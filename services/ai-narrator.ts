/**
 * AI Narrator Service
 * 修仙世界的 AI 叙事引擎
 * 负责与 DZMM AI 交互，生成故事内容
 */

import { dzmmService, DzmmMessage } from './dzmm';
import { Character, ChatMessage } from '../types';
import {
  buildMessages,
  buildOpeningPrompt,
  parseAIResponse,
  ParsedResponse
} from './prompts/cultivation-world';

// AI 模型配置
export const AVAILABLE_MODELS = [
  { id: 'nalang-turbo-0826', name: 'Turbo', description: '最快响应' },
  { id: 'nalang-medium-0826', name: 'Medium', description: '平衡性能' },
  { id: 'nalang-max-0826', name: 'Max', description: '增强推理' },
  { id: 'nalang-xl-0826', name: 'XL', description: '最强理解' },
  { id: 'nalang-max-0826-16k', name: 'Max 16K', description: '快速+短上下文' },
  { id: 'nalang-xl-0826-16k', name: 'XL 16K', description: '最强+短上下文' },
] as const;

export type ModelId = typeof AVAILABLE_MODELS[number]['id'];

let currentModel: ModelId = 'nalang-xl-0826';
const MAX_TOKENS = 2500;

export function setModel(modelId: ModelId) {
  currentModel = modelId;
  console.log('[Narrator] Model changed to:', modelId);
}

export function getModel(): ModelId {
  return currentModel;
}

/**
 * 流式响应回调
 */
export type StreamCallback = (content: string, done: boolean) => void;

/**
 * AI 响应结果
 */
export interface NarratorResponse {
  content: string;
  stateUpdate: Record<string, unknown> | null;
}

/**
 * AI Narrator 类
 */
class AINarrator {
  private isGenerating = false;

  /**
   * 检查是否正在生成
   */
  get generating(): boolean {
    return this.isGenerating;
  }

  /**
   * 生成开场白
   */
  async generateOpening(
    character: Character,
    onStream?: StreamCallback
  ): Promise<NarratorResponse> {
    if (this.isGenerating) {
      throw new Error('AI is already generating');
    }

    this.isGenerating = true;

    try {
      const prompt = buildOpeningPrompt(character);
      const messages: DzmmMessage[] = [
        { role: 'user', content: prompt }
      ];

      let fullResponse = '';

      await dzmmService.completions(
        {
          model: currentModel,
          messages,
          maxTokens: MAX_TOKENS
        },
        (content, done) => {
          fullResponse = content;
          if (onStream) {
            // 流式输出时先显示原始内容，不解析 STATE
            onStream(content, done);
          }
        }
      );

      // 解析最终响应
      const parsed = parseAIResponse(fullResponse);

      return {
        content: parsed.narrativeContent,
        stateUpdate: parsed.stateUpdate
      };
    } finally {
      this.isGenerating = false;
    }
  }

  /**
   * 生成故事响应
   */
  async generateResponse(
    character: Character,
    conversationHistory: ChatMessage[],
    userInput: string,
    onStream?: StreamCallback
  ): Promise<NarratorResponse> {
    if (this.isGenerating) {
      throw new Error('AI is already generating');
    }

    this.isGenerating = true;

    try {
      // 转换历史消息格式
      const history = conversationHistory.map(msg => ({
        role: (msg.sender === 'PLAYER' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: msg.content
      }));

      // 构建消息数组
      const messages = buildMessages(character, history, userInput);

      let fullResponse = '';

      await dzmmService.completions(
        {
          model: currentModel,
          messages,
          maxTokens: MAX_TOKENS
        },
        (content, done) => {
          fullResponse = content;
          if (onStream) {
            // 流式输出时移除 STATE 块显示
            const displayContent = content.replace(/###STATE[\s\S]*?###END\s*/g, '');
            onStream(displayContent, done);
          }
        }
      );

      // 解析最终响应
      const parsed = parseAIResponse(fullResponse);

      return {
        content: parsed.narrativeContent,
        stateUpdate: parsed.stateUpdate
      };
    } finally {
      this.isGenerating = false;
    }
  }

  /**
   * 重新生成最后一条 AI 响应
   */
  async regenerateLastResponse(
    character: Character,
    conversationHistory: ChatMessage[],
    onStream?: StreamCallback
  ): Promise<NarratorResponse> {
    // 找到最后一条玩家消息
    let lastUserInput = '';
    const historyWithoutLastAI: ChatMessage[] = [];

    for (let i = conversationHistory.length - 1; i >= 0; i--) {
      const msg = conversationHistory[i];
      if (msg.sender === 'PLAYER' && !lastUserInput) {
        lastUserInput = msg.content;
        historyWithoutLastAI.unshift(msg);
      } else if (lastUserInput) {
        historyWithoutLastAI.unshift(msg);
      }
      // 跳过最后一条 AI 消息
    }

    if (!lastUserInput) {
      throw new Error('No user message found to regenerate from');
    }

    // 移除 historyWithoutLastAI 中最后一条（就是 lastUserInput）
    historyWithoutLastAI.pop();

    return this.generateResponse(character, historyWithoutLastAI, lastUserInput, onStream);
  }

  /**
   * 取消当前生成（如果支持）
   */
  cancel(): void {
    // DZMM API 目前不支持取消，只能标记状态
    this.isGenerating = false;
  }
}

// 导出单例
export const aiNarrator = new AINarrator();

// 便捷函数导出
export const generateOpening = aiNarrator.generateOpening.bind(aiNarrator);
export const generateResponse = aiNarrator.generateResponse.bind(aiNarrator);
export const regenerateLastResponse = aiNarrator.regenerateLastResponse.bind(aiNarrator);

/**
 * 应用状态更新到角色
 */
export function applyStateUpdate(
  character: Character,
  stateUpdate: Record<string, unknown>
): Character {
  const updatedCharacter = { ...character };
  const updatedVariables = { ...character.variables };

  // 更新变量
  for (const [key, value] of Object.entries(stateUpdate)) {
    if (key in updatedVariables) {
      (updatedVariables as Record<string, unknown>)[key] = value;
    }
  }

  updatedCharacter.variables = updatedVariables;

  console.log('[Narrator] State updated:', stateUpdate);
  return updatedCharacter;
}

