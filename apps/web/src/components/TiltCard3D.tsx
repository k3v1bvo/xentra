import React, { useState, useRef } from 'react';

interface TiltCard3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

/**
 * TiltCard3D — Tarjeta Espacial de Alto Contraste y Nitidez
 * Aplica inclinación física interactiva suave sin romper el apilamiento de capas
 * ni hacer invisibles los textos en navegadores móviles (iOS/Android/WebKit).
 */
export const TiltCard3D: React.FC<TiltCard3DProps> = ({
  children,
  className = '',
  intensity = 6
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -intensity;
    const rotY = ((x - centerX) / centerX) * intensity;

    setRotateX(rotX);
    setRotateY(rotY);

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePos({ x: glareX, y: glareY, opacity: 0.18 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.18s ease-out, box-shadow 0.18s ease-out',
        willChange: 'transform'
      }}
      className={`relative overflow-hidden transition-all duration-200 ${className}`}
    >
      {/* Destello especular de luz 3D suave (sin oscurecer ni ocultar texto) */}
      <div
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 380px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, ${glarePos.opacity}), transparent 75%)`
        }}
      />

      {/* Contenido con contraste garantizado */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};
