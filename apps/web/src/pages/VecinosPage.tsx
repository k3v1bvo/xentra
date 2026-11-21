import React, { useState } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Home,
  CheckCircle2,
  AlertCircle,
  Phone,
  FileCheck
} from 'lucide-react';
import { formatBOB } from '@xentra/shared';

interface NeighborMock {
  id: string;
  name: string;
  ci: string;
  phone: string;
  block: string;
  house: string;
  status: 'Al Día' | 'En Mora';
  debt: number;
}

const INITIAL_NEIGHBORS: NeighborMock[] = [
  { id: '1', name: 'Juan José Flores Morales', ci: '7412589 CBBA', phone: '74567890', block: 'Manzana A', house: 'Lote 12', status: 'En Mora', debt: 50.00 },
  { id: '2', name: 'Silvia Rojas Torrico', ci: '8521479 CBBA', phone: '75678901', block: 'Manzana B', house: 'Lote 05', status: 'En Mora', debt: 125.00 },
  { id: '3', name: 'Roberto Fernández Vargas', ci: '5289341 CBBA', phone: '72345678', block: 'Manzana A', house: 'Lote 01', status: 'Al Día', debt: 0.00 },
  { id: '4', name: 'Marina Condori Rocha', ci: '6398412 CBBA', phone: '73456789', block: 'Manzana C', house: 'Lote 08', status: 'Al Día', debt: 0.00 },
  { id: '5', name: 'Pedro Gonzalo Canaviri', ci: '4896325 CBBA', phone: '78912345', block: 'Manzana B', house: 'Lote 14', status: 'Al Día', debt: 0.00 }
];

export const VecinosPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [neighbors, setNeighbors] = useState(INITIAL_NEIGHBORS);

  // Formulario nuevo vecino
  const [newName, setNewName] = useState('');
  const [newCi, setNewCi] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newBlock, setNewBlock] = useState('Manzana A');
  const [newHouse, setNewHouse] = useState('');

  const filtered = neighbors.filter(
    (n) =>
      n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.ci.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.house.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNeighbor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCi) return;

    const created: NeighborMock = {
      id: Date.now().toString(),
      name: newName,
      ci: newCi,
      phone: newPhone || 'Sin teléfono',
      block: newBlock,
      house: newHouse || 'Lote sin número',
      status: 'Al Día',
      debt: 0.00
    };

    setNeighbors([created, ...neighbors]);
    setShowModal(false);
    setNewName('');
    setNewCi('');
    setNewPhone('');
    setNewHouse('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Padrón de Vecinos y Viviendas
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro censal de residentes, afiliaciones y asignación domiciliaria.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
        >
          <UserPlus className="w-4 h-4" />
          Registrar Vecino
        </button>
      </div>

      {/* Buscador */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-fintech flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre, carnet de identidad (CI) o lote..."
          className="w-full text-xs bg-transparent focus:outline-none text-slate-800 placeholder-slate-400"
        />
      </div>

      {/* Tabla de Vecinos */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-fintech overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3.5 font-bold">Vecino / Residente</th>
                <th className="px-5 py-3.5 font-bold">Vivienda / Ubicación</th>
                <th className="px-5 py-3.5 font-bold">Contacto</th>
                <th className="px-5 py-3.5 font-bold">Estado de Cuotas</th>
                <th className="px-5 py-3.5 font-bold text-right">Deuda Pendiente</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((vecino) => (
                <tr key={vecino.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center">
                        {vecino.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{vecino.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">CI: {vecino.ci}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Home className="w-3.5 h-3.5 text-slate-400" />
                      <span>{vecino.block}, {vecino.house}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 font-mono">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {vecino.phone}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {vecino.status === 'Al Día' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" /> Al Día
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                        <AlertCircle className="w-3 h-3" /> En Mora
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-900">
                    {formatBOB(vecino.debt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Registrar Vecino */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-sm font-bold text-slate-900">Registrar Nuevo Vecino</h2>
              <p className="text-xs text-slate-500">Afiliación comunal en la OTB activa.</p>
            </div>

            <form onSubmit={handleCreateNeighbor} className="p-5 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej. Mario Guzmán Aguilar"
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Cédula (CI)</label>
                  <input
                    type="text"
                    required
                    value={newCi}
                    onChange={(e) => setNewCi(e.target.value)}
                    placeholder="Ej. 6541230 CBBA"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Celular</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="Ej. 76543210"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Manzana</label>
                  <input
                    type="text"
                    value={newBlock}
                    onChange={(e) => setNewBlock(e.target.value)}
                    placeholder="Ej. Manzana D"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Lote / Casa</label>
                  <input
                    type="text"
                    value={newHouse}
                    onChange={(e) => setNewHouse(e.target.value)}
                    placeholder="Ej. Lote 09"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Guardar Vecino
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
