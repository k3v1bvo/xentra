import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  PhoneCall,
  Download,
  QrCode,
  MapPin,
  Clock,
  Phone,
  Building,
  ExternalLink,
  Vote,
  FileCheck,
  Building2,
  Users,
  Compass,
  ArrowRight,
  Github,
  Scale,
  Lock,
  Cpu,
  CheckCircle2
} from 'lucide-react';
import { BoliviaCoatOfArms } from './BoliviaCoatOfArms';
import { useTenantStore } from '../stores/tenantStore';

interface CommunityFooterProps {
  /**
   * 'public': Footer institucional para la portada pública (LandingPage).
   *           NO muestra datos privados ni dirigentes de ninguna OTB particular.
   * 'internal': Footer con datos específicos de la OTB activa para usuarios autenticados.
   */
  variant?: 'public' | 'internal';
  onOpenEmergency?: () => void;
  onOpenInstallApp?: () => void;
  onOpenTransparency?: () => void;
}

export const CommunityFooter: React.FC<CommunityFooterProps> = ({
  variant = 'internal',
  onOpenEmergency,
  onOpenInstallApp,
  onOpenTransparency
}) => {
  const navigate = useNavigate();
  const { currentOtb } = useTenantStore();
  const isPublic = variant === 'public';

  return (
    <footer className="relative z-10 border-t-2 border-slate-800 bg-[#020617] text-slate-300">
      
      {/* =================================================================== */}
      {/* 1. BANDA SUPERIOR DE INGENIERÍA, SEGURIDAD & LICENCIAS              */}
      {/* =================================================================== */}
      <div className="bg-[#0B132B] border-b border-slate-800/80 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs">
          
          {/* Identidad Institucional Nacional */}
          <div className="flex items-center gap-3">
            <BoliviaCoatOfArms size={32} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white uppercase tracking-wider text-sm">
                  {isPublic ? 'Plataforma Nacional Comunal' : `OTB ${currentOtb?.name || 'Registrada'}`}
                </span>
                <span className="px-2 py-0.5 rounded-md font-mono font-bold text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {isPublic ? 'BOLIVIA' : (currentOtb?.code || 'OTB-CBBA-001')}
                </span>
              </div>
              <p className="text-slate-400 text-xs">
                {isPublic
                  ? 'Sistema Integral de Gobernanza Barrial y Control Social Comunitario'
                  : `${currentOtb?.zone || 'Zona Urbana'}, ${currentOtb?.municipality || 'Municipio'} — ${currentOtb?.department || 'Bolivia'}`}
              </p>
            </div>
          </div>

          {/* Badges de Arquitectura & Seguridad */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-emerald-400 font-bold">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cifrado SHA-256 Inmutable</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-blue-400 font-bold">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>Local-First SQLite</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-purple-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Multi-Tenant Zero-PII</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-amber-400 font-bold">
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>Licencia Libre MIT</span>
            </span>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. CUERPO PRINCIPAL: 4 COLUMNAS ESTRUCTURADAS                       */}
      {/* =================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* Columna 1: Identidad & Marco Jurídico */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-base shadow-md">
                X
              </div>
              <div>
                <span className="font-black text-white text-base tracking-tight block">XENTRA OTB</span>
                <span className="text-xs text-blue-400 font-bold block">Plataforma Comunal Bolivia</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Software libre y soberano diseñado para la gestión transparente de cuotas comunales, auditoría criptográfica con código QR y participación democrática vecinal en Bolivia.
            </p>

            <div className="p-3.5 rounded-2xl bg-[#0B132B] border border-slate-800 space-y-1.5 text-xs text-slate-300">
              <p className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Marco Legal Vigente:</span>
              </p>
              <ul className="space-y-1 pl-4 list-disc text-slate-400 text-[11px] leading-relaxed">
                <li><strong>Ley N° 1551:</strong> Participación Popular.</li>
                <li><strong>Ley N° 3488:</strong> Personería Jurídica Comunal.</li>
                <li><strong>Ley N° 031:</strong> Autonomías y Descentralización.</li>
                <li><strong>CPE Art. 241:</strong> Control Social Comunitario.</li>
                <li><strong>Ley N° 164:</strong> Firma y Documentos Digitales.</li>
              </ul>
            </div>
          </div>

          {/* Columna 2: Centrales de Auxilio & Emergencias 24/7 (Bolivia) */}
          <div className="space-y-3.5">
            <h3 className="font-black text-white text-sm sm:text-base flex items-center gap-2 uppercase tracking-wider">
              <PhoneCall className="w-4 h-4 text-rose-400" />
              <span>Emergencias Bolivia 24/7</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Líneas gratuitas de atención inmediata para auxilios policiales, de bomberos y servicios en el barrio:
            </p>

            <div className="space-y-2">
              <a
                href="tel:110"
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#0F172A] hover:bg-rose-950/40 border border-rose-500/30 hover:border-rose-500/60 transition-all text-xs group"
              >
                <div className="flex items-center gap-2">
                  <span className="font-black text-rose-400 font-mono text-sm">110</span>
                  <span className="font-bold text-white">Radio Patrulla (Policía)</span>
                </div>
                <span className="text-[11px] text-rose-300 font-mono group-hover:underline">Llamar →</span>
              </a>

              <a
                href="tel:119"
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#0F172A] hover:bg-amber-950/40 border border-amber-500/30 hover:border-amber-500/60 transition-all text-xs group"
              >
                <div className="flex items-center gap-2">
                  <span className="font-black text-amber-400 font-mono text-sm">119</span>
                  <span className="font-bold text-white">Cuerpo de Bomberos</span>
                </div>
                <span className="text-[11px] text-amber-300 font-mono group-hover:underline">Llamar →</span>
              </a>

              <a
                href="tel:168"
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#0F172A] hover:bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500/60 transition-all text-xs group"
              >
                <div className="flex items-center gap-2">
                  <span className="font-black text-emerald-400 font-mono text-sm">168</span>
                  <span className="font-bold text-white">SAMU Ambulancias Médicas</span>
                </div>
                <span className="text-[11px] text-emerald-300 font-mono group-hover:underline">Llamar →</span>
              </a>

              <a
                href="tel:156"
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#0F172A] hover:bg-purple-950/40 border border-purple-500/30 hover:border-purple-500/60 transition-all text-xs group"
              >
                <div className="flex items-center gap-2">
                  <span className="font-black text-purple-400 font-mono text-sm">156</span>
                  <span className="font-bold text-white">Defensoría Niñez y Mujer</span>
                </div>
                <span className="text-[11px] text-purple-300 font-mono group-hover:underline">Llamar →</span>
              </a>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <p>💧 <strong>Agua (SEMAPA / EPSAS / SAGUAPAC):</strong> 800-10-8888</p>
                <p>⚡ <strong>Luz Eléctrica (ELFEC / DELAPAZ / CRE):</strong> 800-10-3333</p>
              </div>
            </div>
          </div>

          {/* Columna 3: Servicios para el Ciudadano & Recursos Abiertos */}
          <div className="space-y-3.5">
            <h3 className="font-black text-white text-sm sm:text-base flex items-center gap-2 uppercase tracking-wider">
              <FileCheck className="w-4 h-4 text-blue-400" />
              <span>Servicios & Recursos</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Accede a las herramientas oficiales de comprobación y al código fuente abierto:
            </p>

            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => {
                    if (onOpenInstallApp) onOpenInstallApp();
                    else navigate('/#descarga-app');
                  }}
                  className="w-full text-left flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold transition-colors cursor-pointer group"
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Descargar APK Móvil Oficial</span>
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono font-bold">v3.0.0</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => navigate('/verificar-recibo')}
                  className="w-full text-left flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold transition-colors cursor-pointer group"
                >
                  <span className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-blue-400" />
                    <span>Verificar Recibo Oficial TRACE</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                </button>
              </li>

              <li>
                <a
                  href="https://github.com/k3v1bvo/xentra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-left flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold transition-colors cursor-pointer group"
                >
                  <span className="flex items-center gap-2">
                    <Github className="w-4 h-4 text-purple-400" />
                    <span>Repositorio Abierto en GitHub</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                </a>
              </li>

              <li>
                <a
                  href="https://github.com/k3v1bvo/xentra/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-left flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold transition-colors cursor-pointer group"
                >
                  <span className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-amber-400" />
                    <span>Licencia de Software MIT</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">Libre</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4: Gobernanza / Directiva Comunal */}
          {isPublic ? (
            /* Vista Pública: Invitación a Juntas Vecinales y Dirigentes de Bolivia */
            <div className="space-y-3.5">
              <h3 className="font-black text-white text-sm sm:text-base flex items-center gap-2 uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Gobernanza Digital Barrial</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                ¿Eres dirigente de una OTB en Bolivia? Moderniza la administración de tu comunidad sin costos de instalación:
              </p>

              <div className="p-4 rounded-2xl bg-[#0B132B] border border-slate-800 space-y-2.5 text-xs text-slate-300">
                <div className="space-y-1.5">
                  <p className="flex items-center gap-2 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Cobros por QR Simple (0% comisión).</span>
                  </p>
                  <p className="flex items-center gap-2 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>Recibos oficiales sellados con código QR.</span>
                  </p>
                  <p className="flex items-center gap-2 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span>Consultas y asambleas democráticas directas.</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                  >
                    <span>Ingresar al Panel de tu OTB</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Vista Interna: Datos específicos de la OTB una vez iniciada sesión */
            <div className="space-y-3.5">
              <h3 className="font-black text-white text-sm sm:text-base flex items-center gap-2 uppercase tracking-wider">
                <Building className="w-4 h-4 text-emerald-400" />
                <span>Mesa Directiva & Sede</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Atención presencial a socios y vecinos de {currentOtb?.name || 'la OTB'}:
              </p>

              <div className="p-4 rounded-2xl bg-[#0B132B] border border-slate-800 space-y-3 text-xs text-slate-300">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Presidente de la OTB</span>
                  <strong className="text-white text-sm block">{currentOtb?.president_name || 'Directiva Comunal'}</strong>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Tesorería Comunal</span>
                  <strong className="text-white text-sm block">{currentOtb?.treasurer_name || 'Comisión de Finanzas'}</strong>
                </div>

                <div className="pt-1 border-t border-slate-800 space-y-1 text-[11px]">
                  <p className="flex items-center gap-1.5 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span><strong>Horario Sede:</strong> Lun a Sáb 08:30 - 18:30</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span>{currentOtb?.address || 'Sede Social'}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. FRANJA INFERIOR: COPYRIGHT, REPOSITORIO & ESTADO DEL SISTEMA     */}
      {/* =================================================================== */}
      <div className="border-t border-slate-800/80 bg-[#01040D] px-4 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-left text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-200">© 2026 XENTRA OTB BOLIVIA</span>
            <span>•</span>
            <span>Software Libre bajo Licencia MIT</span>
            <span>•</span>
            <a
              href="https://github.com/k3v1bvo/xentra"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-mono underline"
            >
              github.com/k3v1bvo/xentra
            </a>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="inline-flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Red Comunal 100% Operativa</span>
            </span>
            <span>•</span>
            <span className="text-slate-500">Vercel Edge</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
