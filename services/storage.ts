/**
 * Storage Service
 * 游戏存档的统一存储抽象层
 * 自动选择 DZMM KV 或 localStorage fallback
 */

import { dzmmKv, dzmmService } from './dzmm';
import { Character, ChatMessage } from '../types';

// 存档数据结构
export interface GameSaveData {
  id: string;
  character: Character;
  messages: ChatMessage[];
  timestamp: number;
  summary: string;
  version: number;
}

// 存档槽位 key 前缀
const SAVE_KEY_PREFIX = 'xiuxian_save_slot_';
const SAVE_VERSION = 1;
const MAX_SLOTS = 6;

/**
 * 获取存档槽位 key
 */
function getSlotKey(slotId: number): string {
  return `${SAVE_KEY_PREFIX}${slotId}_v${SAVE_VERSION}`;
}

/**
 * 保存游戏到指定槽位
 */
export async function saveGame(
  slotId: number,
  character: Character,
  messages: ChatMessage[]
): Promise<void> {
  if (slotId < 1 || slotId > MAX_SLOTS) {
    throw new Error(`Invalid slot ID: ${slotId}. Must be 1-${MAX_SLOTS}`);
  }

  const realm = character.variables['境界'] || '未知';
  const location = character.location;

  const saveData: GameSaveData = {
    id: slotId.toString(),
    character,
    messages: messages.slice(-50), // 只保留最近 50 条消息
    timestamp: Date.now(),
    summary: `${realm} · ${location}`,
    version: SAVE_VERSION
  };

  await dzmmKv.put(getSlotKey(slotId), saveData);
  console.log(`[Storage] Game saved to slot ${slotId}`);
}

/**
 * 从指定槽位加载游戏
 */
export async function loadGame(slotId: number): Promise<GameSaveData | null> {
  if (slotId < 1 || slotId > MAX_SLOTS) {
    throw new Error(`Invalid slot ID: ${slotId}. Must be 1-${MAX_SLOTS}`);
  }

  const data = await dzmmKv.get<GameSaveData>(getSlotKey(slotId));

  if (data && data.version === SAVE_VERSION) {
    console.log(`[Storage] Game loaded from slot ${slotId}`);
    return data;
  }

  return null;
}

/**
 * 删除指定槽位的存档
 */
export async function deleteGame(slotId: number): Promise<void> {
  if (slotId < 1 || slotId > MAX_SLOTS) {
    throw new Error(`Invalid slot ID: ${slotId}. Must be 1-${MAX_SLOTS}`);
  }

  await dzmmKv.delete(getSlotKey(slotId));
  console.log(`[Storage] Game deleted from slot ${slotId}`);
}

/**
 * 获取所有存档槽位的预览信息
 */
export async function getAllSaveSlots(): Promise<(GameSaveData | null)[]> {
  const slots: (GameSaveData | null)[] = [];

  for (let i = 1; i <= MAX_SLOTS; i++) {
    try {
      const data = await dzmmKv.get<GameSaveData>(getSlotKey(i));
      slots.push(data && data.version === SAVE_VERSION ? data : null);
    } catch (error) {
      console.error(`[Storage] Error loading slot ${i}:`, error);
      slots.push(null);
    }
  }

  return slots;
}

/**
 * 获取存档预览（不加载完整消息）
 */
export interface SaveSlotPreview {
  id: string;
  characterName: string;
  summary: string;
  timestamp: number;
  messageCount: number;
}

export async function getSaveSlotPreviews(): Promise<(SaveSlotPreview | null)[]> {
  const fullSlots = await getAllSaveSlots();

  return fullSlots.map(slot => {
    if (!slot) return null;

    return {
      id: slot.id,
      characterName: slot.character.name,
      summary: slot.summary,
      timestamp: slot.timestamp,
      messageCount: slot.messages.length
    };
  });
}

/**
 * 自动存档 key
 */
const AUTO_SAVE_KEY = 'xiuxian_autosave_v' + SAVE_VERSION;

/**
 * 自动存档（每次对话后调用）
 */
export async function autoSave(
  character: Character,
  messages: ChatMessage[]
): Promise<void> {
  const saveData: GameSaveData = {
    id: 'auto',
    character,
    messages: messages.slice(-50),
    timestamp: Date.now(),
    summary: `${character.variables['境界']} · ${character.location}`,
    version: SAVE_VERSION
  };

  await dzmmKv.put(AUTO_SAVE_KEY, saveData);
  console.log('[Storage] Auto-save completed');
}

/**
 * 加载自动存档
 */
export async function loadAutoSave(): Promise<GameSaveData | null> {
  const data = await dzmmKv.get<GameSaveData>(AUTO_SAVE_KEY);

  if (data && data.version === SAVE_VERSION) {
    console.log('[Storage] Auto-save loaded');
    return data;
  }

  return null;
}

/**
 * 清除自动存档
 */
export async function clearAutoSave(): Promise<void> {
  await dzmmKv.delete(AUTO_SAVE_KEY);
  console.log('[Storage] Auto-save cleared');
}

/**
 * 检查是否有自动存档
 */
export async function hasAutoSave(): Promise<boolean> {
  const data = await dzmmKv.get<GameSaveData>(AUTO_SAVE_KEY);
  return data !== null && data.version === SAVE_VERSION;
}

// ====== Legacy localStorage migration ======

/**
 * 从旧版 localStorage 迁移存档
 */
export async function migrateFromLocalStorage(): Promise<void> {
  // 检查是否在 DZMM 环境
  if (!dzmmService.isInDzmmEnvironment) {
    console.log('[Storage] Not in DZMM environment, skipping migration');
    return;
  }

  const oldKey = 'rpg_saves';
  const oldData = localStorage.getItem(oldKey);

  if (!oldData) {
    console.log('[Storage] No legacy saves to migrate');
    return;
  }

  try {
    const oldSaves = JSON.parse(oldData) as Array<{
      id: string;
      character: Character;
      messages: ChatMessage[];
      timestamp: number;
      summary?: string;
    }>;

    for (const save of oldSaves) {
      const slotId = parseInt(save.id);
      if (slotId >= 1 && slotId <= MAX_SLOTS) {
        await saveGame(slotId, save.character, save.messages);
        console.log(`[Storage] Migrated slot ${slotId} from localStorage`);
      }
    }

    // 迁移完成后删除旧数据
    localStorage.removeItem(oldKey);
    console.log('[Storage] Migration completed, old data removed');
  } catch (error) {
    console.error('[Storage] Migration failed:', error);
  }
}
