import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading,
  ...props 
}) => {
  // Asymmetric shape for organic feel
  const baseStyles = "relative px-8 py-3 font-serif font-bold tracking-widest transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group shape-organic";
  
  const variants = {
    primary: "bg-slate-900/80 text-jade-50 border border-jade-500/50 hover:bg-jade-900/80 hover:border-jade-400 hover:text-white shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] backdrop-blur-md",
    secondary: "bg-white/5 backdrop-blur-sm text-slate-200 border border-white/20 hover:border-white/50 hover:bg-white/10 hover:text-white",
    danger: "bg-red-950/40 text-red-200 border border-red-800/50 hover:bg-red-900/60 hover:border-red-500 hover:text-red-50",
    ghost: "bg-transparent text-slate-300 hover:text-white hover:bg-white/10 border-none shadow-none",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2 text-shadow-sm">
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : null}
        {children}
      </span>
      
      {/* Dynamic Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
    </button>
  );
};