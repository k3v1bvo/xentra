import React, { useState } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Home,
  CheckCircle2,
  AlertCircle,
  Phone,
  FileCheck,
  Printer,
  FileText,
  QrCode,
  ShieldCheck,
  MapPin,
  Map,
  Compass,
  Navigation,
  ChevronDown,
  ChevronUp,
  Edit3,
  Trash2,
  X,
  Check,
  AlertTriangle
} from 'lucide-react';
import { formatBOB } from '@xentra/shared';
import { TiltCard3D } from '../components/TiltCard3D';
import { PrintableStatementModal, StatementData } from '../components/PrintableStatementModal';
import { CommunityInteractiveMap } from '../components/CommunityInteractiveMap';
import { useTenantStore } from '../stores/tenantStore';
import { useAuthStore } from '../stores/authStore';

interface NeighborMock {
  id: string;
  otbId?: string;
  socioCode: string;
  name: string;
  ci: string;
  phone: string;
  block: string;
  house: string;
  status: 'Al Día' | 'En Mora';
  debt: number;
  latitude: number;
  longitude: number;
}

const INITIAL_NEIGHBORS: NeighborMock[] = [
  {
    id: '1',
    otbId: '11111111-1111-1111-1111-111111111111',
    socioCode: 'SOC-012',
    name: 'Juan José Flores Morales',
    ci: '7412589 CBBA',
    phone: '74567890',
    block: 'Manzana A',
    house: 'Lote 12',
    status: 'En Mora',
    debt: 50.00,
    latitude: -17.4128,
    longitude: -66.1648
  },
  {
    id: '2',
    otbId: '11111111-1111-1111-1111-111111111111',
    socioCode: 'SOC-005',
    name: 'Silvia Rojas Torrico',
    ci: '8521479 CBBA',
    phone: '75678901',
    block: 'Manzana B',
    house: 'Lote 05',
    status: 'En Mora',
    debt: 125.00,
    latitude: -17.4138,
    longitude: -66.1659
  },
  {
    id: '3',
    otbId: '11111111-1111-1111-1111-111111111111',
    socioCode: 'SOC-001',
    name: 'Roberto Fernández Vargas',
    ci: '5289341 CBBA',
    phone: '72345678',
    block: 'Manzana A',
    house: 'Lote 01',
    status: 'Al Día',
    debt: 0.00,
    latitude: -17.4122,
    longitude: -66.1642
  },
  {
    id: '4',
    otbId: '11111111-1111-1111-1111-111111111111',
    socioCode: 'SOC-008',
    name: 'Marina Condori Rocha',
    ci: '6398412 CBBA',
    phone: '73456789',
    block: 'Manzana C',
    house: 'Lote 08',
    status: 'Al Día',
    debt: 0.00,
    latitude: -17.4145,
    longitude: -66.1662
  },
  {
    id: '5',
    otbId: '11111111-1111-1111-1111-111111111111',
    socioCode: 'SOC-014',
    name: 'Pedro Gonzalo Canaviri',
    ci: '4896325 CBBA',
    phone: '78912345',
    block: 'Manzana B',
    house: 'Lote 14',
    status: 'Al Día',
    debt: 0.00,
    latitude: -17.4140,
    longitude: -66.1651
  },
  // Vecinos OTB Los Pinos (La Paz)
  {
    id: 'lpz-1',
    otbId: '22222222-2222-2222-2222-222222222222',
    socioCode: 'SOC-LPZ-004',
    name: 'Gonzalo Apaza Quispe',
    ci: '4821903 LPZ',
    phone: '71542890',
    block: 'Sector 2',
    house: 'Vivienda 14',
    status: 'Al Día',
    debt: 0.00,
    latitude: -16.5385,
    longitude: -68.0820
  },
  {
    id: 'lpz-2',
    otbId: '22222222-2222-2222-2222-222222222222',
    socioCode: 'SOC-LPZ-009',
    name: 'Beatriz Mamani Laura',
    ci: '5923180 LPZ',
    phone: '72590123',
    block: 'Sector 1',
    house: 'Vivienda 08',
    status: 'En Mora',
    debt: 35.00,
    latitude: -16.5390,
    longitude: -68.0815
  },
  // Vecinos OTB Barrio Lindo (Santa Cruz)
  {
    id: 'scz-1',
    otbId: '33333333-3333-3333-3333-333333333333',
    socioCode: 'SOC-SCZ-010',
    name: 'Wilder Peña Justiniano',
    ci: '6128490 SCZ',
    phone: '78512490',
    block: 'UV 45',
    house: 'Mz 12, Lote 03',
    status: 'Al Día',
    debt: 0.00,
    latitude: -17.7845,
    longitude: -63.1610
  },
  {
    id: 'scz-2',
    otbId: '33333333-3333-3333-3333-333333333333',
    socioCode: 'SOC-SCZ-018',
    name: 'Carla Melgar Aguilera',
    ci: '7392104 SCZ',
    phone: '76319842',
    block: 'UV 45',
    house: 'Mz 12, Lote 09',
    status: 'En Mora',
    debt: 30.00,
    latitude: -17.7850,
    longitude: -63.1605
  }
];

export const VecinosPage: React.FC = () => {
  const { currentRole } = useAuthStore();
  const { currentOtb } = useTenantStore();
  const isSuperadmin = currentRole === 'superadmin';
  const currentOtbId = currentOtb?.id || '11111111-1111-1111-1111-111111111111';

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showMapSection, setShowMapSection] = useState(true);
  const [neighbors, setNeighbors] = useState(INITIAL_NEIGHBORS);

  // Filtrado Estricto por OTB (solo superadmin ve todas las OTBs de Bolivia)
  const visibleNeighbors = isSuperadmin
    ? neighbors
    : neighbors.filter((n) => n.otbId === currentOtbId);

  // Vecino seleccionado para enfocar su casa en el mapa
  const [focusedNeighbor, setFocusedNeighbor] = useState<NeighborMock | null>(
    visibleNeighbors[0] || null
  );

  // Sincronizar vecino enfocado al cambiar de OTB
  React.useEffect(() => {
    if (visibleNeighbors.length > 0 && (!focusedNeighbor || !visibleNeighbors.some((n) => n.id === focusedNeighbor.id))) {
      setFocusedNeighbor(visibleNeighbors[0]);
    }
  }, [currentOtbId, visibleNeighbors, focusedNeighbor]);

  // Estado para la Ficha Oficial Imprimible
  const [selectedStatement, setSelectedStatement] = useState<StatementData | null>(null);
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);

  // Formulario nuevo vecino
  const [newName, setNewName] = useState('');
  const [newCi, setNewCi] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newBlock, setNewBlock] = useState('Manzana A');
  const [newHouse, setNewHouse] = useState('');
  const [newLat, setNewLat] = useState(-17.4132);
  const [newLng, setNewLng] = useState(-66.1654);

  // Estados para CRUD - Edición de Vecino (Update)
  const [editingNeighbor, setEditingNeighbor] = useState<NeighborMock | null>(null);
  const [editName, setEditName] = useState('');
  const [editCi, setEditCi] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editBlock, setEditBlock] = useState('Manzana A');
  const [editHouse, setEditHouse] = useState('');
  const [editStatus, setEditStatus] = useState<'Al Día' | 'En Mora'>('Al Día');
  const [editDebt, setEditDebt] = useState('0.00');
  const [editLat, setEditLat] = useState(-17.4132);
  const [editLng, setEditLng] = useState(-66.1654);

  // Estados para CRUD - Dar de Baja / Eliminar Vecino (Delete)
  const [deletingNeighbor, setDeletingNeighbor] = useState<NeighborMock | null>(null);

  const filtered = visibleNeighbors.filter(
    (n) =>
      n.socioCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.ci.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.house.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFocusNeighborOnMap = (vecino: NeighborMock) => {
    setFocusedNeighbor(vecino);
    setShowMapSection(true);
    // Scroll suave hacia el mapa si está en móvil
    const mapElement = document.getElementById('mapa-catastral-vecinal');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleOpenStatement = (vecino: NeighborMock) => {
    const isAlDia = vecino.debt === 0;
    const otbName = currentOtb?.name || 'OTB Villa Esperanza';
    const otbCode = currentOtb?.code || 'OTB-CBBA-001';
    const dept = currentOtb?.department || 'Cochabamba';
    const muni = currentOtb?.municipality || 'Cochabamba (Cercado)';
    const zone = currentOtb?.zone || 'Distrito 4 - Noroeste';

    const statement: StatementData = {
      otbName,
      otbCode,
      department: dept,
      municipality: muni,
      zone,
      socioCode: vecino.socioCode,
      socioName: vecino.name,
      ciNumber: vecino.ci,
      block: vecino.block,
      lot: vecino.house,
      phone: vecino.phone,
      totalAssigned: isAlDia ? 125 : 125 + vecino.debt,
      totalPaid: isAlDia ? 125 : 125,
      totalDebt: vecino.debt,
      lastReceiptNumber: `${otbCode}-2026-${vecino.socioCode.replace('SOC-', '000')}`,
      tokenHash: `b8192a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90123456789abcdef${vecino.socioCode.slice(-3)}`,
      fees: [
        {
          period: 'Nov 2026',
          concept: 'Cuota Ordinaria Noviembre 2026',
          assigned: 25.0,
          paid: isAlDia ? 25.0 : (vecino.debt >= 25 ? 0 : 25),
          balance: isAlDia ? 0 : Math.min(vecino.debt, 25),
          status: isAlDia || vecino.debt < 25 ? 'Pagado' : 'Pendiente'
        },
        {
          period: 'Nov 2026',
          concept: 'Aporte Pro-Tinglado Cancha (Cuota 1)',
          assigned: 100.0,
          paid: isAlDia ? 100.0 : (vecino.debt > 25 ? 100 - (vecino.debt - 25) : 100),
          balance: isAlDia ? 0 : Math.max(0, vecino.debt - 25),
          status: isAlDia ? 'Pagado' : (vecino.debt > 25 ? 'Pendiente' : 'Pagado')
        }
      ]
    };

    setSelectedStatement(statement);
    setIsStatementModalOpen(true);
  };

  const handleCreateNeighbor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCi) return;

    const created: NeighborMock = {
      id: Date.now().toString(),
      otbId: currentOtbId,
      socioCode: `SOC-${Math.floor(100 + Math.random() * 900)}`,
      name: newName,
      ci: newCi,
      phone: newPhone || 'Sin teléfono',
      block: newBlock,
      house: newHouse || 'Lote sin número',
      status: 'Al Día',
      debt: 0.00,
      latitude: newLat,
      longitude: newLng
    };

    setNeighbors([created, ...neighbors]);
    setFocusedNeighbor(created);
    setShowModal(false);
    setNewName('');
    setNewCi('');
    setNewPhone('');
    setNewHouse('');
  };

  // CRUD - Iniciar Edición
  const handleStartEdit = (vecino: NeighborMock) => {
    setEditingNeighbor(vecino);
    setEditName(vecino.name);
    setEditCi(vecino.ci);
    setEditPhone(vecino.phone);
    setEditBlock(vecino.block);
    setEditHouse(vecino.house);
    setEditStatus(vecino.status);
    setEditDebt(vecino.debt.toString());
    setEditLat(vecino.latitude);
    setEditLng(vecino.longitude);
  };

  // CRUD - Guardar Edición (Update)
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNeighbor || !editName.trim() || !editCi.trim()) return;

    const parsedDebt = parseFloat(editDebt) || 0;
    const updatedStatus = parsedDebt > 0 ? 'En Mora' : editStatus;

    const updatedList = neighbors.map((n) => {
      if (n.id !== editingNeighbor.id) return n;
      return {
        ...n,
        name: editName.trim(),
        ci: editCi.trim(),
        phone: editPhone.trim() || 'Sin teléfono',
        block: editBlock.trim(),
        house: editHouse.trim() || 'Lote sin número',
        status: updatedStatus,
        debt: parsedDebt,
        latitude: editLat,
        longitude: editLng
      };
    });

    setNeighbors(updatedList);
    if (focusedNeighbor?.id === editingNeighbor.id) {
      const updatedFocused = updatedList.find((n) => n.id === editingNeighbor.id) || null;
      setFocusedNeighbor(updatedFocused);
    }
    setEditingNeighbor(null);
  };

  // CRUD - Confirmar Baja / Eliminación (Delete)
  const handleConfirmDelete = () => {
    if (!deletingNeighbor) return;
    const remaining = neighbors.filter((n) => n.id !== deletingNeighbor.id);
    setNeighbors(remaining);
    if (focusedNeighbor?.id === deletingNeighbor.id) {
      setFocusedNeighbor(remaining[0] || null);
    }
    setDeletingNeighbor(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-white">
      {/* Estilos para impresión limpia del Padrón */}
      <style>{`
        @media print {
          body, html {
            background: #FFFFFF !important;
            color: #000000 !important;
          }
          nav, aside, header, .no-print-action, button, #mapa-catastral-vecinal {
            display: none !important;
          }
          table {
            color: #000000 !important;
            background: #FFFFFF !important;
            width: 100% !important;
          }
          thead {
            background: #F1F5F9 !important;
          }
          th, td {
            color: #000000 !important;
            border-bottom: 1px solid #CBD5E1 !important;
            padding: 6px 8px !important;
          }
          @page {
            size: portrait letter;
            margin: 8mm 10mm;
          }
        }
      `}</style>

      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Padrón de Vecinos & Mapa Catastral
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Censo Oficial OTB
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <p className="text-xs sm:text-sm text-slate-400">
              Registro de socios, localización de viviendas en el mapa comunal y estado de solvencia.
            </p>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300">
              <span>Jurisdicción:</span>
              <strong className="text-white">{currentOtb?.name || 'OTB Villa Esperanza'}</strong>
              <span className="font-mono text-[10px] text-blue-400">({currentOtb?.code || 'OTB-CBBA-001'})</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMapSection(!showMapSection)}
            className="h-12 px-4 rounded-2xl text-xs sm:text-sm font-black text-slate-300 bg-[#0B132B]/90 border border-slate-700 hover:border-blue-500 hover:text-white shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Map className="w-4 h-4 text-blue-400" />
            <span>{showMapSection ? 'Ocultar Mapa' : 'Ver Mapa Catastral'}</span>
            {showMapSection ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => window.print()}
            className="h-12 px-4 rounded-2xl text-xs sm:text-sm font-black text-slate-300 bg-[#0B132B]/90 border border-slate-700 hover:border-slate-500 hover:text-white shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Imprimir Padrón</span>
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="h-12 px-6 rounded-2xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2.5 cursor-pointer"
          >
            <UserPlus className="w-5 h-5" />
            <span>Registrar Nuevo Vecino</span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* SECCIÓN DEL MAPA CATASTRAL VECINAL DE LA OTB (SOLICITADO)           */}
      {/* =================================================================== */}
      {showMapSection && (
        <div id="mapa-catastral-vecinal">
          <TiltCard3D>
            <div className="p-5 sm:p-6 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-black text-white">
                      Plano Georreferenciado — {currentOtb?.name || 'OTB Villa Esperanza'}
                    </h2>
                    <p className="text-xs text-slate-400">
                      Ubica la casa de cada vecino en {currentOtb?.zone || 'la OTB'}. Haz clic en "Ubicar en Mapa" en cualquier fila para enfocarla.
                    </p>
                  </div>
                </div>

                {focusedNeighbor && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 self-start sm:self-auto">
                    <Home className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-purple-300">
                      Casa Enfocada: {focusedNeighbor.name} ({focusedNeighbor.block}, {focusedNeighbor.house})
                    </span>
                  </div>
                )}
              </div>

              {/* Mapa Interactivo con Límites, Manzanos y pines de las casas con Modo Editor Admin */}
              <CommunityInteractiveMap
                centerLat={focusedNeighbor ? focusedNeighbor.latitude : -17.41325}
                centerLng={focusedNeighbor ? focusedNeighbor.longitude : -66.16543}
                zoom={17}
                heightClass="h-96 sm:h-[480px]"
                otbName={currentOtb?.name || 'OTB Villa Esperanza'}
                otbId={currentOtb?.id || '11111111-1111-1111-1111-111111111111'}
                selectedLotName={focusedNeighbor ? `${focusedNeighbor.name} — ${focusedNeighbor.block}, ${focusedNeighbor.house}` : undefined}
                neighbors={visibleNeighbors}
                enableAdminEditor={true}
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-400 border-t border-slate-800/80">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" /> Sede Social OTB
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" /> Cancha Polifuncional
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-purple-600 inline-block" /> Vivienda Vecinal
                  </span>
                </div>
                <span className="font-mono text-[11px] text-slate-500">
                  Jurisdicción: {currentOtb?.name || 'Comunidad'} ({currentOtb?.department || 'Bolivia'})
                </span>
              </div>
            </div>
          </TiltCard3D>
        </div>
      )}

      {/* Buscador de Alto Contraste */}
      <TiltCard3D>
        <div className="p-4 sm:p-5 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 shadow-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
            <Search className="w-5 h-5 text-blue-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código (SOC-012), nombre completo, carnet (CI) o lote..."
            className="w-full text-sm sm:text-base bg-transparent focus:outline-none text-white placeholder-slate-500 font-semibold"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="px-3 py-1 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
            >
              Limpiar
            </button>
          )}
        </div>
      </TiltCard3D>

      {/* Tabla de Vecinos con Acciones de Ubicación y Ficha Oficial */}
      <TiltCard3D>
        <div className="rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 shadow-2xl overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-400" />
              <h2 className="text-base sm:text-lg font-black text-white">
                Lista de Socios Activos ({filtered.length})
              </h2>
            </div>
            <span className="text-xs sm:text-sm text-slate-300 font-mono font-bold">
              {currentOtb?.name || 'OTB Villa Esperanza'} • Código: {currentOtb?.code || 'OTB-CBBA-001'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm sm:text-base">
              <thead className="bg-[#030712]/90 border-b-2 border-slate-800 text-slate-300 uppercase tracking-wider text-xs sm:text-sm font-black">
                <tr>
                  <th className="px-5 py-4">Cód. Socio</th>
                  <th className="px-5 py-4">Vecino / Titular</th>
                  <th className="px-5 py-4">Ubicación Inmueble</th>
                  <th className="px-5 py-4">Contacto</th>
                  <th className="px-5 py-4 text-center">Estado de Solvencia</th>
                  <th className="px-5 py-4 text-right">Saldo Deuda</th>
                  <th className="px-5 py-4 text-center">Acciones Oficiales</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map((vecino) => {
                  const isFocused = focusedNeighbor?.id === vecino.id;
                  return (
                    <tr
                      key={vecino.id}
                      className={`transition-colors ${isFocused ? 'bg-blue-600/10 border-l-4 border-l-blue-500' : 'hover:bg-slate-900/60'
                        }`}
                    >
                      <td className="px-5 py-4 font-mono font-black text-blue-400">
                        <span className="px-3 py-1.5 rounded-xl bg-blue-500/15 border border-blue-500/30 inline-block text-xs">
                          {vecino.socioCode}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600/30 to-indigo-600/30 border border-blue-500/30 text-white font-black flex items-center justify-center text-sm">
                            {vecino.name[0]}
                          </div>
                          <div>
                            <p className="font-black text-white text-base">{vecino.name}</p>
                            <p className="text-xs sm:text-sm text-slate-300 font-mono">CI: {vecino.ci}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-slate-200">
                          <Home className="w-4 h-4 text-blue-400 flex-shrink-0" />
                          <span className="font-bold text-sm sm:text-base text-white">{vecino.block}, {vecino.house}</span>
                        </div>
                        <button
                          onClick={() => handleFocusNeighborOnMap(vecino)}
                          className="mt-1 text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                        >
                          <MapPin className="w-3.5 h-3.5 text-red-400" />
                          <span>Ver casa en mapa</span>
                        </button>
                      </td>
                      <td className="px-5 py-4 font-mono text-slate-300">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{vecino.phone}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        {vecino.status === 'Al Día' ? (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Al Día
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-black bg-rose-500/20 text-rose-300 border border-rose-500/40">
                            <AlertCircle className="w-4 h-4 text-rose-400" /> En Mora
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right font-mono font-black text-base sm:text-lg">
                        {vecino.debt === 0 ? (
                          <span className="text-slate-400">Bs. 0,00</span>
                        ) : (
                          <span className="text-amber-300">{formatBOB(vecino.debt)}</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleFocusNeighborOnMap(vecino)}
                            className="min-h-[38px] px-3 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                            title="Centrar casa en mapa"
                          >
                            <MapPin className="w-3.5 h-3.5 text-red-400" />
                            <span>Mapa</span>
                          </button>

                          <button
                            onClick={() => handleOpenStatement(vecino)}
                            className="min-h-[38px] px-3.5 rounded-xl text-xs sm:text-sm font-black bg-blue-600/25 hover:bg-blue-600 text-blue-200 hover:text-white border border-blue-500/40 hover:border-blue-500 transition-all flex items-center gap-1.5 cursor-pointer"
                            title="Abrir e imprimir Ficha Oficial & Estado de Cuenta"
                          >
                            <FileText className="w-4 h-4" />
                            <span>Ficha</span>
                          </button>

                          {/* Botón Editar Vecino (CRUD Update) */}
                          <button
                            onClick={() => handleStartEdit(vecino)}
                            className="min-h-[38px] px-3 rounded-xl text-xs sm:text-sm font-black bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 transition-all flex items-center gap-1.5 cursor-pointer"
                            title="Editar datos del socio o reubicar vivienda"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>

                          {/* Botón Dar de Baja (CRUD Delete) */}
                          <button
                            onClick={() => setDeletingNeighbor(vecino)}
                            className="min-h-[38px] px-2.5 rounded-xl text-xs sm:text-sm font-black bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 transition-all flex items-center gap-1 cursor-pointer"
                            title="Dar de baja / archivar socio del padrón"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Baja</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </TiltCard3D>

      {/* Modal Registrar Vecino con Ubicación Catastral */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#0B132B] border-2 border-slate-700 shadow-2xl overflow-hidden text-white">
            <div className="p-6 border-b border-slate-800 bg-[#030712]/90 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white">Registrar Nuevo Vecino y Vivienda</h2>
                <p className="text-xs text-slate-400 mt-0.5">Afiliación comunal en el padrón censal OTB.</p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Nuevo Registro
              </span>
            </div>

            <form onSubmit={handleCreateNeighbor} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-black text-slate-300 block mb-1.5 uppercase tracking-wider">
                  Nombre Completo del Titular
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej. Mario Guzmán Aguilar"
                  className="w-full text-sm px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-white placeholder-slate-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Cédula de Identidad (CI)
                  </label>
                  <input
                    type="text"
                    required
                    value={newCi}
                    onChange={(e) => setNewCi(e.target.value)}
                    placeholder="Ej. 6541230 CBBA"
                    className="w-full text-sm px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-white placeholder-slate-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Celular de Contacto
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="Ej. 76543210"
                    className="w-full text-sm px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-white placeholder-slate-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Manzana
                  </label>
                  <input
                    type="text"
                    value={newBlock}
                    onChange={(e) => setNewBlock(e.target.value)}
                    placeholder="Ej. Manzana D"
                    className="w-full text-sm px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-white placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Lote / Vivienda
                  </label>
                  <input
                    type="text"
                    value={newHouse}
                    onChange={(e) => setNewHouse(e.target.value)}
                    placeholder="Ej. Lote 09"
                    className="w-full text-sm px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-blue-400 block mb-1">📍 Coordenadas de Localización GPS:</span>
                <span className="font-mono text-[11px] text-slate-400">
                  Latitud: {newLat} • Longitud: {newLng} (Sede {currentOtb?.name || 'Comunal'})
                </span>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="h-12 px-5 text-xs font-black text-slate-400 hover:text-white hover:bg-slate-800 rounded-2xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="h-12 px-6 text-xs font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl shadow-xl shadow-blue-600/30 transition-all cursor-pointer"
                >
                  Guardar y Ubicar en Mapa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Ficha Oficial Imprimible de Alta Calidad */}
      {isStatementModalOpen && selectedStatement && (
        <PrintableStatementModal
          isOpen={isStatementModalOpen}
          onClose={() => setIsStatementModalOpen(false)}
          data={selectedStatement}
        />
      )}

      {/* ======================================================== */}
      {/* MODAL CRUD: EDITAR DATOS DEL SOCIO / LOTE (UPDATE)      */}
      {/* ======================================================== */}
      {editingNeighbor && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-[#0B132B] border-2 border-amber-500/50 shadow-2xl overflow-hidden text-white my-auto">
            <div className="p-6 border-b border-slate-800 bg-[#030712]/90 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-400 block tracking-wider">
                  Actualización Catastral OTB
                </span>
                <h2 className="text-lg font-black text-white">
                  Editar Socio: {editingNeighbor.socioCode}
                </h2>
              </div>
              <button
                onClick={() => setEditingNeighbor(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1 uppercase tracking-wider text-[11px]">
                  Nombre Completo del Titular
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full text-sm px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-amber-500 text-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1 uppercase tracking-wider text-[11px]">
                    Cédula de Identidad (CI)
                  </label>
                  <input
                    type="text"
                    required
                    value={editCi}
                    onChange={(e) => setEditCi(e.target.value)}
                    className="w-full text-sm px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-amber-500 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1 uppercase tracking-wider text-[11px]">
                    Celular de Contacto
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full text-sm px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-amber-500 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1 uppercase tracking-wider text-[11px]">
                    Manzana
                  </label>
                  <input
                    type="text"
                    value={editBlock}
                    onChange={(e) => setEditBlock(e.target.value)}
                    className="w-full text-sm px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-amber-500 text-white font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1 uppercase tracking-wider text-[11px]">
                    Lote / N° de Casa
                  </label>
                  <input
                    type="text"
                    value={editHouse}
                    onChange={(e) => setEditHouse(e.target.value)}
                    className="w-full text-sm px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-amber-500 text-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1 uppercase tracking-wider text-[11px]">
                    Estado de Solvencia
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as 'Al Día' | 'En Mora')}
                    className="w-full text-sm px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-amber-500 text-white font-bold"
                  >
                    <option value="Al Día">Al Día (Sin Deuda)</option>
                    <option value="En Mora">En Mora (Con Deuda Pendiente)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1 uppercase tracking-wider text-[11px]">
                    Saldo Deuda (BOB)
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    value={editDebt}
                    onChange={(e) => setEditDebt(e.target.value)}
                    className="w-full text-sm px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-amber-500 text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400">📍 Reubicar Vivienda en Mapa:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditLat(-17.4132 + (Math.random() - 0.5) * 0.003);
                      setEditLng(-66.1654 + (Math.random() - 0.5) * 0.003);
                    }}
                    className="text-[11px] font-bold text-blue-400 hover:text-blue-300 underline cursor-pointer"
                  >
                    Reajustar PIN GPS
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-slate-400">
                  <span>Lat: {editLat.toFixed(5)}</span>
                  <span>Lng: {editLng.toFixed(5)}</span>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingNeighbor(null)}
                  className="h-12 px-5 text-xs font-black text-slate-400 hover:text-white hover:bg-slate-800 rounded-2xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="h-12 px-6 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-2xl shadow-xl shadow-amber-400/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL CRUD: CONFIRMAR DAR DE BAJA / ELIMINAR (DELETE)    */}
      {/* ======================================================== */}
      {deletingNeighbor && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#0B132B] border-2 border-rose-500/50 shadow-2xl p-6 sm:p-7 space-y-4 text-white">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-white">¿Dar de baja al socio?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Estás a punto de desvincular a <strong className="text-white">{deletingNeighbor.name}</strong> ({deletingNeighbor.socioCode} - {deletingNeighbor.block}, {deletingNeighbor.house}) del censo activo de la OTB.
              </p>
              {deletingNeighbor.debt > 0 && (
                <div className="mt-2 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs text-left">
                  ⚠️ <strong>Atención:</strong> Este vecino tiene una deuda pendiente de <strong>{formatBOB(deletingNeighbor.debt)}</strong>.
                </div>
              )}
            </div>

            <div className="pt-3 flex gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingNeighbor(null)}
                className="flex-1 h-12 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-2xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 h-12 text-xs font-black text-white bg-rose-600 hover:bg-rose-500 rounded-2xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirmar Baja</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
