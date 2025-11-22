import React, { useState } from 'react';
import { Button } from './ui/Button';
import { RACES, REGIONS, PATHS, ROOT_BONES, ROOT_BONES_MALE_VARIANT, TALENTS, TREASURES, REALMS, RaceOption, RegionOption, PathOption } from '../constants';
import { Character, AttributeRoll, AttributeGrade } from '../types';
import { RefreshCw, Dices, ArrowRight, ChevronLeft, Sparkles, Feather, CheckCircle2 } from 'lucide-react';

interface CharacterCreationProps {
  onComplete: (char: Character) => void;
  onBack: () => void;
}

export const CharacterCreation: React.FC<CharacterCreationProps> = ({ onComplete, onBack }) => {
  // Input States
  const [name, setName] = useState('');
  const [age, setAge] = useState(16);
  const [gender, setGender] = useState<Character['gender']>('男');
  const [appearance, setAppearance] = useState('');
  const [race, setRace] = useState<RaceOption>(RACES[0]);
  const [region, setRegion] = useState<RegionOption>(REGIONS[0]);
  const [path, setPath] = useState<PathOption>(PATHS[0]);

  // RNG States
  const [rollCount, setRollCount] = useState(3);
  const [rootBone, setRootBone] = useState<AttributeRoll>(ROOT_BONES[0]);
  const [talent, setTalent] = useState<AttributeRoll>(TALENTS[0]);
  const [treasure, setTreasure] = useState<AttributeRoll>(TREASURES[0]);
  const [isRolling, setIsRolling] = useState(false);
  const [rollPhase, setRollPhase] = useState<'idle' | 'shaking' | 'revealing'>('idle');
  const [revealIndex, setRevealIndex] = useState(-1);

  const getRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  // 根据性别获取根骨池（男性用纯阳之体替换九阴绝脉）
  const getGenderedRootBones = () => {
    if (gender === '男') {
      return ROOT_BONES.map(bone =>
        bone.name === '九阴绝脉' ? ROOT_BONES_MALE_VARIANT : bone
      );
    }
    return ROOT_BONES;
  };

  const handleRoll = () => {
    if (rollCount <= 0 || isRolling) return;
    setIsRolling(true);
    setRollPhase('shaking');
    setRevealIndex(-1);

    // Phase 1: Shaking animation with rapid changes
    const genderedRootBones = getGenderedRootBones();
    let interval = setInterval(() => {
      setRootBone(getRandom(genderedRootBones));
      setTalent(getRandom(TALENTS));
      setTreasure(getRandom(TREASURES));
    }, 80);

    // Phase 2: Stop shaking, start reveal sequence
    setTimeout(() => {
      clearInterval(interval);
      setRollPhase('revealing');

      // Final values
      const finalRootBone = getRandom(genderedRootBones);
      const finalTalent = getRandom(TALENTS);
      const finalTreasure = getRandom(TREASURES);

      // Staggered reveal animation
      setTimeout(() => {
        setRootBone(finalRootBone);
        setRevealIndex(0);
      }, 200);

      setTimeout(() => {
        setTalent(finalTalent);
        setRevealIndex(1);
      }, 500);

      setTimeout(() => {
        setTreasure(finalTreasure);
        setRevealIndex(2);
      }, 800);

      // Complete
      setTimeout(() => {
        setRollCount(prev => prev - 1);
        setIsRolling(false);
        setRollPhase('idle');
        setRevealIndex(-1);
      }, 1200);
    }, 800);
  };

  const handleSubmit = () => {
    if (!name) {
        alert("大道无名，但你也需一个代号。");
        return;
    }

    const newChar: Character = {
      id: Date.now().toString(),
      name,
      gender,
      appearance: appearance || '相貌平平，混入人群便再难寻觅。',
      race: race.name,
      path: path.name,
      rootBone,
      talent,
      spiritTreasure: treasure,
      inventory: [],
      // The New Variable System
      variables: {
          '寿元': age,
          '境界': REALMS[0],
          '名望': '籍籍无名',
          '宗门': '无',
          '魅力': '普通',
          '气运': '平平',
          '状态': '健康',
          '功法': '无',
          '灵石': 0,
          '杀气': '无'
      },
      location: region.name,
      currentDate: { year: 1, month: 1, day: 1 }
    };

    onComplete(newChar);
  };

  const getGradeColor = (grade: AttributeGrade) => {
    switch(grade) {
      case AttributeGrade.MORTAL: return 'text-slate-400';
      case AttributeGrade.SPIRIT: return 'text-emerald-300';
      case AttributeGrade.EARTH: return 'text-blue-300';
      case AttributeGrade.HEAVEN: return 'text-amber-400 animate-pulse font-bold drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center p-4 md:p-8 overflow-y-auto custom-scrollbar">
      
      {/* Back Button - Floating */}
      <div className="fixed top-6 left-6 z-50">
        <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/20 bg-black/20 backdrop-blur-md border border-white/5">
           <ChevronLeft className="w-5 h-5 mr-1" /> 返回
        </Button>
      </div>

      <div className="w-full max-w-7xl animate-ink-spread mt-12 sm:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 pb-12">
        
        {/* Left Column: Form Inputs - Now enclosed in a glass panel for legibility */}
        <div className="lg:col-span-7">
            <div className="bg-slate-950/60 backdrop-blur-md p-4 sm:p-8 md:p-10 rounded-2xl sm:rounded-[3rem] sm:rounded-tl-lg border border-white/10 shadow-2xl relative overflow-hidden">
                {/* Decorative sheen */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-jade-500/50 to-transparent opacity-50"></div>
                
                <div className="space-y-10 relative z-10">
                    <div>
                        <h2 className="text-5xl font-title text-white drop-shadow-lg mb-2">
                            <span className="text-jade-400 mr-2">✦</span> 塑形铸魂
                        </h2>
                        <p className="text-slate-400 text-lg font-serif italic border-l-2 border-jade-500/30 pl-4 mt-2">
                            既然踏上仙途，便忘了凡尘过往。
                        </p>
                    </div>

                    {/* Name & Age Row */}
                    <div className="grid grid-cols-12 gap-6 items-end">
                        <div className="col-span-8 space-y-2">
                            <label className="text-jade-200/80 text-xs font-bold uppercase tracking-widest ml-1">道号 / Name</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="输入姓名..."
                                className="input-ink w-full placeholder:text-slate-600"
                                autoFocus
                            />
                        </div>
                        <div className="col-span-4 space-y-2">
                            <label className="text-jade-200/80 text-xs font-bold uppercase tracking-widest text-center block">寿元 / Age</label>
                            <input 
                                type="number" 
                                value={age}
                                onChange={e => setAge(Number(e.target.value))}
                                min={10}
                                max={1000}
                                className="input-ink w-full text-center"
                            />
                        </div>
                    </div>

                    {/* Gender Selection - High Contrast */}
                    <div className="space-y-4">
                        <label className="text-jade-200/80 text-xs font-bold uppercase tracking-widest ml-1">阴阳 / Gender</label>
                        <div className="flex gap-4">
                            {['男', '女', '无相'].map((g) => {
                                const isSelected = gender === g;
                                return (
                                    <button 
                                        key={g}
                                        onClick={() => setGender(g as any)}
                                        className={`
                                            flex-1 py-4 text-xl font-title shape-organic transition-all duration-300 relative group overflow-hidden
                                            ${isSelected 
                                                ? 'bg-gradient-to-br from-jade-700 to-jade-900 text-white shadow-[0_0_25px_rgba(16,185,129,0.5)] border border-jade-400 scale-[1.02] z-10' 
                                                : 'bg-black/30 text-slate-500 hover:bg-black/50 hover:text-slate-300 border border-white/5'
                                            }
                                        `}
                                    >
                                        <div className="relative z-10 flex items-center justify-center gap-2">
                                            {isSelected && <CheckCircle2 className="w-4 h-4 text-jade-200 animate-pulse" />}
                                            <span>{g}</span>
                                        </div>
                                        
                                        {/* Shine effect for selected */}
                                        {isSelected && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 种族选择 */}
                    <div className="space-y-3">
                        <label className="text-jade-200/80 text-xs font-bold uppercase tracking-widest ml-1">种族 / Race</label>
                        <div className="relative">
                            <select
                                value={race.name}
                                onChange={e => setRace(RACES.find(r => r.name === e.target.value) || RACES[0])}
                                className="w-full bg-slate-900/60 border-b border-slate-600 text-slate-100 text-xl font-serif py-3 px-3 appearance-none focus:outline-none focus:border-jade-400 focus:bg-slate-800 transition-all cursor-pointer rounded-t-lg hover:bg-slate-800/60"
                            >
                                {RACES.map(r => (
                                    <option key={r.name} value={r.name} className="bg-slate-900 text-slate-200">
                                        【{r.name}】{r.title}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                <Feather className="w-4 h-4 opacity-70" />
                            </div>
                        </div>
                        <div className="bg-slate-900/40 border-l-2 border-amber-500/40 px-4 py-3 rounded-r-lg">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-amber-400 font-title text-lg">{race.name}</span>
                                <span className="text-slate-500 text-sm">·</span>
                                <span className="text-slate-400 text-sm italic">{race.title}</span>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">{race.description}</p>
                        </div>
                    </div>

                    {/* 疆域选择 */}
                    <div className="space-y-3">
                        <label className="text-jade-200/80 text-xs font-bold uppercase tracking-widest ml-1">出生地 / Region</label>
                        <div className="relative">
                            <select
                                value={region.name}
                                onChange={e => setRegion(REGIONS.find(r => r.name === e.target.value) || REGIONS[0])}
                                className="w-full bg-slate-900/60 border-b border-slate-600 text-slate-100 text-xl font-serif py-3 px-3 appearance-none focus:outline-none focus:border-jade-400 focus:bg-slate-800 transition-all cursor-pointer rounded-t-lg hover:bg-slate-800/60"
                            >
                                {REGIONS.map(r => (
                                    <option key={r.name} value={r.name} className="bg-slate-900 text-slate-200">
                                        【{r.name}】{r.title}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                <Feather className="w-4 h-4 opacity-70" />
                            </div>
                        </div>
                        <div className="bg-slate-900/40 border-l-2 border-cyan-500/40 px-4 py-3 rounded-r-lg">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-cyan-400 font-title text-lg">{region.name}</span>
                                <span className="text-slate-500 text-sm">·</span>
                                <span className="text-slate-400 text-sm italic">{region.title}</span>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">{region.description}</p>
                        </div>
                    </div>

                    {/* 道途选择 */}
                    <div className="space-y-3">
                        <label className="text-jade-200/80 text-xs font-bold uppercase tracking-widest ml-1">道途 / Path</label>
                        <div className="relative">
                            <select
                                value={path.name}
                                onChange={e => setPath(PATHS.find(p => p.name === e.target.value) || PATHS[0])}
                                className="w-full bg-slate-900/60 border-b border-slate-600 text-slate-100 text-xl font-serif py-3 px-3 appearance-none focus:outline-none focus:border-jade-400 focus:bg-slate-800 transition-all cursor-pointer rounded-t-lg hover:bg-slate-800/60"
                            >
                                {/* 五行本源 */}
                                <optgroup label="═══ 五行本源 ═══" className="bg-slate-800 text-jade-400 font-bold">
                                    {PATHS.filter(p => p.category === '五行本源').map(p => (
                                        <option key={p.name} value={p.name} className="bg-slate-900 text-slate-200">
                                            {p.name} · {p.title}
                                        </option>
                                    ))}
                                </optgroup>
                                {/* 诸子百艺 */}
                                <optgroup label="═══ 诸子百艺 ═══" className="bg-slate-800 text-amber-400 font-bold">
                                    {PATHS.filter(p => p.category === '诸子百艺').map(p => (
                                        <option key={p.name} value={p.name} className="bg-slate-900 text-slate-200">
                                            {p.name} · {p.title}
                                        </option>
                                    ))}
                                </optgroup>
                                {/* 外道魔门 */}
                                <optgroup label="═══ 外道魔门 ═══" className="bg-slate-800 text-red-400 font-bold">
                                    {PATHS.filter(p => p.category === '外道魔门').map(p => (
                                        <option key={p.name} value={p.name} className="bg-slate-900 text-slate-200">
                                            {p.name} · {p.title}
                                        </option>
                                    ))}
                                </optgroup>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                <Feather className="w-4 h-4 opacity-70" />
                            </div>
                        </div>
                        <div className={`px-4 py-3 rounded-r-lg border-l-2 ${
                            path.category === '五行本源' ? 'bg-jade-950/30 border-jade-500/40' :
                            path.category === '诸子百艺' ? 'bg-amber-950/30 border-amber-500/40' :
                            'bg-red-950/30 border-red-500/40'
                        }`}>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                    path.category === '五行本源' ? 'bg-jade-900/50 text-jade-300' :
                                    path.category === '诸子百艺' ? 'bg-amber-900/50 text-amber-300' :
                                    'bg-red-900/50 text-red-300'
                                }`}>{path.category}</span>
                                <span className={`font-title text-lg ${
                                    path.category === '五行本源' ? 'text-jade-400' :
                                    path.category === '诸子百艺' ? 'text-amber-400' :
                                    'text-red-400'
                                }`}>{path.name}</span>
                                <span className="text-slate-500 text-sm">·</span>
                                <span className="text-slate-400 text-sm italic">{path.title}</span>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">{path.description}</p>
                        </div>
                    </div>

                    {/* Appearance Textarea */}
                    <div className="space-y-2">
                        <label className="text-jade-200/80 text-xs font-bold uppercase tracking-widest ml-1">外貌 / Appearance</label>
                        <textarea 
                            value={appearance}
                            onChange={e => setAppearance(e.target.value)}
                            placeholder="描述你的容貌特征..."
                            rows={3}
                            className="w-full bg-slate-900/30 border-b border-slate-600 text-slate-100 text-lg font-body py-3 px-3 focus:outline-none focus:border-jade-400 resize-none transition-colors placeholder-slate-600 rounded-t-lg hover:bg-slate-800/30"
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: RNG Panel */}
        <div className="lg:col-span-5 flex flex-col">
            <div className="glass-panel shape-organic-reverse p-4 sm:p-6 md:p-8 flex-1 flex flex-col relative overflow-hidden border-jade-500/20 bg-slate-950/80 backdrop-blur-xl shadow-2xl">

                {/* Subtle decorative elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* Top gradient line */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-jade-500/40 to-transparent" />
                    {/* Subtle corner accents */}
                    <div className="absolute top-4 left-4 w-8 h-8 border-l border-t border-jade-500/20" />
                    <div className="absolute top-4 right-4 w-8 h-8 border-r border-t border-jade-500/20" />
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-l border-b border-jade-500/20" />
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-r border-b border-jade-500/20" />
                </div>

                {/* Header */}
                <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4 relative z-10">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-title text-white drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">天命抉择</h2>
                        <p className="text-slate-500 text-xs mt-1 tracking-widest">DESTINY UNFOLDS</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-black/60 px-4 py-2 rounded-full border border-white/10 shadow-inner">
                        <RefreshCw className={`w-4 h-4 ${isRolling ? 'animate-spin text-jade-400' : 'text-slate-400'}`} />
                        <span className="text-slate-400">剩余:</span>
                        <span className={`font-bold text-xl ${rollCount > 0 ? 'text-amber-400' : 'text-slate-600'}`}>{rollCount}</span>
                    </div>
                </div>

                {/* Flavor Quote */}
                <div className="text-center py-3 mb-4 border-y border-white/5 relative z-10">
                    <p className="text-slate-500 text-sm italic font-serif">
                        「命由天定，运由己造。三次机缘，且看造化。」
                    </p>
                </div>

                {/* Attributes Display */}
                <div className="space-y-4 relative z-10">
                    {[
                        { label: '根骨', sub: 'Root Bone', data: rootBone, icon: '◈' },
                        { label: '天赋', sub: 'Talent', data: talent, icon: '◇' },
                        { label: '灵宝', sub: 'Relic', data: treasure, icon: '◆' },
                    ].map((item, idx) => {
                        const isShaking = rollPhase === 'shaking';
                        const isRevealing = rollPhase === 'revealing' && revealIndex === idx;
                        const isRevealed = rollPhase === 'revealing' && revealIndex > idx;

                        return (
                            <div
                                key={idx}
                                className={`
                                    group relative bg-slate-900/50 p-4 sm:p-5 transition-all shape-organic border-l-2 shadow-lg card-3d
                                    ${isShaking ? 'dice-shaking border-amber-500/50 bg-slate-800/80' : ''}
                                    ${isRevealing ? 'card-revealing glow-pulse border-jade-400' : ''}
                                    ${isRevealed || (!isRolling && rollPhase === 'idle') ? 'hover:bg-slate-800/80 border-slate-700 hover:border-jade-500' : 'border-slate-700'}
                                `}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-lg ${getGradeColor(item.data.grade)}`}>{item.icon}</span>
                                        <div>
                                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest block">{item.sub}</span>
                                            <span className="text-xl font-title text-white tracking-wide">{item.label}</span>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2.5 py-1 rounded-full border ${getGradeColor(item.data.grade)} border-current bg-black/40 backdrop-blur-sm font-serif transition-all ${isRevealing ? 'scale-110' : ''}`}>
                                        {item.data.grade}
                                    </span>
                                </div>

                                <div className={`text-lg font-serif font-bold mb-1.5 transition-all ${getGradeColor(item.data.grade)} ${isShaking ? 'blur-[2px]' : ''}`}>
                                    {item.data.name}
                                </div>
                                <p className={`text-xs sm:text-sm text-slate-400 leading-relaxed font-body transition-all ${isShaking ? 'blur-[1px] opacity-50' : ''}`}>
                                    {item.data.description}
                                </p>

                                {/* Glow effect for high-grade reveals */}
                                {isRevealing && (item.data.grade === AttributeGrade.HEAVEN || item.data.grade === AttributeGrade.EARTH) && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-transparent to-amber-500/20 rounded-[inherit] animate-pulse pointer-events-none" />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Divider with decoration */}
                <div className="flex items-center gap-3 my-4 relative z-10">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-jade-500/30 to-transparent" />
                    <span className="text-jade-500/50 text-xs">✦</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-jade-500/30 to-transparent" />
                </div>

                {/* Actions */}
                <div className="space-y-3 relative z-10">
                    {/* 逆天改命 - 命运/骰子按钮，琥珀金色调 */}
                    <Button
                        onClick={handleRoll}
                        disabled={rollCount === 0 || isRolling}
                        variant="secondary"
                        className={`
                            w-full h-12 text-lg font-bold
                            bg-gradient-to-r from-amber-950/80 via-yellow-900/60 to-amber-950/80
                            border border-amber-500/40 hover:border-amber-400/70
                            text-amber-200 hover:text-amber-100
                            shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]
                            transition-all duration-300
                            ${isRolling ? 'animate-pulse border-amber-400' : ''}
                            ${rollCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        <Dices className={`w-5 h-5 mr-2 ${rollPhase === 'shaking' ? 'animate-spin' : ''}`} />
                        {isRolling ? '天机变化中...' : '逆天改命'}
                    </Button>

                    {/* 踏入仙途 - 主要行动按钮，翡翠绿色调 */}
                    <Button
                        onClick={handleSubmit}
                        className="
                            w-full h-14 sm:h-16 text-xl sm:text-2xl font-bold
                            bg-gradient-to-r from-emerald-900/90 via-jade-800/80 to-emerald-900/90
                            border border-jade-400/50 hover:border-jade-300
                            text-jade-100 hover:text-white
                            shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]
                            transition-all duration-300
                        "
                    >
                        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-jade-300 animate-pulse" />
                        <span className="mx-2">踏入仙途</span>
                        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </Button>

                    {/* Decorative Image - at bottom in responsive layout */}
                    <div className="relative rounded-lg overflow-hidden border border-white/10 shadow-lg mt-2">
                        <img
                            src="https://pub-69c4594cd9ee46c681d99f41bd5bf29a.r2.dev/%E4%BF%AE%E4%BB%99%E5%9B%BE.jpeg"
                            alt="修仙意境"
                            className="w-full h-auto object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/30 pointer-events-none" />
                    </div>
                </div>

                {/* Bottom flavor text */}
                <p className="text-center text-slate-600 text-[10px] mt-4 tracking-wider relative z-10">
                    ─── 一入仙门深似海 ───
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
