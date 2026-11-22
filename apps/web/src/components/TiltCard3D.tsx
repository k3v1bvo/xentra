import React from 'react';

interface TiltCard3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

/**
 * TiltCard3D / SpatialCard — Tarjeta Espacial Estable y Profesional
 * Proporciona profundidad visual, iluminación ambiental y contraste óptimo
 * SIN rotaciones físicas que desestabilicen los botones o rompan los clics del usuario.
 */
export const TiltCard3D: React.FC<TiltCard3DProps> = ({
  children,
  className = ''
}) => {
  return (
    <div
      className={`relative transition-all duration-200 ease-out hover:shadow-2xl hover:shadow-blue-500/10 ${className}`}
    >
      <div className="relative z-10 w-full h-full flex flex-col">
        {children}
      </div>
    </div>
  );
};
