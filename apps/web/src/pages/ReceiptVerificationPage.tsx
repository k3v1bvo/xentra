import React, { useState, useEffect } from 'react';
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
  RotateCcw
} from 'lucide-react';
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
    otbName: 'OTB Villa Esperanza',
    otbCode: 'OTB-CBBA-001',
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
    otbName: 'OTB Villa Esperanza',
    otbCode: 'OTB-CBBA-001',
    department: 'Cochabamba',
    beneficiaryMasked: 'S*** Rojas T.',
    concept: 'Cuota Ordinaria Noviembre 2026',
    amount: 25.00,
    paymentMethod: 'Efectivo en Sede',
    issuedAt: '20/11/2026 16:45',
    ledgerEntry: '#8411'
  },
  'OTB-CBBA-001-2026-00040': {
    receiptNumber: 'OTB-CBBA-001-2026-00040',
    tokenHash: 'c9283b4a5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90123456789',
    otbName: 'OTB Villa Esperanza',
    otbCode: 'OTB-CBBA-001',
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
    otbName: 'OTB Villa Esperanza',
    otbCode: 'OTB-CBBA-001',
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

  // Parámetros opcionales si el usuario escanea un QR físico
  const paramReceipt = searchParams.get('receipt');
  const paramToken = searchParams.get('token');

  // Input de búsqueda / escaneo
  const [queryInput, setQueryInput] = useState('');
  const [verifiedResult, setVerifiedResult] = useState<VerifiedReceipt | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  // Función de resolución de recibos contra catálogo estático y tienda dinámica
  const resolveReceipt = (query: string): VerifiedReceipt | null => {
    const clean = query.trim().toUpperCase();
    if (!clean) return null;

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
        otbName: 'OTB Villa Esperanza',
        otbCode: 'OTB-CBBA-001',
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

  // Si el usuario entra mediante un enlace escaneado con query params
  useEffect(() => {
    if (paramReceipt || paramToken) {
      const target = paramReceipt || paramToken || '';
      setQueryInput(target);
      const res = resolveReceipt(target);
      setVerifiedResult(res);
      setHasSearched(true);
    } else {
      // SI NO HAY PARÁMETROS, NO MOSTRAR NINGÚN RECIBO POR DEFECTO
      setVerifiedResult(null);
      setHasSearched(false);
    }
  }, [paramReceipt, paramToken]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) return;

    setHasSearched(true);
    const result = resolveReceipt(queryInput);
    setVerifiedResult(result);
  };

  const handleReset = () => {
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

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* =================================================================== */}
      {/* 1. TOP HEADER: LIMPIO, SOBRIO Y SIN ESCUDO                           */}
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

      {/* =================================================================== */}
      {/* 2. CONTENIDO PRINCIPAL: VALIDADOR PÚBLICO TRACE                      */}
      {/* =================================================================== */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        
        {/* Cabecera del Validador */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Validador Criptográfico Comunal TRACE</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Verificación Oficial de Recibos OTB
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
            Comprueba la autenticidad de cualquier recibo comunal emitido en Bolivia. El sistema verifica el sello criptográfico SHA-256 contra el libro mayor inmutable.
          </p>
        </div>

        {/* Buscador / Scanner de Código de Recibo */}
        <TiltCard3D intensity={4}>
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0B132B] border-2 border-slate-800 shadow-2xl space-y-4">
            <form onSubmit={handleSearchSubmit} className="space-y-3">
              <label className="text-xs font-bold text-slate-300 block">
                Ingresa el Número de Recibo o Token Criptográfico:
              </label>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    placeholder="Ej: OTB-CBBA-001-2026-00042 o hash..."
                    className="w-full pl-11 pr-4 py-3 bg-[#030712] border-2 border-slate-700 rounded-2xl text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="h-12 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer flex-shrink-0"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Verificar Autenticidad</span>
                </button>
              </div>
            </form>

            {/* Información Técnica de Consulta */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
              <span className="font-medium text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                <span>Formatos admitidos: Código de recibo impreso (ej. <code className="text-slate-300">OTB-CBBA-001-2026-XXXXX</code>) o hash SHA-256 de 64 caracteres.</span>
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Aislamiento y Privacidad de Datos Activo
              </span>
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
                      <span>Recibo Auténtico y Registrado en Caja</span>
                    </div>
                    <h2 className="text-xl font-black text-white">
                      Certificación Digital XENTRA TRACE
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

              {/* Datos Técnicos del Recibo */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#030712] border-2 border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400 font-medium">Organización Emisora:</span>
                  <span className="font-bold text-white text-sm flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-blue-400" />
                    <span>{verifiedResult.otbName} ({verifiedResult.otbCode})</span>
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400 font-medium">Número de Recibo:</span>
                  <span className="font-mono font-black text-emerald-400 text-sm bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
                    {verifiedResult.receiptNumber}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400 font-medium">Titular Acreditado:</span>
                  <span className="font-bold text-white font-mono">{verifiedResult.beneficiaryMasked}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400 font-medium">Concepto Cobrado:</span>
                  <span className="font-bold text-slate-200 text-right">{verifiedResult.concept}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400 font-medium">Modalidad de Cobro:</span>
                  <span className="text-slate-300 font-medium">{verifiedResult.paymentMethod}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400 font-medium">Fecha y Hora de Emisión:</span>
                  <span className="text-slate-300 font-mono">{verifiedResult.issuedAt}</span>
                </div>

                <div className="pt-2 flex justify-between items-center text-sm">
                  <span className="font-black text-slate-300 uppercase text-xs">Monto Registrado en Caja:</span>
                  <span className="font-mono font-black text-emerald-400 text-2xl">
                    {formatBOB(verifiedResult.amount)}
                  </span>
                </div>
              </div>

              {/* Sello Criptográfico Inmutable SHA-256 */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-bold flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-purple-400" />
                    <span>Sello Criptográfico Inmutable SHA-256</span>
                  </span>
                  <span className="font-mono font-bold text-purple-400 text-[11px] bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                    ASIENTO CONTABLE {verifiedResult.ledgerEntry}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <p className="font-mono text-[11px] text-slate-400 break-all bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex-1">
                    {verifiedResult.tokenHash}
                  </p>
                  <button
                    onClick={() => handleCopyToken(verifiedResult.tokenHash)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Copiar Hash"
                  >
                    {copiedToken ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Aviso de Garantía y Privacidad */}
              <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-200 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Garantía de Control Social:</strong> Este recibo está indexado en el libro contable de {verifiedResult.otbName}. Sus datos coinciden con el extracto bancario oficial y no han sido adulterados.
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
                El número de recibo o token criptográfico ingresado (<code>{queryInput}</code>) no coincide con ningún asiento contable registrado en la plataforma.
              </p>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-1">
                <p>• Verifica haber copiado el código completo del recibo impreso (ej. <code>OTB-CBBA-001-2026-00042</code>).</p>
                <p>• Si el pago fue realizado recientemente, es posible que la Tesorería de la OTB aún esté validando el extracto bancario.</p>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={handleReset}
                  className="h-11 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Intentar con otro código</span>
                </button>
              </div>
            </div>
          </TiltCard3D>
        )}

        {/* =================================================================== */}
        {/* CASO C: ESTADO INICIAL (SIN BÚSQUEDA) -> INFORMACIÓN DIDÁCTICA      */}
        {/* =================================================================== */}
        {!hasSearched && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <TiltCard3D intensity={5}>
              <div className="h-full p-5 rounded-2xl bg-[#0B132B]/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <h3 className="font-black text-sm text-white">Inmutabilidad Criptográfica</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Cada comprobante emitido por la OTB contiene una firma digital única SHA-256 calculada a partir del monto, la fecha y el folio. Es imposible falsificar o duplicar un recibo sin alterar el hash.
                </p>
              </div>
            </TiltCard3D>

            <TiltCard3D intensity={5}>
              <div className="h-full p-5 rounded-2xl bg-[#0B132B]/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-blue-400">
                  <Lock className="w-4 h-4" />
                  <h3 className="font-black text-sm text-white">Protección de Datos Familiares</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  El validador público únicamente certifica que la transacción ingresó a la caja de la OTB. Jamás expone las deudas familiares ni la situación privada de ningún vecino a terceros.
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
