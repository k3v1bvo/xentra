import React, { useState } from 'react';
import {
  Users,
  Home,
  TrendingUp,
  AlertCircle,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  PlusCircle,
  FileSpreadsheet,
  PhoneCall,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Radio,
  Check,
  ShieldAlert
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { formatBOB } from '@xentra/shared';
import { useTenantStore } from '../stores/tenantStore';
import { useCommunityReportsStore } from '../stores/communityReportsStore';
import { CommunityAlertsAndEmergencyModal } from '../components/CommunityAlertsAndEmergencyModal';
import { useNavigate } from 'react-router-dom';

const MONTHLY_DATA = [
  { month: 'Jul', ingresos: 4200, egresos: 3100 },
  { month: 'Ago', ingresos: 5100, egresos: 4800 },
  { month: 'Sep', ingresos: 4800, egresos: 2900 },
  { month: 'Oct', ingresos: 6200, egresos: 5400 },
  { month: 'Nov', ingresos: 7150, egresos: 3800 }
];

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentOtb } = useTenantStore();
  const { getReportsByOtb, updateReportStatus } = useCommunityReportsStore();
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const otbId = currentOtb?.id || '11111111-1111-1111-1111-111111111111';
  const reports = getReportsByOtb(otbId);
  const activeReports = reports.filter((r) => r.status !== 'resuelto');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Encabezado y Acciones Rápidas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Panel de Control Financiero
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestión en tiempo real de {currentOtb?.name} • Cochabamba, Bolivia
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAlertModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 shadow-sm transition-all cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
            <span>Alertas Vecinales ({activeReports.length})</span>
          </button>
          <button
            onClick={() => navigate('/admin/finanzas')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/25 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Registrar Cobro
          </button>
          <button
            onClick={() => navigate('/admin/trace')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-500" />
            Ver TRACE
          </button>
        </div>
      </div>

      {/* Tarjetas de Métricas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Recaudación Total */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-fintech">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-medium">Recaudación del Mes</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono">
            {formatBOB(7150.00)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-700 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+15.3% respecto al mes anterior</span>
          </div>
        </div>

        {/* Saldo Disponible en Caja */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-fintech">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-medium">Saldo Disponible en Caja</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-blue-600 tracking-tight font-mono">
            {formatBOB(4250.00)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500 font-medium">
            <span>Arqueo verificado hoy</span>
          </div>
        </div>

        {/* Deuda Pendiente de Vecinos */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-fintech">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-medium">Deuda Total Pendiente</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono">
            {formatBOB(1350.00)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-amber-700 font-medium">
            <span>6 viviendas en mora</span>
          </div>
        </div>

        {/* Vecinos & Viviendas */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-fintech">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-medium">Comunidad Registrada</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            48 <span className="text-xs font-normal text-slate-400">familias</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500 font-medium">
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span>52 viviendas censadas</span>
          </div>
        </div>
      </div>

      {/* Gráfico y Proyectos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico Financiero de Ingresos vs Egresos */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-fintech">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Flujo Financiero (Últimos 5 Meses)</h2>
              <p className="text-xs text-slate-500">Comparativa de ingresos confirmados vs egresos ejecutados (Bs.)</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-600 inline-block" />
                <span className="text-slate-600">Ingresos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-500 inline-block" />
                <span className="text-slate-600">Egresos</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(value: number) => [`${formatBOB(value)}`, '']}
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="ingresos" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="egresos" fill="#F43F5E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Estado de Proyectos y Fondos */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-fintech flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900">Proyecto Comunitario Activo</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                En Ejecución
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-bold text-slate-900">Tinglado Cancha Polifuncional</p>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                Techado metálico y luminarias LED para el campo deportivo comunal.
              </p>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Ejecutado:</span>
                  <span className="font-mono text-slate-800">{formatBOB(6200.00)} / {formatBOB(15000.00)}</span>
                </div>
                {/* Barra de progreso */}
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '41.3%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Avance financiero: 41.3%</span>
                  <span>Meta: Bs. 15,000</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Auditoría transparente al día</span>
            </div>
            <button
              onClick={() => navigate('/admin/trace')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              Ver Trazabilidad →
            </button>
          </div>
        </div>
      </div>

      {/* SECCIÓN: ALERTAS CIUDADANAS Y SEGURIDAD VECINAL EN VIVO */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-fintech space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                <Radio className="w-4 h-4 animate-pulse" />
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Alertas Comunitarias & Seguridad Vecinal 24/7 ({currentOtb?.name})
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Reportes directos enviados por vecinos con código de cliente acreditado.
            </p>
          </div>

          <button
            onClick={() => setIsAlertModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Abrir Centro de Auxilio Completo</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {reports.slice(0, 3).map((rep) => (
            <div
              key={rep.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                    {rep.socioCode}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      rep.status === 'resuelto'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rep.status === 'en_camino'
                        ? 'bg-rose-100 text-rose-800 animate-pulse'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {rep.statusLabel}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
                  {rep.title}
                </h4>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{rep.location}</span>
                </p>
                <p className="text-xs text-slate-600 line-clamp-2 bg-white p-2 rounded-lg border border-slate-200">
                  {rep.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400">{rep.timestamp}</span>
                <div className="flex items-center gap-1">
                  {rep.status !== 'en_camino' && rep.status !== 'resuelto' && (
                    <button
                      onClick={() => updateReportStatus(rep.id, 'en_camino', 'La Ronda Vecinal acude al llamado.')}
                      className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold cursor-pointer"
                    >
                      En Camino
                    </button>
                  )}
                  {rep.status !== 'resuelto' && (
                    <button
                      onClick={() => updateReportStatus(rep.id, 'resuelto', 'Incidente resuelto y archivado.')}
                      className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Resuelto
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Auxilio y Reportes Barriales */}
      <CommunityAlertsAndEmergencyModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        otbId={otbId}
        otbName={currentOtb?.name || 'OTB Villa Esperanza'}
        socioCode="ADM-PRES"
        neighborName="Mesa Directiva OTB"
        lotName="Sede Comunal"
      />
    </div>
  );
};
