import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Building,
  QrCode,
  ArrowLeft,
  Calendar,
  Lock,
  Search,
  FileCheck,
  Copy,
  Check,
  Upload,
  Receipt,
  RotateCcw,
  Camera,
  X,
  Sparkles,
  Smartphone
} from 'lucide-react';
import jsQR from 'jsqr';
import { formatBOB } from '@xentra/shared';
import { XentraLogo } from '../components/XentraLogo';
import { TiltCard3D } from '../components/TiltCard3D';
import { usePaymentVerificationStore } from '../stores/paymentVerificationStore';
import { CommunityFooter } from '../components/CommunityFooter';

interface VerifiedReceipt {
  receiptNumber: string;
  tokenHash: string;
  otbName: string;
  otbCode: string;
  department: string;
  beneficiaryMasked: string;
  concept: string;
  amount: number;
  paymentMethod: string;
  issuedAt: string;
  ledgerEntry: string;
}

const REGISTERED_RECEIPTS: Record<string, VerifiedReceipt> = {
  'OTB-CBBA-001-2026-00042': {
    receiptNumber: 'OTB-CBBA-001-2026-00042',
    tokenHash: '7a9f2b84c13e5d02e847192a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4',
    otbName: 'OTB Villa Graciela (Distrito 1)',
    otbCode: 'OTB-CBBA-024',
    department: 'Cochabamba',
    beneficiaryMasked: 'J*** J*** Flores M.',
    concept: 'Aporte Pro-Tinglado Cancha (Abono Parcial)',
    amount: 50.00,
    paymentMethod: 'QR Simple Bancario (Banco Unión)',
    issuedAt: '21/11/2026 10:30',
    ledgerEntry: '#8412'
  },
  'OTB-CBBA-001-2026-00041': {
    receiptNumber: 'OTB-CBBA-001-2026-00041',
    tokenHash: 'b8192a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90123456789abcdef012345678',
    otbName: 'OTB Villa Graciela (Distrito 1)',
    otbCode: 'OTB-CBBA-024',
    department: 'Cochabamba',
    beneficiaryMasked: 'S*** Rojas T.',
    concept: 'Cuota Ordinaria Noviembre 2026',
    amount: 25.00,
    paymentMethod: 'Efectivo en Sede Social',
    issuedAt: '20/11/2026 16:45',
    ledgerEntry: '#8411'
  },
  'OTB-CBBA-001-2026-00040': {
    receiptNumber: 'OTB-CBBA-001-2026-00040',
    tokenHash: 'c9283b4a5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90123456789',
    otbName: 'OTB Villa Graciela (Distrito 1)',
    otbCode: 'OTB-CBBA-024',
    department: 'Cochabamba',
    beneficiaryMasked: 'R*** Gutiérrez V.',
    concept: 'Aporte Pro-Tinglado Cancha (Pago Total)',
    amount: 100.00,
    paymentMethod: 'QR Simple Bancario (BCP)',
    issuedAt: '19/11/2026 11:15',
    ledgerEntry: '#8410'
  },
  'OTB-CBBA-001-2026-00039': {
    receiptNumber: 'OTB-CBBA-001-2026-00039',
    tokenHash: 'd0394c5b6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f901234567890a',
    otbName: 'OTB Villa Graciela (Distrito 1)',
    otbCode: 'OTB-CBBA-024',
    department: 'Cochabamba',
    beneficiaryMasked: 'M*** Condori R.',
    concept: 'Cuota Ordinaria Noviembre 2026',
    amount: 25.00,
    paymentMethod: 'QR Simple Bancario (BancoSol)',
    issuedAt: '18/11/2026 09:20',
    ledgerEntry: '#8409'
  }
};

export const ReceiptVerificationPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { submissions } = usePaymentVerificationStore();

  const paramReceipt = searchParams.get('receipt');
  const paramToken = searchParams.get('token');

  // Input de búsqueda / escaneo
  const [queryInput, setQueryInput] = useState('');
  const [verifiedResult, setVerifiedResult] = useState<VerifiedReceipt | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  // Escáner de Cámara QR
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Función de resolución de recibos
  const resolveReceipt = (query: string): VerifiedReceipt | null => {
    let clean = query.trim().toUpperCase();
    if (!clean) return null;

    // Si viene una URL completa escaneada por QR (ej: https://.../verificar-recibo?receipt=OTB-CBBA-001...)
    if (clean.includes('RECEIPT=')) {
      const match = clean.match(/RECEIPT=([^&]+)/);
      if (match && match[1]) clean = decodeURIComponent(match[1]).trim().toUpperCase();
    } else if (clean.includes('TOKEN=')) {
      const match = clean.match(/TOKEN=([^&]+)/);
      if (match && match[1]) clean = decodeURIComponent(match[1]).trim().toUpperCase();
    }

    // 1. Buscar en catálogo predeterminado
    for (const key of Object.keys(REGISTERED_RECEIPTS)) {
      const item = REGISTERED_RECEIPTS[key];
      if (
        item.receiptNumber.toUpperCase() === clean ||
        item.receiptNumber.toUpperCase().endsWith(clean) ||
        item.tokenHash.toUpperCase() === clean ||
        clean.includes(item.receiptNumber.toUpperCase())
      ) {
        return item;
      }
    }

    // 2. Buscar en vouchers aprobados dinámicamente en el store
    const storeFound = submissions.find(
      (s) =>
        s.status === 'Confirmed' &&
        ((s.officialReceiptNumber && s.officialReceiptNumber.toUpperCase().includes(clean)) ||
          (s.traceToken && s.traceToken.toUpperCase().includes(clean)))
    );

    if (storeFound) {
      return {
        receiptNumber: storeFound.officialReceiptNumber || 'OTB-REC-2026-00043',
        tokenHash: storeFound.traceToken || 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
        otbName: 'OTB Villa Graciela (Distrito 1)',
        otbCode: 'OTB-CBBA-024',
        department: 'Cochabamba',
        beneficiaryMasked: `${storeFound.neighborName.charAt(0)}*** ${storeFound.neighborName.split(' ').slice(-1)[0]}`,
        concept: storeFound.concept,
        amount: storeFound.amount,
        paymentMethod: storeFound.method === 'QR' ? 'QR Simple Bancario' : 'Transferencia Bancaria',
        issuedAt: storeFound.verifiedAt || storeFound.submittedAt,
        ledgerEntry: `#${storeFound.id.slice(0, 6)}`
      };
    }

    return null;
  };

  // Parámetros URL al cargar la página
  useEffect(() => {
    if (paramReceipt || paramToken) {
      const target = paramReceipt || paramToken || '';
      setQueryInput(target);
      const res = resolveReceipt(target);
      setVerifiedResult(res);
      setHasSearched(true);
    } else {
      setVerifiedResult(null);
      setHasSearched(false);
    }
  }, [paramReceipt, paramToken]);

  // Detener la cámara al desmontar
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) return;

    setHasSearched(true);
    const result = resolveReceipt(queryInput);
    setVerifiedResult(result);
  };

  const handleSelectDemoReceipt = (code: string) => {
    stopCamera();
    setQueryInput(code);
    setHasSearched(true);
    const result = resolveReceipt(code);
    setVerifiedResult(result);
  };

  const handleReset = () => {
    stopCamera();
    setQueryInput('');
    setVerifiedResult(null);
    setHasSearched(false);
    setSearchParams({});
  };

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  // Activar escáner de cámara
  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);

    try {
      const constraints: MediaStreamConstraints = {
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
        scanVideoFrame();
      }
    } catch (err: any) {
      console.error('Error al acceder a la cámara:', err);
      setCameraError('No se pudo acceder a la cámara. Revisa los permisos del navegador o sube una foto del recibo.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const scanVideoFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code && code.data) {
        stopCamera();
        setQueryInput(code.data);
        setHasSearched(true);
        const result = resolveReceipt(code.data);
        setVerifiedResult(result);
        return;
      }
    }

    animationFrameId.current = requestAnimationFrame(scanVideoFrame);
  };

  // Subir imagen / foto del recibo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          setQueryInput(code.data);
          setHasSearched(true);
          const result = resolveReceipt(code.data);
          setVerifiedResult(result);
        } else {
          setCameraError('No se detectó un código QR nítido en la imagen. Intenta con una foto más cercana o escribe el número de recibo.');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* =================================================================== */}
      {/* 1. TOP HEADER: LIMPIO, SOBRIO Y CON VOLVER A PORTADA                */}
      {/* =================================================================== */}
      <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 px-4 sm:px-8 h-16 flex items-center justify-between shadow-md">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-blue-400" />
          <span>Volver a la Portada</span>
        </button>

        <div className="flex items-center gap-2">
          <XentraLogo size="sm" variant="light" />
        </div>
      </header>

      {/* Canvas oculto para procesar frames del video */}
      <canvas ref={canvasRef} className="hidden" />
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* =================================================================== */}
      {/* 2. CONTENIDO PRINCIPAL: COMPROBADOR DE RECIBOS CON QR               */}
      {/* =================================================================== */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        
        {/* Cabecera del Validador */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-black">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Comprobador Oficial de Recibos</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Verificación de Recibos OTB
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Escanea con la cámara de tu celular el código QR de tu recibo en papel o ingresa el número impreso para comprobar que tu aporte ingresó legalmente a la caja de la OTB.
          </p>
        </div>

        {/* Buscador / Scanner Inteligente */}
        <TiltCard3D intensity={4}>
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0B132B] border-2 border-slate-800 shadow-2xl space-y-4">
            
            {/* BOTONES PRINCIPALES DE ESCANEO RÁPIDO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
              <button
                type="button"
                onClick={isCameraActive ? stopCamera : startCamera}
                className={`py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg ${
                  isCameraActive
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                }`}
              >
                <Camera className="w-5 h-5" />
                <span>{isCameraActive ? 'Cerrar Cámara' : 'Escanear QR con la Cámara'}</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 text-slate-200 transition-all cursor-pointer shadow-md"
              >
                <Upload className="w-5 h-5 text-blue-400" />
                <span>Subir Foto del Recibo</span>
              </button>
            </div>

            {/* VISOR DE CÁMARA EN VIVO */}
            {isCameraActive && (
              <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 bg-black aspect-video flex items-center justify-center shadow-2xl animate-in fade-in">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                />
                
                {/* Cuadro Guía de Escaneo */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-52 h-52 border-2 border-dashed border-emerald-400 rounded-2xl animate-pulse bg-emerald-500/10 flex items-center justify-center">
                    <span className="text-[11px] font-black text-emerald-300 bg-black/70 px-2 py-1 rounded-md">
                      Apunta al código QR
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={stopCamera}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-black/70 text-white hover:bg-black transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Mensaje de error de cámara si falla */}
            {cameraError && (
              <div className="p-3 bg-amber-950/60 border border-amber-500/50 rounded-xl text-amber-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{cameraError}</span>
              </div>
            )}

            {/* Formulario Manual Alternativo */}
            <form onSubmit={handleSearchSubmit} className="space-y-3 pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-300 block">
                O escribe el Número de Recibo impreso:
              </label>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    placeholder="Ej: OTB-CBBA-001-2026-00042 o el número 42..."
                    className="w-full pl-11 pr-4 py-3 bg-[#030712] border-2 border-slate-700 rounded-2xl text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="h-12 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer flex-shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>Comprobar</span>
                </button>
              </div>
            </form>

            {/* Botones de Prueba Rápida con 1 Clic */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Probar con recibos de ejemplo con 1 clic:</span>
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectDemoReceipt('OTB-CBBA-001-2026-00042')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-bold text-slate-200 transition-colors cursor-pointer"
                >
                  🧾 Recibo #042 (Juan José Flores • 50 Bs)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectDemoReceipt('OTB-CBBA-001-2026-00041')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-bold text-slate-200 transition-colors cursor-pointer"
                >
                  🧾 Recibo #041 (Silvia Rojas • 25 Bs)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectDemoReceipt('OTB-CBBA-001-2026-00040')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-bold text-slate-200 transition-colors cursor-pointer"
                >
                  🧾 Recibo #040 (Roberto Gutiérrez • 100 Bs)
                </button>
              </div>
            </div>
          </div>
        </TiltCard3D>

        {/* =================================================================== */}
        {/* CASO A: RECIBO VERIFICADO CON ÉXITO                                 */}
        {/* =================================================================== */}
        {hasSearched && verifiedResult && (
          <TiltCard3D intensity={5}>
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0B132B] border-2 border-emerald-500/50 shadow-2xl space-y-6 text-left animate-in fade-in duration-300">
              
              {/* Encabezado del Certificado */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-md">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-400 uppercase tracking-wider">
                      <span>✓ Recibo Válido y Registrado en Caja</span>
                    </div>
                    <h2 className="text-xl font-black text-white">
                      Comprobante Auténtico Oficial
                    </h2>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Verificar Otro</span>
                </button>
              </div>

              {/* Datos del Recibo */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#030712] border-2 border-slate-800 space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400 font-medium">Comunidad OTB:</span>
                  <span className="font-bold text-white text-sm flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-blue-400" />
                    <span>{verifiedResult.otbName}</span>
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400 font-medium">Número de Recibo:</span>
                  <span className="font-mono font-black text-emerald-400 text-sm bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
                    {verifiedResult.receiptNumber}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400 font-medium">Vecino Acreditado:</span>
                  <span className="font-bold text-white font-mono">{verifiedResult.beneficiaryMasked}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400 font-medium">Concepto Cobrado:</span>
                  <span className="font-bold text-slate-200 text-right">{verifiedResult.concept}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400 font-medium">Método de Pago:</span>
                  <span className="text-slate-300 font-medium">{verifiedResult.paymentMethod}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400 font-medium">Fecha y Hora de Emisión:</span>
                  <span className="text-slate-300 font-mono">{verifiedResult.issuedAt}</span>
                </div>

                <div className="pt-2 flex justify-between items-center text-sm sm:text-base">
                  <span className="font-black text-slate-300 uppercase text-xs">Monto en Caja Comunal:</span>
                  <span className="font-mono font-black text-emerald-400 text-2xl">
                    {formatBOB(verifiedResult.amount)}
                  </span>
                </div>
              </div>

              {/* Registro Oficial de Caja */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-200 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Control Social Garantizado:</strong> Este recibo está legalmente asentado en el Libro de Caja de {verifiedResult.otbName}. El dinero fue recibido por la directiva y rendirá cuentas claras en asamblea.
                </p>
              </div>

            </div>
          </TiltCard3D>
        )}

        {/* =================================================================== */}
        {/* CASO B: CÓDIGO NO ENCONTRADO O INVÁLIDO                             */}
        {/* =================================================================== */}
        {hasSearched && !verifiedResult && (
          <TiltCard3D intensity={4}>
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0B132B] border-2 border-rose-500/50 shadow-2xl space-y-4 text-left animate-in fade-in duration-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase text-rose-400 tracking-wider block">
                    Comprobante No Registrado
                  </span>
                  <h2 className="text-xl font-black text-white">
                    No se encontró ningún recibo con ese código
                  </h2>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                El código ingresado o escaneado no coincide con ningún recibo oficial emitido por la OTB.
              </p>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-1">
                <p>• Asegúrate de apuntar la cámara directamente al código QR del recibo en papel.</p>
                <p>• Verifica haber ingresado el número completo del recibo (ejemplo: <code>OTB-CBBA-001-2026-00042</code>).</p>
                <p>• Si acabas de pagar por QR, espera a que el tesorero apruebe la transacción en el sistema.</p>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={handleReset}
                  className="h-11 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Intentar con otro recibo</span>
                </button>
              </div>
            </div>
          </TiltCard3D>
        )}

        {/* =================================================================== */}
        {/* CASO C: ESTADO INICIAL -> BENEFICIOS CLAROS PARA EL VECINO          */}
        {/* =================================================================== */}
        {!hasSearched && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <TiltCard3D intensity={5}>
              <div className="h-full p-5 rounded-2xl bg-[#0B132B]/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <h3 className="font-black text-sm text-white">Seguridad Vecinal</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Cada recibo oficial cuenta con un código QR único impreso. Al escanearlo, compruebas que tu cuota fue ingresada legalmente a los fondos de la comunidad y no se perderá.
                </p>
              </div>
            </TiltCard3D>

            <TiltCard3D intensity={5}>
              <div className="h-full p-5 rounded-2xl bg-[#0B132B]/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-blue-400">
                  <Lock className="w-4 h-4" />
                  <h3 className="font-black text-sm text-white">Protección de Datos del Hogar</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  El comprobador únicamente confirma que el recibo es auténtico y el monto aportado. Nunca muestra deudas familiares ni datos personales a personas ajenas al lote.
                </p>
              </div>
            </TiltCard3D>
          </div>
        )}

      </main>

      {/* Footer Público Institucional */}
      <CommunityFooter variant="public" />
    </div>
  );
};
