import React, { useState, useEffect } from 'react';
import { Printer, X, ShieldCheck, CheckCircle2, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import { formatBOB } from '@xentra/shared';
import { XentraLogo } from './XentraLogo';
import { BoliviaCivicEmblem } from './OfficialMonthlyReceiptsPrintModal';

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
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  useEffect(() => {
    const generateQR = async () => {
      const baseUrl =
        typeof window !== 'undefined' && window.location.origin
          ? window.location.origin
          : 'https://xentra-two.vercel.app';

      const verificationUrl = `${baseUrl}/verificar-recibo?token=${encodeURIComponent(
        data.tokenHash || '7a9f2b84c13e5d02e847192a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4'
      )}&receipt=${encodeURIComponent(
        data.lastReceiptNumber || 'OTB-CBBA-001-2026-00042'
      )}&socio=${encodeURIComponent(data.socioCode)}&socioName=${encodeURIComponent(
        data.socioName
      )}&ci=${encodeURIComponent(data.ciNumber)}&lot=${encodeURIComponent(
        data.lot
      )}&otb=${encodeURIComponent(data.otbName)}`;

      try {
        const url = await QRCode.toDataURL(verificationUrl, {
          errorCorrectionLevel: 'H',
          margin: 2,
          width: 260,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrUrl(url);
      } catch (err) {
        console.error('Error generating Statement QR', err);
      }
    };

    if (isOpen) {
      generateQR();
    }
  }, [isOpen, data]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      <style>{`
        @media print {
          @page {
            size: portrait;
            margin: 8mm 10mm;
          }
          body {
            background-color: #FFFFFF !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .statement-sheet {
            page-break-inside: avoid;
            box-shadow: none !important;
            border-color: #000000 !important;
            padding: 16px !important;
          }
        }
      `}</style>

      {/* Contenedor del Documento Formal */}
      <div className="statement-sheet bg-white text-slate-900 w-full max-w-3xl rounded-3xl p-6 sm:p-10 shadow-2xl relative my-auto border-2 border-slate-900 print:border-2 print:border-slate-900 print:shadow-none print:rounded-none print:p-6 print:max-w-none">
        {/* Barra de Acciones (Oculta en Impresión) */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
              Ficha Oficial & Estado de Cuenta Vecinal
            </span>
            <span className="text-xs text-slate-600 font-mono font-bold">Código: {data.socioCode}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center gap-2 shadow-md shadow-blue-500/25 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar en PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CUERPO DEL ESTADO DE CUENTA / RECIBO IMPRIMIBLE          */}
        {/* ======================================================== */}
        <div className="space-y-6">
          {/* Encabezado Institucional con Emblemas */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4 gap-3">
            <div className="flex items-center gap-3">
              <BoliviaCivicEmblem size={54} />
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <XentraLogo size="sm" variant="dark" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 bg-blue-100 px-2 py-0.5 rounded border border-blue-300">
                    Estado Plurinacional de Bolivia
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase">
                  {data.otbName}
                </h1>
                <p className="text-xs text-slate-600 font-semibold">
                  Organización Territorial de Base (O.T.B.) • Código Oficial: <strong className="font-mono text-slate-900">{data.otbCode}</strong>
                </p>
                <p className="text-[11px] text-slate-500">
                  {data.department} — Municipio {data.municipality} {data.zone ? `• ${data.zone}` : ''} • Ley N° 1551
                </p>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="inline-block p-2 border-2 border-slate-900 rounded-xl bg-slate-50 print:bg-transparent">
                <span className="text-[9px] font-black text-slate-600 block uppercase">Ficha de Socio</span>
                <span className="text-base font-black text-slate-900 font-mono">{data.socioCode}</span>
              </div>
              <p className="text-[10px] text-slate-600 font-medium mt-1">Emisión: {currentDate}</p>
            </div>
          </div>

          {/* Datos del Socio / Inmueble Censado */}
          <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs print:bg-white print:border-slate-400">
            <div>
              <span className="text-[10px] text-slate-500 font-black uppercase block">Código de Socio</span>
              <strong className="text-blue-800 font-mono text-sm font-black">{data.socioCode}</strong>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 font-black uppercase block">Nombre del Titular</span>
              <strong className="text-slate-900 font-bold">{data.socioName}</strong>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 font-black uppercase block">Cédula de Identidad</span>
              <strong className="text-slate-900 font-mono font-bold">{data.ciNumber}</strong>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 font-black uppercase block">Ubicación / Inmueble</span>
              <strong className="text-slate-900 font-bold">{data.block}, {data.lot}</strong>
            </div>
          </div>

          {/* Tabla de Detalle de Obligaciones y Cuotas */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-2">
              Desglose de Cuotas Ordinarias y Aportes Especiales Acreditados
            </h3>

            <div className="overflow-x-auto border-2 border-slate-300 rounded-2xl print:border-slate-400">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 border-b-2 border-slate-300 text-slate-800 font-black uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Período / Fecha</th>
                    <th className="py-2.5 px-3">Concepto Oficial</th>
                    <th className="py-2.5 px-3 text-right">Asignado</th>
                    <th className="py-2.5 px-3 text-right">Abonado</th>
                    <th className="py-2.5 px-3 text-right">Saldo</th>
                    <th className="py-2.5 px-3 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.fees.map((fee, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono font-bold text-slate-700">{fee.period}</td>
                      <td className="py-2 px-3 font-bold text-slate-900">{fee.concept}</td>
                      <td className="py-2 px-3 text-right font-mono">{formatBOB(fee.assigned)}</td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-800 font-bold">{formatBOB(fee.paid)}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                        {fee.balance > 0 ? (
                          <span className="text-amber-800 font-black">{formatBOB(fee.balance)}</span>
                        ) : (
                          <span className="text-slate-400">Bs. 0,00</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                          fee.status === 'Pagado'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border-amber-300'
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
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-slate-900 text-white gap-4 print:bg-slate-100 print:text-slate-900 print:border-2 print:border-slate-800">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 print:text-slate-600 font-black block">
                Estado General de Cuenta Vecinal
              </span>
              <p className="text-xs font-bold text-white print:text-slate-900 mt-0.5">
                {data.totalDebt === 0 ? '✓ El socio se encuentra al día con sus aportes comunales.' : '⚠ Presenta saldo pendiente sujeto a regularización por Tesorería.'}
              </p>
            </div>

            <div className="flex items-center gap-6 text-right">
              <div>
                <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-bold block">Total Abonado</span>
                <strong className="text-emerald-400 print:text-emerald-800 font-mono text-base font-black">{formatBOB(data.totalPaid)}</strong>
              </div>

              <div className="border-l border-slate-700 print:border-slate-400 pl-6">
                <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-bold block">Saldo Pendiente</span>
                <strong className="text-white print:text-slate-900 font-mono text-xl font-black">{formatBOB(data.totalDebt)}</strong>
              </div>
            </div>
          </div>

          {/* Sello de Autenticidad Criptográfica con Código QR Real */}
          <div className="p-3.5 border-2 border-blue-200 bg-blue-50/50 rounded-2xl flex items-center justify-between text-xs text-slate-700 gap-4 print:bg-white print:border-slate-800">
            <div className="space-y-1 flex-1">
              <p className="font-black text-slate-900 flex items-center gap-1.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                <span>Certificación Digital XENTRA TRACE (Contabilidad Inmutable)</span>
              </p>
              <p className="text-[10px] font-mono text-slate-600 truncate max-w-md">
                Token SHA-256: {data.tokenHash || '7a9f2b84c13e5d02e847192a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4'}
              </p>
              <p className="text-[10px] text-slate-600">
                Verificable públicamente en: <span className="font-mono text-blue-700 font-bold">xentra-two.vercel.app/verificar-recibo</span>
              </p>
            </div>

            <div className="flex flex-col items-center flex-shrink-0 text-center">
              <div className="p-1.5 bg-white rounded-xl border-2 border-slate-800 shadow-sm">
                {qrUrl ? (
                  <img src={qrUrl} alt="QR Verificación Ficha" className="w-20 h-20 sm:w-24 sm:h-24 object-contain" />
                ) : (
                  <QrCode className="w-20 h-20 text-slate-800" />
                )}
              </div>
              <span className="text-[8px] font-black text-slate-900 mt-0.5 uppercase">Escanear Ficha</span>
            </div>
          </div>

          {/* Espacio para Firmas Oficiales */}
          <div className="pt-6 grid grid-cols-3 gap-6 text-center text-xs text-slate-600 border-t-2 border-slate-300">
            <div className="space-y-1">
              <div className="border-b-2 border-slate-800 w-3/4 mx-auto h-10" />
              <p className="font-black text-slate-900 text-xs">Tesorero(a)</p>
              <p className="text-[10px] text-slate-500">Mesa Directiva OTB</p>
            </div>

            <div className="space-y-1">
              <div className="border-b-2 border-slate-800 w-3/4 mx-auto h-10" />
              <p className="font-black text-slate-900 text-xs">Presidente(a)</p>
              <p className="text-[10px] text-slate-500">Representación Legal OTB</p>
            </div>

            <div className="space-y-1">
              <div className="border-b-2 border-slate-800 w-3/4 mx-auto h-10" />
              <p className="font-black text-slate-900 text-xs">Socio / Afiliado</p>
              <p className="text-[10px] text-slate-500">Firma de Conformidad</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
