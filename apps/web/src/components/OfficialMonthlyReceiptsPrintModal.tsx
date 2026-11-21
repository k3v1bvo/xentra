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
  Download
} from 'lucide-react';
import QRCode from 'qrcode';
import { formatBOB } from '@xentra/shared';
import { XentraLogo } from './XentraLogo';

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
    amountLiteral: 'Cincuenta 00/100 Bolivianos',
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
    amountLiteral: 'Veinticinco 00/100 Bolivianos',
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
    amountLiteral: 'Cien 00/100 Bolivianos',
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
    amountLiteral: 'Veinticinco 00/100 Bolivianos',
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
      for (const r of receipts) {
        // Enlace personalizado a la web oficial de Xentra para este usuario
        const verificationUrl = `https://xentra-two.vercel.app/verificar-recibo?token=${r.token}&receipt=${r.receiptNumber}&socio=${r.socioCode}`;
        try {
          const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
            errorCorrectionLevel: 'M',
            margin: 1,
            width: 180,
            color: {
              dark: '#0F172A',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      <div className="bg-white text-slate-900 w-full max-w-4xl rounded-3xl p-4 sm:p-8 shadow-2xl relative my-auto border border-slate-200 print:border-none print:shadow-none print:rounded-none print:p-0 print:max-w-none">
        {/* ======================================================== */}
        {/* BARRA SUPERIOR DE ACCIONES Y CONTROLES (OCULTA EN PRINT) */}
        {/* ======================================================== */}
        <div className="pb-4 mb-6 border-b border-slate-200 space-y-4 print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-black mb-1">
                <Printer className="w-3.5 h-3.5" />
                <span>Módulo de Impresión Oficial de Recibos Mensuales</span>
              </div>
              <h2 className="text-xl font-black text-slate-900">
                Talonario de Recibos con Código QR Personalizado
              </h2>
              <p className="text-xs text-slate-500">
                Cada recibo contiene el código QR dinámico que abre en el celular la ficha y estado de cuenta de cada socio en la web de Xentra.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center gap-2 shadow-md shadow-blue-500/25 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / Guardar PDF</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filtros de Selección Individual o Talonario Completo */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="flex items-center gap-2 flex-1">
              <button
                onClick={() => setSelectedReceiptIndex('all')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Ver todos los socios</option>
                {filteredReceipts.map((r, idx) => (
                  <option key={r.receiptNumber} value={idx}>
                    {r.socioCode} - {r.socioName} ({r.lot})
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
                placeholder="Buscar socio, lote o recibo..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RECIBOS FORMALES LISTOS PARA IMPRIMIR (FORMATO OFICIAL)  */}
        {/* ======================================================== */}
        <div className="space-y-8 print:space-y-0">
          {displayReceipts.map((receipt, index) => (
            <div
              key={receipt.receiptNumber}
              className="p-6 sm:p-8 rounded-2xl border-2 border-slate-800 bg-white shadow-sm space-y-5 print:border-slate-800 print:shadow-none print:rounded-none print:p-6 print:mb-8 print:page-break-after-always"
              style={{ pageBreakAfter: index < displayReceipts.length - 1 ? 'always' : 'auto' }}
            >
              {/* Encabezado del Recibo */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <XentraLogo size="sm" variant="dark" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Bolivia • Gestión Comunal
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 uppercase">
                    {receipt.otbName}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {receipt.municipality} • {receipt.department} • Código Oficial: <strong className="text-slate-800 font-mono">{receipt.otbCode}</strong>
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    RECIBO OFICIAL DE CAJA
                  </span>
                  <div className="px-3 py-1 bg-slate-900 text-white rounded-lg font-mono font-black text-sm tracking-tight inline-block print:border print:border-slate-900 print:bg-white print:text-slate-900">
                    N° {receipt.receiptNumber}
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Fecha de emisión: <strong className="text-slate-800">{receipt.date}</strong>
                  </p>
                </div>
              </div>

              {/* Fila de Datos del Vecino / Aportante */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Socio / Propietario</span>
                  <strong className="text-slate-900 block truncate">{receipt.socioName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Cédula de Identidad</span>
                  <strong className="text-slate-900 font-mono block">{receipt.ciNumber}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Ubicación</span>
                  <strong className="text-slate-900 block">{receipt.block}, {receipt.lot}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Código de Socio</span>
                  <strong className="text-blue-700 font-mono block">{receipt.socioCode}</strong>
                </div>
              </div>

              {/* Detalle del Concepto y Liquidación */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Periodo</th>
                      <th className="py-2.5 px-3">Concepto / Glosa Oficial</th>
                      <th className="py-2.5 px-3">Modalidad</th>
                      <th className="py-2.5 px-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-2.5 px-3 font-medium text-slate-700">{receipt.period}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{receipt.concept}</td>
                      <td className="py-2.5 px-3 text-slate-600">{receipt.paymentMethod}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        {formatBOB(receipt.amount)}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold">
                    <tr>
                      <td colSpan={3} className="py-2.5 px-3 text-right text-slate-700">
                        Total Pagado:
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-base font-black text-emerald-700">
                        {formatBOB(receipt.amount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Monto Literal */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 mr-2">Son:</span>
                <strong className="text-slate-900 italic">{receipt.amountLiteral}</strong>
              </div>

              {/* Código QR Dinámico Personalizado y Sello Criptográfico TRACE */}
              <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 flex items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Verificación Digital Personalizada en la Web de XENTRA</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Escanea este código con cualquier celular para abrir la ficha personal en vivo de este socio (<strong className="text-slate-800">{receipt.socioCode}</strong>), verificar la autenticidad del recibo y auditar el balance de la OTB.
                  </p>
                  <p className="text-[9px] font-mono text-slate-500 truncate max-w-md">
                    Hash TRACE: {receipt.token}
                  </p>
                </div>

                {/* Imagen del Código QR Real Generado */}
                <div className="flex flex-col items-center flex-shrink-0 text-center">
                  <div className="p-1.5 bg-white border border-slate-300 rounded-xl shadow-sm">
                    {qrCodeUrls[receipt.receiptNumber] ? (
                      <img
                        src={qrCodeUrls[receipt.receiptNumber]}
                        alt={`QR Recibo ${receipt.receiptNumber}`}
                        className="w-24 h-24 sm:w-28 sm:h-28"
                      />
                    ) : (
                      <div className="w-24 h-24 flex items-center justify-center">
                        <QrCode className="w-12 h-12 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] font-bold text-blue-700 mt-1 uppercase tracking-tight">
                    Escanear Recibo
                  </span>
                </div>
              </div>

              {/* Firmas Oficiales de Conformidad */}
              <div className="pt-6 grid grid-cols-3 gap-4 text-center text-xs text-slate-600">
                <div className="space-y-1">
                  <div className="border-b border-slate-400 w-4/5 mx-auto h-10" />
                  <p className="font-bold text-slate-900">Tesorero(a)</p>
                  <p className="text-[10px] text-slate-500">Mesa Directiva OTB</p>
                </div>

                <div className="space-y-1">
                  <div className="border-b border-slate-400 w-4/5 mx-auto h-10" />
                  <p className="font-bold text-slate-900">Presidente(a)</p>
                  <p className="text-[10px] text-slate-500">Representación Legal OTB</p>
                </div>

                <div className="space-y-1">
                  <div className="border-b border-slate-400 w-4/5 mx-auto h-10" />
                  <p className="font-bold text-slate-900">Socio Aportante</p>
                  <p className="text-[10px] text-slate-500">Firma de Conformidad</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
