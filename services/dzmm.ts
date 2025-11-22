/**
 * DZMM.AI Platform API Service
 * 封装 DZMM 平台专有接口，提供类型安全的调用方式
 */

// DZMM API 类型定义
export interface DzmmMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface DzmmCompletionsConfig {
  model: 'nalang-turbo-0826' | 'nalang-medium-0826' | 'nalang-max-0826' | 'nalang-xl-0826' | 'nalang-max-0826-16k' | 'nalang-xl-0826-16k';
  messages: DzmmMessage[];
  maxTokens?: number; // 200-3000, default 1000
}

export type DzmmStreamCallback = (content: string, done: boolean) => void;

export interface DzmmKvResult<T = unknown> {
  value: T | null;
}

// 扩展 Window 类型
declare global {
  interface Window {
    dzmm?: {
      completions: (config: DzmmCompletionsConfig, callback: DzmmStreamCallback) => Promise<void>;
      kv: {
        put: (key: string, value: unknown) => Promise<void>;
        get: <T = unknown>(key: string) => Promise<DzmmKvResult<T>>;
        delete: (key: string) => Promise<void>;
      };
      chat: {
        insert: (parentId: string | null, messages: DzmmMessage[]) => Promise<{ ids: string[] }>;
        list: (ids: string[]) => Promise<Array<{ id: string; role: string; content: string; timestamp: number; parent: string | null; children: string[] }>>;
        timeline: (messageId: string) => Promise<string[]>;
      };
    };
  }
}

/**
 * DZMM Service Class
 * 管理 DZMM API 的初始化和调用
 */
class DzmmService {
  private _ready = false;
  private _readyPromise: Promise<void> | null = null;

  /**
   * 检查 DZMM API 是否就绪
   */
  get isReady(): boolean {
    return this._ready;
  }

  /**
   * 检查是否在 DZMM 环境中运行
   */
  get isInDzmmEnvironment(): boolean {
    return typeof window !== 'undefined' && !!window.dzmm;
  }

  /**
   * 等待 DZMM API 就绪
   * 使用双重检测：直接检查 + 事件监听 + 超时重检
   */
  async waitForReady(timeout = 5000): Promise<boolean> {
    if (this._ready) return true;

    if (this._readyPromise) {
      await this._readyPromise;
      return this._ready;
    }

    this._readyPromise = new Promise<void>((resolve) => {
      // 直接检查
      if (window.dzmm) {
        this._ready = true;
        console.log('[DZMM] API already available');
        resolve();
        return;
      }

      // 事件监听
      const handler = (event: MessageEvent) => {
        if (event.data?.type === 'dzmm:ready') {
          window.removeEventListener('message', handler);
          this._ready = true;
          console.log('[DZMM] API ready via event');
          resolve();
        }
      };
      window.addEventListener('message', handler);

      // 超时重检
      setTimeout(() => {
        if (!this._ready && window.dzmm) {
          window.removeEventListener('message', handler);
          this._ready = true;
          console.log('[DZMM] API ready via timeout recheck');
          resolve();
        } else if (!this._ready) {
          window.removeEventListener('message', handler);
          console.warn('[DZMM] API not available after timeout, running in fallback mode');
          resolve();
        }
      }, timeout);
    });

    await this._readyPromise;
    return this._ready;
  }

  /**
   * 调用 AI 生成（流式）
   */
  async completions(
    config: DzmmCompletionsConfig,
    callback: DzmmStreamCallback
  ): Promise<string> {
    if (!this._ready || !window.dzmm) {
      throw new Error('[DZMM] API not ready. Call waitForReady() first.');
    }

    // 验证 maxTokens 范围
    const maxTokens = Math.min(Math.max(config.maxTokens || 1000, 200), 3000);

    // 验证消息格式（只允许 user/assistant）
    const validatedMessages = config.messages.filter(
      msg => msg.role === 'user' || msg.role === 'assistant'
    );

    // 检查连续相同角色（DZMM 不允许）
    const cleanedMessages: DzmmMessage[] = [];
    for (const msg of validatedMessages) {
      const last = cleanedMessages[cleanedMessages.length - 1];
      if (last && last.role === msg.role) {
        // 合并连续相同角色的消息
        last.content += '\n\n' + msg.content;
      } else {
        cleanedMessages.push({ ...msg });
      }
    }

    let finalContent = '';

    try {
      await window.dzmm.completions(
        {
          ...config,
          messages: cleanedMessages,
          maxTokens
        },
        (content, done) => {
          finalContent = content;
          callback(content, done);
        }
      );
    } catch (error) {
      console.error('[DZMM] Completions error:', error);
      throw error;
    }

    return finalContent;
  }

  /**
   * KV 存储 - 保存
   */
  async kvPut<T>(key: string, value: T): Promise<void> {
    if (!this._ready || !window.dzmm) {
      // Fallback to localStorage
      console.warn('[DZMM] Using localStorage fallback for kvPut');
      localStorage.setItem(key, JSON.stringify(value));
      return;
    }

    await window.dzmm.kv.put(key, value);
  }

  /**
   * KV 存储 - 读取
   */
  async kvGet<T>(key: string): Promise<T | null> {
    if (!this._ready || !window.dzmm) {
      // Fallback to localStorage
      console.warn('[DZMM] Using localStorage fallback for kvGet');
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    }

    const result = await window.dzmm.kv.get<T>(key);
    return result.value;
  }

  /**
   * KV 存储 - 删除
   */
  async kvDelete(key: string): Promise<void> {
    if (!this._ready || !window.dzmm) {
      // Fallback to localStorage
      console.warn('[DZMM] Using localStorage fallback for kvDelete');
      localStorage.removeItem(key);
      return;
    }

    await window.dzmm.kv.delete(key);
  }
}

// 导出单例
export const dzmmService = new DzmmService();

// 便捷导出
export const waitForDzmm = () => dzmmService.waitForReady();
export const dzmmCompletions = dzmmService.completions.bind(dzmmService);
export const dzmmKv = {
  put: dzmmService.kvPut.bind(dzmmService),
  get: dzmmService.kvGet.bind(dzmmService),
  delete: dzmmService.kvDelete.bind(dzmmService)
};
