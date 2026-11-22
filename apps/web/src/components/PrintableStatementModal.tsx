import React, { useState, useEffect } from 'react';
import { Printer, X, ShieldCheck, CheckCircle2, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import { formatBOB } from '@xentra/shared';
import { XentraLogo } from './XentraLogo';
import { BoliviaCoatOfArms } from './BoliviaCoatOfArms';

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
      const isLocal =
        typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      const baseUrl = isLocal
        ? 'https://xentra-two.vercel.app'
        : (typeof window !== 'undefined' && window.location.origin
            ? window.location.origin
            : 'https://xentra-two.vercel.app');

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
          errorCorrectionLevel: 'M',
          margin: 1,
          width: 240,
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
    <div
      id="printable-statement-container"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto"
    >
      {/* =================================================================== */}
      {/* ESTILOS DE IMPRESIÓN AISLADA: EXACTAMENTE 1 PÁGINA (HOJA ÚNICA)    */}
      {/* =================================================================== */}
      <style>{`
        @page {
          size: portrait letter;
          margin: 6mm 8mm;
        }
        @media print {
          html, body {
            height: 100% !important;
            max-height: 100vh !important;
            overflow: hidden !important;
            background: #FFFFFF !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body > * {
            visibility: hidden !important;
          }
          #printable-statement-container,
          #printable-statement-container * {
            visibility: visible !important;
          }
          #printable-statement-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-height: 270mm !important;
            background: #FFFFFF !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
            overflow: hidden !important;
          }
          .statement-sheet {
            width: 100% !important;
            max-width: 100% !important;
            max-height: 260mm !important;
            box-sizing: border-box !important;
            box-shadow: none !important;
            border: 2px solid #000000 !important;
            padding: 5mm 7mm !important;
            margin: 0 !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            break-inside: avoid !important;
            break-after: avoid !important;
            overflow: hidden !important;
          }
          .no-print-action {
            display: none !important;
          }
        }
      `}</style>

      {/* Contenedor del Documento Formal (Ajustado para Hoja Única) */}
      <div className="statement-sheet bg-white text-slate-900 w-full max-w-3xl rounded-3xl p-5 sm:p-7 shadow-2xl relative my-auto border-2 border-slate-900">
        
        {/* Barra de Acciones Superior (Oculta en Impresión) */}
        <div className="no-print-action flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
              Ficha Oficial & Estado de Cuenta Vecinal
            </span>
            <span className="text-xs text-slate-600 font-mono font-bold">Código: {data.socioCode}</span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Formato Hoja Única A4/Carta
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center gap-2 shadow-md shadow-blue-500/25 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar en PDF (1 Página)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CUERPO DEL ESTADO DE CUENTA / FICHA OFICIAL IMPRIMIBLE    */}
        {/* ======================================================== */}
        <div className="space-y-3.5">
          {/* Encabezado Institucional Compacto */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-2.5 gap-3">
            <div className="flex items-center gap-3">
              <BoliviaCoatOfArms size={48} />

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <XentraLogo size="sm" variant="dark" />
                  <span className="text-[9px] font-black uppercase tracking-wider text-blue-900 bg-blue-100 px-2 py-0.5 rounded border border-blue-300">
                    Estado Plurinacional de Bolivia
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
                  {data.otbName}
                </h1>
                <p className="text-[11px] text-slate-700 font-semibold leading-tight">
                  Organización Territorial de Base (O.T.B.) • Código: <strong className="font-mono text-slate-900">{data.otbCode}</strong>
                </p>
                <p className="text-[10px] text-slate-500 leading-tight">
                  {data.department} — Municipio {data.municipality} {data.zone ? `• ${data.zone}` : ''} • Ley N° 1551 de Participación Popular
                </p>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="inline-block p-2 border-2 border-slate-900 rounded-xl bg-slate-50 text-center min-w-[100px]">
                <span className="text-[8px] font-black text-slate-600 block uppercase">Ficha Socio</span>
                <span className="text-sm font-black text-slate-900 font-mono">{data.socioCode}</span>
              </div>
              <p className="text-[9px] text-slate-600 font-medium mt-0.5">Emisión: {currentDate}</p>
            </div>
          </div>

          {/* Datos del Socio / Inmueble Censado (Compacto) */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <span className="text-[9px] text-slate-500 font-black uppercase block">Código de Socio</span>
              <strong className="text-blue-800 font-mono text-xs font-black">{data.socioCode}</strong>
            </div>

            <div>
              <span className="text-[9px] text-slate-500 font-black uppercase block">Nombre del Titular</span>
              <strong className="text-slate-900 font-bold text-xs block truncate">{data.socioName}</strong>
            </div>

            <div>
              <span className="text-[9px] text-slate-500 font-black uppercase block">Cédula de Identidad</span>
              <strong className="text-slate-900 font-mono font-bold text-xs block">{data.ciNumber}</strong>
            </div>

            <div>
              <span className="text-[9px] text-slate-500 font-black uppercase block">Ubicación / Inmueble</span>
              <strong className="text-slate-900 font-bold text-xs block truncate">{data.block}, {data.lot}</strong>
            </div>
          </div>

          {/* Tabla de Detalle de Obligaciones y Cuotas (Compacta) */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-800 mb-1">
              Desglose de Cuotas Ordinarias y Aportes Especiales Acreditados
            </h3>

            <div className="overflow-x-auto border border-slate-300 rounded-xl">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-100 border-b border-slate-300 text-slate-800 font-black uppercase text-[9px]">
                  <tr>
                    <th className="py-1.5 px-2.5">Período</th>
                    <th className="py-1.5 px-2.5">Concepto Oficial</th>
                    <th className="py-1.5 px-2.5 text-right">Asignado</th>
                    <th className="py-1.5 px-2.5 text-right">Abonado</th>
                    <th className="py-1.5 px-2.5 text-right">Saldo</th>
                    <th className="py-1.5 px-2.5 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.fees.map((fee, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-1.5 px-2.5 font-mono font-bold text-slate-700">{fee.period}</td>
                      <td className="py-1.5 px-2.5 font-bold text-slate-900">{fee.concept}</td>
                      <td className="py-1.5 px-2.5 text-right font-mono">{formatBOB(fee.assigned)}</td>
                      <td className="py-1.5 px-2.5 text-right font-mono text-emerald-800 font-bold">{formatBOB(fee.paid)}</td>
                      <td className="py-1.5 px-2.5 text-right font-mono font-bold text-slate-900">
                        {fee.balance > 0 ? (
                          <span className="text-amber-800 font-black">{formatBOB(fee.balance)}</span>
                        ) : (
                          <span className="text-slate-400">Bs. 0,00</span>
                        )}
                      </td>
                      <td className="py-1.5 px-2.5 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black border ${
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

          {/* ======================================================== */}
          {/* FILA COMPACTA LADO A LADO: TOTALES + CERTIFICACIÓN QR     */}
          {/* ======================================================== */}
          <div className="grid grid-cols-12 gap-3 items-stretch">
            
            {/* Columna Izquierda (7 cols): Resumen Financiero */}
            <div className="col-span-7 p-3 rounded-xl bg-slate-900 text-white flex flex-col justify-between space-y-2">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-black block">
                  Estado General de Cuenta Vecinal
                </span>
                <p className="text-[11px] font-bold text-white mt-0.5 leading-snug">
                  {data.totalDebt === 0
                    ? '✓ El socio se encuentra al día con sus aportes comunales en la OTB.'
                    : '⚠ Presenta saldo pendiente sujeto a regularización por Tesorería.'}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-right">
                <div className="text-left">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Total Abonado</span>
                  <strong className="text-emerald-400 font-mono text-sm font-black">{formatBOB(data.totalPaid)}</strong>
                </div>

                <div className="border-l border-slate-700 pl-4 text-right">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Saldo Pendiente</span>
                  <strong className="text-white font-mono text-base font-black">{formatBOB(data.totalDebt)}</strong>
                </div>
              </div>
            </div>

            {/* Columna Derecha (5 cols): Certificación Digital Criptográfica TRACE */}
            <div className="col-span-5 p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 flex items-center gap-2.5">
              <div className="p-1 bg-white rounded-lg border border-slate-400 flex-shrink-0">
                {qrUrl ? (
                  <img
                    src={qrUrl}
                    alt="QR Verificación Ficha Oficial"
                    className="w-20 h-20 object-contain"
                  />
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center">
                    <QrCode className="w-12 h-12 text-slate-800 animate-pulse" />
                  </div>
                )}
              </div>

              <div className="space-y-0.5 overflow-hidden text-left">
                <div className="flex items-center gap-1 text-blue-950 font-black text-[10px] uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-700 flex-shrink-0" />
                  <span>Sello Oficial de Tesorería</span>
                </div>
                <p className="text-[9px] text-slate-600 leading-tight">
                  Escanea para comprobar la autenticidad de tus cuotas y recibos.
                </p>
                <p className="text-[8px] font-mono text-slate-600 truncate pt-0.5">
                  Registro Comunal N° {data.socioCode}
                </p>
              </div>
            </div>

          </div>

          {/* Espacio para Firmas Oficiales (Compacto y en 1 fila) */}
          <div className="pt-2 grid grid-cols-3 gap-4 text-center text-xs text-slate-600 border-t border-slate-300">
            <div className="space-y-0.5">
              <div className="border-b border-slate-800 w-3/4 mx-auto h-7" />
              <p className="font-black text-slate-900 text-[11px]">Tesorero(a)</p>
              <p className="text-[9px] text-slate-500">Mesa Directiva OTB</p>
            </div>

            <div className="space-y-0.5">
              <div className="border-b border-slate-800 w-3/4 mx-auto h-7" />
              <p className="font-black text-slate-900 text-[11px]">Presidente(a)</p>
              <p className="text-[9px] text-slate-500">Representación Legal OTB</p>
            </div>

            <div className="space-y-0.5">
              <div className="border-b border-slate-800 w-3/4 mx-auto h-7" />
              <p className="font-black text-slate-900 text-[11px]">Socio / Afiliado</p>
              <p className="text-[9px] text-slate-500">Firma de Conformidad</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
