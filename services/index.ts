/**
 * Services Index
 * 统一导出所有服务模块
 */

// DZMM API
export {
  dzmmService,
  waitForDzmm,
  dzmmCompletions,
  dzmmKv,
  type DzmmMessage,
  type DzmmCompletionsConfig,
  type DzmmStreamCallback
} from './dzmm';

// Storage
export {
  saveGame,
  loadGame,
  deleteGame,
  getAllSaveSlots,
  getSaveSlotPreviews,
  autoSave,
  loadAutoSave,
  clearAutoSave,
  hasAutoSave,
  migrateFromLocalStorage,
  type GameSaveData,
  type SaveSlotPreview
} from './storage';

// AI Narrator
export {
  aiNarrator,
  generateOpening,
  generateResponse,
  regenerateLastResponse,
  applyStateUpdate,
  AVAILABLE_MODELS,
  setModel,
  getModel,
  type ModelId,
  type StreamCallback,
  type NarratorResponse
} from './ai-narrator';

// Prompts
export {
  buildSystemPrompt,
  buildCharacterProfile,
  buildEmphasisPrompt,
  buildOpeningPrompt,
  buildMessages,
  parseAIResponse,
  type ParsedResponse
} from './prompts/cultivation-world';
