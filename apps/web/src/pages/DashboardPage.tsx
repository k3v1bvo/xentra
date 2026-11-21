import React from 'react';
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
  FileSpreadsheet
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
            onClick={() => navigate('/finanzas')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/25 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Registrar Cobro
          </button>
          <button
            onClick={() => navigate('/trace')}
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
              onClick={() => navigate('/trace')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              Ver Trazabilidad →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
