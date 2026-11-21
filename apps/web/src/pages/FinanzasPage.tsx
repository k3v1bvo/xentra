import React, { useState } from 'react';
import {
  Wallet,
  PlusCircle,
  QrCode,
  CheckCircle2,
  Receipt,
  Download,
  AlertTriangle,
  ArrowRight,
  CreditCard,
  Banknote,
  Calendar,
  Building
} from 'lucide-react';
import { formatBOB, generateSecureReceiptToken, PaymentMethod } from '@xentra/shared';
import { useTenantStore } from '../stores/tenantStore';
import { useNotificationStore } from '../stores/notificationStore';
import { useNavigate } from 'react-router-dom';

interface PaymentMock {
  id: string;
  receiptNumber: string;
  neighborName: string;
  amount: number;
  method: PaymentMethod;
  concept: string;
  date: string;
  status: 'Confirmed' | 'PendingVerification' | 'Reversed';
  token: string;
}

const INITIAL_PAYMENTS: PaymentMock[] = [
  {
    id: 'pay-1',
    receiptNumber: 'OTB-CBBA-001-2026-00042',
    neighborName: 'Juan José Flores Morales',
    amount: 50.00,
    method: 'Efectivo',
    concept: 'Aporte Pro-Tinglado Cuota 1 (Abono Parcial)',
    date: '2026-11-21 10:30',
    status: 'Confirmed',
    token: '7a9f2b84c13e5d02e847192a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4'
  },
  {
    id: 'pay-2',
    receiptNumber: 'OTB-CBBA-001-2026-00041',
    neighborName: 'Marina Condori Rocha',
    amount: 25.00,
    method: 'Efectivo',
    concept: 'Cuota Ordinaria Noviembre 2026',
    date: '2026-11-20 16:15',
    status: 'Confirmed',
    token: 'b8192a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90123456789abcdef012345678'
  },
  {
    id: 'pay-3',
    receiptNumber: 'OTB-CBBA-001-2026-00040',
    neighborName: 'Silvia Rojas Torrico',
    amount: 100.00,
    method: 'Transferencia',
    concept: 'Aporte Pro-Tinglado Cuota 1',
    date: '2026-11-19 14:00',
    status: 'PendingVerification',
    token: 'c9203b4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90123456789abcdef0123456789'
  }
];

export const FinanzasPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentOtb } = useTenantStore();
  const { addNotification } = useNotificationStore();
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [activeTab, setActiveTab] = useState<'pagos' | 'cuotas' | 'arqueo'>('pagos');

  // Modal Cobro
  const [showPayModal, setShowPayModal] = useState(false);
  const [neighborName, setNeighborName] = useState('Juan José Flores Morales');
  const [payAmount, setPayAmount] = useState('50.00');
  const [payMethod, setPayMethod] = useState<PaymentMethod>('Efectivo');
  const [payConcept, setPayConcept] = useState('Cuota Ordinaria Noviembre 2026');

  // Recibo recién emitido
  const [generatedReceipt, setGeneratedReceipt] = useState<PaymentMock | null>(null);

  const handleRegisterPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(payAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    const token = generateSecureReceiptToken();
    const nextSeq = payments.length + 43;
    const receiptNum = `${currentOtb?.code || 'OTB'}-2026-${String(nextSeq).padStart(5, '0')}`;

    const newPayment: PaymentMock = {
      id: `pay-${Date.now()}`,
      receiptNumber: receiptNum,
      neighborName,
      amount: amountNum,
      method: payMethod,
      concept: payConcept,
      date: new Date().toLocaleString('es-BO', { dateStyle: 'short', timeStyle: 'short' }),
      status: payMethod === 'Transferencia' ? 'PendingVerification' : 'Confirmed',
      token
    };

    setPayments([newPayment, ...payments]);
    setShowPayModal(false);
    setGeneratedReceipt(newPayment);

    // Encolar notificación en tiempo real
    addNotification({
      id: `notif-${Date.now()}`,
      recipient_user_id: 'user-neighbor',
      otb_id: currentOtb?.id || '',
      type: 'PAYMENT_CONFIRMED',
      category: 'Pagos',
      title: 'Pago Confirmado con Recibo QR',
      body: `Se emitió el recibo ${receiptNum} por ${formatBOB(amountNum)} a nombre de ${neighborName}.`,
      priority: 'normal',
      action_route: `/verificar-recibo?token=${token}&receipt=${receiptNum}`,
      created_at: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Tesorería & Gestión Financiera
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Control de cobranzas, amortización de deudas, emisión de recibos y arqueos.
          </p>
        </div>

        <button
          onClick={() => setShowPayModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Registrar Cobranza
        </button>
      </div>

      {/* Tabs con scroll horizontal en móvil */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto whitespace-nowrap pb-1">
        <button
          onClick={() => setActiveTab('pagos')}
          className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'pagos'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Historial de Pagos & Recibos
        </button>
        <button
          onClick={() => setActiveTab('cuotas')}
          className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'cuotas'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Tarifario de Cuotas Activas
        </button>
        <button
          onClick={() => setActiveTab('arqueo')}
          className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'arqueo'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Arqueo de Caja Central
        </button>
      </div>

      {/* TAB PAGOS */}
      {activeTab === 'pagos' && (
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-fintech overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5 font-bold">N° Recibo / Fecha</th>
                  <th className="px-5 py-3.5 font-bold">Vecino / Aportante</th>
                  <th className="px-5 py-3.5 font-bold">Concepto</th>
                  <th className="px-5 py-3.5 font-bold">Método</th>
                  <th className="px-5 py-3.5 font-bold">Estado</th>
                  <th className="px-5 py-3.5 font-bold text-right">Importe</th>
                  <th className="px-5 py-3.5 font-bold text-center">Validación QR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-bold font-mono text-slate-900">{p.receiptNumber}</p>
                      <p className="text-[10px] text-slate-400">{p.date}</p>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">
                      {p.neighborName}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {p.concept}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600">
                        {p.method === 'Efectivo' && <Banknote className="w-3.5 h-3.5 text-emerald-600" />}
                        {p.method === 'Transferencia' && <CreditCard className="w-3.5 h-3.5 text-blue-600" />}
                        {p.method === 'QR' && <QrCode className="w-3.5 h-3.5 text-purple-600" />}
                        {p.method}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {p.status === 'Confirmed' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Confirmado
                        </span>
                      )}
                      {p.status === 'PendingVerification' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          Verificación Pendiente
                        </span>
                      )}
                      {p.status === 'Reversed' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          Revertido
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-900">
                      {formatBOB(p.amount)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() =>
                          navigate(`/verificar-recibo?token=${p.token}&receipt=${p.receiptNumber}`)
                        }
                        title="Verificar Recibo Oficial QR"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        Ver QR
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CUOTAS */}
      {activeTab === 'cuotas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-fintech">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                Ordinaria
              </span>
              <span className="text-xs text-slate-400 font-mono">Vence: 30/11/2026</span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Cuota Ordinaria Noviembre 2026</h3>
            <p className="text-xs text-slate-500 mt-1">
              Fondo operativo para pago de alumbrado público, recojo de basura comunal y mantenimiento.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Monto asignado por vivienda:</span>
              <span className="text-lg font-extrabold font-mono text-slate-900">{formatBOB(25.00)}</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-fintech">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700">
                Aporte Especial
              </span>
              <span className="text-xs text-slate-400 font-mono">Vence: 15/12/2026</span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Aporte Pro-Tinglado (Cuota 1 de 2)</h3>
            <p className="text-xs text-slate-500 mt-1">
              Fondo exclusivo con destino a la compra de perfiles y tinglado de la cancha polifuncional.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Monto asignado por vivienda:</span>
              <span className="text-lg font-extrabold font-mono text-purple-700">{formatBOB(100.00)}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB ARQUEO */}
      {activeTab === 'arqueo' && (
        <div className="max-w-2xl p-6 rounded-2xl bg-white border border-slate-200/80 shadow-fintech space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Arqueo y Cierre Diario de Caja</h2>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50">
              <span className="text-slate-500">Saldo Inicial:</span>
              <p className="text-sm font-mono font-bold text-slate-800">{formatBOB(3500.00)}</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50">
              <span className="text-emerald-700">Ingresos del Día:</span>
              <p className="text-sm font-mono font-bold text-emerald-800">{formatBOB(750.00)}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Saldo Contable Esperado:</span>
            <span className="text-lg font-extrabold font-mono text-blue-600">{formatBOB(4250.00)}</span>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Arqueo cuadrado al 100%. Sin discrepancias entre conteo físico y sistema.</span>
          </div>
        </div>
      )}

      {/* Modal Cobro */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-sm font-bold text-slate-900">Registrar Cobranza & Emitir Recibo</h2>
              <p className="text-xs text-slate-500">Genera recibo oficial con token de validación QR.</p>
            </div>

            <form onSubmit={handleRegisterPayment} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Vecino / Aportante</label>
                <select
                  value={neighborName}
                  onChange={(e) => setNeighborName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Juan José Flores Morales">Juan José Flores Morales (Lote 12 - Deuda: Bs. 50)</option>
                  <option value="Silvia Rojas Torrico">Silvia Rojas Torrico (Lote 05 - Deuda: Bs. 125)</option>
                  <option value="Roberto Fernández Vargas">Roberto Fernández Vargas (Lote 01 - Al Día)</option>
                  <option value="Marina Condori Rocha">Marina Condori Rocha (Lote 08 - Al Día)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Concepto de Cobro</label>
                <input
                  type="text"
                  required
                  value={payConcept}
                  onChange={(e) => setPayConcept(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Monto (BOB / Bs.)</label>
                  <input
                    type="number"
                    step="0.50"
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full font-mono font-bold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Método de Cobro</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Efectivo">Efectivo en Caja</option>
                    <option value="QR">QR Simple (Bolivia)</option>
                    <option value="Transferencia">Transferencia Bancaria</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-3.5 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Confirmar & Emitir Recibo QR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Éxito Recibo Emitido */}
      {generatedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">¡Recibo Oficial Emitido!</h3>
              <p className="text-xs text-slate-500 mt-1">El cobro ha sido registrado e impactado en tesorería.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5 font-mono">
              <p className="text-slate-500">Recibo: <span className="font-bold text-slate-900">{generatedReceipt.receiptNumber}</span></p>
              <p className="text-slate-500">Vecino: <span className="font-bold text-slate-900">{generatedReceipt.neighborName}</span></p>
              <p className="text-slate-500">Monto: <span className="font-bold text-emerald-600 text-sm">{formatBOB(generatedReceipt.amount)}</span></p>
              <p className="text-slate-500">Método: <span className="text-slate-900">{generatedReceipt.method}</span></p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigate(`/verificar-recibo?token=${generatedReceipt.token}&receipt=${generatedReceipt.receiptNumber}`);
                  setGeneratedReceipt(null);
                }}
                className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
              >
                Abrir Verificación QR
              </button>
              <button
                onClick={() => setGeneratedReceipt(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
