import React from 'react';

interface XentraLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark'; // 'light' para fondos oscuros (Landing, Superadmin), 'dark' para fondos claros (AdminLayout, NeighborLayout, Modal Login)
}

export const XentraLogo: React.FC<XentraLogoProps> = ({
  className = '',
  showText = true,
  size = 'md',
  variant = 'light' // Predeterminado a 'light' con texto blanco brillante para máxima visibilidad
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

  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Símbolo Geométrico XENTRA */}
      <div className={`relative ${sizeMap[size]} flex-shrink-0 flex items-center justify-center`}>
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-md">
          <polygon
            points="50,10 90,32 90,68 50,90 10,68 10,32"
            stroke={isLight ? '#3B82F6' : '#2563EB'}
            strokeWidth="7"
            strokeLinejoin="round"
            fill={isLight ? '#0B132B' : '#F8FAFC'}
          />
          <path
            d="M32,36 L68,64 M68,36 L32,64"
            stroke="#10B981"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <circle
            cx="50"
            cy="50"
            r="10"
            fill="#2563EB"
            stroke="#FFFFFF"
            strokeWidth="3"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span
              style={{
                color: isLight ? '#FFFFFF' : '#0F172A',
                textShadow: isLight ? '0 1px 4px rgba(0,0,0,0.6)' : 'none'
              }}
              className={`font-black tracking-tight ${textSizeMap[size]}`}
            >
              XENTRA
            </span>
            <span
              style={{
                backgroundColor: isLight ? '#2563EB' : '#DBEAFE',
                color: isLight ? '#FFFFFF' : '#1D4ED8'
              }}
              className="text-[11px] font-black px-2 py-0.5 rounded-full tracking-wider border border-blue-400/40 shadow-sm"
            >
              OTB
            </span>
          </div>
          <span
            style={{ color: isLight ? '#E2E8F0' : '#475569' }}
            className="text-[10px] font-semibold tracking-tight mt-0.5"
          >
            Gestión Financiera Comunitaria
          </span>
        </div>
      )}
    </div>
  );
};
