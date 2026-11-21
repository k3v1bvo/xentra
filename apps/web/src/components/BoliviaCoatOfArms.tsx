import React from 'react';

interface BoliviaCoatOfArmsProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const BoliviaCoatOfArms: React.FC<BoliviaCoatOfArmsProps> = ({
  size = 64,
  className = '',
  showText = false
}) => {
  return (
    <div className={`flex flex-col items-center flex-shrink-0 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm select-none"
      >
        <defs>
          {/* Degradados heráldicos */}
          <linearGradient id="skyGrad" x1="100" y1="50" x2="100" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="60%" stopColor="#BAE6FD" />
            <stop offset="100%" stopColor="#FEF08A" />
          </linearGradient>

          <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>

          <linearGradient id="cerroGrad" x1="100" y1="75" x2="100" y2="125" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#B45309" />
            <stop offset="50%" stopColor="#92400E" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          <linearGradient id="condorBody" x1="100" y1="10" x2="100" y2="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Sombra suave interior */}
          <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* ======================================================== */}
        {/* 1. CAÑONES Y FUSILES CRUZADOS TRASEROS                    */}
        {/* ======================================================== */}
        <g stroke="#334155" strokeWidth="3" strokeLinecap="round">
          <line x1="30" y1="160" x2="170" y2="70" />
          <line x1="170" y1="160" x2="30" y2="70" />
        </g>
        {/* Bocas de cañón en bronce */}
        <circle cx="28" cy="162" r="4.5" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
        <circle cx="172" cy="162" r="4.5" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />

        {/* ======================================================== */}
        {/* 2. BANDERAS TRICOLORES LATERALES (IZQUIERDA Y DERECHA)   */}
        {/* ======================================================== */}
        {/* Pabellón Izquierdo */}
        <g filter="url(#softGlow)">
          {/* Bandera 1 (Roja, Amarilla, Verde) */}
          <path d="M45 68 C30 72 18 85 10 98 L18 135 C30 118 42 106 52 100 Z" fill="#DC2626" />
          <path d="M42 78 C30 84 20 95 14 108 L22 142 C32 126 44 114 50 108 Z" fill="#FACC15" />
          <path d="M40 88 C30 94 22 104 18 116 L26 148 C36 132 46 122 50 116 Z" fill="#16A34A" />

          {/* Bandera 2 Izquierda */}
          <path d="M56 60 C38 66 22 80 14 96 L22 126 C36 108 50 94 62 88 Z" fill="#DC2626" />
          <path d="M54 70 C38 76 26 88 18 104 L26 132 C40 114 52 102 60 96 Z" fill="#FACC15" />
          <path d="M52 80 C38 86 28 96 22 110 L30 138 C42 120 54 110 60 104 Z" fill="#16A34A" />

          {/* Astas doradas con picas */}
          <line x1="58" y1="50" x2="32" y2="155" stroke="url(#goldGrad)" strokeWidth="3" strokeLinecap="round" />
          <polygon points="60,42 63,52 55,50" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
          <line x1="48" y1="58" x2="22" y2="150" stroke="url(#goldGrad)" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="50,50 53,60 45,58" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
        </g>

        {/* Pabellón Derecho */}
        <g filter="url(#softGlow)">
          {/* Bandera 1 Derecha */}
          <path d="M155 68 C170 72 182 85 190 98 L182 135 C170 118 158 106 148 100 Z" fill="#DC2626" />
          <path d="M158 78 C170 84 180 95 186 108 L178 142 C168 126 156 114 150 108 Z" fill="#FACC15" />
          <path d="M160 88 C170 94 178 104 182 116 L174 148 C164 132 154 122 150 116 Z" fill="#16A34A" />

          {/* Bandera 2 Derecha */}
          <path d="M144 60 C162 66 178 80 186 96 L178 126 C164 108 150 94 138 88 Z" fill="#DC2626" />
          <path d="M146 70 C162 76 174 88 182 104 L174 132 C160 114 148 102 140 96 Z" fill="#FACC15" />
          <path d="M148 80 C162 86 172 96 178 110 L170 138 C158 120 146 110 140 104 Z" fill="#16A34A" />

          {/* Astas doradas con picas */}
          <line x1="142" y1="50" x2="168" y2="155" stroke="url(#goldGrad)" strokeWidth="3" strokeLinecap="round" />
          <polygon points="140,42 137,52 145,50" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
          <line x1="152" y1="58" x2="178" y2="150" stroke="url(#goldGrad)" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="150,50 147,60 155,58" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
        </g>

        {/* ======================================================== */}
        {/* 3. GUIRNALDA DE LAUREL Y OLIVO EN EL CONTORNO            */}
        {/* ======================================================== */}
        <g stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" opacity="0.9">
          {/* Lado izquierdo */}
          <path d="M62 68 C50 90 52 125 70 150" fill="none" />
          <circle cx="56" cy="85" r="3" fill="#22C55E" />
          <circle cx="54" cy="105" r="3" fill="#22C55E" />
          <circle cx="58" cy="125" r="3" fill="#22C55E" />
          <circle cx="68" cy="142" r="3" fill="#22C55E" />

          {/* Lado derecho */}
          <path d="M138 68 C150 90 148 125 130 150" fill="none" />
          <circle cx="144" cy="85" r="3" fill="#22C55E" />
          <circle cx="146" cy="105" r="3" fill="#22C55E" />
          <circle cx="142" cy="125" r="3" fill="#22C55E" />
          <circle cx="132" cy="142" r="3" fill="#22C55E" />
        </g>

        {/* ======================================================== */}
        {/* 4. ÓVALO HERÁLDICO CENTRAL CON BORDURA AZUL Y ESTRELLAS  */}
        {/* ======================================================== */}
        {/* Marco exterior dorado */}
        <ellipse cx="100" cy="108" rx="46" ry="56" fill="url(#goldGrad)" stroke="#A16207" strokeWidth="1.5" />
        {/* Faja azul marino con las 10 estrellas y "BOLIVIA" */}
        <ellipse cx="100" cy="108" rx="43" ry="53" fill="#1E3A8A" />

        {/* Texto BOLIVIA en la parte superior del óvalo */}
        <text
          x="100"
          y="68"
          textAnchor="middle"
          fill="#FEF08A"
          fontSize="9.5"
          fontWeight="900"
          fontFamily="serif"
          letterSpacing="2.5"
          filter="drop-shadow(0 1px 1px rgba(0,0,0,0.8))"
        >
          BOLIVIA
        </text>

        {/* 10 Estrellas Doradas en la parte inferior */}
        <g fill="#FACC15" stroke="#CA8A04" strokeWidth="0.5">
          {/* Distribución semicircular inferior */}
          <polygon points="76,145 77.5,147 80,147 78,148.5 79,151 76,149.5 73,151 74,148.5 72,147 74.5,147" />
          <polygon points="81,149 82.5,151 85,151 83,152.5 84,155 81,153.5 78,155 79,152.5 77,151 79.5,151" />
          <polygon points="87,153 88.5,155 91,155 89,156.5 90,159 87,157.5 84,159 85,156.5 83,155 85.5,155" />
          <polygon points="94,155 95.5,157 98,157 96,158.5 97,161 94,159.5 91,161 92,158.5 90,157 92.5,157" />
          <polygon points="101,156 102.5,158 105,158 103,159.5 104,162 101,160.5 98,162 99,159.5 97,158 99.5,158" />
          <polygon points="108,155 109.5,157 112,157 110,158.5 111,161 108,159.5 105,161 106,158.5 104,157 106.5,157" />
          <polygon points="115,153 116.5,155 119,155 117,156.5 118,159 115,157.5 112,159 113,156.5 111,155 113.5,155" />
          <polygon points="121,149 122.5,151 125,151 123,152.5 124,155 121,153.5 118,155 119,152.5 117,151 119.5,151" />
          <polygon points="126,145 127.5,147 130,147 128,148.5 129,151 126,149.5 123,151 124,148.5 122,147 124.5,147" />
          <polygon points="100,148 101.5,150 104,150 102,151.5 103,154 100,152.5 97,154 98,151.5 96,150 98.5,150" />
        </g>

        {/* ======================================================== */}
        {/* 5. PAISAJE INTERIOR DEL ÓVALO (CERRO RICO, SOL, LLAMA)    */}
        {/* ======================================================== */}
        <g clipPath="url(#ovalClip)">
          {/* Cielo y resplandor */}
          <ellipse cx="100" cy="108" rx="35" ry="44" fill="url(#skyGrad)" />

          {/* Sol Naciente Radiante */}
          <circle cx="100" cy="85" r="9" fill="#FDE047" stroke="#F59E0B" strokeWidth="1.5" />
          {/* Rayos del sol */}
          <g stroke="#F59E0B" strokeWidth="1.2">
            <line x1="100" y1="72" x2="100" y2="75" />
            <line x1="100" y1="95" x2="100" y2="98" />
            <line x1="87" y1="85" x2="90" y2="85" />
            <line x1="110" y1="85" x2="113" y2="85" />
            <line x1="91" y1="76" x2="93" y2="78" />
            <line x1="107" y1="92" x2="109" y2="94" />
            <line x1="91" y1="94" x2="93" y2="92" />
            <line x1="107" y1="78" x2="109" y2="76" />
          </g>

          {/* El Majestuoso Cerro Rico de Potosí */}
          {/* Cerro mayor */}
          <polygon points="100,78 68,124 128,124" fill="url(#cerroGrad)" />
          {/* Cara iluminada del cerro */}
          <polygon points="100,78 100,124 128,124" fill="#D97706" opacity="0.6" />
          {/* Cerro menor */}
          <polygon points="118,92 102,124 135,124" fill="#92400E" />

          {/* Capilla del Sagrado Corazón / Casa de Moneda */}
          <rect x="74" y="118" width="10" height="6" fill="#F8FAFC" stroke="#475569" strokeWidth="0.8" />
          <polygon points="79,114 73,118 85,118" fill="#DC2626" />

          {/* Pradera verde esmeralda */}
          <ellipse cx="100" cy="138" rx="40" ry="18" fill="#15803D" />
          <ellipse cx="100" cy="144" rx="38" ry="14" fill="#16A34A" />

          {/* Haz de Trigo dorado (lado izquierdo) */}
          <g stroke="#EAB308" strokeWidth="1.2" strokeLinecap="round">
            <line x1="78" y1="138" x2="82" y2="128" />
            <line x1="80" y1="138" x2="85" y2="129" />
            <line x1="82" y1="138" x2="88" y2="131" />
            <ellipse cx="82" cy="127" rx="1.5" ry="3" fill="#FDE047" />
            <ellipse cx="85" cy="128" rx="1.5" ry="3" fill="#FDE047" />
          </g>

          {/* Palmera Janchi Coco (lado derecho) */}
          <g stroke="#14532D" strokeWidth="1.5" strokeLinecap="round">
            <path d="M122 138 Q120 128 122 120" stroke="#78350F" strokeWidth="2" fill="none" />
            {/* Hojas */}
            <path d="M122 120 Q116 116 112 118" fill="none" stroke="#22C55E" strokeWidth="1.5" />
            <path d="M122 120 Q124 114 128 116" fill="none" stroke="#22C55E" strokeWidth="1.5" />
            <path d="M122 120 Q120 112 122 110" fill="none" stroke="#22C55E" strokeWidth="1.5" />
          </g>

          {/* La Llama andina erguida en el centro */}
          <g transform="translate(93, 122)" fill="#FEF08A" stroke="#713F12" strokeWidth="0.8">
            {/* Cuerpo */}
            <ellipse cx="7" cy="11" rx="6" ry="4" fill="#FFFFFF" />
            {/* Cuello y cabeza erguida */}
            <path d="M9 10 L11 3 L13 2 L13 5 L11 11 Z" fill="#FFFFFF" />
            {/* Orejas */}
            <line x1="12" y1="2" x2="13" y2="0.5" stroke="#713F12" strokeWidth="0.8" />
            {/* Patas */}
            <line x1="3" y1="13" x2="3" y2="19" stroke="#713F12" strokeWidth="1" />
            <line x1="6" y1="13" x2="6" y2="19" stroke="#713F12" strokeWidth="1" />
            <line x1="9" y1="13" x2="9" y2="19" stroke="#713F12" strokeWidth="1" />
            <line x1="11" y1="13" x2="11" y2="19" stroke="#713F12" strokeWidth="1" />
          </g>
        </g>

        {/* Clip para mantener el paisaje dentro del óvalo */}
        <clipPath id="ovalClip">
          <ellipse cx="100" cy="108" rx="35" ry="44" />
        </clipPath>

        {/* Anillo interior fino dorado */}
        <ellipse cx="100" cy="108" rx="35" ry="44" fill="none" stroke="#FDE047" strokeWidth="1.5" />

        {/* ======================================================== */}
        {/* 6. CÓNDOR DE LOS ANDES EN LA CIMA (ALAS DESPLEGADAS)     */}
        {/* ======================================================== */}
        <g filter="url(#softGlow)" transform="translate(0, 2)">
          {/* Corona de laurel debajo del cóndor */}
          <path d="M82 46 Q100 50 118 46" fill="none" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />

          {/* Alas desplegadas */}
          {/* Ala izquierda */}
          <path
            d="M98 32 C86 20 70 12 52 14 C62 25 74 36 86 42 C72 38 60 42 56 46 C68 50 82 48 94 44 Z"
            fill="url(#condorBody)"
            stroke="#475569"
            strokeWidth="0.8"
          />
          {/* Ala derecha */}
          <path
            d="M102 32 C114 20 130 12 148 14 C138 25 126 36 114 42 C128 38 140 42 144 46 C132 50 118 48 106 44 Z"
            fill="url(#condorBody)"
            stroke="#475569"
            strokeWidth="0.8"
          />

          {/* Cuerpo y cola */}
          <ellipse cx="100" cy="38" rx="6" ry="9" fill="url(#condorBody)" stroke="#334155" strokeWidth="0.8" />
          {/* Gorguera blanca en el cuello */}
          <ellipse cx="100" cy="30" rx="4" ry="2.5" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="0.5" />
          {/* Cabeza de perfil mirando a la derecha */}
          <ellipse cx="102" cy="27" rx="3.5" ry="3" fill="#1E293B" />
          {/* Cresta carnosa */}
          <path d="M101 24 Q103 22 105 25" stroke="#DC2626" strokeWidth="1.2" fill="none" />
          {/* Pico ganchudo dorado */}
          <path d="M105 26 L109 28 L105 29 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="0.6" />
          {/* Ojo */}
          <circle cx="103" cy="26.5" r="0.8" fill="#FACC15" />
        </g>
      </svg>

      {showText && (
        <div className="text-center mt-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 block">
            Estado Plurinacional de Bolivia
          </span>
          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">
            Escudo Nacional Oficial
          </span>
        </div>
      )}
    </div>
  );
};
