import React from 'react';
import { Eye, Check, Sparkles } from 'lucide-react';
import { useAccessibilityStore } from '../stores/accessibilityStore';

export const SeniorModeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isSeniorMode, toggleSeniorMode } = useAccessibilityStore();

  return (
    <button
      type="button"
      onClick={toggleSeniorMode}
      aria-label="Alternar Modo Senior para personas mayores de 50 años"
      title="Activa letra grande (≥18px), botones táctiles de 56-64px y contraste WCAG AAA (7:1)"
      className={`inline-flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border-2 transition-all cursor-pointer font-black text-xs sm:text-sm shadow-md ${
        isSeniorMode
          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-amber-500/25 scale-[1.02]'
          : 'bg-[#0B132B] text-slate-200 border-slate-700 hover:border-amber-400/80 hover:text-white'
      } ${className}`}
    >
      <Eye className={`w-4 h-4 sm:w-5 h-5 flex-shrink-0 ${isSeniorMode ? 'text-slate-950' : 'text-amber-400'}`} />
      <span className="leading-tight">
        {isSeniorMode ? '👓 Vista Cómoda (+50)' : '👓 Modo Senior (+50)'}
      </span>
      {isSeniorMode && (
        <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse flex-shrink-0" />
      )}
    </button>
  );
};
