import React, { useState } from 'react';
import { Button } from './ui/Button';
import { RACES, REGIONS, PATHS, ROOT_BONES, TALENTS, TREASURES, REALMS } from '../constants';
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
  const [race, setRace] = useState(RACES[0]);
  const [region, setRegion] = useState(REGIONS[0]);
  const [path, setPath] = useState(PATHS[0]);

  // RNG States
  const [rollCount, setRollCount] = useState(3);
  const [rootBone, setRootBone] = useState<AttributeRoll>(ROOT_BONES[0]);
  const [talent, setTalent] = useState<AttributeRoll>(TALENTS[0]);
  const [treasure, setTreasure] = useState<AttributeRoll>(TREASURES[0]);
  const [isRolling, setIsRolling] = useState(false);

  const getRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  const handleRoll = () => {
    if (rollCount <= 0) return;
    setIsRolling(true);
    
    // Animation simulation
    let interval = setInterval(() => {
      setRootBone(getRandom(ROOT_BONES));
      setTalent(getRandom(TALENTS));
      setTreasure(getRandom(TREASURES));
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setRollCount(prev => prev - 1);
      setIsRolling(false);
    }, 1000);
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
      race,
      path,
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
      location: region,
      currentDate: { year: 1, month: 1, day: 1 }
    };

    onComplete(newChar);
  };

  const getGradeColor = (grade: AttributeGrade) => {
    switch(grade) {
      case AttributeGrade.MORTAL: return 'text-slate-400';
      case AttributeGrade.SPIRIT: return 'text-emerald-300';
      case AttributeGrade.EARTH: return 'text-blue-300';
      case AttributeGrade.HEAVEN: return 'text-amber-300';
      case AttributeGrade.DIVINE: return 'text-red-400 animate-pulse font-bold';
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

      <div className="w-full max-w-7xl animate-ink-spread mt-12 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12">
        
        {/* Left Column: Form Inputs - Now enclosed in a glass panel for legibility */}
        <div className="md:col-span-7">
            <div className="bg-slate-950/60 backdrop-blur-md p-8 md:p-10 rounded-[3rem] rounded-tl-lg border border-white/10 shadow-2xl relative overflow-hidden">
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

                    {/* Selectors */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { label: '种族', val: race, set: setRace, opts: RACES },
                            { label: '出生地', val: region, set: setRegion, opts: REGIONS },
                            { label: '道途', val: path, set: setPath, opts: PATHS },
                        ].map((item) => (
                            <div key={item.label} className="space-y-2 group">
                                <label className="text-jade-200/80 text-xs font-bold uppercase tracking-widest ml-1 group-hover:text-jade-400 transition-colors">{item.label}</label>
                                <div className="relative">
                                    <select 
                                        value={item.val}
                                        onChange={e => item.set(e.target.value)}
                                        className="w-full bg-slate-900/60 border-b border-slate-600 text-slate-100 text-xl font-serif py-3 px-3 appearance-none focus:outline-none focus:border-jade-400 focus:bg-slate-800 transition-all cursor-pointer rounded-t-lg hover:bg-slate-800/60"
                                    >
                                        {item.opts.map(o => <option key={o} value={o} className="bg-slate-900 text-slate-200">{o}</option>)}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                        <Feather className="w-4 h-4 opacity-70" />
                                    </div>
                                </div>
                            </div>
                        ))}
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

        {/* Right Column: RNG Panel - Stylized as a floating talisman/artifact */}
        <div className="md:col-span-5 flex flex-col">
            <div className="glass-panel shape-organic-reverse p-8 md:p-10 flex-1 flex flex-col gap-8 relative overflow-hidden border-jade-500/20 bg-slate-950/80 backdrop-blur-xl shadow-2xl">
                
                {/* Header */}
                <div className="flex justify-between items-center border-b border-white/10 pb-6">
                     <h2 className="text-4xl font-title text-white">天命抉择</h2>
                     <div className="flex items-center gap-2 text-sm bg-black/60 px-4 py-1.5 rounded-full border border-white/10 shadow-inner">
                        <RefreshCw className={`w-4 h-4 ${isRolling ? 'animate-spin text-jade-400' : 'text-slate-400'}`} />
                        <span className="text-slate-400">剩余:</span>
                        <span className={`font-bold text-xl ${rollCount > 0 ? 'text-amber-400' : 'text-slate-600'}`}>{rollCount}</span>
                     </div>
                </div>

                {/* Attributes Display */}
                <div className="space-y-5 flex-1">
                    {[
                        { label: '根骨', sub: 'Root Bone', data: rootBone },
                        { label: '天赋', sub: 'Talent', data: talent },
                        { label: '灵宝', sub: 'Relic', data: treasure },
                    ].map((item, idx) => (
                        <div key={idx} className="group relative bg-slate-900/50 p-6 transition-all hover:bg-slate-800/80 shape-organic border-l-2 border-slate-700 hover:border-jade-500 shadow-lg">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest block mb-1">{item.sub}</span>
                                    <span className="text-2xl font-title text-white tracking-wide">{item.label}</span>
                                </div>
                                <span className={`text-xs px-2.5 py-1 rounded-full border ${getGradeColor(item.data.grade)} border-current bg-black/40 backdrop-blur-sm font-serif`}>
                                    {item.data.grade}
                                </span>
                            </div>
                            
                            <div className={`text-xl font-serif font-bold mb-2 ${getGradeColor(item.data.grade)}`}>
                                {item.data.name}
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed font-body">{item.data.description}</p>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="space-y-4 mt-4 pt-6 border-t border-white/5">
                    <Button 
                        onClick={handleRoll} 
                        disabled={rollCount === 0 || isRolling}
                        variant="secondary"
                        className="w-full text-lg"
                    >
                        <Dices className="w-5 h-5" /> 逆天改命
                    </Button>

                    <Button 
                        onClick={handleSubmit}
                        className="w-full h-16 text-2xl bg-gradient-to-r from-jade-900 to-slate-900 border-jade-500/50 hover:border-jade-300 hover:from-jade-800 hover:to-slate-800"
                    >
                        <Sparkles className="w-6 h-6 text-jade-300 animate-pulse" /> 
                        <span className="mx-2">踏入仙途</span>
                        <ArrowRight className="w-6 h-6" />
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
