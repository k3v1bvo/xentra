import React from 'react';

interface XentraLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'auto'; // 'light' para fondos oscuros (Landing, Superadmin), 'dark' para fondos claros (AdminLayout, NeighborLayout)
}

export const XentraLogo: React.FC<XentraLogoProps> = ({
  className = '',
  showText = true,
  size = 'md',
  variant = 'light' // Predeterminado a 'light' con texto blanco brillante para máxima visibilidad en fondos oscuros
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
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Símbolo Geométrico Hexagonal XENTRA */}
      <div className={`relative ${sizeMap[size]} flex-shrink-0 flex items-center justify-center`}>
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-md">
          {/* Hexágono exterior */}
          <polygon
            points="50,10 90,32 90,68 50,90 10,68 10,32"
            stroke="#3B82F6"
            strokeWidth="7"
            strokeLinejoin="round"
            fill={isLight ? '#0B132B' : '#EFF6FF'}
          />
          {/* Cruz comunitaria en verde esmeralda */}
          <path
            d="M32,36 L68,64 M68,36 L32,64"
            stroke="#10B981"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Nodo central de consenso */}
          <circle
            cx="50"
            cy="50"
            r="10"
            fill="#2563EB"
            stroke="#FFFFFF"
            strokeWidth="3.5"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            {/* Texto de la Marca: XENTRA con Alto Contraste Garantizado */}
            <span
              style={{
                color: isLight ? '#FFFFFF' : '#0F172A',
                textShadow: isLight
                  ? '0 2px 10px rgba(59, 130, 246, 0.4), 0 1px 3px rgba(0, 0, 0, 0.9)'
                  : 'none'
              }}
              className={`font-black tracking-tight ${textSizeMap[size]}`}
            >
              XENTRA
            </span>

            {/* Badge Institucional OTB: Siempre de Alto Contraste */}
            <span
              style={{
                backgroundColor: isLight ? '#2563EB' : '#1D4ED8',
                color: '#FFFFFF'
              }}
              className="text-[11px] font-black px-2 py-0.5 rounded-md tracking-wider border border-blue-400/50 shadow-sm"
            >
              OTB
            </span>
          </div>

          {/* Subtítulo Institucional */}
          <span
            style={{
              color: isLight ? '#CBD5E1' : '#475569'
            }}
            className="text-[10px] font-semibold tracking-tight"
          >
            Gestión Financiera Comunitaria
          </span>
        </div>
      )}
    </div>
  );
};
