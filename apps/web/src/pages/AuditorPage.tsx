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
  RefreshCw
} from 'lucide-react';
import { formatBOB } from '@xentra/shared';

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
    suggestedAction: 'El tesorero debe solicitar al proveedor la nota de entrega firmada o recibo oficial.',
    isResolved: false
  },
  {
    id: 'alt-2',
    ruleCode: 'R02_DUPLICATE_PAYMENT',
    severity: 'warning',
    title: 'Posible cobro duplicado detectado',
    description: 'Se registraron dos pagos idénticos de Bs. 25,00 para la misma vivienda con 4 horas de diferencia.',
    suggestedAction: 'Verificar si corresponde a dos meses distintos o a un error de digitación.',
    isResolved: false
  }
];

export const AuditorPage: React.FC = () => {
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              XENTRA AI Auditor
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700">
              Reglas Deterministas + IA
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Detección preventiva de inconsistencias contables, sobregiros y apoyo al comité fiscalizador.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRunAudit}
            disabled={isScanning}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Auditando...' : 'Ejecutar Auditoría'}
          </button>
          <button
            onClick={() => setShowAiReport(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            Generar Informe Asamblea
          </button>
        </div>
      </div>

      {/* Resumen de Hallazgos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-fintech">
          <span className="text-xs font-medium text-slate-500">Reglas Deterministas Evaluadas</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">14 reglas</p>
          <span className="text-[11px] text-emerald-600 font-medium">100% de cobertura contable</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-fintech">
          <span className="text-xs font-medium text-slate-500">Alertas Activas</span>
          <p className="text-2xl font-extrabold text-amber-600 mt-1 font-mono">
            {alerts.filter((a) => !a.isResolved).length}
          </p>
          <span className="text-[11px] text-slate-400">Sin alertas críticas de sobregiro</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-fintech">
          <span className="text-xs font-medium text-slate-500">Alertas Subsanadas</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1 font-mono">
            {alerts.filter((a) => a.isResolved).length}
          </p>
          <span className="text-[11px] text-emerald-700 font-medium">Descargos registrados</span>
        </div>
      </div>

      {/* Lista de Alertas */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900">Inconsistencias Detectadas por el Motor</h2>
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-5 rounded-2xl border transition-all ${
              alert.isResolved
                ? 'bg-slate-50/70 border-slate-200/80 opacity-75'
                : 'bg-white border-amber-200/90 shadow-fintech'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    alert.isResolved
                      ? 'bg-emerald-100 text-emerald-700'
                      : alert.severity === 'critical'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {alert.isResolved ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {alert.ruleCode}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900">{alert.title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{alert.description}</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    <strong className="text-slate-700">Recomendación preventiva:</strong> {alert.suggestedAction}
                  </p>

                  {alert.isResolved && (
                    <div className="mt-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800">
                      <strong>Resolución registrada:</strong> {alert.resolution}
                    </div>
                  )}
                </div>
              </div>

              {!alert.isResolved && (
                <button
                  onClick={() => setResolvingAlertId(alert.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors flex-shrink-0"
                >
                  Registrar Descargo
                </button>
              )}
            </div>

            {/* Modal de Descargo Inline */}
            {resolvingAlertId === alert.id && (
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  placeholder="Detalle el descargo o comprobante regularizado..."
                  className="flex-1 text-xs px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleResolveAlert(alert.id)}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                  >
                    Confirmar Subsanación
                  </button>
                  <button
                    onClick={() => setResolvingAlertId(null)}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Informe Narrativo IA */}
      {showAiReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-sm text-slate-900">Informe de Auditoría para la Asamblea General</h3>
              </div>
              <button
                onClick={() => setShowAiReport(false)}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
              >
                Cerrar
              </button>
            </div>

            <div className="p-6 overflow-y-auto text-xs text-slate-700 space-y-4 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 font-medium">
                Este informe ha sido redactado de forma objetiva por XENTRA AI AUDITOR a partir de los datos contables verificados del mes de Noviembre de 2026.
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">1. Diagnóstico de Salud Financiera</h4>
                <p>
                  La OTB Villa Esperanza presenta un índice de recaudación del 84.1% sobre las cuotas emitidas en el periodo. Los fondos de la comunidad se encuentran depositados bajo custodia física en Caja Central y conciliados con el arqueo diario al 100%.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">2. Ejecución del Proyecto "Tinglado Comunitario"</h4>
                <p>
                  El proyecto cuenta con un presupuesto aprobado de Bs. 15,000.00, de los cuales se han ejecutado Bs. 6,200.00 (41.3%). Todos los materiales adquiridos cuentan con factura comercial verificada a nombre de la institución.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">3. Recomendaciones para el Fiscalizador</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>Regularizar la boleta física pendiente del flete de áridos (Bs. 850.00).</li>
                  <li>Notificar a las 6 familias con cuotas extraordinarias pendientes antes del cierre de gestión.</li>
                  <li>Publicar la rendición de cuentas en la vitrina comunal antes del 30 de Noviembre.</li>
                </ul>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
              <button
                onClick={() => setShowAiReport(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
