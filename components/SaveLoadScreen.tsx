import React, { useEffect, useState, useCallback } from 'react';
import { SaveFile } from '../types';
import { Button } from './ui/Button';
import { Trash2, ChevronLeft, Clock, Save, FileText, Loader2 } from 'lucide-react';
import {
  saveGame,
  loadGame,
  deleteGame,
  getAllSaveSlots,
  type GameSaveData
} from '../services';

interface SaveLoadScreenProps {
  mode: 'SAVE' | 'LOAD';
  onBack: () => void;
  onLoadFile: (file: SaveFile) => void;
  currentSaveData?: Omit<SaveFile, 'id' | 'timestamp'>; // For saving
}

export const SaveLoadScreen: React.FC<SaveLoadScreenProps> = ({ mode, onBack, onLoadFile, currentSaveData }) => {
  const [saves, setSaves] = useState<(GameSaveData | null)[]>([null, null, null, null, null, null]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingSlot, setSavingSlot] = useState<number | null>(null);

  // Load all saves on mount
  const loadSaves = useCallback(async () => {
    setIsLoading(true);
    try {
      const slots = await getAllSaveSlots();
      setSaves(slots);
    } catch (error) {
      console.error('[SaveLoadScreen] Failed to load saves:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSaves();
  }, [loadSaves]);

  const handleSave = async (slotId: number) => {
    if (!currentSaveData || savingSlot !== null) return;

    setSavingSlot(slotId);
    try {
      await saveGame(slotId, currentSaveData.character, currentSaveData.messages);
      // Reload saves to show updated data
      await loadSaves();
      alert("存档成功");
    } catch (error) {
      console.error('[SaveLoadScreen] Failed to save:', error);
      alert("存档失败，请重试");
    } finally {
      setSavingSlot(null);
    }
  };

  const handleLoad = async (slotId: number) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const data = await loadGame(slotId);
      if (data) {
        // Convert GameSaveData to SaveFile format
        const saveFile: SaveFile = {
          id: data.id,
          character: data.character,
          messages: data.messages,
          timestamp: data.timestamp,
          summary: data.summary
        };
        onLoadFile(saveFile);
      }
    } catch (error) {
      console.error('[SaveLoadScreen] Failed to load:', error);
      alert("读档失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, slotId: number) => {
    e.stopPropagation();
    if (confirm("确定要删除此存档吗？此操作不可逆。")) {
      try {
        await deleteGame(slotId);
        await loadSaves();
      } catch (error) {
        console.error('[SaveLoadScreen] Failed to delete:', error);
        alert("删除失败，请重试");
      }
    }
  };

  const slots = [1, 2, 3, 4, 5, 6];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-black/60 backdrop-blur-sm">
        
        {/* Back Button - Fixed Position (Consistent with CharacterCreation) */}
        <div className="fixed top-6 left-6 z-50">
            <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/20 bg-black/20 backdrop-blur-sm">
                <ChevronLeft className="w-5 h-5 mr-1" /> 返回
            </Button>
        </div>

        <div className="w-full max-w-6xl relative animate-ink-spread mt-12">
             <div className="text-center mb-12">
                <h2 className="text-5xl font-title text-white drop-shadow-lg mb-2">
                    {mode === 'SAVE' ? '铭刻道果' : '回溯时光'}
                </h2>
                <p className="text-slate-400 font-serif tracking-widest uppercase text-sm">
                    {mode === 'SAVE' ? 'Eternalize your Path' : 'Reverse the River of Time'}
                </p>
             </div>

             {/* Loading indicator */}
             {isLoading && (
               <div className="flex items-center justify-center py-12">
                 <Loader2 className="w-8 h-8 animate-spin text-jade-500" />
                 <span className="ml-3 text-slate-400 font-serif">读取存档中...</span>
               </div>
             )}

             {!isLoading && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-8 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
                {slots.map(slotId => {
                    const save = saves[slotId - 1]; // Array is 0-indexed, slots are 1-indexed
                    const isSaving = savingSlot === slotId;

                    return (
                        <div
                            key={slotId}
                            onClick={() => {
                                if (isSaving) return;
                                if (mode === 'LOAD' && save) handleLoad(slotId);
                                if (mode === 'SAVE') handleSave(slotId);
                            }}
                            className={`
                                relative group h-48 p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer shape-organic overflow-hidden
                                ${isSaving ? 'opacity-70 cursor-wait' : ''}
                                ${save
                                    ? 'bg-gradient-to-br from-slate-900/80 via-jade-950/40 to-slate-950/90 border border-jade-500/30 hover:border-jade-400/70 hover:shadow-[0_0_35px_rgba(16,185,129,0.25)] hover:-translate-y-1'
                                    : 'bg-slate-950/30 border border-white/10 border-dashed hover:bg-slate-900/50 hover:border-white/20'
                                }
                            `}
                        >
                            {/* Saving overlay */}
                            {isSaving && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30 rounded-lg">
                                <Loader2 className="w-6 h-6 animate-spin text-jade-400" />
                                <span className="ml-2 text-jade-300 text-sm">存档中...</span>
                              </div>
                            )}

                            {/* Decorative elements for saved slots */}
                            {save && (
                                <>
                                    {/* Top gradient line */}
                                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-jade-500/50 to-transparent" />
                                    {/* Corner accents */}
                                    <div className="absolute top-2 left-2 w-4 h-4 border-l border-t border-jade-500/30 group-hover:border-jade-400/50 transition-colors" />
                                    <div className="absolute top-2 right-2 w-4 h-4 border-r border-t border-jade-500/30 group-hover:border-jade-400/50 transition-colors" />
                                    <div className="absolute bottom-2 left-2 w-4 h-4 border-l border-b border-jade-500/30 group-hover:border-jade-400/50 transition-colors" />
                                    <div className="absolute bottom-2 right-2 w-4 h-4 border-r border-b border-jade-500/30 group-hover:border-jade-400/50 transition-colors" />
                                </>
                            )}

                            <div className="flex justify-between items-start relative z-10">
                                <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded ${save ? 'text-jade-400/80 bg-jade-950/60 border border-jade-500/20' : 'text-slate-500 bg-black/40'}`}>
                                    命盘 {slotId}
                                </span>
                                {save && (
                                    <button
                                        onClick={(e) => handleDelete(e, slotId)}
                                        className="text-slate-600 hover:text-red-400 transition-colors p-1 z-20"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {save ? (
                                <div className="space-y-2 z-10">
                                    <div className="text-2xl text-white font-title drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">{save.character.name}</div>
                                    <div className="flex items-center gap-2 text-sm text-jade-300 font-serif">
                                        <FileText className="w-3 h-3" />
                                        {save.summary}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 border-t border-jade-500/10 pt-2">
                                        <Clock className="w-3 h-3 text-amber-500/60" />
                                        {new Date(save.timestamp).toLocaleString()}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <Save className="w-8 h-8" />
                                    <span className="text-sm font-serif">
                                        {mode === 'SAVE' ? '点击存档' : '虚位以待'}
                                    </span>
                                </div>
                            )}

                            {/* Background glow decorations for saved slots */}
                            {save && (
                                <>
                                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-jade-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-jade-500/20 transition-colors" />
                                    <div className="absolute top-0 left-0 w-20 h-20 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                                </>
                            )}
                        </div>
                    );
                })}
               </div>
             )}
        </div>
    </div>
  );
};