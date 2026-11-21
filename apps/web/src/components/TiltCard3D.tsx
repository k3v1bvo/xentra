import React, { useState, useRef } from 'react';

interface TiltCard3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

/**
 * TiltCard3D — Tarjeta Espacial con Profundidad 3D y Efecto Vidrio
 * Aplica inclinación física interactiva en los ejes X e Y según la posición del cursor.
 * Añade destello especular dinámico que sigue el ángulo de la luz.
 */
export const TiltCard3D: React.FC<TiltCard3DProps> = ({
  children,
  className = '',
  intensity = 12
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
    setGlarePos({ x: glareX, y: glareY, opacity: 0.25 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      style={{ perspective: '1000px' }}
      className="w-full"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
          transformStyle: 'preserve-3d'
        }}
        className={`relative overflow-hidden transition-all duration-200 ${className}`}
      >
        {/* Destello especular 3D */}
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 320px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, ${glarePos.opacity}), transparent 80%)`
          }}
        />

        <div style={{ transform: 'translateZ(18px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
};
