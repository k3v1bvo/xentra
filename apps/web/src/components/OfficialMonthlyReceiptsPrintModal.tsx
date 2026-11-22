import React, { useState, useEffect } from 'react';
import {
  Printer,
  X,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Scissors,
  Search,
  Filter,
  Check
} from 'lucide-react';
import QRCode from 'qrcode';
import { formatBOB } from '@xentra/shared';
import { XentraLogo } from './XentraLogo';
import { BoliviaCoatOfArms } from './BoliviaCoatOfArms';

export interface OfficialReceipt {
  receiptNumber: string;
  socioCode: string;
  socioName: string;
  ciNumber: string;
  block: string;
  lot: string;
  concept: string;
  period: string;
  amount: number;
  amountLiteral: string;
  paymentMethod: string;
  date: string;
  time: string;
  token: string;
  otbName: string;
  otbCode: string;
  department: string;
  municipality: string;
}

const MOCK_MONTHLY_RECEIPTS: OfficialReceipt[] = [
  {
    receiptNumber: 'OTB-CBBA-001-2026-00042',
    socioCode: 'SOC-012',
    socioName: 'Juan José Flores Morales',
    ciNumber: '7412589 CBBA',
    block: 'Manzano 261',
    lot: 'Lote 12',
    concept: 'Aporte Pro-Tinglado Cancha (Abono Parcial)',
    period: 'Noviembre 2026',
    amount: 50.00,
    amountLiteral: 'Cincuenta 00/100 Bolivianos',
    paymentMethod: 'QR Simple Bancario (Banco Unión)',
    date: '21/11/2026',
    time: '10:30',
    token: '7a9f2b84c13e5d02e847192a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4',
    otbName: 'OTB Villa Graciela (Distrito 1)',
    otbCode: 'OTB-CBBA-024',
    department: 'Cochabamba',
    municipality: 'Cochabamba (Cercado)'
  },
  {
    receiptNumber: 'OTB-CBBA-001-2026-00043',
    socioCode: 'SOC-014',
    socioName: 'Carlos Mendizábal Rojas',
    ciNumber: '6123450 CBBA',
    block: 'Manzano 261',
    lot: 'Lote 14',
    concept: 'Cuota Ordinaria Noviembre 2026',
    period: 'Noviembre 2026',
    amount: 25.00,
    amountLiteral: 'Veinticinco 00/100 Bolivianos',
    paymentMethod: 'QR Simple Bancario (BNB)',
    date: '21/11/2026',
    time: '11:00',
    token: 'e1234a5b6c7d8e9f0123456789abcdef0123456789abcdef0123456789abcdef',
    otbName: 'OTB Villa Graciela (Distrito 1)',
    otbCode: 'OTB-CBBA-024',
    department: 'Cochabamba',
    municipality: 'Cochabamba (Cercado)'
  },
  {
    receiptNumber: 'OTB-CBBA-001-2026-00041',
    socioCode: 'SOC-003',
    socioName: 'Silvia Rojas Torrico',
    ciNumber: '5289140 CBBA',
    block: 'Manzano 262',
    lot: 'Lote 08',
    concept: 'Cuota Ordinaria Noviembre 2026',
    period: 'Noviembre 2026',
    amount: 25.00,
    amountLiteral: 'Veinticinco 00/100 Bolivianos',
    paymentMethod: 'Efectivo en Sede Social',
    date: '20/11/2026',
    time: '16:45',
    token: 'b8192a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90123456789abcdef012345678',
    otbName: 'OTB Villa Graciela (Distrito 1)',
    otbCode: 'OTB-CBBA-024',
    department: 'Cochabamba',
    municipality: 'Cochabamba (Cercado)'
  },
  {
    receiptNumber: 'OTB-CBBA-001-2026-00040',
    socioCode: 'SOC-001',
    socioName: 'Roberto Gutiérrez Vargas',
    ciNumber: '3145678 CBBA',
    block: 'Manzano 262',
    lot: 'Lote 01',
    concept: 'Aporte Pro-Tinglado Cancha (Pago Total)',
    period: 'Noviembre 2026',
    amount: 100.00,
    amountLiteral: 'Cien 00/100 Bolivianos',
    paymentMethod: 'QR Simple Bancario (BCP)',
    date: '19/11/2026',
    time: '11:15',
    token: 'c9283b4a5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90123456789',
    otbName: 'OTB Villa Graciela (Distrito 1)',
    otbCode: 'OTB-CBBA-024',
    department: 'Cochabamba',
    municipality: 'Cochabamba (Cercado)'
  },
  {
    receiptNumber: 'OTB-CBBA-001-2026-00039',
    socioCode: 'SOC-005',
    socioName: 'Marina Condori Rocha',
    ciNumber: '4892103 CBBA',
    block: 'Manzano 263',
    lot: 'Lote 05',
    concept: 'Cuota Ordinaria Noviembre 2026',
    period: 'Noviembre 2026',
    amount: 25.00,
    amountLiteral: 'Veinticinco 00/100 Bolivianos',
    paymentMethod: 'QR Simple Bancario (BancoSol)',
    date: '18/11/2026',
    time: '09:20',
    token: 'd0394c5b6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f901234567890a',
    otbName: 'OTB Villa Graciela (Distrito 1)',
    otbCode: 'OTB-CBBA-024',
    department: 'Cochabamba',
    municipality: 'Cochabamba (Cercado)'
  },
  {
    receiptNumber: 'OTB-CBBA-001-2026-00038',
    socioCode: 'SOC-009',
    socioName: 'Gonzalo Claros Arispe',
    ciNumber: '3987123 CBBA',
    block: 'Manzano 266',
    lot: 'Lote 03',
    concept: 'Aporte Alumbrado y Mantenimiento',
    period: 'Noviembre 2026',
    amount: 35.00,
    amountLiteral: 'Treinta y cinco 00/100 Bolivianos',
    paymentMethod: 'Efectivo en Sede Social',
    date: '17/11/2026',
    time: '18:10',
    token: 'f9876a5b4c3d2e1f0123456789abcdef0123456789abcdef0123456789abcdef',
    otbName: 'OTB Villa Graciela (Distrito 1)',
    otbCode: 'OTB-CBBA-024',
    department: 'Cochabamba',
    municipality: 'Cochabamba (Cercado)'
  }
];

interface OfficialMonthlyReceiptsPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  customReceipts?: OfficialReceipt[];
}

export const OfficialMonthlyReceiptsPrintModal: React.FC<OfficialMonthlyReceiptsPrintModalProps> = ({
  isOpen,
  onClose,
  customReceipts
}) => {
  const receipts = customReceipts || MOCK_MONTHLY_RECEIPTS;
  const [selectedReceiptIndex, setSelectedReceiptIndex] = useState<number | 'all'>('all');
  const [selectedBlock, setSelectedBlock] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [qrCodeUrls, setQrCodeUrls] = useState<Record<string, string>>({});

  const availableBlocks = Array.from(new Set(receipts.map((r) => r.block))).filter(Boolean);

  useEffect(() => {
    const generateAllQRs = async () => {
      const isLocal =
        typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      const baseUrl = isLocal
        ? 'https://xentra-two.vercel.app'
        : (typeof window !== 'undefined' && window.location.origin
            ? window.location.origin
            : 'https://xentra-two.vercel.app');

      const urls: Record<string, string> = {};

      for (const r of receipts) {
        const verificationUrl = `${baseUrl}/verificar-recibo?token=${encodeURIComponent(
          r.token
        )}&receipt=${encodeURIComponent(r.receiptNumber)}&socio=${encodeURIComponent(
          r.socioCode
        )}&socioName=${encodeURIComponent(r.socioName)}&amount=${encodeURIComponent(
          r.amount.toString()
        )}&otb=${encodeURIComponent(r.otbName)}`;

        try {
          const url = await QRCode.toDataURL(verificationUrl, {
            errorCorrectionLevel: 'M',
            margin: 1,
            width: 200,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          urls[r.receiptNumber] = url;
        } catch (err) {
          console.error('Error generating receipt QR', err);
        }
      }

      setQrCodeUrls(urls);
    };

    if (isOpen) {
      generateAllQRs();
    }
  }, [isOpen, receipts]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const filteredReceipts = receipts.filter((r) => {
    const matchesBlock = selectedBlock === 'ALL' || r.block === selectedBlock;
    if (!matchesBlock) return false;
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
      {/* =================================================================== */}
      {/* ESTILOS CSS PARA IMPRESIÓN AISLADA: EXACTAMENTE 1 PÁGINA POR RECIBO */}
      {/* =================================================================== */}
      <style>{`
        @page {
          size: portrait letter;
          margin: 6mm 8mm;
        }
        @media print {
          html, body {
            height: 100% !important;
            background: #FFFFFF !important;
            margin: 0 !important;
            padding: 0 !important;
          }
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
            background: #FFFFFF !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
          }
          .no-print-action {
            display: none !important;
          }
          .receipt-sheet {
            width: 100% !important;
            max-width: 100% !important;
            max-height: 265mm !important;
            box-sizing: border-box !important;
            border: 2px solid #000000 !important;
            box-shadow: none !important;
            margin: 0 0 10mm 0 !important;
            padding: 5mm 7mm !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: always !important;
            break-after: page !important;
            overflow: hidden !important;
          }
          .receipt-sheet:last-child {
            page-break-after: avoid !important;
            break-after: avoid !important;
            margin-bottom: 0 !important;
          }
        }
      `}</style>

      <div className="bg-white text-slate-900 w-full max-w-4xl rounded-3xl p-4 sm:p-6 shadow-2xl relative my-auto border border-slate-200">
        
        {/* ======================================================== */}
        {/* BARRA SUPERIOR DE ACCIONES Y CONTROLES (OCULTA EN PRINT) */}
        {/* ======================================================== */}
        <div className="no-print-action pb-3 mb-4 border-b border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  Talonario Oficial de Recibos
                </span>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-300">
                  {displayReceipts.length} recibo(s) listos
                </span>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Formato: 1 Hoja por Recibo con Talón Desglosable
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 mt-1">
                Impresión y Reparto de Recibos por Manzano
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>
                  {selectedReceiptIndex !== 'all'
                    ? 'Imprimir Recibo Seleccionado (1 Hoja)'
                    : selectedBlock !== 'ALL'
                    ? `Imprimir Manzano ${selectedBlock} (${displayReceipts.length} Hojas)`
                    : `Imprimir Todo el Talonario (${displayReceipts.length} Hojas)`}
                </span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* FILTRO RÁPIDO POR MANZANOS PARA REPARTO CASA POR CASA */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
            <span className="text-xs font-black text-slate-700 flex items-center gap-1 mr-1">
              <span>🏢 Manzano:</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedBlock('ALL');
                setSelectedReceiptIndex('all');
              }}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                selectedBlock === 'ALL'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Todos los Manzanos ({receipts.length})
            </button>
            {availableBlocks.map((blk) => {
              const count = receipts.filter((r) => r.block === blk).length;
              return (
                <button
                  key={blk}
                  type="button"
                  onClick={() => {
                    setSelectedBlock(blk);
                    setSelectedReceiptIndex('all');
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    selectedBlock === blk
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {blk} ({count})
                </button>
              );
            })}
          </div>

          {/* Filtros para previsualizar socio individual o buscar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span>Previsualizar:</span>
              </span>
              <select
                value={selectedReceiptIndex === 'all' ? 'all' : selectedReceiptIndex}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedReceiptIndex(val === 'all' ? 'all' : parseInt(val, 10));
                }}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 max-w-xs"
              >
                <option value="all">
                  Imprimir todos ({filteredReceipts.length} recibos en {selectedBlock === 'ALL' ? 'todos los manzanos' : selectedBlock})
                </option>
                {filteredReceipts.map((r, idx) => (
                  <option key={r.receiptNumber} value={idx}>
                    {r.block} • {r.lot} - {r.socioName} ({formatBOB(r.amount)})
                  </option>
                ))}
              </select>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar socio, CI, lote o recibo..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RECIBOS FORMALES LISTOS PARA IMPRIMIR (1 RECIBO = 1 HOJA)*/}
        {/* ======================================================== */}
        <div className="space-y-6">
          {displayReceipts.map((receipt) => (
            <div
              key={receipt.receiptNumber}
              className="receipt-sheet p-4 sm:p-6 rounded-2xl border-2 border-slate-900 bg-white shadow-sm space-y-3"
            >
              {/* ==================================================== */}
              {/* CUERPO 1: ORIGINAL PARA EL SOCIO / APORTANTE          */}
              {/* ==================================================== */}
              <div className="space-y-2.5">
                {/* Encabezado Institucional Compacto */}
                <div className="flex items-start justify-between border-b-2 border-slate-900 pb-2 gap-3">
                  <div className="flex items-center gap-3">
                    <BoliviaCoatOfArms size={44} />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <XentraLogo size="sm" variant="dark" />
                        <span className="text-[9px] font-black uppercase tracking-wider text-blue-900 bg-blue-100 px-2 py-0.5 rounded border border-blue-300">
                          Estado Plurinacional de Bolivia
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                        {receipt.otbName}
                      </h3>
                      <p className="text-[10px] text-slate-700 font-semibold leading-tight">
                        Personería Jurídica R.P. N° 412/2018 • {receipt.municipality} • {receipt.department}
                      </p>
                      <p className="text-[9px] text-slate-500 leading-tight">
                        Código OTB: <strong className="text-slate-900 font-mono">{receipt.otbCode}</strong> • Ley N° 1551 de Participación Popular
                      </p>
                    </div>
                  </div>

                  <div className="text-right space-y-0.5 flex-shrink-0">
                    <div className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-black border border-emerald-300 uppercase tracking-wider">
                      ORIGINAL — SOCIO
                    </div>
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">
                      RECIBO OFICIAL DE CAJA
                    </span>
                    <div className="px-2.5 py-1 bg-slate-900 text-white rounded-lg font-mono font-black text-xs tracking-wide inline-block">
                      N° {receipt.receiptNumber}
                    </div>
                    <p className="text-[10px] text-slate-600 font-medium">
                      Fecha: <strong className="text-slate-900 font-mono">{receipt.date}</strong>
                    </p>
                  </div>
                </div>

                {/* Fila de Datos del Vecino / Aportante (Compacto) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-black block">Socio Aportante</span>
                    <strong className="text-slate-900 block font-bold text-xs truncate">{receipt.socioName}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-black block">Cédula de Identidad</span>
                    <strong className="text-slate-900 font-mono block font-bold text-xs">{receipt.ciNumber}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-black block">Inmueble / Lote</span>
                    <strong className="text-slate-900 block font-bold text-xs">{receipt.block}, {receipt.lot}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-black block">Código Socio</span>
                    <strong className="text-blue-800 font-mono block font-black text-xs">{receipt.socioCode}</strong>
                  </div>
                </div>

                {/* Detalle del Concepto y Liquidación (Compacto) */}
                <div className="border border-slate-300 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100 text-slate-800 font-black uppercase text-[9px] border-b border-slate-300">
                      <tr>
                        <th className="py-1.5 px-2.5">Periodo</th>
                        <th className="py-1.5 px-2.5">Concepto Oficial</th>
                        <th className="py-1.5 px-2.5">Modalidad de Pago</th>
                        <th className="py-1.5 px-2.5 text-right">Monto Acreditado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="py-1.5 px-2.5 font-mono font-bold text-slate-700">{receipt.period}</td>
                        <td className="py-1.5 px-2.5 font-bold text-slate-900">{receipt.concept}</td>
                        <td className="py-1.5 px-2.5 text-slate-700 font-medium">{receipt.paymentMethod}</td>
                        <td className="py-1.5 px-2.5 text-right font-mono font-black text-slate-900 text-xs">
                          {formatBOB(receipt.amount)}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot className="bg-slate-50 font-bold border-t border-slate-300">
                      <tr>
                        <td colSpan={3} className="py-1.5 px-2.5 text-right text-slate-800 uppercase font-black text-[10px]">
                          Total Pagado en Caja:
                        </td>
                        <td className="py-1.5 px-2.5 text-right font-mono text-base font-black text-emerald-800">
                          {formatBOB(receipt.amount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Monto Literal (1 sola línea) */}
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-300 text-[11px] flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-black text-slate-500 mr-1.5">Son:</span>
                    <strong className="text-slate-900 font-bold">{receipt.amountLiteral}</strong>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-700 font-bold">
                    ✓ PAGO ASENTADO EN LIBRO MAYOR
                  </span>
                </div>

                {/* ======================================================== */}
                {/* FILA COMPACTA LADO A LADO: FIRMAS + CERTIFICACIÓN QR     */}
                {/* ======================================================== */}
                <div className="grid grid-cols-12 gap-3 items-center pt-1">
                  {/* Firmas Oficiales de Conformidad (7 cols) */}
                  <div className="col-span-7 grid grid-cols-2 gap-3 text-center text-xs text-slate-700">
                    <div className="space-y-0.5">
                      <div className="border-b border-slate-800 w-4/5 mx-auto h-7" />
                      <p className="font-black text-slate-900 text-[11px]">Tesorero(a) OTB</p>
                      <p className="text-[9px] text-slate-500">Mesa Directiva Comunal</p>
                    </div>

                    <div className="space-y-0.5">
                      <div className="border-b border-slate-800 w-4/5 mx-auto h-7" />
                      <p className="font-black text-slate-900 text-[11px]">Socio Aportante</p>
                      <p className="text-[9px] text-slate-500">Firma de Conformidad</p>
                    </div>
                  </div>

                  {/* Certificación Digital QR (5 cols) */}
                  <div className="col-span-5 p-2 rounded-xl border border-slate-900 bg-slate-50 flex items-center gap-2">
                    <div className="p-0.5 bg-white rounded border border-slate-400 flex-shrink-0">
                      {qrCodeUrls[receipt.receiptNumber] ? (
                        <img
                          src={qrCodeUrls[receipt.receiptNumber]}
                          alt={`QR Recibo ${receipt.receiptNumber}`}
                          className="w-16 h-16 object-contain"
                        />
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center">
                          <QrCode className="w-8 h-8 text-slate-800" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-0.5 overflow-hidden text-left">
                      <div className="flex items-center gap-1 text-blue-950 font-black text-[9px] uppercase">
                        <ShieldCheck className="w-3 h-3 text-blue-700 flex-shrink-0" />
                        <span>Sello Oficial de Tesorería</span>
                      </div>
                      <p className="text-[8px] font-mono text-slate-600 truncate">
                        Recibo N° {receipt.receiptNumber}
                      </p>
                      <span className="text-[8px] text-emerald-700 font-bold block">
                        ✓ Asentado en Libro de Caja
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ==================================================== */}
              {/* LÍNEA DE CORTE CON TIJERAS PARA TALONARIO            */}
              {/* ==================================================== */}
              <div className="relative py-1 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-dashed border-slate-400" />
                </div>
                <div className="relative bg-white px-3 text-slate-500 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 border border-slate-300 rounded-full py-0.5">
                  <Scissors className="w-3 h-3 text-slate-600" />
                  <span>Corte Aquí — Talón de Archivo para Tesorería OTB</span>
                </div>
              </div>

              {/* ==================================================== */}
              {/* CUERPO 2: TALÓN DE CONTROL (COPIA PARA TESORERÍA)     */}
              {/* ==================================================== */}
              <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-50/70 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-300 pb-1">
                  <div className="flex items-center gap-2">
                    <XentraLogo size="sm" variant="dark" />
                    <span className="font-black text-slate-900 text-[10px] uppercase">
                      TALÓN DE CONTROL — ARCHIVO DE TESORERÍA OTB
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-slate-500">RECIBO N°:</span>
                    <strong className="font-mono font-black text-slate-900 text-xs">{receipt.receiptNumber}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                  <div>
                    <span className="text-[8px] text-slate-500 uppercase font-bold block">Socio</span>
                    <strong className="text-slate-900 truncate block">{receipt.socioName}</strong>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 uppercase font-bold block">Código / Lote</span>
                    <strong className="text-slate-900 font-mono block">{receipt.socioCode} • {receipt.lot}</strong>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 uppercase font-bold block">Fecha / Método</span>
                    <strong className="text-slate-900 font-mono block">{receipt.date} • {receipt.paymentMethod}</strong>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 uppercase font-bold block">Monto Cobrado</span>
                    <strong className="text-emerald-800 font-mono font-black text-xs block">{formatBOB(receipt.amount)}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[9px] text-slate-600">
                  <div>
                    <span>Concepto: <strong className="text-slate-800">{receipt.concept}</strong></span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="border-b border-slate-400 w-24 h-5" />
                      <span className="text-[8px] font-bold text-slate-700">Firma Tesorero</span>
                    </div>
                    <div className="text-center">
                      <div className="border-b border-slate-400 w-24 h-5" />
                      <span className="text-[8px] font-bold text-slate-700">Sello de Recibido</span>
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
