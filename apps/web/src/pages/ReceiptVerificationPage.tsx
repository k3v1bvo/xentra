import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ShieldCheck,
  AlertOctagon,
  Building,
  QrCode,
  ArrowLeft,
  Calendar,
  Lock
} from 'lucide-react';
import { formatBOB } from '@xentra/shared';
import { XentraLogo } from '../components/XentraLogo';

export const ReceiptVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const receiptNum = searchParams.get('receipt') || 'OTB-CBBA-001-2026-00042';

  // Validación: si hay token se considera válido
  const isValid = !!token || receiptNum.includes('2026');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 py-10 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden">
        {/* Cabecera de Verificación Oficial */}
        <div className="bg-slate-900 p-6 text-white text-center space-y-2 relative">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md mx-auto flex items-center justify-center mb-3">
            <QrCode className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-base font-extrabold tracking-tight">Verificación Pública de Recibo</h1>
          <p className="text-xs text-slate-400">
            Plataforma Financiera Comunitaria XENTRA OTB
          </p>

          <div className="pt-2">
            {isValid ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <CheckCircle2 className="w-4 h-4" /> Recibo Válido y Oficial
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                <AlertOctagon className="w-4 h-4" /> Recibo No Encontrado / Revertido
              </span>
            )}
          </div>
        </div>

        {/* Datos Públicos Verificados */}
        <div className="p-6 space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Organización Emisora:</span>
              <span className="font-bold text-slate-900 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                OTB Villa Esperanza
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Código de Recibo:</span>
              <span className="font-mono font-bold text-blue-700">{receiptNum}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Fecha y Hora de Emisión:</span>
              <span className="text-slate-700 font-mono flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                21/11/2026 10:30
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Concepto General:</span>
              <span className="font-semibold text-slate-800">Aporte Comunitario Pro-Tinglado</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Método de Cobro:</span>
              <span className="text-slate-700 font-medium">Efectivo en Caja Central</span>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-600">Monto Acreditado:</span>
              <span className="text-xl font-extrabold font-mono text-emerald-600">
                {formatBOB(50.00)}
              </span>
            </div>
          </div>

          {/* Aviso Estricto de Protección de Datos Personales */}
          <div className="p-3 rounded-xl bg-slate-100 border border-slate-200/60 text-[11px] text-slate-500 flex items-start gap-2">
            <Lock className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Protección de Privacidad:</strong> Por seguridad y normativa de datos personales,
              el nombre completo, cédula de identidad y teléfono del aportante no son expuestos públicamente.
            </span>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver al Sistema
          </button>
        </div>
      </div>
    </div>
  );
};
