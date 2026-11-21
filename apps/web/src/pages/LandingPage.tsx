import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  ShieldCheck,
  QrCode,
  ArrowRight,
  Home,
  CheckCircle2,
  FileCheck,
  Send,
  X,
  CreditCard,
  Lock,
  ChevronRight
} from 'lucide-react';
import { XentraLogo } from '../components/XentraLogo';
import { useAuthStore } from '../stores/authStore';
import { useTenantStore } from '../stores/tenantStore';
import { AppRole } from '@xentra/shared';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setProfile, setCurrentRole } = useAuthStore();
  const { availableOtbs, setCurrentOtb } = useTenantStore();

  // Estados para acceso de vecino
  const [selectedOtbId, setSelectedOtbId] = useState(availableOtbs[0]?.id || '');
  const [neighborCode, setNeighborCode] = useState('Lote 12');

  // Modal para solicitar nueva OTB
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [otbName, setOtbName] = useState('');
  const [department, setDepartment] = useState('Cochabamba');
  const [municipality, setMunicipality] = useState('');
  const [zone, setZone] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Acceso Vecino Rápido
  const handleNeighborAccess = (e: React.FormEvent) => {
    e.preventDefault();
    const otb = availableOtbs.find((o) => o.id === selectedOtbId) || availableOtbs[0];
    setCurrentOtb(otb);
    setUser({ id: 'dddddddd-dddd-dddd-dddd-dddddddddddd', email: 'juan.vecino@xentra.app' });
    setProfile({
      id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
      first_name: 'Juan José',
      last_name: 'Flores Morales',
      ci_number: '7412589',
      ci_extension: 'CBBA',
      phone: '74567890',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    setCurrentRole('vecino');
    navigate('/vecino');
  };

  // Acceso Directiva OTB
  const handleBoardAccess = (role: AppRole = 'tesorero') => {
    const otb = availableOtbs.find((o) => o.id === selectedOtbId) || availableOtbs[0];
    setCurrentOtb(otb);
    if (role === 'presidente') {
      setUser({ id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', email: 'roberto.presidencia@xentra.app' });
      setProfile({
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        first_name: 'Roberto',
        last_name: 'Fernández Vargas',
        ci_number: '5289341',
        ci_extension: 'CBBA',
        phone: '72345678',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      setCurrentRole('presidente');
    } else {
      setUser({ id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', email: 'marina.tesoreria@xentra.app' });
      setProfile({
        id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        first_name: 'Marina',
        last_name: 'Condori Rocha',
        ci_number: '6398412',
        ci_extension: 'CBBA',
        phone: '73456789',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      setCurrentRole('tesorero');
    }
    navigate('/admin');
  };

  // Acceso Superadmin
  const handleSuperadminAccess = () => {
    setUser({ id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', email: 'carlos.admin@xentra.app' });
    setProfile({
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      first_name: 'Carlos',
      last_name: 'Mamani Quispe',
      ci_number: '4589210',
      ci_extension: 'CBBA',
      phone: '71234567',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    setCurrentRole('superadmin');
    navigate('/superadmin');
  };

  // Enviar solicitud de OTB
  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSent(true);
    setTimeout(() => {
      setIsRequestModalOpen(false);
      setRequestSent(false);
      alert('¡Solicitud enviada con éxito! La directiva y el Superadministrador revisarán los antecedentes de su OTB.');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="px-4 sm:px-8 py-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between">
        <XentraLogo size="md" />

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => navigate('/verificar-recibo')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors"
          >
            <QrCode className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Verificar Recibo QR</span>
            <span className="sm:hidden">Verificar QR</span>
          </button>

          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 transition-all"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Iniciar Sesión</span>
          </button>
        </div>
      </header>

      {/* Main Content Hero */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        {/* Banner Central */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <span>🇧🇴 Plataforma Financiera Comunitaria para Bolivia</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Tu comunidad, <span className="text-blue-500">en orden.</span><br />
            Tu gestión, <span className="text-emerald-400">transparente.</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            Digitalización de cuotas, cobros por QR, rendición de cuentas, trazabilidad contable y participación democrática para las OTB de Bolivia.
          </p>
        </div>

        {/* 3 Opciones de Acceso */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Portal del Vecino */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 shadow-2xl flex flex-col justify-between hover:border-blue-500/50 transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Acceso Rápido</span>
                <h2 className="text-lg font-bold text-white">Portal del Vecino</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Consulta tus cuotas pendientes, paga por QR y descarga tus recibos oficiales.
                </p>
              </div>

              <form onSubmit={handleNeighborAccess} className="space-y-3 pt-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Tu OTB:</label>
                  <select
                    value={selectedOtbId}
                    onChange={(e) => setSelectedOtbId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {availableOtbs.map((otb) => (
                      <option key={otb.id} value={otb.id}>
                        {otb.name} ({otb.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Lote / Vivienda o C.I.:</label>
                  <input
                    type="text"
                    required
                    value={neighborCode}
                    onChange={(e) => setNeighborCode(e.target.value)}
                    placeholder="ej. Lote 12 o 7412589"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all"
                >
                  <span>Consultar Mi Cuenta</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
            <p className="text-[10px] text-slate-500 mt-4 text-center">
              Accede sin contraseña con tu código de lote censado.
            </p>
          </div>

          {/* Card 2: Directiva de la OTB */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 shadow-2xl flex flex-col justify-between hover:border-emerald-500/50 transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Gestión OTB</span>
                <h2 className="text-lg font-bold text-white">Directiva de la OTB</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Panel de control de tu OTB para cobranzas, tesorería, libros contables y asambleas.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleBoardAccess('tesorero')}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 text-left flex items-center justify-between text-xs text-white transition-all group"
                >
                  <div>
                    <span className="font-bold block text-emerald-400">Entrar como Tesorero</span>
                    <span className="text-[10px] text-slate-400">Caja, cobros y comprobantes</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                </button>

                <button
                  onClick={() => handleBoardAccess('presidente')}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-blue-500 text-left flex items-center justify-between text-xs text-white transition-all group"
                >
                  <div>
                    <span className="font-bold block text-blue-400">Entrar como Presidente</span>
                    <span className="text-[10px] text-slate-400">Proyectos, consultas y TRACE</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/60 mt-4 text-center">
              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="text-xs font-semibold text-emerald-400 hover:underline flex items-center justify-center gap-1 mx-auto"
              >
                <span>¿Tu OTB aún no está registrada? Solicitar aquí</span>
              </button>
            </div>
          </div>

          {/* Card 3: Superadministrador Global */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 shadow-2xl flex flex-col justify-between hover:border-purple-500/50 transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Control Nacional</span>
                <h2 className="text-lg font-bold text-white">Superadministrador</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Administración global de organizaciones territoriales, aprobación de solicitudes y auditoría.
                </p>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 text-xs space-y-1.5 text-slate-400">
                <div className="flex items-center justify-between text-[11px]">
                  <span>OTBs en Red:</span>
                  <strong className="text-white">3 activas</strong>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Departamentos:</span>
                  <strong className="text-white">Cochabamba, La Paz, Santa Cruz</strong>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Moneda Base:</span>
                  <strong className="text-white">Bolivianos (BOB / Bs.)</strong>
                </div>
              </div>

              <button
                onClick={handleSuperadminAccess}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-purple-600/30 transition-all"
              >
                <span>Acceder al Panel Global</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[10px] text-slate-500 mt-4 text-center">
              Acceso restringido con privilegios a nivel de servidor.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 sm:px-8 py-4 border-t border-slate-800 text-center text-xs text-slate-500 bg-slate-950">
        <p>© 2026 XENTRA OTB — Plataforma Financiera Comunitaria para Bolivia. Todos los derechos reservados.</p>
      </footer>

      {/* Modal: Solicitar Nueva OTB */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setIsRequestModalOpen(false)}
              className="absolute right-5 top-5 p-1 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-white">Solicitud de Incorporación de OTB</h3>
              <p className="text-xs text-slate-400 mt-1">
                Completa los datos de tu comunidad. La directiva o el Superadministrador validarán la solicitud.
              </p>
            </div>

            <form onSubmit={handleSendRequest} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Nombre Oficial de la OTB / Barrio:</label>
                <input
                  type="text"
                  required
                  placeholder="ej. OTB San Pedro Central"
                  value={otbName}
                  onChange={(e) => setOtbName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Departamento:</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {['Cochabamba', 'La Paz', 'Santa Cruz', 'Chuquisaca', 'Oruro', 'Potosí', 'Tarija', 'Beni', 'Pando'].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Municipio:</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Cercado / Quillacollo"
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Zona / Distrito:</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Distrito 4 - Zona Noroeste"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Nombre Solicitante / Presidente:</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Mario Gutiérrez"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Teléfono / WhatsApp Celular:</label>
                  <input
                    type="tel"
                    required
                    placeholder="ej. 76543210"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={requestSent}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all mt-4"
              >
                <Send className="w-4 h-4" />
                <span>{requestSent ? 'Enviando Solicitud...' : 'Enviar Solicitud al Superadministrador'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
