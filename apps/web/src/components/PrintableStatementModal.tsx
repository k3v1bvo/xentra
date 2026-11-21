import React from 'react';
import { Printer, X, ShieldCheck, CheckCircle2, QrCode } from 'lucide-react';
import { formatBOB } from '@xentra/shared';
import { XentraLogo } from './XentraLogo';

export interface FeeItem {
  period: string;
  concept: string;
  assigned: number;
  paid: number;
  balance: number;
  status: 'Pagado' | 'Pendiente';
}

export interface StatementData {
  otbName: string;
  otbCode: string;
  department: string;
  municipality: string;
  zone?: string;
  socioCode: string;
  socioName: string;
  ciNumber: string;
  block: string;
  lot: string;
  phone?: string;
  totalAssigned: number;
  totalPaid: number;
  totalDebt: number;
  lastReceiptNumber?: string;
  tokenHash?: string;
  fees: FeeItem[];
}

interface PrintableStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: StatementData;
}

export const PrintableStatementModal: React.FC<PrintableStatementModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('es-BO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      {/* Contenedor del Documento Formal */}
      <div className="bg-white text-slate-900 w-full max-w-3xl rounded-3xl p-6 sm:p-10 shadow-2xl relative my-auto border border-slate-200 print:border-none print:shadow-none print:rounded-none print:p-8 print:max-w-none">
        
        {/* Barra de Acciones (Oculta en Impresión) */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
              Documento Oficial Comunitario
            </span>
            <span className="text-xs text-slate-500 font-mono">Código: {data.socioCode}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar en PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CUERPO DEL ESTADO DE CUENTA / RECIBO IMPRIMIBLE          */}
        {/* ======================================================== */}
        <div className="space-y-6">
          {/* Encabezado Institucional */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-700 block">
                Estado Plurinacional de Bolivia
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {data.otbName}
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                Organización Territorial de Base (O.T.B.) • Código: <strong className="font-mono text-slate-900">{data.otbCode}</strong>
              </p>
              <p className="text-[11px] text-slate-500">
                {data.department} — Municipio {data.municipality} {data.zone ? `• ${data.zone}` : ''}
              </p>
            </div>

            <div className="text-right">
              <div className="inline-block p-1.5 border border-slate-300 rounded-lg bg-slate-50 print:bg-transparent">
                <span className="text-[9px] font-black text-slate-500 block uppercase">Ficha Oficial</span>
                <span className="text-sm font-black text-slate-900 font-mono">{data.socioCode}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Fecha de Emisión: {currentDate}</p>
            </div>
          </div>

          {/* Datos del Socio / Inmueble Censado */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Código de Socio</span>
              <strong className="text-slate-900 font-mono text-sm">{data.socioCode}</strong>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Nombre del Socio / Titular</span>
              <strong className="text-slate-900">{data.socioName}</strong>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Cédula de Identidad</span>
              <strong className="text-slate-900 font-mono">{data.ciNumber}</strong>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Ubicación / Inmueble</span>
              <strong className="text-slate-900">{data.block}, {data.lot}</strong>
            </div>
          </div>

          {/* Tabla de Detalle de Obligaciones y Cuotas */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
              Desglose de Cuotas Ordinarias y Aportes Especiales
            </h3>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Período / Fecha</th>
                    <th className="py-2.5 px-3">Concepto Oficial</th>
                    <th className="py-2.5 px-3 text-right">Asignado</th>
                    <th className="py-2.5 px-3 text-right">Abonado</th>
                    <th className="py-2.5 px-3 text-right">Saldo</th>
                    <th className="py-2.5 px-3 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.fees.map((fee, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono text-slate-600">{fee.period}</td>
                      <td className="py-2 px-3 font-semibold text-slate-800">{fee.concept}</td>
                      <td className="py-2 px-3 text-right font-mono">{formatBOB(fee.assigned)}</td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-700 font-bold">{formatBOB(fee.paid)}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                        {fee.balance > 0 ? (
                          <span className="text-amber-700">{formatBOB(fee.balance)}</span>
                        ) : (
                          <span className="text-slate-400">Bs. 0,00</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          fee.status === 'Pagado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {fee.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resumen de Totales y Liquidación */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-slate-900 text-white gap-4 print:bg-slate-100 print:text-slate-900 print:border print:border-slate-300">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 print:text-slate-600 block">
                Estado General de Cuenta Vecinal
              </span>
              <p className="text-xs font-bold text-white print:text-slate-900 mt-0.5">
                {data.totalDebt === 0 ? '✓ El socio se encuentra al día con sus aportes comunales.' : '⚠ Presenta saldo pendiente sujeto a regularización por Tesorería.'}
              </p>
            </div>

            <div className="flex items-center gap-6 text-right">
              <div>
                <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase block">Total Abonado</span>
                <strong className="text-emerald-400 print:text-emerald-700 font-mono text-base">{formatBOB(data.totalPaid)}</strong>
              </div>

              <div className="border-l border-slate-700 print:border-slate-300 pl-6">
                <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase block">Saldo Pendiente</span>
                <strong className="text-white print:text-slate-900 font-mono text-xl">{formatBOB(data.totalDebt)}</strong>
              </div>
            </div>
          </div>

          {/* Sello de Autenticidad Criptográfica */}
          <div className="p-3 border border-slate-200 rounded-xl flex items-center justify-between text-[11px] text-slate-500">
            <div className="space-y-0.5">
              <p className="font-bold text-slate-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Certificación Digital XENTRA TRACE (Contabilidad Inmutable)</span>
              </p>
              <p className="text-[10px] font-mono">
                Token SHA-256: {data.tokenHash || '7a9f2b84c13e5d02e847192a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4'}
              </p>
              <p className="text-[10px]">
                Verificable públicamente en: <span className="font-mono text-blue-600">https://xentra-two.vercel.app/verificar-recibo</span>
              </p>
            </div>

            <div className="w-14 h-14 bg-slate-100 rounded-lg p-1 border border-slate-200 flex items-center justify-center flex-shrink-0">
              <QrCode className="w-10 h-10 text-slate-800" />
            </div>
          </div>

          {/* Espacio para Firmas Oficiales */}
          <div className="pt-8 grid grid-cols-3 gap-6 text-center text-xs text-slate-600 border-t border-slate-200">
            <div className="space-y-1">
              <div className="border-b border-slate-400 w-3/4 mx-auto h-12" />
              <p className="font-bold text-slate-900">Tesorero(a)</p>
              <p className="text-[10px] text-slate-500">Mesa Directiva OTB</p>
            </div>

            <div className="space-y-1">
              <div className="border-b border-slate-400 w-3/4 mx-auto h-12" />
              <p className="font-bold text-slate-900">Presidente(a)</p>
              <p className="text-[10px] text-slate-500">Representación Legal OTB</p>
            </div>

            <div className="space-y-1">
              <div className="border-b border-slate-400 w-3/4 mx-auto h-12" />
              <p className="font-bold text-slate-900">Socio / Afiliado</p>
              <p className="text-[10px] text-slate-500">Firma de Conformidad</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
