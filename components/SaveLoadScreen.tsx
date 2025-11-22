import React, { useEffect, useState } from 'react';
import { SaveFile } from '../types';
import { Button } from './ui/Button';
import { Trash2, ChevronLeft, Clock, Save, FileText } from 'lucide-react';

interface SaveLoadScreenProps {
  mode: 'SAVE' | 'LOAD';
  onBack: () => void;
  onLoadFile: (file: SaveFile) => void;
  currentSaveData?: Omit<SaveFile, 'id' | 'timestamp'>; // For saving
}

export const SaveLoadScreen: React.FC<SaveLoadScreenProps> = ({ mode, onBack, onLoadFile, currentSaveData }) => {
  const [saves, setSaves] = useState<SaveFile[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('rpg_saves');
    if (stored) {
      try {
        setSaves(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse saves", e);
      }
    }
  }, []);

  const saveToStorage = (newSaves: SaveFile[]) => {
    localStorage.setItem('rpg_saves', JSON.stringify(newSaves));
    setSaves(newSaves);
  };

  const handleSave = (slotId: number) => {
    if (!currentSaveData) return;
    
    const realm = currentSaveData.character.variables['境界'] || '未知';
    const location = currentSaveData.character.location;

    const newFile: SaveFile = {
        ...currentSaveData,
        id: slotId.toString(),
        timestamp: Date.now(),
        summary: `${realm} · ${location}`
    };

    // Replace or add
    const existingIndex = saves.findIndex(s => s.id === slotId.toString());
    let newSaves = [...saves];
    
    if (existingIndex >= 0) {
        newSaves[existingIndex] = newFile;
    } else {
        newSaves.push(newFile);
    }
    
    saveToStorage(newSaves);
    alert("存档成功");
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("确定要删除此存档吗？此操作不可逆。")) {
        const newSaves = saves.filter(s => s.id !== id);
        saveToStorage(newSaves);
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

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-8 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
                {slots.map(slotId => {
                    const save = saves.find(s => s.id === slotId.toString());
                    
                    return (
                        <div 
                            key={slotId}
                            onClick={() => {
                                if (mode === 'LOAD' && save) onLoadFile(save);
                                if (mode === 'SAVE') handleSave(slotId);
                            }}
                            className={`
                                relative group h-48 p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer shape-organic
                                ${save 
                                    ? 'bg-gradient-to-br from-slate-900/90 to-black/90 border border-jade-500/30 hover:border-jade-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:-translate-y-1' 
                                    : 'bg-white/5 border border-white/10 border-dashed hover:bg-white/10'
                                }
                            `}
                        >
                            <div className="flex justify-between items-start">
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest bg-black/40 px-2 py-1 rounded">
                                    命盘 {slotId}
                                </span>
                                {save && (
                                    <button 
                                        onClick={(e) => handleDelete(e, save.id)}
                                        className="text-slate-600 hover:text-red-400 transition-colors p-1 z-20"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {save ? (
                                <div className="space-y-2 z-10">
                                    <div className="text-2xl text-white font-title">{save.character.name}</div>
                                    <div className="flex items-center gap-2 text-sm text-jade-300 font-serif">
                                        <FileText className="w-3 h-3" />
                                        {save.summary}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 border-t border-white/5 pt-2">
                                        <Clock className="w-3 h-3" />
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

                            {/* Background decoration for saved slots */}
                            {save && <div className="absolute bottom-0 right-0 w-24 h-24 bg-jade-500/5 rounded-full blur-2xl pointer-events-none" />}
                        </div>
                    );
                })}
             </div>
        </div>
    </div>
  );
};