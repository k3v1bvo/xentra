import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  Users,
  CheckCircle,
  XCircle,
  Plus,
  ArrowLeft,
  Search,
  ExternalLink,
  MapPin,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { XentraLogo } from '../components/XentraLogo';
import { useTenantStore } from '../stores/tenantStore';
import { useAuthStore } from '../stores/authStore';
import { Otb } from '@xentra/shared';

interface OtbRequest {
  id: string;
  otbName: string;
  department: string;
  municipality: string;
  zone: string;
  contactName: string;
  contactPhone: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const INITIAL_REQUESTS: OtbRequest[] = [
  {
    id: 'req-01',
    otbName: 'OTB Alto Mirador',
    department: 'Cochabamba',
    municipality: 'Cercado',
    zone: 'Distrito 9 - Pucara',
    contactName: 'Víctor Hugo Claros',
    contactPhone: '71458920',
    submittedAt: '21/11/2026',
    status: 'pending'
  },
  {
    id: 'req-02',
    otbName: 'Barrio Lindo Plan 4000',
    department: 'Santa Cruz',
    municipality: 'Santa Cruz de la Sierra',
    zone: 'Villa 1ro de Mayo',
    contactName: 'Carmen Rosa Salvatierra',
    contactPhone: '76891234',
    submittedAt: '20/11/2026',
    status: 'pending'
  }
];

export const SuperadminPage: React.FC = () => {
  const navigate = useNavigate();
  const { availableOtbs, setCurrentOtb } = useTenantStore();
  const { profile, logout } = useAuthStore();

  const [otbList, setOtbList] = useState<Otb[]>(availableOtbs);
  const [requests, setRequests] = useState<OtbRequest[]>(INITIAL_REQUESTS);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal para crear OTB directamente
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCode, setNewCode] = useState('OTB-CBBA-004');
  const [newName, setNewName] = useState('');
  const [newDept, setNewDept] = useState('Cochabamba');
  const [newMuni, setNewMuni] = useState('');
  const [newZone, setNewZone] = useState('');

  const handleApproveRequest = (req: OtbRequest) => {
    // 1. Crear OTB
    const created: Otb = {
      id: `otb-${Date.now()}`,
      code: `OTB-${req.department.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      name: req.otbName,
      department: req.department,
      municipality: req.municipality,
      zone: req.zone,
      currency: 'BOB',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setOtbList([created, ...otbList]);
    setRequests(requests.map((r) => (r.id === req.id ? { ...r, status: 'approved' } : r)));
    alert(`¡OTB "${req.otbName}" Aprobada y Creada con éxito! Código asignado: ${created.code}`);
  };

  const handleRejectRequest = (id: string) => {
    setRequests(requests.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r)));
  };

  const handleCreateOtb = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Otb = {
      id: `otb-${Date.now()}`,
      code: newCode,
      name: newName,
      department: newDept,
      municipality: newMuni,
      zone: newZone,
      currency: 'BOB',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setOtbList([created, ...otbList]);
    setIsCreateModalOpen(false);
    setNewName('');
    setNewMuni('');
    setNewZone('');
    alert(`OTB "${created.name}" creada en la red nacional de Xentra.`);
  };

  const handleEnterOtbAsAdmin = (otb: Otb) => {
    setCurrentOtb(otb);
    navigate('/admin');
  };

  const filteredOtbs = otbList.filter(
    (o) =>
      o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Top Header */}
      <header className="px-4 sm:px-8 py-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <XentraLogo size="md" />
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Consola Superadmin Global
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Inicio</span>
          </button>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 space-y-8">
        {/* Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/80 via-slate-900 to-slate-900 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Administración Nacional Multi-Tenant</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              Control Global de Organizaciones Territoriales de Base
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Supervisa las OTBs activas en Bolivia, evalúa solicitudes de incorporación y asigna códigos institucionales.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/30 self-start sm:self-auto transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Nueva OTB</span>
          </button>
        </div>

        {/* 1. Solicitudes Pendientes de Incorporación */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Solicitudes de Incorporación Pendientes ({requests.filter(r => r.status === 'pending').length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className={`p-5 rounded-2xl border ${
                  req.status === 'approved'
                    ? 'bg-emerald-950/30 border-emerald-500/30'
                    : req.status === 'rejected'
                    ? 'bg-rose-950/20 border-rose-500/30 opacity-60'
                    : 'bg-slate-900 border-slate-800'
                } space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-purple-400">
                    {req.department} • {req.municipality}
                  </span>
                  <span className="text-[10px] text-slate-400">Recibido: {req.submittedAt}</span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-sm">{req.otbName}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{req.zone}</span>
                  </p>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-slate-300 space-y-1">
                  <p><strong>Presidente / Contacto:</strong> {req.contactName}</p>
                  <p><strong>Teléfono / Celular:</strong> <span className="font-mono text-emerald-400">{req.contactPhone}</span></p>
                </div>

                {req.status === 'pending' ? (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleApproveRequest(req)}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Aprobar y Crear OTB</span>
                    </button>
                    <button
                      onClick={() => handleRejectRequest(req.id)}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 font-bold text-xs flex items-center justify-center transition-all"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : req.status === 'approved' ? (
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    <span>Solicitud Aprobada • OTB dada de alta en el sistema</span>
                  </div>
                ) : (
                  <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" />
                    <span>Solicitud Rechazada</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 2. Directorio de OTBs Registradas */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-400" />
              <span>Organizaciones Territoriales de Base Activas ({otbList.length})</span>
            </h2>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-purple-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar OTB o departamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#020617] border-2 border-slate-600 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredOtbs.map((otb) => (
              <div
                key={otb.id}
                className="p-5 rounded-2xl bg-[#0F172A] border-2 border-slate-700/80 hover:border-purple-500/60 transition-all flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded bg-purple-500/25 text-purple-300 border border-purple-500/40">
                      {otb.code}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Activa
                    </span>
                  </div>

                  <h3 className="font-extrabold text-white text-base">{otb.name}</h3>

                  <div className="text-xs text-slate-300 space-y-1">
                    <p className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                      <span>{otb.department} • {otb.municipality}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 pl-5">{otb.zone}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleEnterOtbAsAdmin(otb)}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-black text-white flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-600/30 cursor-pointer"
                >
                  <span>Ingresar a Administrar</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal: Crear Nueva OTB Directamente */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute right-5 top-5 p-1 text-slate-400 hover:text-white rounded-lg"
            >
              ✕
            </button>

            <div>
              <h3 className="text-lg font-bold text-white">Registrar Nueva OTB en la Red</h3>
              <p className="text-xs text-slate-400 mt-1">
                Crea una organización institucional directamente en el sistema multi-tenant.
              </p>
            </div>

            <form onSubmit={handleCreateOtb} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Código Único OTB:</label>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full bg-[#020617] border-2 border-slate-500 rounded-xl px-3 py-2 text-white font-mono font-medium focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Nombre Oficial:</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. OTB Valle Hermoso"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-[#020617] border-2 border-slate-500 rounded-xl px-3 py-2 text-white placeholder-slate-400 font-medium focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Departamento:</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full bg-[#020617] border-2 border-slate-500 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-purple-400 cursor-pointer"
                  >
                    {['Cochabamba', 'La Paz', 'Santa Cruz', 'Chuquisaca', 'Oruro', 'Potosí', 'Tarija', 'Beni', 'Pando'].map((d) => (
                      <option key={d} value={d} className="bg-slate-900 text-white">{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Municipio:</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Cercado"
                    value={newMuni}
                    onChange={(e) => setNewMuni(e.target.value)}
                    className="w-full bg-[#020617] border-2 border-slate-500 rounded-xl px-3 py-2 text-white placeholder-slate-400 font-medium focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">Zona / Distrito:</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Distrito 6 - Tamborada"
                  value={newZone}
                  onChange={(e) => setNewZone(e.target.value)}
                  className="w-full bg-[#020617] border-2 border-slate-500 rounded-xl px-3 py-2 text-white placeholder-slate-400 font-medium focus:outline-none focus:border-purple-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-purple-600/30 transition-all mt-4 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Crear OTB Oficial</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
