import React, { useState } from 'react';
import {
  ShieldAlert,
  Play,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  Search,
  MessageSquare,
  ShieldCheck,
  RefreshCw,
  X
} from 'lucide-react';
import { formatBOB } from '@xentra/shared';
import { TiltCard3D } from '../components/TiltCard3D';
import { useTenantStore } from '../stores/tenantStore';

interface AlertMock {
  id: string;
  ruleCode: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  suggestedAction: string;
  isResolved: boolean;
  resolution?: string;
}

const INITIAL_ALERTS: AlertMock[] = [
  {
    id: 'alt-1',
    ruleCode: 'R03_ORPHAN_EXPENSE',
    severity: 'warning',
    title: 'Egreso ejecutado sin factura o comprobante adjunto',
    description: 'El gasto por Bs. 850,00 registrado como "Compra de Arena y Grava" no cuenta con comprobante digital respaldatorio.',
    suggestedAction: 'El tesorero debe solicitar al proveedor la nota de entrega firmada o recibo oficial con C.I.',
    isResolved: false
  },
  {
    id: 'alt-2',
    ruleCode: 'R02_DUPLICATE_PAYMENT',
    severity: 'warning',
    title: 'Posible cobro duplicado detectado',
    description: 'Se registraron dos pagos idénticos de Bs. 25,00 para la misma vivienda con 4 horas de diferencia.',
    suggestedAction: 'Verificar si corresponde a dos meses distintos o a un error involuntario de digitación en caja.',
    isResolved: false
  }
];

export const AuditorPage: React.FC = () => {
  const { currentOtb } = useTenantStore();
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [isScanning, setIsScanning] = useState(false);
  const [showAiReport, setShowAiReport] = useState(false);
  const [resolvingAlertId, setResolvingAlertId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  const handleRunAudit = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 800);
  };

  const handleResolveAlert = (id: string) => {
    setAlerts(
      alerts.map((a) =>
        a.id === id ? { ...a, isResolved: true, resolution: resolutionText || 'Verificado por fiscalización.' } : a
      )
    );
    setResolvingAlertId(null);
    setResolutionText('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-white">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Revisión y Control de Cuentas
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-500/20 text-purple-400 border border-purple-500/30">
              Apoyo al Comité de Vigilancia
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <p className="text-xs sm:text-sm text-slate-400">
              Revisión automática de gastos, ingresos y comprobantes para evitar descuadres de caja antes de la asamblea.
            </p>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300">
              <span>Comunidad:</span>
              <strong className="text-white">{currentOtb?.name || 'OTB Villa Graciela'}</strong>
              <span className="font-mono text-[10px] text-purple-400">({currentOtb?.code || 'OTB-CBBA-024'})</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunAudit}
            disabled={isScanning}
            className="h-12 px-5 rounded-2xl text-xs sm:text-sm font-black text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2.5 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Revisando...' : 'Revisar Cuentas'}</span>
          </button>
          <button
            onClick={() => setShowAiReport(true)}
            className="h-12 px-5 rounded-2xl text-xs sm:text-sm font-black text-purple-300 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 transition-all flex items-center gap-2.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Informe para Asamblea</span>
          </button>
        </div>
      </div>

      {/* Resumen de Hallazgos en TiltCard3D */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TiltCard3D>
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 shadow-2xl space-y-1">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              Reglas Evaluadas
            </span>
            <p className="text-3xl font-black text-white font-mono">14 reglas</p>
            <span className="text-xs text-emerald-400 font-bold block pt-1">
              ✓ 100% de cobertura contable OTB
            </span>
          </div>
        </TiltCard3D>

        <TiltCard3D>
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0B132B]/90 border-2 border-amber-500/40 shadow-2xl space-y-1">
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider block">
              Alertas Activas
            </span>
            <p className="text-3xl font-black text-amber-400 font-mono">
              {alerts.filter((a) => !a.isResolved).length}
            </p>
            <span className="text-xs text-slate-400 font-bold block pt-1">
              Sin alertas críticas de sobregiro
            </span>
          </div>
        </TiltCard3D>

        <TiltCard3D>
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0B132B]/90 border-2 border-emerald-500/40 shadow-2xl space-y-1">
            <span className="text-xs font-black text-emerald-400 uppercase tracking-wider block">
              Alertas Subsanadas
            </span>
            <p className="text-3xl font-black text-emerald-400 font-mono">
              {alerts.filter((a) => a.isResolved).length}
            </p>
            <span className="text-xs text-emerald-300 font-bold block pt-1">
              Descargos registrados formalmente
            </span>
          </div>
        </TiltCard3D>
      </div>

      {/* Lista de Alertas en Dark Mode */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <span>Inconsistencias Detectadas por el Motor</span>
        </h2>

        {alerts.map((alert) => (
          <TiltCard3D key={alert.id}>
            <div
              className={`p-6 rounded-3xl border-2 transition-all ${alert.isResolved
                  ? 'bg-[#0B132B]/60 border-slate-800 opacity-80'
                  : 'bg-[#0B132B]/90 border-amber-500/50 shadow-2xl'
                }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 ${alert.isResolved
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}
                  >
                    {alert.isResolved ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <AlertTriangle className="w-6 h-6" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold border border-slate-700">
                        {alert.ruleCode}
                      </span>
                      {alert.isResolved && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Subsanado
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-black text-white">{alert.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {alert.description}
                    </p>

                    <div className="p-3 rounded-xl bg-[#030712]/90 border border-slate-800 mt-2">
                      <span className="text-[10px] font-black uppercase text-amber-400 block">
                        Acción Recomendada:
                      </span>
                      <p className="text-xs text-slate-300 mt-0.5">{alert.suggestedAction}</p>
                    </div>

                    {alert.isResolved && alert.resolution && (
                      <p className="text-xs text-emerald-400 font-bold mt-2">
                        ✓ Descargo: {alert.resolution}
                      </p>
                    )}
                  </div>
                </div>

                {!alert.isResolved && (
                  <div className="flex-shrink-0 pt-2 sm:pt-0">
                    {resolvingAlertId === alert.id ? (
                      <div className="space-y-2 w-full sm:w-64">
                        <textarea
                          value={resolutionText}
                          onChange={(e) => setResolutionText(e.target.value)}
                          placeholder="Nota o comprobante de descargo..."
                          rows={2}
                          className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleResolveAlert(alert.id)}
                            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                          >
                            Confirmar Descargo
                          </button>
                          <button
                            onClick={() => setResolvingAlertId(null)}
                            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setResolvingAlertId(alert.id)}
                        className="h-11 px-5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-black transition-all cursor-pointer"
                      >
                        Subsanar Alerta
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </TiltCard3D>
        ))}
      </div>

      {/* Modal Informe para Asamblea General */}
      {showAiReport && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-[#0B132B] border-2 border-slate-700 shadow-2xl overflow-hidden text-white">
            <div className="p-6 border-b border-slate-800 bg-[#030712]/90 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <div>
                  <h2 className="text-lg font-black text-white">
                    Informe Técnico para Asamblea — {currentOtb?.name || 'OTB Villa Esperanza'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Jurisdicción: {currentOtb?.zone || 'Distrito 4'}, {currentOtb?.municipality || 'Cochabamba'} • Código: {currentOtb?.code || 'OTB-CBBA-001'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAiReport(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm text-slate-300 max-h-[70vh] overflow-y-auto">
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30">
                <h3 className="font-black text-purple-300 text-sm mb-1">
                  Dictamen General: "Gestión Transparente con Salvedades Menores"
                </h3>
                <p className="text-slate-300 leading-relaxed text-xs">
                  Se verificó la conciliación del 100% de los ingresos por cuotas ordinarias y aportes extraordinarios
                  del mes de Noviembre de 2026. Los fondos destinados al "Proyecto Tinglado Cancha Polifuncional"
                  se encuentran resguardados y ejecutados conforme a las decisiones tomadas en asamblea general.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                  Recomendaciones para la Mesa Directiva:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-400 text-xs">
                  <li>Regularizar la factura pendiente por Bs. 850,00 de compra de agregados para cerrar el descargo.</li>
                  <li>Reconocer a los 42 socios cumplidos que cuentan con certificación QR inmutable en sus recibos.</li>
                  <li>Habilitar la opción de pago por QR Simple en el portal para facilitar el aporte de socios mayores.</li>
                </ul>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-slate-800 bg-[#030712]/90 flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="h-12 px-6 rounded-2xl text-xs font-black text-slate-300 bg-slate-800 hover:text-white transition-all"
              >
                Imprimir Dictamen
              </button>
              <button
                onClick={() => setShowAiReport(false)}
                className="h-12 px-6 rounded-2xl text-xs font-black text-white bg-purple-600 hover:bg-purple-500 shadow-xl shadow-purple-600/30 transition-all"
              >
                Cerrar Informe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
