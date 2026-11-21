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
import { TiltCard3D } from '../components/TiltCard3D';
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
    <div className="space-y-6 max-w-7xl mx-auto text-white">
      {/* Encabezado y Acciones Rápidas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Panel de Control Financiero
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Gestión en tiempo real de <strong className="text-emerald-400">{currentOtb?.name}</strong> • Cochabamba, Bolivia
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAlertModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black text-rose-200 bg-rose-600/30 border border-rose-500/50 hover:bg-rose-600/50 shadow-md transition-all cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>Alertas Vecinales ({activeReports.length})</span>
          </button>
          <button
            onClick={() => navigate('/admin/finanzas')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/25 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Cobro</span>
          </button>
          <button
            onClick={() => navigate('/admin/trace')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 shadow-md transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
            <span>Ver TRACE</span>
          </button>
        </div>
      </div>

      {/* Tarjetas de Métricas Principales con Tilt 3D y Profundidad */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Recaudación Total */}
        <TiltCard3D intensity={5} className="p-5 rounded-2xl bg-[#0B132B]/90 border-2 border-emerald-500/30 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-300">Recaudación del Mes</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
            {formatBOB(7150.00)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-400 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+15.3% respecto al mes anterior</span>
          </div>
        </TiltCard3D>

        {/* Saldo Disponible en Caja */}
        <TiltCard3D intensity={5} className="p-5 rounded-2xl bg-[#0B132B]/90 border-2 border-blue-500/30 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-300">Saldo Disponible en Caja</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-400 tracking-tight font-mono">
            {formatBOB(4250.00)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400 font-medium">
            <span>✓ Arqueo verificado hoy</span>
          </div>
        </TiltCard3D>

        {/* Deuda Pendiente de Vecinos */}
        <TiltCard3D intensity={5} className="p-5 rounded-2xl bg-[#0B132B]/90 border-2 border-amber-500/30 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-300">Deuda Total Pendiente</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight font-mono">
            {formatBOB(1350.00)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-amber-300 font-bold">
            <span>6 viviendas en mora</span>
          </div>
        </TiltCard3D>

        {/* Vecinos & Viviendas */}
        <TiltCard3D intensity={5} className="p-5 rounded-2xl bg-[#0B132B]/90 border-2 border-slate-700/80 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-300">Comunidad Registrada</span>
            <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            48 <span className="text-xs font-normal text-slate-400">familias</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400 font-medium">
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span>52 viviendas censadas</span>
          </div>
        </TiltCard3D>
      </div>

      {/* Gráfico y Proyectos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico Financiero de Ingresos vs Egresos */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">Flujo Financiero (Últimos 5 Meses)</h2>
              <p className="text-xs text-slate-400">Comparativa de ingresos confirmados vs egresos ejecutados (Bs.)</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-500 inline-block shadow-sm" />
                <span className="text-slate-300">Ingresos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-500 inline-block shadow-sm" />
                <span className="text-slate-300">Egresos</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(value: number) => [`${formatBOB(value)}`, '']}
                  contentStyle={{ backgroundColor: '#020617', borderRadius: '14px', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="ingresos" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="egresos" fill="#F43F5E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Estado de Proyectos y Fondos */}
        <div className="p-6 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-white uppercase tracking-wider">Proyecto Comunitario Activo</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
                En Ejecución
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#030712] border-2 border-slate-700/80 space-y-2">
              <p className="text-xs font-black text-white">Tinglado Cancha Polifuncional</p>
              <p className="text-[11px] text-slate-300 line-clamp-2">
                Techado metálico y luminarias LED para el campo deportivo comunal.
              </p>

              <div className="mt-4 space-y-2 pt-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Ejecutado:</span>
                  <span className="font-mono text-emerald-400">{formatBOB(6200.00)} / {formatBOB(15000.00)}</span>
                </div>
                {/* Barra de progreso */}
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
                  <div className="bg-emerald-500 h-2.5 rounded-full shadow-sm shadow-emerald-500/50" style={{ width: '41.3%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Avance financiero: 41.3%</span>
                  <span>Meta: Bs. 15,000</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Auditoría transparente al día</span>
            </div>
            <button
              onClick={() => navigate('/admin/trace')}
              className="text-xs text-blue-400 hover:text-blue-300 font-black cursor-pointer"
            >
              Ver Trazabilidad →
            </button>
          </div>
        </div>
      </div>

      {/* SECCIÓN: ALERTAS CIUDADANAS Y SEGURIDAD VECINAL EN VIVO */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 shadow-2xl backdrop-blur-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Radio className="w-4 h-4 animate-pulse" />
              </span>
              <h2 className="text-base sm:text-lg font-black text-white">
                Alertas Comunitarias & Seguridad Vecinal 24/7 ({currentOtb?.name})
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Reportes directos enviados por vecinos con código de cliente acreditado.
            </p>
          </div>

          <button
            onClick={() => setIsAlertModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black text-rose-200 bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/40 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Abrir Centro de Auxilio Completo</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {reports.slice(0, 3).map((rep) => (
            <div
              key={rep.id}
              className="p-4 rounded-2xl border-2 border-slate-700/80 bg-[#030712] hover:border-blue-400 transition-all space-y-3 flex flex-col justify-between shadow-md"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 font-mono">
                    {rep.socioCode}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                      rep.status === 'resuelto'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : rep.status === 'en_camino'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {rep.statusLabel}
                  </span>
                </div>
                <h4 className="font-extrabold text-white text-xs sm:text-sm line-clamp-1">
                  {rep.title}
                </h4>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{rep.location}</span>
                </p>
                <p className="text-xs text-slate-300 line-clamp-2 bg-[#0B132B] p-2.5 rounded-xl border border-slate-700/80">
                  {rep.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400 font-mono">{rep.timestamp}</span>
                <div className="flex items-center gap-1.5">
                  {rep.status !== 'en_camino' && rep.status !== 'resuelto' && (
                    <button
                      onClick={() => updateReportStatus(rep.id, 'en_camino', 'La Ronda Vecinal acude al llamado.')}
                      className="px-2.5 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/50 text-[10px] font-black cursor-pointer"
                    >
                      En Camino
                    </button>
                  )}
                  {rep.status !== 'resuelto' && (
                    <button
                      onClick={() => updateReportStatus(rep.id, 'resuelto', 'Incidente resuelto y archivado.')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/50 text-[10px] font-black cursor-pointer flex items-center gap-1"
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
