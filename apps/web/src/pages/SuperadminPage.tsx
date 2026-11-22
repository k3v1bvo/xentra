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
  AlertTriangle,
  Edit,
  Trash2,
  Power,
  Phone,
  Image,
  Layers,
  Award,
  Check
} from 'lucide-react';
import { XentraLogo } from '../components/XentraLogo';
import { useTenantStore } from '../stores/tenantStore';
import { useAuthStore } from '../stores/authStore';
import { Otb } from '@xentra/shared';
import { TiltCard3D } from '../components/TiltCard3D';
import { BoliviaCoatOfArms } from '../components/BoliviaCoatOfArms';

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
  const { availableOtbs, currentOtb, setCurrentOtb, updateOtb, setAvailableOtbs } = useTenantStore();
  const { profile, currentRole, logout } = useAuthStore();

  // Control de Acceso Estricto Multi-Tenant: Solo el Superadministrador puede acceder
  React.useEffect(() => {
    if (currentRole !== 'superadmin') {
      alert('Acceso restringido: Solo el Superadministrador de la plataforma puede ver y gestionar todas las OTBs a nivel nacional.');
      navigate('/admin');
    }
  }, [currentRole, navigate]);

  if (currentRole !== 'superadmin') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-white">
        <div className="p-6 rounded-3xl bg-[#0B132B] border border-rose-500/50 text-center space-y-3 max-w-md">
          <p className="font-black text-rose-400 text-lg">Acceso Denegado</p>
          <p className="text-xs text-slate-300">
            Tu cuenta pertenece a una OTB específica. No tienes permisos de Superadministrador Nacional para ver datos de otras OTBs.
          </p>
        </div>
      </div>
    );
  }

  const [otbList, setOtbList] = useState(availableOtbs);
  const [requests, setRequests] = useState<OtbRequest[]>(INITIAL_REQUESTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('todos');

  // Modal Crear OTB
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCode, setNewCode] = useState('OTB-CBBA-004');
  const [newName, setNewName] = useState('');
  const [newDept, setNewDept] = useState('Cochabamba');
  const [newMuni, setNewMuni] = useState('Cochabamba (Cercado)');
  const [newZone, setNewZone] = useState('');
  const [newAddress, setNewAddress] = useState('Av. Principal #100');
  const [newLogoUrl, setNewLogoUrl] = useState('bolivia');
  const [newPresident, setNewPresident] = useState('');
  const [newTreasurer, setNewTreasurer] = useState('');
  const [newPhone, setNewPhone] = useState('71234567');

  // Modal Editar OTB (CRUD Update)
  const [editingOtb, setEditingOtb] = useState<any | null>(null);

  // Sincronizar cambios en otbList
  const syncOtbs = (updated: any[]) => {
    setOtbList(updated);
    setAvailableOtbs(updated);
  };

  const handleApproveRequest = (req: OtbRequest) => {
    const created: any = {
      id: `otb-${Date.now()}`,
      code: `OTB-${req.department.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      name: req.otbName,
      department: req.department,
      municipality: req.municipality,
      zone: req.zone,
      address: `Sede Comunal ${req.zone}`,
      logo_url: 'bolivia',
      currency: 'BOB',
      is_active: true,
      president_name: req.contactName,
      treasurer_name: 'Por Asignar en Asamblea',
      contact_phone: req.contactPhone,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const nextOtbs = [created, ...otbList];
    syncOtbs(nextOtbs);
    setRequests(requests.map((r) => (r.id === req.id ? { ...r, status: 'approved' } : r)));
    alert(`¡OTB "${req.otbName}" Aprobada y dada de alta! Código oficial: ${created.code}`);
  };

  const handleRejectRequest = (id: string) => {
    setRequests(requests.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r)));
  };

  // CREATE: Guardar Nueva OTB
  const handleCreateOtb = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCode) return;

    const created: any = {
      id: `otb-${Date.now()}`,
      code: newCode,
      name: newName,
      department: newDept,
      municipality: newMuni,
      zone: newZone || 'Distrito Central',
      address: newAddress,
      logo_url: newLogoUrl,
      currency: 'BOB',
      is_active: true,
      president_name: newPresident || 'Presidente Electo',
      treasurer_name: newTreasurer || 'Tesorero Electo',
      contact_phone: newPhone,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const nextList = [created, ...otbList];
    syncOtbs(nextList);
    setIsCreateModalOpen(false);
    setNewName('');
    setNewZone('');
    setNewPresident('');
    setNewTreasurer('');
    alert(`OTB "${created.name}" creada oficialmente en la red nacional de Xentra.`);
  };

  // UPDATE: Guardar Edición de OTB
  const handleSaveEditOtb = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOtb) return;

    updateOtb(editingOtb.id, {
      name: editingOtb.name,
      code: editingOtb.code,
      department: editingOtb.department,
      municipality: editingOtb.municipality,
      zone: editingOtb.zone,
      address: editingOtb.address,
      logo_url: editingOtb.logo_url,
      president_name: editingOtb.president_name,
      treasurer_name: editingOtb.treasurer_name,
      contact_phone: editingOtb.contact_phone,
      is_active: editingOtb.is_active
    });

    const updated = otbList.map((o) => (o.id === editingOtb.id ? { ...editingOtb } : o));
    syncOtbs(updated);
    setEditingOtb(null);
    alert('¡Datos de la OTB y Escudo Oficial actualizados con éxito!');
  };

  // DELETE / TOGGLE STATUS: Activar o Suspender OTB
  const handleToggleOtbStatus = (otb: any) => {
    const nextStatus = !otb.is_active;
    updateOtb(otb.id, { is_active: nextStatus });
    const updated = otbList.map((o) => (o.id === otb.id ? { ...o, is_active: nextStatus } : o));
    syncOtbs(updated);
    alert(`La OTB "${otb.name}" ahora está ${nextStatus ? 'ACTIVA' : 'PAUSADA / INACTIVA'}.`);
  };

  const handleDeleteOtb = (otb: any) => {
    if (confirm(`¿Estás seguro de eliminar la OTB "${otb.name}" (${otb.code}) del sistema nacional?`)) {
      const nextList = otbList.filter((o) => o.id !== otb.id);
      syncOtbs(nextList);
      alert(`OTB "${otb.name}" eliminada de la red.`);
    }
  };

  const handleEnterOtbAsAdmin = (otb: any) => {
    setCurrentOtb(otb);
    navigate('/admin');
  };

  const filteredOtbs = otbList.filter((o) => {
    const matchesSearch =
      o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept =
      selectedDeptFilter === 'todos' || o.department.toLowerCase() === selectedDeptFilter.toLowerCase();
    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Top Header */}
      <header className="px-4 sm:px-8 py-4 border-b border-slate-800 bg-[#0B132B]/90 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <XentraLogo size="md" variant="light" />
          <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Administración General de OTBs de Bolivia
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-900 border border-slate-700 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Portada</span>
          </button>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 space-y-8">
        {/* Banner de Control Nacional */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/80 via-[#0B132B] to-[#0B132B] border-2 border-purple-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Consola Exclusiva de Administración Central</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Gestión Integral de Organizaciones Territoriales de Base (OTBs)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Supervisión de personerías, personalización de escudos comunales, control de directivas y aislamiento
              seguro de libros contables para cada comunidad de Bolivia.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="h-12 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-purple-600/30 self-start sm:self-auto transition-all cursor-pointer flex-shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Crear Nueva OTB</span>
          </button>
        </div>

        {/* 1. Solicitudes Pendientes de Incorporación */}
        {requests.some((r) => r.status === 'pending') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Solicitudes de Incorporación Pendientes ({requests.filter((r) => r.status === 'pending').length})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className={`p-5 rounded-2xl border-2 ${
                    req.status === 'approved'
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : req.status === 'rejected'
                      ? 'bg-rose-950/20 border-rose-500/30 opacity-60'
                      : 'bg-[#0B132B]/90 border-slate-800'
                  } space-y-3 shadow-lg`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {req.department} • {req.municipality}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Recibido: {req.submittedAt}</span>
                  </div>

                  <div>
                    <h3 className="font-black text-white text-base">{req.otbName}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-purple-400" />
                      <span>{req.zone}</span>
                    </p>
                  </div>

                  <div className="p-3 bg-[#030712]/90 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                    <p><strong>Presidente / Contacto:</strong> {req.contactName}</p>
                    <p><strong>Celular Oficial:</strong> <span className="font-mono text-emerald-400 font-bold">{req.contactPhone}</span></p>
                  </div>

                  {req.status === 'pending' ? (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleApproveRequest(req)}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Aprobar y Crear OTB</span>
                      </button>
                      <button
                        onClick={() => handleRejectRequest(req.id)}
                        className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-800 font-bold text-xs flex items-center justify-center transition-all cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ) : req.status === 'approved' ? (
                    <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" />
                      <span>Solicitud Aprobada • OTB activa en el sistema</span>
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
        )}

        {/* 2. Directorio de OTBs Registradas (CRUD Completo) */}
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-400" />
                <span>Directorio Nacional de OTBs Registradas ({otbList.length})</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Edita nombres, escudos, sedes sociales y directivas oficiales.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              {/* Filtro por departamento */}
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="w-full sm:w-auto text-xs px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold cursor-pointer"
              >
                <option value="todos">Todos los Departamentos</option>
                <option value="cochabamba">Cochabamba</option>
                <option value="la paz">La Paz</option>
                <option value="santa cruz">Santa Cruz</option>
              </select>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-purple-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar OTB o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#020617] border-2 border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 font-semibold"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filteredOtbs.map((otb) => (
              <TiltCard3D key={otb.id}>
                <div className="p-6 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-5 shadow-2xl h-full">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black font-mono px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        {otb.code}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                        otb.is_active
                          ? 'text-emerald-300 bg-emerald-950/80 border-emerald-600'
                          : 'text-rose-300 bg-rose-950/80 border-rose-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${otb.is_active ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        {otb.is_active ? 'Activa' : 'Pausada'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                        <BoliviaCoatOfArms size={36} />
                      </div>
                      <div>
                        <h3 className="font-black text-white text-base">{otb.name}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-purple-400" />
                          <span>{otb.department} • {otb.municipality}</span>
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 bg-[#030712]/90 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
                      <p className="text-[11px] text-slate-400">
                        <strong className="text-slate-200">Sede Comunal:</strong> {otb.address || otb.zone}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        <strong className="text-slate-200">Presidente(a):</strong> {otb.president_name || 'Por Asignar'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        <strong className="text-slate-200">Tesorero(a):</strong> {otb.treasurer_name || 'Por Asignar'}
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        <span className="font-mono text-emerald-400 font-bold">{otb.contact_phone || '76543210'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingOtb({ ...otb })}
                        className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        title="Modificar nombre, escudo, sede y directiva"
                      >
                        <Edit className="w-3.5 h-3.5 text-purple-400" />
                        <span>Editar OTB</span>
                      </button>

                      <button
                        onClick={() => handleToggleOtbStatus(otb)}
                        className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          otb.is_active
                            ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30'
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        }`}
                        title={otb.is_active ? 'Pausar OTB' : 'Activar OTB'}
                      >
                        <Power className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteOtb(otb)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
                        title="Dar de baja OTB"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => handleEnterOtbAsAdmin(otb)}
                        className="py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-black text-white flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-purple-600/30 cursor-pointer"
                        title="Ingresar al panel administrativo de esta OTB"
                      >
                        <span>Panel OTB</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentOtb(otb);
                          navigate('/admin/vecinos');
                        }}
                        className="py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-black text-white flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
                        title="Abrir mapa satelital para trazar límites y manzanos de esta OTB"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Delimitar Mapa</span>
                      </button>
                    </div>
                  </div>
                </div>
              </TiltCard3D>
            ))}
          </div>
        </div>
      </main>

      {/* =================================================================== */}
      {/* MODAL EDITAR OTB (CRUD UPDATE)                                      */}
      {/* =================================================================== */}
      {editingOtb && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0B132B] border-2 border-slate-700 w-full max-w-xl rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <Edit className="w-5 h-5 text-purple-400" />
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    Editar Organización: {editingOtb.name}
                  </h3>
                  <p className="text-xs text-slate-400">Modificación institucional por Superadmin</p>
                </div>
              </div>
              <button
                onClick={() => setEditingOtb(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditOtb} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Nombre Oficial OTB:</label>
                  <input
                    type="text"
                    required
                    value={editingOtb.name}
                    onChange={(e) => setEditingOtb({ ...editingOtb, name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Código Único OTB:</label>
                  <input
                    type="text"
                    required
                    value={editingOtb.code}
                    onChange={(e) => setEditingOtb({ ...editingOtb, code: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Departamento:</label>
                  <select
                    value={editingOtb.department}
                    onChange={(e) => setEditingOtb({ ...editingOtb, department: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold"
                  >
                    {['Cochabamba', 'La Paz', 'Santa Cruz', 'Chuquisaca', 'Oruro', 'Potosí', 'Tarija', 'Beni', 'Pando'].map((d) => (
                      <option key={d} value={d} className="bg-slate-900 text-white">{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Municipio:</label>
                  <input
                    type="text"
                    required
                    value={editingOtb.municipality}
                    onChange={(e) => setEditingOtb({ ...editingOtb, municipality: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Zona / Distrito:</label>
                  <input
                    type="text"
                    value={editingOtb.zone}
                    onChange={(e) => setEditingOtb({ ...editingOtb, zone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Dirección Sede Social:</label>
                  <input
                    type="text"
                    value={editingOtb.address || ''}
                    onChange={(e) => setEditingOtb({ ...editingOtb, address: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Presidente(a) OTB:</label>
                  <input
                    type="text"
                    value={editingOtb.president_name || ''}
                    onChange={(e) => setEditingOtb({ ...editingOtb, president_name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Tesorero(a) OTB:</label>
                  <input
                    type="text"
                    value={editingOtb.treasurer_name || ''}
                    onChange={(e) => setEditingOtb({ ...editingOtb, treasurer_name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Celular de Contacto Oficial:</label>
                <input
                  type="text"
                  value={editingOtb.contact_phone || ''}
                  onChange={(e) => setEditingOtb({ ...editingOtb, contact_phone: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingOtb(null)}
                  className="h-11 px-5 rounded-xl text-slate-400 hover:text-white font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="h-11 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black shadow-lg shadow-purple-600/30"
                >
                  Guardar Cambios Institucionales
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL CREAR NUEVA OTB (CRUD CREATE)                                 */}
      {/* =================================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0B132B] border-2 border-slate-700 w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base sm:text-lg font-black text-white">Registrar Nueva OTB en la Red</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOtb} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Código Único OTB:</label>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Nombre Oficial:</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. OTB Valle Hermoso"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Departamento:</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold"
                  >
                    {['Cochabamba', 'La Paz', 'Santa Cruz', 'Chuquisaca', 'Oruro', 'Potosí', 'Tarija', 'Beni', 'Pando'].map((d) => (
                      <option key={d} value={d} className="bg-slate-900 text-white">{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Municipio:</label>
                  <input
                    type="text"
                    required
                    value={newMuni}
                    onChange={(e) => setNewMuni(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Zona / Distrito:</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Distrito 6 - Tamborada"
                  value={newZone}
                  onChange={(e) => setNewZone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Presidente(a):</label>
                  <input
                    type="text"
                    placeholder="ej. Juan Carlos López"
                    value={newPresident}
                    onChange={(e) => setNewPresident(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Tesorero(a):</label>
                  <input
                    type="text"
                    placeholder="ej. María Eugenia Rocha"
                    value={newTreasurer}
                    onChange={(e) => setNewTreasurer(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="h-11 px-5 rounded-xl text-slate-400 hover:text-white font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="h-11 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black shadow-lg shadow-purple-600/30"
                >
                  Crear OTB Oficial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
