import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Character, ChatMessage } from '../types';
import { Send, Menu, User, Save as SaveIcon, MapPin, Calendar, Feather, Scroll, Loader2, RefreshCw, Pencil, Trash2, RotateCcw, Check, X, Cpu, ChevronDown } from 'lucide-react';
import { Button } from './ui/Button';
import { RichText } from './RichText';
import {
  dzmmService,
  waitForDzmm,
  aiNarrator,
  applyStateUpdate,
  autoSave,
  AVAILABLE_MODELS,
  setModel,
  getModel,
  type ModelId
} from '../services';

interface GameInterfaceProps {
  character: Character;
  onSave: (char: Character, messages: ChatMessage[]) => void;
  onExit: () => void;
  initialMessages?: ChatMessage[];
}

export const GameInterface: React.FC<GameInterfaceProps> = ({
  character: initialCharacter,
  onSave,
  onExit,
  initialMessages
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages || []);
  const [showStatus, setShowStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState<Character>(initialCharacter);
  const [streamingContent, setStreamingContent] = useState('');
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [currentModelId, setCurrentModelId] = useState<ModelId>(getModel());
  const [showModelMenu, setShowModelMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize DZMM and generate opening
  useEffect(() => {
    const initGame = async () => {
      // Wait for DZMM API
      await waitForDzmm();

      // If no initial messages, generate opening
      if (messages.length === 0) {
        setIsLoading(true);

        // Add placeholder message for streaming
        const placeholderId = 'opening-' + Date.now();
        setMessages([{
          id: placeholderId,
          sender: 'SYSTEM',
          content: '',
          type: 'NARRATIVE',
          timestamp: Date.now()
        }]);

        try {
          // Check if DZMM is available, otherwise use fallback
          if (dzmmService.isInDzmmEnvironment && dzmmService.isReady) {
            const result = await aiNarrator.generateOpening(
              currentCharacter,
              (content, done) => {
                setStreamingContent(content);
                if (done) {
                  setMessages([{
                    id: placeholderId,
                    sender: 'SYSTEM',
                    content: content,
                    type: 'NARRATIVE',
                    timestamp: Date.now()
                  }]);
                  setStreamingContent('');
                }
              }
            );

            // Apply state updates if any
            if (result.stateUpdate) {
              setCurrentCharacter(prev => applyStateUpdate(prev, result.stateUpdate!));
            }
          } else {
            // Fallback for non-DZMM environment
            setMessages([{
              id: placeholderId,
              sender: 'SYSTEM',
              content: `你站在${currentCharacter.location}的边缘，${currentCharacter.race}的血脉在体内微微躁动。\n\n作为一名${currentCharacter.variables['境界']}的修士，你的修仙之路才刚刚开始。${currentCharacter.rootBone.name}的根骨赋予你独特的天赋，而${currentCharacter.spiritTreasure.name}静静躺在你的储物袋中，等待着被唤醒。\n\n*一阵灵气波动从远处传来，似乎有什么正在发生...*`,
              type: 'NARRATIVE',
              timestamp: Date.now()
            }]);
          }
        } catch (error) {
          console.error('[GameInterface] Failed to generate opening:', error);
          // Fallback message
          setMessages([{
            id: placeholderId,
            sender: 'SYSTEM',
            content: `你的修仙之旅从${currentCharacter.location}开始了...\n\n（AI 叙事引擎加载失败，请检查网络连接）`,
            type: 'NARRATIVE',
            timestamp: Date.now()
          }]);
        } finally {
          setIsLoading(false);
        }
      }

      setIsInitialized(true);
    };

    initGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Handle sending message
  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userInput = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'PLAYER',
      senderName: currentCharacter.name,
      content: userInput,
      type: 'DIALOGUE',
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);

    // Add placeholder for AI response
    const aiMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: aiMsgId,
      sender: 'SYSTEM',
      content: '',
      type: 'NARRATIVE',
      timestamp: Date.now()
    }]);

    try {
      if (dzmmService.isInDzmmEnvironment && dzmmService.isReady) {
        const result = await aiNarrator.generateResponse(
          currentCharacter,
          messages,
          userInput,
          (content, done) => {
            setStreamingContent(content);
            if (done) {
              setMessages(prev => prev.map(msg =>
                msg.id === aiMsgId ? { ...msg, content } : msg
              ));
              setStreamingContent('');
            }
          }
        );

        // Apply state updates
        if (result.stateUpdate) {
          setCurrentCharacter(prev => applyStateUpdate(prev, result.stateUpdate!));
        }

        // Auto-save
        await autoSave(currentCharacter, messages);
      } else {
        // Fallback for non-DZMM environment
        setTimeout(() => {
          setMessages(prev => prev.map(msg =>
            msg.id === aiMsgId
              ? { ...msg, content: `*你的话语回荡在${currentCharacter.location}的空气中...*\n\n（DZMM 环境未就绪，AI 叙事功能暂不可用）` }
              : msg
          ));
        }, 500);
      }
    } catch (error) {
      console.error('[GameInterface] AI response failed:', error);
      setMessages(prev => prev.map(msg =>
        msg.id === aiMsgId
          ? { ...msg, content: '（AI 响应失败，请重试）' }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, currentCharacter, messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 重新生成AI响应
  const handleReroll = useCallback(async (msgIndex: number) => {
    if (isLoading) return;

    // 找到这条AI消息之前的玩家消息
    let playerMsgIndex = -1;
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (messages[i].sender === 'PLAYER') {
        playerMsgIndex = i;
        break;
      }
    }

    if (playerMsgIndex === -1) return;

    const userInput = messages[playerMsgIndex].content;
    const historyBeforePlayer = messages.slice(0, playerMsgIndex);

    setIsLoading(true);

    // 更新当前AI消息为空（显示加载状态）
    const aiMsgId = messages[msgIndex].id;
    setMessages(prev => prev.map((msg, idx) =>
      idx === msgIndex ? { ...msg, content: '' } : msg
    ));

    try {
      if (dzmmService.isInDzmmEnvironment && dzmmService.isReady) {
        const result = await aiNarrator.generateResponse(
          currentCharacter,
          historyBeforePlayer,
          userInput,
          (content, done) => {
            setStreamingContent(content);
            if (done) {
              setMessages(prev => prev.map(msg =>
                msg.id === aiMsgId ? { ...msg, content } : msg
              ));
              setStreamingContent('');
            }
          }
        );

        if (result.stateUpdate) {
          setCurrentCharacter(prev => applyStateUpdate(prev, result.stateUpdate!));
        }
      }
    } catch (error) {
      console.error('[GameInterface] Reroll failed:', error);
      setMessages(prev => prev.map(msg =>
        msg.id === aiMsgId ? { ...msg, content: '（重新生成失败，请重试）' } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, currentCharacter]);

  // 开始编辑消息
  const handleStartEdit = (msg: ChatMessage) => {
    setEditingMsgId(msg.id);
    setEditContent(msg.content);
  };

  // 保存编辑
  const handleSaveEdit = useCallback(async () => {
    if (!editingMsgId || !editContent.trim()) return;

    const msgIndex = messages.findIndex(m => m.id === editingMsgId);
    if (msgIndex === -1) return;

    const editedMsg = messages[msgIndex];

    // 更新消息内容
    setMessages(prev => prev.map(msg =>
      msg.id === editingMsgId ? { ...msg, content: editContent.trim() } : msg
    ));

    setEditingMsgId(null);
    setEditContent('');

    // 如果是玩家消息，删除后续所有消息并重新生成AI响应
    if (editedMsg.sender === 'PLAYER') {
      const historyBeforeEdit = messages.slice(0, msgIndex);
      const newUserInput = editContent.trim();

      // 删除编辑消息之后的所有消息
      setMessages(prev => prev.slice(0, msgIndex + 1));

      setIsLoading(true);

      // 添加新的AI响应占位
      const aiMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: aiMsgId,
        sender: 'SYSTEM',
        content: '',
        type: 'NARRATIVE',
        timestamp: Date.now()
      }]);

      try {
        if (dzmmService.isInDzmmEnvironment && dzmmService.isReady) {
          const result = await aiNarrator.generateResponse(
            currentCharacter,
            historyBeforeEdit,
            newUserInput,
            (content, done) => {
              setStreamingContent(content);
              if (done) {
                setMessages(prev => prev.map(msg =>
                  msg.id === aiMsgId ? { ...msg, content } : msg
                ));
                setStreamingContent('');
              }
            }
          );

          if (result.stateUpdate) {
            setCurrentCharacter(prev => applyStateUpdate(prev, result.stateUpdate!));
          }
        }
      } catch (error) {
        console.error('[GameInterface] Regenerate after edit failed:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [editingMsgId, editContent, messages, currentCharacter]);

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingMsgId(null);
    setEditContent('');
  };

  // 删除消息
  const handleDeleteMessage = useCallback((msgId: string) => {
    const msgIndex = messages.findIndex(m => m.id === msgId);
    if (msgIndex === -1) return;

    // 删除这条消息及其后续所有消息
    setMessages(prev => prev.slice(0, msgIndex));
  }, [messages]);

  return (
    <div className="relative w-full h-full flex flex-col bg-transparent">
        
        {/* Top Status Bar - Floating Glass */}
        <header className="min-h-[60px] md:h-20 px-2 sm:px-4 md:px-8 z-20 shrink-0 flex items-center justify-between pointer-events-none py-2">
            {/* Left: Character Summary */}
            <div className="pointer-events-auto flex items-center gap-2 sm:gap-4 bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-md px-2 sm:px-4 py-1.5 sm:py-2 rounded-full border border-jade-600/30 shadow-lg shadow-jade-900/20 max-w-[55%] sm:max-w-none group">
                {/* Avatar with glow */}
                <div className="relative shrink-0">
                    <div className="absolute inset-0 rounded-full bg-jade-500/20 blur-md group-hover:bg-jade-500/30 transition-all" />
                    <div className="relative w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-jade-900/80 via-slate-800 to-cyan-900/60 flex items-center justify-center border border-jade-400/50 shadow-inner">
                        <span className="font-title text-lg sm:text-2xl text-jade-200 drop-shadow-[0_0_4px_rgba(16,185,129,0.5)]">{currentCharacter.name[0]}</span>
                    </div>
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="font-bold text-sm sm:text-lg text-white font-serif leading-none mb-0.5 sm:mb-1 truncate">{currentCharacter.name}</span>
                    <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs">
                        <span className="truncate text-cyan-300">{currentCharacter.variables['境界']}</span>
                        <span className="w-1 h-1 bg-jade-500/50 rounded-full shrink-0 hidden sm:block"></span>
                        <span className="truncate hidden sm:block text-amber-300/80">{currentCharacter.variables['道途'] || currentCharacter.path}</span>
                    </div>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-md px-2 sm:px-3 py-1.5 sm:py-2 rounded-full border border-slate-600/30">
                 {/* Hidden on small screens to save space */}
                 <div className="hidden lg:flex items-center gap-4 border-r border-jade-500/20 pr-4 mr-2 text-sm">
                    <div className="flex items-center gap-1.5 text-amber-300/90"><MapPin className="w-4 h-4 text-amber-500" /> {currentCharacter.location}</div>
                    <div className="flex items-center gap-1.5 text-slate-400"><Calendar className="w-4 h-4 text-cyan-500/70" /> 道历 {currentCharacter.currentDate.year}年</div>
                 </div>

                {/* Model Selector */}
                <div className="relative">
                    <button
                        onClick={() => setShowModelMenu(!showModelMenu)}
                        className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm text-violet-300 hover:text-violet-200 bg-violet-950/40 hover:bg-violet-900/50 border border-violet-500/30 rounded-lg transition-all"
                    >
                        <Cpu className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">{AVAILABLE_MODELS.find(m => m.id === currentModelId)?.name || 'XL'}</span>
                        <ChevronDown className="w-3 h-3" />
                    </button>
                    {showModelMenu && (
                        <>
                            {/* Backdrop to close menu */}
                            <div className="fixed inset-0 z-40" onClick={() => setShowModelMenu(false)} />
                            <div className="absolute right-0 top-full mt-2 min-w-[140px] bg-slate-950 border border-violet-500/40 rounded-lg shadow-2xl z-50 overflow-hidden">
                                {AVAILABLE_MODELS.map(model => (
                                    <button
                                        key={model.id}
                                        onClick={() => {
                                            setModel(model.id);
                                            setCurrentModelId(model.id);
                                            setShowModelMenu(false);
                                        }}
                                        className={`w-full px-3 py-2.5 text-left hover:bg-violet-500/20 transition-colors ${
                                            currentModelId === model.id ? 'bg-violet-500/30' : ''
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span className={`font-bold text-sm ${currentModelId === model.id ? 'text-violet-200' : 'text-slate-200'}`}>{model.name}</span>
                                            {currentModelId === model.id && <span className="text-violet-400 text-xs">✓</span>}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-0.5">{model.description}</div>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <Button variant="ghost" onClick={() => setShowStatus(!showStatus)} className="p-1.5 sm:p-2 hover:bg-jade-500/20 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-slate-400 hover:text-jade-300 transition-colors">
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                <Button variant="ghost" onClick={() => onSave(currentCharacter, messages)} className="p-1.5 sm:p-2 hover:bg-amber-500/20 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-slate-400 hover:text-amber-300 transition-colors">
                    <SaveIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                <Button variant="ghost" onClick={onExit} className="p-1.5 sm:p-2 hover:bg-red-500/20 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-slate-400 hover:text-red-300 transition-colors">
                    <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
            </div>
        </header>

        <div className="flex-1 flex overflow-hidden relative">
            
            {/* Main Chat Area - Scroll/Book Style */}
            <main className="flex-1 flex flex-col min-w-0 relative items-center">
                {/* Scroll Container */}
                <div className="flex-1 w-full max-w-3xl overflow-y-auto scroll-smooth z-10 px-4 py-6">
                    {/* Paper/Scroll Frame */}
                    <div className="bg-slate-950/70 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl min-h-full">
                        {/* Top decorative border */}
                        <div className="h-1 bg-gradient-to-r from-transparent via-jade-500/40 to-transparent" />

                        {/* Content Area */}
                        <div className="px-6 sm:px-10 md:px-14 py-8">
                            {messages.map((msg, index) => {
                                const isPlayer = msg.sender === 'PLAYER';
                                const isSystem = msg.sender === 'SYSTEM';
                                const isNPC = !isPlayer && !isSystem;
                                const isLastSystemMsg = isSystem && index === messages.length - 1;
                                const displayContent = isLastSystemMsg && streamingContent ? streamingContent : msg.content;
                                const isEditing = editingMsgId === msg.id;
                                const canReroll = isSystem && index > 0 && !isLoading && displayContent;
                                const canEdit = isPlayer && !isLoading;
                                const canDelete = index > 0 && !isLoading;

                                return (
                                    <div key={msg.id} className="animate-ink-spread group/msg relative">
                                        {/* System/Narrative Message - Main prose */}
                                        {isSystem && (
                                            <div className="mb-1 relative">
                                                {isEditing ? (
                                                    // AI消息编辑模式
                                                    <div className="space-y-2 my-4">
                                                        <textarea
                                                            value={editContent}
                                                            onChange={(e) => setEditContent(e.target.value)}
                                                            className="w-full bg-slate-800/50 border border-amber-500/30 rounded-lg px-3 py-2 text-slate-200 font-serif focus:outline-none focus:border-amber-400 resize-none min-h-[120px]"
                                                            rows={6}
                                                            autoFocus
                                                        />
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={handleSaveEdit}
                                                                className="flex items-center gap-1 px-3 py-1 bg-amber-600/80 hover:bg-amber-500 text-white text-sm rounded transition-colors"
                                                            >
                                                                <Check className="w-3.5 h-3.5" /> 保存
                                                            </button>
                                                            <button
                                                                onClick={handleCancelEdit}
                                                                className="flex items-center gap-1 px-3 py-1 bg-slate-700/80 hover:bg-slate-600 text-slate-300 text-sm rounded transition-colors"
                                                            >
                                                                <X className="w-3.5 h-3.5" /> 取消
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {index === 0 && (
                                                            <span className="text-amber-500/80 mr-1 text-lg">◆</span>
                                                        )}
                                                        {displayContent ? (
                                                            <RichText text={displayContent} className="inline" />
                                                        ) : (
                                                            <span className="inline-flex items-center gap-2 text-slate-500 italic">
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                                天道推演中...
                                                            </span>
                                                        )}
                                                        {/* AI消息操作按钮 */}
                                                        {!isLoading && displayContent && (
                                                            <div className="inline-flex items-center gap-1 ml-3 opacity-0 group-hover/msg:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={() => handleStartEdit(msg)}
                                                                    className="p-1.5 text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded transition-all"
                                                                    title="编辑"
                                                                >
                                                                    <Pencil className="w-3.5 h-3.5" />
                                                                </button>
                                                                {canReroll && (
                                                                    <button
                                                                        onClick={() => handleReroll(index)}
                                                                        className="p-1.5 text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 rounded transition-all"
                                                                        title="重新生成"
                                                                    >
                                                                        <RotateCcw className="w-3.5 h-3.5" />
                                                                    </button>
                                                                )}
                                                                {index > 0 && (
                                                                    <button
                                                                        onClick={() => handleDeleteMessage(msg.id)}
                                                                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                                                                        title="删除"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        {/* Player Message - Jade accent style */}
                                        {isPlayer && (
                                            <div className="my-6 pl-4 border-l-2 border-cyan-500/70 py-1 relative">
                                                {isEditing ? (
                                                    // 编辑模式
                                                    <div className="space-y-2">
                                                        <textarea
                                                            value={editContent}
                                                            onChange={(e) => setEditContent(e.target.value)}
                                                            className="w-full bg-slate-800/50 border border-cyan-500/30 rounded-lg px-3 py-2 text-cyan-100 font-serif focus:outline-none focus:border-cyan-400 resize-none"
                                                            rows={3}
                                                            autoFocus
                                                        />
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={handleSaveEdit}
                                                                className="flex items-center gap-1 px-3 py-1 bg-cyan-600/80 hover:bg-cyan-500 text-white text-sm rounded transition-colors"
                                                            >
                                                                <Check className="w-3.5 h-3.5" /> 保存
                                                            </button>
                                                            <button
                                                                onClick={handleCancelEdit}
                                                                className="flex items-center gap-1 px-3 py-1 bg-slate-700/80 hover:bg-slate-600 text-slate-300 text-sm rounded transition-colors"
                                                            >
                                                                <X className="w-3.5 h-3.5" /> 取消
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    // 显示模式
                                                    <>
                                                        <p className="text-slate-100 text-base sm:text-lg leading-[1.8] font-serif">
                                                            <span className="text-cyan-400 font-medium mr-1">{msg.senderName || '你'}：</span>
                                                            <span className="text-cyan-100/90">「{msg.content}」</span>
                                                        </p>
                                                        {/* 玩家消息操作按钮 */}
                                                        {canEdit && (
                                                            <div className="absolute right-0 top-1 flex items-center gap-1 opacity-0 group-hover/msg:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={() => handleStartEdit(msg)}
                                                                    className="p-1.5 text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded transition-all"
                                                                    title="编辑"
                                                                >
                                                                    <Pencil className="w-3.5 h-3.5" />
                                                                </button>
                                                                {canDelete && (
                                                                    <button
                                                                        onClick={() => handleDeleteMessage(msg.id)}
                                                                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                                                                        title="删除"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        {/* NPC Dialogue */}
                                        {isNPC && (
                                            <div className="my-5 pl-4 border-l-2 border-amber-500/40 bg-amber-950/10 py-3 pr-4 rounded-r relative group/npc">
                                                <p className="text-slate-100 text-base sm:text-lg leading-[1.8] font-serif">
                                                    <span className="text-amber-400 font-bold mr-2">{msg.senderName}：</span>
                                                    「{msg.content}」
                                                </p>
                                                {canDelete && (
                                                    <button
                                                        onClick={() => handleDeleteMessage(msg.id)}
                                                        className="absolute right-2 top-2 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded opacity-0 group-hover/npc:opacity-100 transition-all"
                                                        title="删除"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} className="h-4" />
                        </div>

                        {/* Bottom decorative border */}
                        <div className="h-1 bg-gradient-to-r from-transparent via-jade-500/40 to-transparent" />
                    </div>
                </div>

                {/* Input Area - Gradient accent style */}
                <div className="w-full max-w-3xl px-4 pb-3 z-20">
                    <div className="relative bg-gradient-to-r from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-sm px-4 py-2 rounded-xl border border-cyan-800/30 flex items-center gap-3 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                        {/* Top glow line */}
                        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="描述你的行动..."
                            className="flex-1 bg-transparent border-none py-1 min-h-[32px] max-h-[80px] text-slate-100 text-base font-serif focus:ring-0 focus:outline-none resize-none placeholder-cyan-700/70 leading-normal"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={isLoading || !input.trim()}
                            className="p-2.5 text-cyan-500/70 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </main>

            {/* Side Drawer for Variables (Daoist Scroll Style) */}
            <aside className={`
                absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-b from-slate-950/98 via-slate-900/95 to-slate-950/98 backdrop-blur-xl border-l border-jade-800/30 transform transition-transform duration-500 z-30 overflow-y-auto
                ${showStatus ? 'translate-x-0' : 'translate-x-full'}
                shadow-[-10px_0_40px_rgba(0,0,0,0.8)]
            `}>
                {/* Decorative background pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(16,185,129,0.3) 0%, transparent 50%)'}} />

                <div className="p-6 space-y-8 relative z-10">

                    {/* Header */}
                    <div className="text-center pb-4 relative">
                        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-jade-500/50 to-transparent" />
                        <h3 className="text-white font-title text-4xl mb-2 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">道果金榜</h3>
                        <p className="text-jade-600 text-xs font-serif tracking-[0.5em] uppercase">Status & Destiny</p>
                    </div>

                    {/* World Variables - with color coding */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-3">
                            <Scroll className="w-5 h-5 text-amber-500" />
                            <span className="font-title text-lg text-white">红尘因果</span>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                            {Object.entries(currentCharacter.variables).map(([key, value]) => {
                                // 根据属性类型分配颜色
                                let colorClass = '';
                                let bgClass = '';
                                let borderClass = '';

                                if (key === '境界' || key === '功法') {
                                    colorClass = 'text-cyan-300';
                                    bgClass = 'bg-cyan-950/30';
                                    borderClass = 'border-cyan-500/30';
                                } else if (key === '寿元') {
                                    colorClass = 'text-amber-300';
                                    bgClass = 'bg-amber-950/30';
                                    borderClass = 'border-amber-500/30';
                                } else if (key === '灵石') {
                                    colorClass = 'text-yellow-300';
                                    bgClass = 'bg-yellow-950/30';
                                    borderClass = 'border-yellow-500/30';
                                } else if (key === '名望' || key === '气运') {
                                    colorClass = 'text-purple-300';
                                    bgClass = 'bg-purple-950/30';
                                    borderClass = 'border-purple-500/30';
                                } else if (key === '状态') {
                                    const isNegative = String(value).includes('伤') || String(value).includes('毒') || String(value).includes('病');
                                    colorClass = isNegative ? 'text-red-300' : 'text-emerald-300';
                                    bgClass = isNegative ? 'bg-red-950/30' : 'bg-emerald-950/30';
                                    borderClass = isNegative ? 'border-red-500/30' : 'border-emerald-500/30';
                                } else if (key === '杀气') {
                                    colorClass = 'text-red-400';
                                    bgClass = 'bg-red-950/20';
                                    borderClass = 'border-red-500/20';
                                } else if (key === '宗门') {
                                    colorClass = 'text-blue-300';
                                    bgClass = 'bg-blue-950/30';
                                    borderClass = 'border-blue-500/30';
                                } else {
                                    colorClass = 'text-jade-300';
                                    bgClass = 'bg-jade-950/20';
                                    borderClass = 'border-jade-500/20';
                                }

                                return (
                                    <div
                                        key={key}
                                        className={`flex items-center justify-between p-3 ${bgClass} border ${borderClass} rounded-lg hover:brightness-125 transition-all group`}
                                    >
                                        <span className="text-slate-400 text-sm tracking-wider font-bold group-hover:text-slate-300">{key}</span>
                                        <span className={`${colorClass} font-serif font-bold text-base`}>{String(value)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Natural Talent - with grade-based colors */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-3">
                            <Feather className="w-5 h-5 text-amber-500" />
                            <span className="font-title text-lg text-white">先天命格</span>
                        </div>
                        <div className="space-y-2">
                            {[
                                { attr: currentCharacter.rootBone, label: '根骨', icon: '◈' },
                                { attr: currentCharacter.talent, label: '天赋', icon: '◇' },
                                { attr: currentCharacter.spiritTreasure, label: '灵宝', icon: '◆' }
                            ].map((item, i) => {
                                // 根据品级设置颜色 (新四级系统: 凡级/灵级/地级/天级)
                                let gradeColor = '';
                                let gradeBg = '';
                                let gradeBorder = '';
                                const grade = item.attr.grade;

                                if (grade === '天级') {
                                    gradeColor = 'text-amber-300';
                                    gradeBg = 'bg-gradient-to-r from-amber-950/40 to-orange-950/30';
                                    gradeBorder = 'border-amber-500/40';
                                } else if (grade === '地级') {
                                    gradeColor = 'text-blue-300';
                                    gradeBg = 'bg-gradient-to-r from-blue-950/30 to-indigo-950/20';
                                    gradeBorder = 'border-blue-500/30';
                                } else if (grade === '灵级') {
                                    gradeColor = 'text-emerald-300';
                                    gradeBg = 'bg-gradient-to-r from-emerald-950/30 to-teal-950/20';
                                    gradeBorder = 'border-emerald-500/30';
                                } else {
                                    // 凡级 or default
                                    gradeColor = 'text-slate-400';
                                    gradeBg = 'bg-slate-900/50';
                                    gradeBorder = 'border-slate-600/30';
                                }

                                return (
                                    <div key={i} className={`${gradeBg} p-3 border-l-2 ${gradeBorder} rounded-r-lg relative overflow-hidden group hover:brightness-110 transition-all`}>
                                        {/* Subtle glow for high grades */}
                                        {(grade === '天级' || grade === '地级') && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        )}
                                        <div className="flex justify-between items-center mb-1 relative z-10">
                                            <span className="text-slate-500 text-xs font-bold flex items-center gap-1">
                                                <span className={gradeColor}>{item.icon}</span>
                                                {item.label}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs px-1.5 py-0.5 rounded ${gradeBg} ${gradeColor} border ${gradeBorder}`}>
                                                    {grade}
                                                </span>
                                                <span className="text-white font-serif font-bold text-sm">{item.attr.name}</span>
                                            </div>
                                        </div>
                                        <div className="text-xs text-slate-500 italic truncate relative z-10">{item.attr.description}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Inventory */}
                    {currentCharacter.inventory.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-amber-500">◈</span>
                                <span className="font-title text-lg text-white">储物袋</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {currentCharacter.inventory.map((item, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-gradient-to-r from-slate-800/80 to-slate-700/60 text-sm text-slate-200 rounded-full border border-slate-600/50 hover:border-jade-500/50 hover:text-jade-200 transition-all cursor-default">
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