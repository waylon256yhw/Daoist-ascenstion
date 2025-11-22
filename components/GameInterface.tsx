import React, { useState, useEffect, useRef } from 'react';
import { Character, ChatMessage } from '../types';
import { INITIAL_MESSAGES } from '../constants';
import { Send, Menu, User, Save as SaveIcon, MapPin, Calendar, Feather, Scroll } from 'lucide-react';
import { Button } from './ui/Button';

interface GameInterfaceProps {
  character: Character;
  onSave: (char: Character, messages: ChatMessage[]) => void;
  onExit: () => void;
}

export const GameInterface: React.FC<GameInterfaceProps> = ({ character, onSave, onExit }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showStatus, setShowStatus] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize game
  useEffect(() => {
    if (messages.length === 0) {
      const initMsgs: ChatMessage[] = INITIAL_MESSAGES.map((text, i) => ({
        id: `init-${i}`,
        sender: 'SYSTEM',
        content: text,
        type: 'NARRATIVE',
        timestamp: Date.now() + i * 1000
      }));
      setMessages(initMsgs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'PLAYER',
      senderName: character.name,
      content: input,
      type: 'DIALOGUE',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Mock AI Response
    setTimeout(() => {
       const responseMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'SYSTEM', 
        content: `(AI推演: 变量 [名望=${character.variables['名望']}] 已更新。) \n\n风吹过${character.location}的山岗，你的话语消散在云雾之中。`,
        type: 'NARRATIVE',
        timestamp: Date.now()
       };
       setMessages(prev => [...prev, responseMsg]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-transparent">
        
        {/* Top Status Bar - Floating Glass */}
        <header className="h-20 px-4 md:px-8 z-20 shrink-0 flex items-center justify-between pointer-events-none">
            {/* Left: Character Summary */}
            <div className="pointer-events-auto flex items-center gap-4 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700 shadow-lg">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-800 to-black flex items-center justify-center border border-jade-500/50">
                    <span className="font-title text-2xl text-jade-200">{character.name[0]}</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-lg text-white font-serif leading-none mb-1">{character.name}</span>
                    <div className="flex items-center gap-2 text-xs text-jade-300">
                        <span>{character.variables['境界']}</span>
                        <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                        <span>{character.variables['道途'] || character.path}</span>
                    </div>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="pointer-events-auto flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-full border border-slate-700">
                 {/* Hidden on small screens to save space */}
                 <div className="hidden md:flex items-center gap-4 border-r border-white/10 pr-4 mr-2 text-sm text-slate-300">
                    <div className="flex items-center gap-1"><MapPin className="w-4 h-4 text-amber-500" /> {character.location}</div>
                    <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /> 道历 {character.currentDate.year}年</div>
                 </div>

                <Button variant="ghost" onClick={() => setShowStatus(!showStatus)} className="p-2 hover:bg-white/10 rounded-full w-10 h-10 flex items-center justify-center">
                    <User className="w-5 h-5" />
                </Button>
                <Button variant="ghost" onClick={() => onSave(character, messages)} className="p-2 hover:bg-white/10 rounded-full w-10 h-10 flex items-center justify-center">
                    <SaveIcon className="w-5 h-5" />
                </Button>
                <Button variant="ghost" onClick={onExit} className="p-2 hover:bg-white/10 rounded-full w-10 h-10 flex items-center justify-center">
                    <Menu className="w-5 h-5" />
                </Button>
            </div>
        </header>

        <div className="flex-1 flex overflow-hidden relative">
            
            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col min-w-0 relative">
                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth z-10 mask-image-gradient">
                    {messages.map((msg) => {
                        const isPlayer = msg.sender === 'PLAYER';
                        const isSystem = msg.sender === 'SYSTEM';

                        return (
                            <div 
                                key={msg.id} 
                                className={`flex flex-col max-w-4xl animate-ink-spread ${isPlayer ? 'ml-auto items-end' : 'mr-auto items-start'} w-full`}
                            >
                               {/* Sender Name for NPC */}
                               {!isPlayer && !isSystem && (
                                   <span className="text-sm text-jade-300 mb-1 font-serif tracking-widest font-bold ml-4">{msg.senderName}</span>
                               )}
                               
                               <div className={`
                                    relative px-6 py-4 text-lg md:text-xl leading-relaxed font-serif shadow-xl backdrop-blur-sm whitespace-pre-wrap
                                    ${isPlayer 
                                        ? 'bg-slate-800/90 border border-slate-600 text-white shape-organic-reverse mr-2 rounded-2xl rounded-tr-sm' 
                                        : isSystem
                                            ? 'w-full max-w-3xl mx-auto bg-black/40 text-center text-slate-100 italic border border-white/5 rounded-lg py-6 px-10 my-4 font-body text-xl md:text-2xl shadow-[0_0_20px_rgba(0,0,0,0.5)]'
                                            : 'bg-black/70 border border-slate-700 text-slate-100 shape-organic ml-2 rounded-2xl rounded-tl-sm'
                                    }
                               `}>
                                    {isSystem && <span className="text-amber-500 mr-2 opacity-90 inline-block animate-pulse">✦</span>}
                                    {msg.content}
                               </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area - Floating & Stylized */}
                <div className="p-4 md:p-8 z-20 flex justify-center">
                    <div className="w-full max-w-4xl glass-panel p-2 shape-organic flex items-end gap-3 relative bg-slate-900/90 border border-jade-500/30 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="在此输入你的行动，或与天地对话..."
                            className="flex-1 bg-transparent border-none p-4 min-h-[60px] max-h-[150px] text-white text-lg focus:ring-0 resize-none font-serif placeholder-slate-500"
                        />
                        <Button 
                            onClick={handleSendMessage} 
                            className="mb-1 mr-1 px-6 bg-jade-800 hover:bg-jade-600 border-none text-white rounded-br-2xl rounded-tl-lg h-12"
                        >
                            <Send className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </main>

            {/* Side Drawer for Variables (Daoist Scroll Style) */}
            <aside className={`
                absolute right-0 top-0 bottom-0 w-96 bg-slate-950/95 backdrop-blur-xl border-l border-jade-900/50 transform transition-transform duration-500 z-30 overflow-y-auto
                ${showStatus ? 'translate-x-0' : 'translate-x-full'}
                shadow-[-10px_0_40px_rgba(0,0,0,0.8)]
            `}>
                <div className="p-8 space-y-10 relative z-10">
                    
                    {/* Header */}
                    <div className="text-center border-b border-jade-900/50 pb-6">
                        <h3 className="text-white font-title text-4xl mb-2 text-shadow-glow">道果金榜</h3>
                        <p className="text-slate-500 text-xs font-serif tracking-[0.5em] uppercase">Status & Destiny</p>
                    </div>

                    {/* World Variables */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-amber-500 mb-2">
                            <Scroll className="w-5 h-5" />
                            <span className="font-title text-xl text-white">红尘因果</span>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3">
                            {Object.entries(character.variables).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                    <span className="text-slate-400 text-sm tracking-wider font-bold">{key}</span>
                                    <span className="text-jade-300 font-serif font-bold text-lg">{String(value)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Natural Talent */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-amber-500 mb-2">
                            <Feather className="w-5 h-5" />
                            <span className="font-title text-xl text-white">先天命格</span>
                        </div>
                        <div className="space-y-3">
                            {[character.rootBone, character.talent, character.spiritTreasure].map((attr, i) => (
                                <div key={i} className="bg-black/40 p-4 border-l-2 border-jade-500/50 rounded-r-lg">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-slate-500 text-xs font-bold">{['根骨', '天赋', '灵宝'][i]}</span>
                                        <span className="text-white font-serif font-bold">{attr.name}</span>
                                    </div>
                                    <div className="text-xs text-slate-400 italic opacity-70 truncate">{attr.description}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Inventory */}
                    {character.inventory.length > 0 && (
                        <div>
                             <h4 className="text-white font-title text-xl mb-4 border-l-4 border-amber-600 pl-3">储物袋</h4>
                             <div className="flex flex-wrap gap-2">
                                {character.inventory.map((item, i) => (
                                    <span key={i} className="px-3 py-1 bg-slate-800 text-sm text-slate-200 rounded-full border border-slate-600">
                                        {item}
                                    </span>
                                ))}
                             </div>
                        </div>
                    )}

                </div>
            </aside>
        </div>
    </div>
  );
};