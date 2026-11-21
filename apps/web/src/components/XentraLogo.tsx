import React from 'react';

interface XentraLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const XentraLogo: React.FC<XentraLogoProps> = ({
  className = '',
  showText = true,
  size = 'md'
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const textSizeMap = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Símbolo Geométrico XENTRA */}
      <div className={`relative ${sizeMap[size]} flex-shrink-0 flex items-center justify-center`}>
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-sm">
          <polygon
            points="50,10 90,32 90,68 50,90 10,68 10,32"
            stroke="#2563EB"
            strokeWidth="7"
            strokeLinejoin="round"
            className="fill-slate-900"
          />
          <path
            d="M32,36 L68,64 M68,36 L32,64"
            stroke="#10B981"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <circle cx="50" cy="50" r="10" fill="#2563EB" stroke="#FFFFFF" strokeWidth="3" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold tracking-tight text-slate-900 dark:text-white ${textSizeMap[size]}`}>
              XENTRA
            </span>
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 tracking-wider">
              OTB
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium tracking-tight">
            Gestión Financiera Comunitaria
          </span>
        </div>
      )}
    </div>
  );
};
