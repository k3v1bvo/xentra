import React, { useState } from 'react';
import {
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  FileText,
  X,
  Share2,
  CheckCircle2,
  Users,
  Download,
  Building,
  Check
} from 'lucide-react';
import { formatBOB } from '@xentra/shared';

interface CommunityTransparencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  otbName?: string;
  otbCode?: string;
}

export const CommunityTransparencyModal: React.FC<CommunityTransparencyModalProps> = ({
  isOpen,
  onClose,
  otbName = 'OTB Villa Esperanza',
  otbCode = 'OTB-CBBA-001'
}) => {
  const [activeTab, setActiveTab] = useState<'asamblea' | 'gastos' | 'resumen'>('asamblea');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const EGRESOS_AUDITADOS = [
    {
      id: 'eg-01',
      date: '18 Nov 2026',
      concept: 'Pintura de alto tráfico y demarcación para cancha polifuncional',
      category: 'Obras & Deporte',
      amount: 1200.00,
      invoiceRef: 'Factura #4820 - Pinturas Coral',
      traceHash: '8f4a1c...2e9d',
      approvedBy: 'Asamblea Ordinaria Octubre'
    },
    {
      id: 'eg-02',
      date: '14 Nov 2026',
      concept: 'Adquisición de 6 reflectores LED para postes de esquinas oscuras (Mz B y C)',
      category: 'Alumbrado Público',
      amount: 900.00,
      invoiceRef: 'Factura #1039 - Ferretería El Foco',
      traceHash: '3a7b9c...4f1e',
      approvedBy: 'Comité de Seguridad y Directiva'
    },
    {
      id: 'eg-03',
      date: '08 Nov 2026',
      concept: 'Alquiler de volqueta para retiro de escombros en curva comunal',
      category: 'Limpieza Barrial',
      amount: 900.00,
      invoiceRef: 'Recibo Oficial #112',
      traceHash: '1c5e7d...9a2f',
      approvedBy: 'Resolución de Emergencia Directiva'
    },
    {
      id: 'eg-04',
      date: '04 Nov 2026',
      concept: 'Botiquín de primeros auxilios y 50 silbatos para la Ronda Vecinal',
      category: 'Seguridad Ciudadana',
      amount: 450.00,
      invoiceRef: 'Factura #9021 - Farmacia San Elías',
      traceHash: '5e8b2a...7c3d',
      approvedBy: 'Mesa Directiva'
    },
    {
      id: 'eg-05',
      date: '01 Nov 2026',
      concept: 'Reparación urgente de tubería matriz de agua frente a la sede',
      category: 'Servicios Básicos',
      amount: 350.00,
      invoiceRef: 'Recibo Fontanero Don Celso #44',
      traceHash: '7d2a4e...1b9c',
      approvedBy: 'Fondo Menor de Emergencias'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0B132B] border-2 border-slate-600 text-white w-full max-w-3xl rounded-3xl p-5 sm:p-8 shadow-2xl relative max-h-[92vh] flex flex-col my-auto">
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 sm:right-6 sm:top-6 p-2 text-slate-300 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado */}
        <div className="mb-4 pr-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/40 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Transparencia Radical & Gobierno Abierto OTB</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Transparencia Financiera & Convocatoria de Asambleas
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Comunidad: <strong className="text-emerald-400">{otbName}</strong> • Código: <strong className="font-mono text-blue-300">{otbCode}</strong>
          </p>
        </div>

        {/* Pestañas de Navegación */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[#020617] border-2 border-slate-700 mb-5">
          <button
            type="button"
            onClick={() => setActiveTab('asamblea')}
            className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'asamblea'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Calendar className="w-4 h-4 text-blue-300" />
            <span>Próxima Asamblea</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gastos')}
            className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'gastos'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-300" />
            <span>¿En qué se gastó? ({EGRESOS_AUDITADOS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('resumen')}
            className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'resumen'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <PiggyBank className="w-4 h-4 text-purple-300" />
            <span>Caja Comunal</span>
          </button>
        </div>

        {/* TAB 1: CONVOCATORIA OFICIAL A ASAMBLEA */}
        {activeTab === 'asamblea' && (
          <div className="space-y-4 overflow-y-auto pr-1 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/60 to-indigo-950/80 border-2 border-blue-500/60 space-y-3 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-400/30 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-blue-600 text-white font-bold">
                    <Calendar className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-300 block">
                      Convocatoria Oficial
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      Asamblea General Ordinaria del Mes de Noviembre
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 self-start sm:self-auto">
                  Quórum Obligatorio
                </span>
              </div>

              {/* Ficha de Día, Hora y Lugar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-[#030712] border border-slate-700 flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Fecha:</span>
                    <strong className="text-white text-xs sm:text-sm">Domingo 29 Nov 2026</strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#030712] border border-slate-700 flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Hora de Inicio:</span>
                    <strong className="text-white text-xs sm:text-sm">09:00 AM (Tol. 15 min)</strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#030712] border border-slate-700 flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Ubicación Física:</span>
                    <strong className="text-white text-xs sm:text-sm">Sede Social Comunal</strong>
                  </div>
                </div>
              </div>

              {/* Orden del Día */}
              <div className="p-4 rounded-xl bg-[#020617] border border-slate-700 space-y-2">
                <h4 className="font-extrabold text-white text-xs uppercase tracking-wide flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>Orden del Día Aprobado por la Directiva:</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-200 pl-1 leading-relaxed">
                  <li><strong>Control de Asistencia Digital:</strong> Registro de socios mediante código y quórum con Xentra Vota.</li>
                  <li><strong>Informe Económico de Tesorería:</strong> Rendición de cuentas de ingresos recaudados y egresos con facturas.</li>
                  <li><strong>Avance del Proyecto Tinglado Cancha Polifuncional:</strong> Informe de la empresa contratista y segunda cuota pro-tinglado.</li>
                  <li><strong>Seguridad Barrial & Rondas Vecinales:</strong> Evaluación de los reportes vecinales y coordinación con Radiopatrullas 110.</li>
                  <li><strong>Asuntos Varios:</strong> Aportes de vecinos y propuestas de mejora.</li>
                </ol>
              </div>

              {/* Convocante y Botón Compartir */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
                <p className="text-slate-300">
                  Convoca: <strong className="text-white">Don Roberto Gómez Montaño (Presidente OTB)</strong> y la Mesa Directiva.
                </p>
                <button
                  type="button"
                  onClick={handleShare}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all self-start sm:self-auto"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? '¡Enlace Copiado!' : 'Compartir Convocatoria'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EN QUÉ SE GASTÓ EL DINERO (DESGLOSE DE EGRESOS) */}
        {activeTab === 'gastos' && (
          <div className="space-y-3 overflow-y-auto pr-1 text-xs">
            <div className="flex items-center justify-between pb-1 text-slate-400">
              <span>Gastos ejecutados con facturas y respaldo contable:</span>
              <span className="font-bold text-white font-mono">Total: {formatBOB(3800.00)}</span>
            </div>

            <div className="space-y-2.5">
              {EGRESOS_AUDITADOS.map((eg) => (
                <div
                  key={eg.id}
                  className="p-3.5 rounded-2xl bg-[#030712] border-2 border-slate-700 hover:border-emerald-500/50 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400">{eg.date}</span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {eg.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-xs sm:text-sm mt-1">
                        {eg.concept}
                      </h4>
                    </div>
                    <span className="text-sm sm:text-base font-black font-mono text-rose-400 flex-shrink-0">
                      - {formatBOB(eg.amount)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                    <span>Respaldo: <strong className="text-slate-200">{eg.invoiceRef}</strong></span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Comprobante Oficial: <code className="text-emerald-300 font-mono">{eg.traceHash}</code></span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: RESUMEN DE CAJA Y FONDOS COMUNALES */}
        {activeTab === 'resumen' && (
          <div className="space-y-4 overflow-y-auto pr-1 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-[#030712] border-2 border-blue-500/50 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">Saldo Disponible en Caja</span>
                <p className="text-xl sm:text-2xl font-black font-mono text-white mt-1">
                  {formatBOB(4250.00)}
                </p>
                <p className="text-[11px] text-slate-400">Arqueado y conciliado con el banco</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#030712] border-2 border-emerald-500/50 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Ingresos del Mes</span>
                <p className="text-xl sm:text-2xl font-black font-mono text-emerald-400 mt-1">
                  +{formatBOB(7150.00)}
                </p>
                <p className="text-[11px] text-slate-400">48 pagos de vecinos registrados</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#030712] border-2 border-rose-500/50 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300">Egresos Ejecutados</span>
                <p className="text-xl sm:text-2xl font-black font-mono text-rose-400 mt-1">
                  -{formatBOB(3800.00)}
                </p>
                <p className="text-[11px] text-slate-400">100% con facturas y recibos</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#020617] border border-slate-700 text-xs text-slate-200 space-y-2">
              <strong className="text-white block font-bold text-sm">Garantía de Auditoría Comunitaria Ley 1551:</strong>
              <p className="leading-relaxed">
                Cada centavo que ingresa por QR o caja física se deposita en la cuenta comunal de la OTB y queda registrado de forma transparente con su recibo correspondiente. Los libros de caja y comprobantes están a disposición de cualquier vecino en asamblea general.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
