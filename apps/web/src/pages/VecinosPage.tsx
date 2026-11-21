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
  ChevronUp
} from 'lucide-react';
import { formatBOB } from '@xentra/shared';
import { TiltCard3D } from '../components/TiltCard3D';
import { PrintableStatementModal, StatementData } from '../components/PrintableStatementModal';
import { CommunityInteractiveMap } from '../components/CommunityInteractiveMap';

interface NeighborMock {
  id: string;
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
  }
];

export const VecinosPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showMapSection, setShowMapSection] = useState(true);
  const [neighbors, setNeighbors] = useState(INITIAL_NEIGHBORS);

  // Vecino seleccionado para enfocar su casa en el mapa
  const [focusedNeighbor, setFocusedNeighbor] = useState<NeighborMock | null>(INITIAL_NEIGHBORS[0]);

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

  const filtered = neighbors.filter(
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
    const statement: StatementData = {
      otbName: 'OTB Villa Esperanza',
      otbCode: 'OTB-CBBA-001',
      department: 'Cochabamba',
      municipality: 'Cochabamba (Cercado)',
      zone: 'Distrito 4 - Noroeste',
      socioCode: vecino.socioCode,
      socioName: vecino.name,
      ciNumber: vecino.ci,
      block: vecino.block,
      lot: vecino.house,
      phone: vecino.phone,
      totalAssigned: isAlDia ? 125 : 125 + vecino.debt,
      totalPaid: isAlDia ? 125 : 125,
      totalDebt: vecino.debt,
      lastReceiptNumber: `OTB-CBBA-001-2026-${vecino.socioCode.replace('SOC-', '000')}`,
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-white">
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
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Registro de socios, localización de viviendas en el mapa comunal y estado de solvencia.
          </p>
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
                      Plano Georreferenciado de Viviendas y Lotes Censados
                    </h2>
                    <p className="text-xs text-slate-400">
                      Ubica la casa de cada vecino en la OTB. Haz clic en "Ubicar en Mapa" en cualquier fila para enfocarla.
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

              {/* Mapa Interactivo con pines de las casas */}
              <CommunityInteractiveMap
                centerLat={focusedNeighbor ? focusedNeighbor.latitude : -17.41325}
                centerLng={focusedNeighbor ? focusedNeighbor.longitude : -66.16543}
                zoom={17}
                heightClass="h-80 sm:h-96"
                otbName="OTB Villa Esperanza"
                selectedLotName={focusedNeighbor ? `${focusedNeighbor.name} — ${focusedNeighbor.block}, ${focusedNeighbor.house}` : undefined}
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
                  Coordenadas GPS Villa Esperanza: -17.41325, -66.16543
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
              <Users className="w-5 h-5 text-blue-400" />
              <h2 className="text-sm sm:text-base font-black text-white">
                Lista de Socios Activos ({filtered.length})
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              OTB Villa Esperanza • Código: OTB-CBBA-001
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#030712]/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] font-black">
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
                      className={`transition-colors ${
                        isFocused ? 'bg-blue-600/10 border-l-4 border-l-blue-500' : 'hover:bg-slate-900/60'
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
                            <p className="font-bold text-white text-sm">{vecino.name}</p>
                            <p className="text-xs text-slate-400 font-mono">CI: {vecino.ci}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Home className="w-4 h-4 text-blue-400 flex-shrink-0" />
                          <span className="font-semibold">{vecino.block}, {vecino.house}</span>
                        </div>
                        <button
                          onClick={() => handleFocusNeighborOnMap(vecino)}
                          className="mt-1 text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                        >
                          <MapPin className="w-3 h-3 text-red-400" />
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
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Al Día
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-400" /> En Mora
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right font-mono font-black text-sm">
                        {vecino.debt === 0 ? (
                          <span className="text-slate-500">Bs. 0,00</span>
                        ) : (
                          <span className="text-amber-400">{formatBOB(vecino.debt)}</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleFocusNeighborOnMap(vecino)}
                            className="h-9 px-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                            title="Centrar casa en mapa"
                          >
                            <MapPin className="w-3 h-3 text-red-400" />
                            <span>Mapa</span>
                          </button>

                          <button
                            onClick={() => handleOpenStatement(vecino)}
                            className="h-9 px-3.5 rounded-xl text-xs font-black bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 hover:border-blue-500 transition-all flex items-center gap-1.5 cursor-pointer"
                            title="Abrir e imprimir Ficha Oficial & Estado de Cuenta"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Ficha Oficial</span>
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
                  Latitud: {newLat} • Longitud: {newLng} (Sede OTB Villa Esperanza)
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
    </div>
  );
};
