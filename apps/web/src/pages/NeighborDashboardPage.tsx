import React, { useState } from 'react';
import {
  FileCheck,
  CreditCard,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Building,
  Home,
  Download,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { formatBOB } from '@xentra/shared';
import { useAuthStore } from '../stores/authStore';
import { useTenantStore } from '../stores/tenantStore';
import { useNavigate } from 'react-router-dom';

interface NeighborFee {
  id: string;
  title: string;
  type: string;
  dueDate: string;
  amountAssigned: number;
  amountPaid: number;
  isSettled: boolean;
}

const MY_FEES: NeighborFee[] = [
  {
    id: 'f-1',
    title: 'Cuota Ordinaria Noviembre 2026',
    type: 'Ordinaria',
    dueDate: '30/11/2026',
    amountAssigned: 25.00,
    amountPaid: 25.00,
    isSettled: true
  },
  {
    id: 'f-2',
    title: 'Aporte Pro-Tinglado (Cuota 1)',
    type: 'AporteEspecial',
    dueDate: '15/11/2026',
    amountAssigned: 100.00,
    amountPaid: 50.00,
    isSettled: false
  }
];

export const NeighborDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const { currentOtb } = useTenantStore();
  const [fees] = useState<NeighborFee[]>(MY_FEES);

  const totalAssigned = fees.reduce((acc, f) => acc + f.amountAssigned, 0);
  const totalPaid = fees.reduce((acc, f) => acc + f.amountPaid, 0);
  const totalDebt = Math.max(0, totalAssigned - totalPaid);

  return (
    <div className="space-y-6">
      {/* Encabezado Vecino */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-fintech-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-200 text-xs">
            <Home className="w-4 h-4" />
            <span>Manzana A, Lote 12 • {currentOtb?.name}</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight mt-1">
            Bienvenido, {profile?.first_name} {profile?.last_name}
          </h1>
          <p className="text-xs text-blue-200/80 mt-0.5">
            Consulta tus cuotas asignadas, historial de pagos y recibos digitales oficiales.
          </p>
        </div>

        {/* Tarjeta Deuda */}
        <div className="bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/20 text-right flex-shrink-0">
          <span className="text-[11px] text-blue-200 block font-medium">Deuda Total Pendiente</span>
          <span className="text-2xl font-extrabold font-mono text-white">
            {formatBOB(totalDebt)}
          </span>
          <span className="block text-[10px] text-amber-300 mt-0.5">
            {totalDebt > 0 ? '1 cuota con saldo por amortizar' : '¡Estás al día!'}
          </span>
        </div>
      </div>

      {/* Mis Cuotas Asignadas */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-blue-600" />
          Mis Cuotas y Obligaciones Comunitarias
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fees.map((fee) => (
            <div
              key={fee.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-fintech space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {fee.type}
                </span>
                {fee.isSettled ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Pagada
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    <AlertCircle className="w-3.5 h-3.5" /> Saldo Pendiente
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm">{fee.title}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Vencimiento: {fee.dueDate}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 grid grid-cols-3 gap-2 text-xs text-center font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block">Asignado</span>
                  <strong className="text-slate-800">{formatBOB(fee.amountAssigned)}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Abonado</span>
                  <strong className="text-emerald-600">{formatBOB(fee.amountPaid)}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Resta</span>
                  <strong className="text-rose-600">{formatBOB(fee.amountAssigned - fee.amountPaid)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mis Recibos Oficiales */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-fintech space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            Mis Recibos Digitales con QR
          </h2>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold font-mono text-slate-900">OTB-CBBA-001-2026-00042</p>
              <p className="text-[11px] text-slate-500">21/11/2026 • Aporte Pro-Tinglado (Abono Parcial)</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-between sm:justify-end">
            <span className="text-sm font-extrabold font-mono text-emerald-600">
              {formatBOB(50.00)}
            </span>
            <button
              onClick={() => navigate('/verificar-recibo?receipt=OTB-CBBA-001-2026-00042')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-100/70 hover:bg-blue-100 transition-colors"
            >
              <span>Ver QR</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
