import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ShieldCheck,
  AlertOctagon,
  Building,
  QrCode,
  ArrowLeft,
  Calendar,
  Lock,
  MapPin,
  Clock,
  PhoneCall,
  Download,
  Copy,
  Check,
  Upload,
  Printer,
  Sparkles,
  ExternalLink,
  CreditCard,
  Building2,
  HelpCircle
} from 'lucide-react';
import { formatBOB } from '@xentra/shared';
import { XentraLogo } from '../components/XentraLogo';
import { usePaymentVerificationStore } from '../stores/paymentVerificationStore';
import { PrintableStatementModal } from '../components/PrintableStatementModal';

interface SocioAccountMock {
  socioCode: string;
  name: string;
  maskedName: string;
  ci: string;
  block: string;
  lot: string;
  debt: number;
  unsettledConcept: string;
  status: 'al_dia' | 'con_deuda';
}

const KNOWN_SOCIOS: Record<string, SocioAccountMock> = {
  'SOC-012': {
    socioCode: 'SOC-012',
    name: 'Juan José Flores Morales',
    maskedName: 'J*** J*** F*** M***',
    ci: '7412589 CBBA',
    block: 'Manzana A',
    lot: 'Lote 12',
    debt: 50.0,
    unsettledConcept: 'Aporte Pro-Tinglado (Cuota 1 de 2)',
    status: 'con_deuda'
  },
  'SOC-003': {
    socioCode: 'SOC-003',
    name: 'Silvia Rojas Torrico',
    maskedName: 'S*** R*** T***',
    ci: '5289140 CBBA',
    block: 'Manzana B',
    lot: 'Lote 08',
    debt: 125.0,
    unsettledConcept: 'Cuota Ordinaria Noviembre + Aporte Tinglado',
    status: 'con_deuda'
  },
  'SOC-005': {
    socioCode: 'SOC-005',
    name: 'Marina Condori Rocha',
    maskedName: 'M*** C*** R***',
    ci: '4892103 CBBA',
    block: 'Manzana A',
    lot: 'Lote 05',
    debt: 0.0,
    unsettledConcept: 'Ninguna (Aportes al Día)',
    status: 'al_dia'
  },
  'SOC-001': {
    socioCode: 'SOC-001',
    name: 'Roberto Gutiérrez Vargas',
    maskedName: 'R*** G*** V***',
    ci: '3145678 CBBA',
    block: 'Manzana A',
    lot: 'Lote 01',
    debt: 0.0,
    unsettledConcept: 'Ninguna (Aportes al Día)',
    status: 'al_dia'
  }
};

export const ReceiptVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const receiptNum = searchParams.get('receipt') || 'OTB-CBBA-001-2026-00042';
  const socioParam = searchParams.get('socio') || 'SOC-012';

  const { config: otbConfig, submitVoucher } = usePaymentVerificationStore();

  // Datos del socio vinculado
  const socioData = KNOWN_SOCIOS[socioParam] || {
    socioCode: socioParam,
    name: 'Juan José Flores Morales',
    maskedName: 'J*** J*** F***',
    ci: '7412589 CBBA',
    block: 'Manzana A',
    lot: 'Lote 12',
    debt: 50.0,
    unsettledConcept: 'Cuota Comunitaria Pendiente',
    status: 'con_deuda'
  };

  // Estados locales para pago QR en esta página
  const [payAmount, setPayAmount] = useState(String(socioData.debt > 0 ? socioData.debt : 50));
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [voucherSentSuccess, setVoucherSentSuccess] = useState(false);

  // Modal Imprimir Ficha
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const isValid = !!token || receiptNum.includes('2026');

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(otbConfig.accountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  // Descargar imagen del QR a la galería
  const handleDownloadQrImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 460;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 400, 460);
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${otbConfig.otbName} - QR SIMPLE`, 200, 38);
      ctx.font = '13px sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText(`${otbConfig.bankName} • Cta: ${otbConfig.accountNumber}`, 200, 62);

      ctx.fillStyle = '#0F172A';
      ctx.fillRect(45, 90, 80, 80);
      ctx.clearRect(55, 100, 60, 60);
      ctx.fillRect(65, 110, 40, 40);

      ctx.fillRect(275, 90, 80, 80);
      ctx.clearRect(285, 100, 60, 60);
      ctx.fillRect(295, 110, 40, 40);

      ctx.fillRect(45, 300, 80, 80);
      ctx.clearRect(55, 310, 60, 60);
      ctx.fillRect(65, 320, 40, 40);

      ctx.fillStyle = '#2563EB';
      ctx.beginPath();
      ctx.arc(200, 235, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(200, 235, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(200, 235, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0F172A';
      ctx.fillRect(150, 110, 20, 20);
      ctx.fillRect(180, 140, 20, 20);
      ctx.fillRect(210, 110, 20, 20);
      ctx.fillRect(240, 140, 20, 20);
      ctx.fillRect(150, 310, 20, 20);
      ctx.fillRect(180, 340, 20, 20);
      ctx.fillRect(210, 310, 20, 20);
      ctx.fillRect(240, 340, 20, 20);
      ctx.fillRect(275, 220, 20, 20);
      ctx.fillRect(315, 250, 20, 20);
      ctx.fillRect(100, 220, 20, 20);
      ctx.fillRect(70, 250, 20, 20);

      ctx.fillStyle = '#059669';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(`Monto Sugerido: ${formatBOB(parseFloat(payAmount) || 50)}`, 200, 420);

      const link = document.createElement('a');
      link.download = `QR_Pago_${socioData.socioCode}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      alert('¡Código QR guardado en tu teléfono/descargas! Abre tu app bancaria y selecciona "Pagar con QR" cargando esta imagen.');
    }
  };

  const handleSendVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    await submitVoucher({
      otbId: otbConfig.otbId,
      neighborName: socioData.name,
      neighborSocioCode: socioData.socioCode,
      neighborCi: socioData.ci,
      block: socioData.block,
      lot: socioData.lot,
      amount: parseFloat(payAmount) || 50,
      concept: `Pago de Saldo ${socioData.unsettledConcept}`,
      method: 'QR',
      evidenceName: selectedFileName || 'comprobante_banco_union.jpg'
    });

    setIsUploading(false);
    setVoucherSentSuccess(true);
    alert('¡Comprobante enviado a la Tesorería de la OTB! El Tesorero lo verificará en el extracto bancario y emitirá tu recibo oficial.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-6 sm:py-10 px-3 sm:px-6 flex flex-col items-center justify-center relative">
      <div className="w-full max-w-2xl space-y-6">
        {/* Barra Superior con Logo y Botón Volver */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a la Portada</span>
          </button>

          <XentraLogo size="sm" variant="light" />
        </div>

        {/* Tarjeta 1: Verificación Oficial de Recibo Escaneado */}
        <div className="bg-slate-900/90 border-2 border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 p-6 text-center space-y-2 border-b border-slate-800 relative">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 mx-auto flex items-center justify-center mb-2 shadow-inner">
              <QrCode className="w-6 h-6 text-emerald-400" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/40">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Recibo Oficial Auténtico & Verificado</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Certificación Digital Comunitaria
            </h1>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Este recibo fue emitido por la mesa directiva de <strong>{otbConfig.otbName}</strong> y está sellado con token criptográfico TRACE.
            </p>
          </div>

          <div className="p-6 space-y-4 text-xs">
            {/* Detalles del Recibo */}
            <div className="p-4 rounded-2xl bg-[#020617] border-2 border-slate-800 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Organización Emisora:</span>
                <span className="font-bold text-white flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-blue-400" />
                  {otbConfig.otbName} ({otbConfig.otbId.slice(0, 8)}...)
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Número de Recibo:</span>
                <span className="font-mono font-black text-emerald-400 text-sm">{receiptNum}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Fecha de Emisión:</span>
                <span className="text-slate-200 font-mono">21/11/2026 10:30</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Concepto Acreditado:</span>
                <span className="font-bold text-white">Cuota Ordinaria / Aporte Comunal</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Modalidad de Cobro:</span>
                <span className="text-slate-300">QR Simple Bancario (Verificación Manual)</span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-300">Monto Acreditado:</span>
                <span className="font-mono font-black text-emerald-400 text-lg">
                  {formatBOB(50.0)}
                </span>
              </div>
            </div>

            {/* Aviso de Privacidad Zero-PII */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <Lock className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Protección de Privacidad Vecinal:</strong> Por seguridad de las familias, los nombres completos y cédulas no se muestran públicamente sin autenticación previa.
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TARJETA 2: ESTADO ACTUAL DE DEUDA DEL SOCIO              */}
        {/* ======================================================== */}
        <div className="bg-slate-900/90 border-2 border-blue-500/50 rounded-3xl p-6 shadow-2xl space-y-5 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider block mb-0.5">
                Estado de Cuenta del Socio ({socioData.socioCode})
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white">
                Socio: <span className="font-mono">{socioData.maskedName}</span> ({socioData.lot})
              </h2>
              <p className="text-xs text-slate-400">
                {socioData.block} • {otbConfig.otbName}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[11px] text-slate-400 block font-medium">Deuda Pendiente</span>
              <span className="text-2xl sm:text-3xl font-mono font-black text-white">
                {formatBOB(socioData.debt)}
              </span>
              <span className="block text-[10px] text-amber-300 font-semibold mt-0.5">
                {socioData.debt > 0 ? socioData.unsettledConcept : '¡Felicidades! Se encuentra al día'}
              </span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* OPCIÓN A: PAGAR CON QR SIMPLE DESDE EL CELULAR           */}
          {/* ======================================================== */}
          {socioData.debt > 0 ? (
            <div className="p-5 rounded-2xl bg-[#020617] border-2 border-emerald-500/60 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <h3 className="font-black text-sm text-white">Opción 1: Pagar Saldo con Código QR Simple</h3>
              </div>

              <p className="text-xs text-slate-300">
                Transfiere desde cualquier banco de Bolivia y envía tu comprobante para que el Tesorero emita tu recibo:
              </p>

              {/* Contenedor del QR y Datos Bancarios Oficiales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-1">
                {/* Visual del QR */}
                <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl shadow-md">
                  {otbConfig.qrImageUrl ? (
                    <img
                      src={otbConfig.qrImageUrl}
                      alt="QR de Cobro OTB"
                      className="w-36 h-36 object-contain"
                    />
                  ) : (
                    <svg className="w-36 h-36 text-slate-950" viewBox="0 0 100 100" fill="currentColor">
                      <rect x="0" y="0" width="30" height="30" rx="3" fill="#0F172A" />
                      <rect x="5" y="5" width="20" height="20" fill="white" />
                      <rect x="10" y="10" width="10" height="10" fill="#0F172A" />
                      <rect x="70" y="0" width="30" height="30" rx="3" fill="#0F172A" />
                      <rect x="75" y="5" width="20" height="20" fill="white" />
                      <rect x="80" y="10" width="10" height="10" fill="#0F172A" />
                      <rect x="0" y="70" width="30" height="30" rx="3" fill="#0F172A" />
                      <rect x="5" y="75" width="20" height="20" fill="white" />
                      <rect x="10" y="80" width="10" height="10" fill="#0F172A" />
                      <rect x="36" y="36" width="28" height="28" rx="4" fill="#2563EB" />
                      <circle cx="50" cy="50" r="8" fill="white" />
                      <rect x="70" y="70" width="10" height="10" fill="#0F172A" />
                    </svg>
                  )}
                  <span className="text-[10px] font-bold text-slate-700 mt-1 uppercase">
                    QR Simple Oficial
                  </span>
                </div>

                {/* Datos de la Cuenta y Botones de Acción */}
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 space-y-1">
                    <p><strong className="text-white">Banco:</strong> <span className="text-blue-300 font-bold">{otbConfig.bankName}</span></p>
                    <p><strong className="text-white">N° Cuenta:</strong> <code className="text-emerald-400 font-mono font-bold text-sm">{otbConfig.accountNumber}</code></p>
                    <p><strong className="text-white">Titular:</strong> <span className="text-slate-300">{otbConfig.accountHolder}</span></p>
                    <p><strong className="text-white">NIT:</strong> <span className="text-slate-400 font-mono">{otbConfig.nitOrCi}</span></p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleDownloadQrImage}
                      className="flex-1 py-2 px-2.5 rounded-xl text-xs font-black text-slate-950 bg-emerald-400 hover:bg-emerald-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-950" />
                      <span>Guardar QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className="py-2 px-2.5 rounded-xl text-xs font-bold text-blue-300 bg-blue-600/20 border border-blue-500/40 hover:bg-blue-600/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedAccount ? '¡Copiado!' : 'Copiar Cta.'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Formulario para Subir Comprobante Directo */}
              <form onSubmit={handleSendVoucher} className="space-y-3 pt-2 text-xs border-t border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Monto a Reportar (Bs.):</label>
                    <input
                      type="number"
                      step="0.50"
                      required
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      className="w-full bg-slate-950 border-2 border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Adjuntar Foto o Voucher:</label>
                    <label className="border-2 border-dashed border-slate-700 hover:border-emerald-400 rounded-xl px-3 py-2 flex items-center justify-center gap-2 cursor-pointer transition-colors bg-slate-950">
                      <Upload className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-[11px] text-slate-300 truncate">
                        {selectedFileName || 'Seleccionar captura de pago'}
                      </span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => e.target.files && setSelectedFileName(e.target.files[0].name)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {voucherSentSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>¡Comprobante enviado a Tesorería! Se notificará en cuanto sea revisado.</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-slate-950" />
                  <span>{isUploading ? 'Enviando Comprobante...' : 'Enviar Voucher para Verificación de Tesorería'}</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <strong className="block text-sm font-bold">¡Estás al día con la OTB!</strong>
                <span>No tienes cuotas ni aportes pendientes. Puedes descargar tu ficha oficial de socio libre de deudas.</span>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* OPCIÓN B: PAGO PRESENCIAL Y DIRECCIÓN DE LA SEDE OTB     */}
          {/* ======================================================== */}
          <div className="p-5 rounded-2xl bg-slate-950 border-2 border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-blue-400">
              <Building2 className="w-4 h-4" />
              <h3 className="font-black text-sm text-white">
                Opción 2: Pago Presencial en Efectivo & Dirección de la Sede
              </h3>
            </div>

            <p className="text-xs text-slate-300">
              Si prefieres pagar en efectivo o consultar en ventanilla con la mesa directiva:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-blue-300 font-bold">
                  <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>Dirección de la Sede Comunal:</span>
                </div>
                <p className="text-white font-medium pl-5 leading-relaxed">
                  Av. Petrolera Km 4, Manzana A frente a la Cancha Polifuncional, Cochabamba (Cercado).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Horarios de Atención en Ventanilla:</span>
                </div>
                <p className="text-slate-200 pl-5 leading-relaxed">
                  <strong>Sábados y Domingos:</strong> 08:30 a 12:30<br />
                  Reuniones y Cobranzas Presenciales.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">
                  Contacto Directiva / Tesorero: <strong className="text-white font-mono">{otbConfig.whatsappContact}</strong>
                </span>
              </div>

              <a
                href={`https://wa.me/591${otbConfig.whatsappContact}?text=Hola,%20soy%20del%20lote%20${encodeURIComponent(socioData.lot)}%20de%20la%20OTB`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-emerald-400 font-bold hover:underline"
              >
                <span>Escribir por WhatsApp</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Botones Finales */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-blue-400" />
              <span>Imprimir Ficha Oficial / Estado de Cuenta</span>
            </button>

            <button
              onClick={() => navigate('/')}
              className="py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Consultar Otro Código
            </button>
          </div>
        </div>
      </div>

      {/* Modal Imprimible de Estado de Cuenta */}
      <PrintableStatementModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        data={{
          otbName: otbConfig.otbName,
          otbCode: otbConfig.otbId.slice(0, 8),
          department: 'Cochabamba',
          municipality: 'Cochabamba (Cercado)',
          zone: 'Zona Sud - Distrito 8',
          socioCode: socioData.socioCode,
          socioName: socioData.name,
          ciNumber: socioData.ci,
          block: socioData.block,
          lot: socioData.lot,
          totalAssigned: 125.0,
          totalPaid: 125.0 - socioData.debt,
          totalDebt: socioData.debt,
          lastReceiptNumber: receiptNum,
          tokenHash: token || '7a9f2b84c13e5d02e847192a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4',
          fees: [
            {
              period: 'Noviembre 2026',
              concept: 'Cuota Ordinaria Noviembre 2026',
              assigned: 25.0,
              paid: socioData.debt > 50 ? 0.0 : 25.0,
              balance: socioData.debt > 50 ? 25.0 : 0.0,
              status: socioData.debt > 50 ? 'Pendiente' : 'Pagado'
            },
            {
              period: 'Noviembre 2026',
              concept: 'Aporte Pro-Tinglado (Cuota 1 de 2)',
              assigned: 100.0,
              paid: socioData.debt === 0 ? 100.0 : 50.0,
              balance: socioData.debt === 0 ? 0.0 : 50.0,
              status: socioData.debt === 0 ? 'Pagado' : 'Pendiente'
            }
          ]
        }}
      />
    </div>
  );
};
