import React from 'react';
import { Button } from './ui/Button';
import { Save, PlayCircle, Cloud, Wind } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  onLoad: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onLoad }) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      
      {/* Ambient Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Orbs/Clouds */}
        <div className="absolute top-[20%] left-[20%] text-jade-light/10 animate-float duration-[8s]">
            <Cloud className="w-32 h-32 blur-sm" />
        </div>
        <div className="absolute bottom-[30%] right-[20%] text-spirit/10 animate-float duration-[10s] delay-1000">
            <Cloud className="w-48 h-48 blur-md" />
        </div>
        <div className="absolute top-[40%] right-[30%] text-white/5 animate-pulse-slow">
             <Wind className="w-24 h-24 rotate-12" />
        </div>
      </div>

      {/* Main Content */}
      <div className="z-10 flex flex-col items-center space-y-12 animate-ink-spread px-4 w-full max-w-4xl">
        <div className="text-center space-y-8 w-full">
          
          <div className="flex flex-col items-center relative">
            {/* Vertical text decoration */}
            <div className="absolute -left-12 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-jade-500/30 to-transparent hidden md:block"></div>
            <div className="absolute -right-12 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-jade-500/30 to-transparent hidden md:block"></div>

            <h2 className="text-jade-200/90 font-serif tracking-[0.8em] text-sm md:text-base mb-4 uppercase drop-shadow-md">
              Infinite Cultivation Simulator
            </h2>
            
            <h1 className="text-7xl md:text-9xl font-title text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-300 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] relative z-20">
              问道长生
              <span className="absolute -top-4 -right-8 text-2xl text-amber-500/80 animate-pulse">✦</span>
            </h1>
          </div>

          {/* Redesigned Quote Box - High Contrast */}
          <div className="relative max-w-xl mx-auto group cursor-default mt-10">
            {/* Dark background for readability */}
            <div className="absolute inset-0 bg-slate-950/90 transform skew-x-[-3deg] border border-jade-500/40 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl rounded-sm"></div>
            
            {/* Content */}
            <div className="relative z-10 py-8 px-12 text-center space-y-5">
                <p className="text-4xl font-title text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-relaxed tracking-wider">
                    “天地不仁，以万物为刍狗”
                </p>
                <div className="w-2/3 h-[1px] bg-gradient-to-r from-transparent via-jade-500/50 to-transparent mx-auto"></div>
                <div className="flex justify-center items-center gap-8 text-slate-300 text-sm font-serif tracking-[0.3em] font-bold">
                    <span>踏天道</span>
                    <span className="text-amber-500 text-xs">✦</span>
                    <span>碎凌霄</span>
                    <span className="text-amber-500 text-xs">✦</span>
                    <span>逆乾坤</span>
                </div>
            </div>

            {/* Decorative Corner Accents - Brighter */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-amber-500 rounded-tl-none"></div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-amber-500 rounded-br-none"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-jade-500 rounded-tr-none opacity-50"></div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-jade-500 rounded-bl-none opacity-50"></div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-8 w-full max-w-lg px-4 pt-6">
          <Button onClick={onStart} className="flex-1 h-16 text-xl group border-jade-500/50 hover:border-jade-400 bg-slate-900 hover:bg-jade-950 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <PlayCircle className="w-6 h-6 text-jade-400 group-hover:text-white transition-colors" />
            <span>开启仙途</span>
          </Button>
          
          <Button 
            onClick={onLoad} 
            variant="secondary" 
            // Solid background for visibility
            className="flex-1 h-16 text-xl group bg-slate-800 hover:bg-slate-700 border-slate-600 hover:border-slate-400 text-slate-200 hover:text-white shadow-lg"
          >
            <Save className="w-6 h-6 text-slate-400 group-hover:text-jade-300 transition-colors" />
            <span>重续前缘</span>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-slate-400/80 text-xs font-serif tracking-widest drop-shadow-md">
        VER 0.1.0 | PRE-ALPHA | 梦入神机
      </div>
    </div>
  );
};