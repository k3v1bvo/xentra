import React, { useState, useEffect } from 'react';
import {
  Printer,
  X,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Users,
  Calendar,
  Building2,
  FileText,
  Search,
  Download,
  Scissors,
  Check
} from 'lucide-react';
import QRCode from 'qrcode';
import { formatBOB } from '@xentra/shared';
import { XentraLogo } from './XentraLogo';
import { BoliviaCoatOfArms } from './BoliviaCoatOfArms';

export interface MonthlyReceiptData {
  receiptNumber: string;
  socioCode: string;
  socioName: string;
  ciNumber: string;
  block: string;
  lot: string;
  period: string;
  concept: string;
  amount: number;
  amountLiteral: string;
  date: string;
  paymentMethod: string;
  token: string;
  otbName: string;
  otbCode: string;
  department: string;
  municipality: string;
}

const DEFAULT_SAMPLE_RECEIPTS: MonthlyReceiptData[] = [
  {
    receiptNumber: 'OTB-CBBA-001-2026-00042',
    socioCode: 'SOC-012',
    socioName: 'Juan José Flores Morales',
    ciNumber: '7412589 CBBA',
    block: 'Manzana A',
    lot: 'Lote 12',
    period: 'Noviembre 2026',
    concept: 'Cuota Ordinaria Noviembre 2026 + Aporte Tinglado',
    amount: 50.0,
    amountLiteral: 'CINCUENTA 00/100 BOLIVIANOS',
    date: '21/11/2026',
    paymentMethod: 'QR Simple Bancario',
    token: '7a9f2b84c13e5d02e847192a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4',
    otbName: 'OTB Villa Esperanza',
    otbCode: 'OTB-CBBA-001',
    department: 'Cochabamba',
    municipality: 'Cochabamba (Cercado)'
  },
  {
    receiptNumber: 'OTB-CBBA-001-2026-00041',
    socioCode: 'SOC-005',
    socioName: 'Marina Condori Rocha',
    ciNumber: '4892103 CBBA',
    block: 'Manzana A',
    lot: 'Lote 05',
    period: 'Noviembre 2026',
    concept: 'Cuota Ordinaria Noviembre 2026',
    amount: 25.0,
    amountLiteral: 'VEINTICINCO 00/100 BOLIVIANOS',
    date: '20/11/2026',
    paymentMethod: 'Efectivo en Sede',
    token: 'b8192a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90123456789abcdef012345678',
    otbName: 'OTB Villa Esperanza',
    otbCode: 'OTB-CBBA-001',
    department: 'Cochabamba',
    municipality: 'Cochabamba (Cercado)'
  },
  {
    receiptNumber: 'OTB-CBBA-001-2026-00040',
    socioCode: 'SOC-003',
    socioName: 'Silvia Rojas Torrico',
    ciNumber: '5289140 CBBA',
    block: 'Manzana B',
    lot: 'Lote 08',
    period: 'Noviembre 2026',
    concept: 'Aporte Pro-Tinglado (Cuota 1 de 2)',
    amount: 100.0,
    amountLiteral: 'CIEN 00/100 BOLIVIANOS',
    date: '19/11/2026',
    paymentMethod: 'Transferencia Bancaria',
    token: 'c9203b4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90123456789abcdef0123456789',
    otbName: 'OTB Villa Esperanza',
    otbCode: 'OTB-CBBA-001',
    department: 'Cochabamba',
    municipality: 'Cochabamba (Cercado)'
  },
  {
    receiptNumber: 'OTB-CBBA-001-2026-00039',
    socioCode: 'SOC-001',
    socioName: 'Roberto Gutiérrez Vargas',
    ciNumber: '3145678 CBBA',
    block: 'Manzana A',
    lot: 'Lote 01',
    period: 'Noviembre 2026',
    concept: 'Cuota Ordinaria Noviembre 2026',
    amount: 25.0,
    amountLiteral: 'VEINTICINCO 00/100 BOLIVIANOS',
    date: '18/11/2026',
    paymentMethod: 'QR Simple Bancario',
    token: 'd1029384c5b6a7e8f90123456789abcdef0123456789abcdef0123456789abcd',
    otbName: 'OTB Villa Esperanza',
    otbCode: 'OTB-CBBA-001',
    department: 'Cochabamba',
    municipality: 'Cochabamba (Cercado)'
  }
];

interface OfficialMonthlyReceiptsPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipts?: MonthlyReceiptData[];
  selectedMonth?: string;
}

export const OfficialMonthlyReceiptsPrintModal: React.FC<OfficialMonthlyReceiptsPrintModalProps> = ({
  isOpen,
  onClose,
  receipts = DEFAULT_SAMPLE_RECEIPTS,
  selectedMonth = 'Noviembre 2026'
}) => {
  const [selectedReceiptIndex, setSelectedReceiptIndex] = useState<number | 'all'>('all');
  const [qrCodeUrls, setQrCodeUrls] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Generar QR para cada recibo apuntando a la verificación personalizada en la web
  useEffect(() => {
    const generateQRs = async () => {
      const qrs: Record<string, string> = {};
      const isLocal =
        typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      const baseUrl = isLocal
        ? 'https://xentra-two.vercel.app'
        : (typeof window !== 'undefined' && window.location.origin
            ? window.location.origin
            : 'https://xentra-two.vercel.app');

      for (const r of receipts) {
        // Enlace enriquecido con parámetros para que el celular del vecino lo abra directamente y verifique al 100%
        const verificationUrl = `${baseUrl}/verificar-recibo?token=${encodeURIComponent(r.token)}&receipt=${encodeURIComponent(r.receiptNumber)}&socio=${encodeURIComponent(r.socioCode)}&socioName=${encodeURIComponent(r.socioName)}&ci=${encodeURIComponent(r.ciNumber)}&lot=${encodeURIComponent(r.lot)}&monto=${r.amount}&concepto=${encodeURIComponent(r.concept)}&otb=${encodeURIComponent(r.otbName)}&fecha=${encodeURIComponent(r.date)}&metodo=${encodeURIComponent(r.paymentMethod)}`;

        try {
          const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
            errorCorrectionLevel: 'H',
            margin: 2,
            width: 380,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          qrs[r.receiptNumber] = qrDataUrl;
        } catch (err) {
          console.error('Error generating QR for receipt', r.receiptNumber, err);
        }
      }
      setQrCodeUrls(qrs);
    };

    if (isOpen) {
      generateQRs();
    }
  }, [isOpen, receipts]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const filteredReceipts = receipts.filter((r) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.socioName.toLowerCase().includes(term) ||
      r.socioCode.toLowerCase().includes(term) ||
      r.receiptNumber.toLowerCase().includes(term) ||
      r.lot.toLowerCase().includes(term) ||
      r.block.toLowerCase().includes(term)
    );
  });

  const displayReceipts =
    selectedReceiptIndex === 'all'
      ? filteredReceipts
      : [filteredReceipts[selectedReceiptIndex as number] || filteredReceipts[0]];

  return (
    <div
      id="printable-receipts-container"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto"
    >
      {/* Estilos CSS Específicos para Aislamiento de Impresión Limpia (NO imprime la web de fondo) */}
      <style>{`
        @media print {
          body > * {
            visibility: hidden !important;
          }
          #printable-receipts-container,
          #printable-receipts-container * {
            visibility: visible !important;
          }
          #printable-receipts-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            min-height: 100% !important;
            background: #FFFFFF !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
          }
          .no-print-action {
            display: none !important;
          }
          .receipt-sheet {
            page-break-after: always !important;
            page-break-inside: avoid !important;
            border: 2px solid #000000 !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 8mm !important;
          }
          .receipt-sheet:last-child {
            page-break-after: auto !important;
          }
          @page {
            size: portrait;
            margin: 8mm 10mm;
          }
        }
      `}</style>

      <div className="bg-white text-slate-900 w-full max-w-4xl rounded-3xl p-4 sm:p-8 shadow-2xl relative my-auto border border-slate-200">
        {/* ======================================================== */}
        {/* BARRA SUPERIOR DE ACCIONES Y CONTROLES (OCULTA EN PRINT) */}
        {/* ======================================================== */}
        <div className="no-print-action pb-4 mb-6 border-b border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-black mb-1 border border-blue-300">
                <Printer className="w-4 h-4 text-blue-700" />
                <span>Módulo Oficial de Talonario e Impresión de Recibos</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Recibos Comunitarios con Código QR Central y Sello Inmutable
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Formato legal boliviano: incluye duplicado para el vecino y talón de archivo para Tesorería. Cada QR abre en el celular la certificación oficial y saldo en vivo.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="py-3 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / Guardar PDF</span>
              </button>

              <button
                onClick={onClose}
                className="p-2.5 text-slate-400 hover:text-slate-800 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer"
                title="Cerrar modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Filtros de Selección Individual o Talonario Completo */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="flex items-center gap-2 flex-1">
              <button
                onClick={() => setSelectedReceiptIndex('all')}
                className={`py-2 px-4 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedReceiptIndex === 'all'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Todo el Talonario ({filteredReceipts.length} recibos)
              </button>

              <select
                value={selectedReceiptIndex === 'all' ? 'all' : selectedReceiptIndex}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedReceiptIndex(val === 'all' ? 'all' : parseInt(val, 10));
                }}
                className="bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Ver todos los socios</option>
                {filteredReceipts.map((r, idx) => (
                  <option key={r.receiptNumber} value={idx}>
                    {r.socioCode} - {r.socioName} ({r.lot})
                  </option>
                ))}
              </select>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar socio, CI, lote o recibo..."
                className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RECIBOS FORMALES LISTOS PARA IMPRIMIR (FORMATO OFICIAL)  */}
        {/* ======================================================== */}
        <div className="space-y-10">
          {displayReceipts.map((receipt, index) => (
            <div
              key={receipt.receiptNumber}
              className="receipt-sheet p-6 sm:p-8 rounded-3xl border-2 border-slate-900 bg-white shadow-md space-y-6"
            >
              {/* ==================================================== */}
              {/* CUERPO 1: ORIGINAL PARA EL SOCIO / APORTANTE          */}
              {/* ==================================================== */}
              <div className="space-y-4">
                {/* Encabezado Institucional con Escudo Oficial de Bolivia */}
                <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3 gap-4">
                  <div className="flex items-center gap-4">
                    <BoliviaCoatOfArms size={68} />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <XentraLogo size="sm" variant="dark" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 bg-blue-100 px-2 py-0.5 rounded border border-blue-300">
                          Estado Plurinacional de Bolivia
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                        {receipt.otbName}
                      </h3>
                      <p className="text-[11px] text-slate-700 font-semibold">
                        Personería Jurídica R.P. N° 412/2018 • {receipt.municipality} • {receipt.department}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Código de Registro OTB: <strong className="text-slate-900 font-mono">{receipt.otbCode}</strong> • Ley N° 1551 de Participación Popular
                      </p>
                    </div>
                  </div>

                  <div className="text-right space-y-1 flex-shrink-0">
                    <div className="inline-block px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300 uppercase tracking-wider mb-1">
                      ORIGINAL — SOCIO
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      RECIBO OFICIAL DE CAJA
                    </span>
                    <div className="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl font-mono font-black text-sm tracking-wide inline-block">
                      N° {receipt.receiptNumber}
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Fecha: <strong className="text-slate-900 font-mono">{receipt.date}</strong>
                    </p>
                  </div>
                </div>

                {/* Fila de Datos del Vecino / Aportante */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-300 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-black block">Socio Aportante</span>
                    <strong className="text-slate-900 block font-bold text-sm truncate">{receipt.socioName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-black block">Cédula de Identidad</span>
                    <strong className="text-slate-900 font-mono block font-bold text-sm">{receipt.ciNumber}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-black block">Inmueble / Lote</span>
                    <strong className="text-slate-900 block font-bold text-sm">{receipt.block}, {receipt.lot}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-black block">Código de Socio</span>
                    <strong className="text-blue-800 font-mono block font-black text-sm">{receipt.socioCode}</strong>
                  </div>
                </div>

                {/* Detalle del Concepto y Liquidación */}
                <div className="border-2 border-slate-300 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-800 font-black uppercase text-[10px] border-b-2 border-slate-300">
                      <tr>
                        <th className="py-2.5 px-3">Periodo</th>
                        <th className="py-2.5 px-3">Concepto / Glosa Oficial</th>
                        <th className="py-2.5 px-3">Modalidad de Pago</th>
                        <th className="py-2.5 px-3 text-right">Monto Acreditado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="py-3 px-3 font-mono font-bold text-slate-700">{receipt.period}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{receipt.concept}</td>
                        <td className="py-3 px-3 text-slate-700 font-medium">{receipt.paymentMethod}</td>
                        <td className="py-3 px-3 text-right font-mono font-black text-slate-900 text-sm">
                          {formatBOB(receipt.amount)}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-300">
                      <tr>
                        <td colSpan={3} className="py-3 px-3 text-right text-slate-800 uppercase font-black text-xs">
                          Total Pagado en Caja:
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-lg font-black text-emerald-800">
                          {formatBOB(receipt.amount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Monto Literal */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-300 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-black text-slate-500 mr-2">Son:</span>
                    <strong className="text-slate-900 font-bold tracking-wide">{receipt.amountLiteral}</strong>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold">
                    ✓ PAGO EFECTUADO Y ASENTADO
                  </span>
                </div>

                {/* ======================================================== */}
                {/* CÓDIGO QR AL MEDIO Y MÁS GRANDE (CERTIFICACIÓN DIGITAL)   */}
                {/* ======================================================== */}
                <div className="p-5 rounded-2xl border-2 border-slate-900 bg-slate-50/80 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="flex items-center gap-2 text-blue-950 font-black text-sm uppercase tracking-wide">
                    <ShieldCheck className="w-5 h-5 text-blue-700" />
                    <span>Certificación Digital Inmutable XENTRA TRACE</span>
                  </div>

                  <p className="text-xs text-slate-600 max-w-md leading-relaxed">
                    Escanea este código con la cámara de cualquier teléfono celular para autenticar este recibo en el libro mayor de la OTB y ver el historial de <strong>{receipt.socioName}</strong>.
                  </p>

                  {/* Código QR Grande y Nítido en el Centro */}
                  <div className="p-3 bg-white rounded-2xl border-2 border-slate-900 shadow-md">
                    {qrCodeUrls[receipt.receiptNumber] ? (
                      <img
                        src={qrCodeUrls[receipt.receiptNumber]}
                        alt={`QR Recibo ${receipt.receiptNumber}`}
                        className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                      />
                    ) : (
                      <div className="w-48 h-48 flex items-center justify-center">
                        <QrCode className="w-20 h-20 text-slate-800 animate-pulse" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-wider block">
                      Escanear con Cámara de Celular para Certificar
                    </span>
                    <p className="text-[9px] font-mono text-slate-500 max-w-sm truncate">
                      Token SHA-256: {receipt.token}
                    </p>
                    <span className="text-[10px] text-blue-800 font-bold block">
                      xentra-two.vercel.app/verificar-recibo
                    </span>
                  </div>
                </div>

                {/* Firmas Oficiales de Conformidad (Cuerpo Original) */}
                <div className="pt-4 grid grid-cols-3 gap-6 text-center text-xs text-slate-700">
                  <div className="space-y-1">
                    <div className="border-b-2 border-slate-800 w-4/5 mx-auto h-10" />
                    <p className="font-black text-slate-900 text-xs">Tesorero(a) OTB</p>
                    <p className="text-[10px] text-slate-500">Mesa Directiva Comunal</p>
                  </div>

                  <div className="space-y-1">
                    <div className="border-b-2 border-slate-800 w-4/5 mx-auto h-10" />
                    <p className="font-black text-slate-900 text-xs">Presidente(a) OTB</p>
                    <p className="text-[10px] text-slate-500">Representación Legal</p>
                  </div>

                  <div className="space-y-1">
                    <div className="border-b-2 border-slate-800 w-4/5 mx-auto h-10" />
                    <p className="font-black text-slate-900 text-xs">Socio Aportante</p>
                    <p className="text-[10px] text-slate-500">Firma de Conformidad</p>
                  </div>
                </div>
              </div>

              {/* ==================================================== */}
              {/* LÍNEA DE CORTE CON TIJERAS PARA TALONARIO            */}
              {/* ==================================================== */}
              <div className="relative py-2 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-dashed border-slate-400" />
                </div>
                <div className="relative bg-white px-4 text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-slate-300 rounded-full py-0.5">
                  <Scissors className="w-3.5 h-3.5 text-slate-600" />
                  <span>Corte Aquí — Talón de Archivo para Tesorería OTB</span>
                </div>
              </div>

              {/* ==================================================== */}
              {/* CUERPO 2: TALÓN DE CONTROL (COPIA PARA TESORERÍA)     */}
              {/* ==================================================== */}
              <div className="p-4 rounded-2xl border-2 border-slate-800 bg-slate-50/60 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-300 pb-2">
                  <div className="flex items-center gap-2">
                    <XentraLogo size="sm" variant="dark" />
                    <span className="font-black text-slate-900 text-xs uppercase">
                      TALÓN DE CONTROL — ARCHIVO DE TESORERÍA OTB
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500">RECIBO N°:</span>
                    <strong className="font-mono font-black text-slate-900 text-xs">{receipt.receiptNumber}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold block">Socio</span>
                    <strong className="text-slate-900 truncate block">{receipt.socioName}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold block">Código / Lote</span>
                    <strong className="text-slate-900 font-mono block">{receipt.socioCode} • {receipt.lot}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold block">Fecha / Método</span>
                    <strong className="text-slate-900 font-mono block">{receipt.date} • {receipt.paymentMethod}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold block">Monto Cobrado</span>
                    <strong className="text-emerald-800 font-mono font-black text-sm block">{formatBOB(receipt.amount)}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[10px] text-slate-600">
                  <div>
                    <span>Concepto: <strong className="text-slate-800">{receipt.concept}</strong></span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="border-b border-slate-400 w-28 h-6" />
                      <span className="text-[9px] font-bold text-slate-700">Firma Tesorero</span>
                    </div>
                    <div className="text-center">
                      <div className="border-b border-slate-400 w-28 h-6" />
                      <span className="text-[9px] font-bold text-slate-700">Sello de Recibido</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
