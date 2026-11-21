import React, { useState } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  AlertTriangle,
  Lightbulb,
  Droplets,
  Trash2,
  Volume2,
  X,
  Send,
  CheckCircle2,
  Clock,
  Camera,
  MapPin,
  Flame,
  Radio,
  Building,
  HeartPulse,
  Smartphone
} from 'lucide-react';

export interface CommunityReport {
  id: string;
  category: 'seguridad' | 'cancha' | 'luminaria' | 'agua' | 'basura' | 'ruido';
  title: string;
  description: string;
  location: string;
  reportedBy: string;
  timestamp: string;
  status: 'atendiendo' | 'en_camino' | 'resuelto';
  statusLabel: string;
}

const INITIAL_REPORTS: CommunityReport[] = [
  {
    id: 'rep-01',
    category: 'cancha',
    title: 'Persona descompensada / dormida en graderías de la cancha',
    description: 'Hay una persona mayor recostada en las graderías de la cancha polifuncional, parece necesitar abrigo o auxilio médico.',
    location: 'Cancha Polifuncional - Manzana B',
    reportedBy: 'Vecino Vigilante (Lote 05)',
    timestamp: 'Hace 12 minutos',
    status: 'en_camino',
    statusLabel: 'Directiva y Ronda Vecinal en camino'
  },
  {
    id: 'rep-02',
    category: 'luminaria',
    title: 'Poste sin luz en esquina oscura',
    description: 'Foco quemado hace 2 noches. Está muy oscuro para las señoras y jóvenes que vuelven del trabajo.',
    location: 'Calle Los Pinos esq. Manzano A',
    reportedBy: 'Vecina Silvia R. (Lote 14)',
    timestamp: 'Hoy 10:15',
    status: 'atendiendo',
    statusLabel: 'Reporte derivado a Alumbrado Público'
  },
  {
    id: 'rep-03',
    category: 'agua',
    title: 'Fuga de agua potable en vereda comunal',
    description: 'Chorro de agua saliendo de la llave de paso de la sede social.',
    location: 'Puerta Sede Comunal',
    reportedBy: 'Don Roberto (Lote 01)',
    timestamp: 'Ayer 18:30',
    status: 'resuelto',
    statusLabel: 'Solucionado por plomero del barrio'
  }
];

interface CommunityAlertsAndEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'emergencias' | 'reportar' | 'muro';
  otbName?: string;
}

export const CommunityAlertsAndEmergencyModal: React.FC<CommunityAlertsAndEmergencyModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'emergencias',
  otbName = 'OTB Villa Esperanza'
}) => {
  const [activeTab, setActiveTab] = useState<'emergencias' | 'reportar' | 'muro'>(initialTab);
  const [reports, setReports] = useState<CommunityReport[]>(INITIAL_REPORTS);

  // Formulario nuevo reporte
  const [category, setCategory] = useState<CommunityReport['category']>('cancha');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Cancha Polifuncional');
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newReport: CommunityReport = {
        id: `rep-${Date.now()}`,
        category,
        title,
        description,
        location,
        reportedBy: 'Vecino Registrado',
        timestamp: 'Justo ahora',
        status: 'atendiendo',
        statusLabel: 'Alerta comunitaria enviada a la Directiva'
      };

      setReports([newReport, ...reports]);
      setIsSubmitting(false);
      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        setActiveTab('muro');
        setTitle('');
        setDescription('');
        setPhotoName(null);
      }, 1200);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0B132B] border-2 border-slate-600 text-white w-full max-w-2xl rounded-3xl p-5 sm:p-8 shadow-2xl relative max-h-[92vh] flex flex-col my-auto">
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado */}
        <div className="mb-4 pr-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-black border border-rose-500/40 mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse text-rose-400" />
            <span>Red Vecinal Activa & Seguridad Ciudadana 24/7</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Centro de Auxilio, Reportes y Emergencias Barriales
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Comunidad: <strong className="text-emerald-400">{otbName}</strong> • Comunicación directa entre vecinos, directiva y auxilio público.
          </p>
        </div>

        {/* Navegación por Pestañas de Gran Tamaño (Accesible para 40 a 60 años) */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[#020617] border-2 border-slate-700 mb-5">
          <button
            type="button"
            onClick={() => setActiveTab('emergencias')}
            className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'emergencias'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <PhoneCall className="w-4 h-4 text-rose-300" />
            <span>Números de Auxilio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reportar')}
            className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'reportar'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Avisar al Barrio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('muro')}
            className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'muro'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-blue-300" />
            <span>Muro en Vivo ({reports.length})</span>
          </button>
        </div>

        {/* CONTENIDO 1: NÚMEROS DE EMERGENCIA DE BOLIVIA (1-TAP CALL) */}
        {activeTab === 'emergencias' && (
          <div className="space-y-4 overflow-y-auto pr-1">
            <div className="p-3.5 rounded-2xl bg-rose-950/40 border-2 border-rose-500/50 text-xs text-rose-200 flex items-start gap-2.5">
              <PhoneCall className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white text-sm">Llamadas Directas de Urgencia:</strong>
                <span>Presiona cualquier número para marcar al instante desde tu teléfono celular sin costo.</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Radiopatrullas 110 */}
              <a
                href="tel:110"
                className="p-4 rounded-2xl bg-[#030712] border-2 border-slate-700 hover:border-rose-400 flex items-center justify-between transition-all group shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-rose-600/25 border border-rose-500 text-rose-400 flex items-center justify-center font-bold text-lg">
                    110
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-sm group-hover:text-rose-300">
                      Radiopatrullas Policía
                    </h4>
                    <p className="text-[11px] text-slate-300">Emergencias de seguridad 24h</p>
                  </div>
                </div>
                <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-rose-600 text-white shadow-sm">
                  Llamar
                </span>
              </a>

              {/* Bomberos 119 */}
              <a
                href="tel:119"
                className="p-4 rounded-2xl bg-[#030712] border-2 border-slate-700 hover:border-amber-400 flex items-center justify-between transition-all group shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-600/25 border border-amber-500 text-amber-400 flex items-center justify-center font-bold text-lg">
                    119
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-sm group-hover:text-amber-300">
                      Bomberos y Rescate
                    </h4>
                    <p className="text-[11px] text-slate-300">Incendios, fugas y rescates</p>
                  </div>
                </div>
                <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 shadow-sm">
                  Llamar
                </span>
              </a>

              {/* Ambulancia SAMU 165 */}
              <a
                href="tel:165"
                className="p-4 rounded-2xl bg-[#030712] border-2 border-slate-700 hover:border-emerald-400 flex items-center justify-between transition-all group shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-600/25 border border-emerald-500 text-emerald-400 flex items-center justify-center font-bold text-lg">
                    165
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-sm group-hover:text-emerald-300">
                      Ambulancia SAMU
                    </h4>
                    <p className="text-[11px] text-slate-300">Primeros auxilios médicos</p>
                  </div>
                </div>
                <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 shadow-sm">
                  Llamar
                </span>
              </a>

              {/* Presidente OTB / Ronda Barrial */}
              <a
                href="tel:72345678"
                className="p-4 rounded-2xl bg-[#030712] border-2 border-slate-700 hover:border-blue-400 flex items-center justify-between transition-all group shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-600/25 border border-blue-500 text-blue-400 flex items-center justify-center font-bold">
                    OTB
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-sm group-hover:text-blue-300">
                      Presidente de la OTB
                    </h4>
                    <p className="text-[11px] text-slate-300">Don Roberto (Cel: 72345678)</p>
                  </div>
                </div>
                <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-blue-600 text-white shadow-sm">
                  Llamar
                </span>
              </a>

              {/* Alumbrado Público ELFEC */}
              <a
                href="tel:176"
                className="p-4 rounded-2xl bg-[#030712] border-2 border-slate-700 hover:border-yellow-400 flex items-center justify-between transition-all group shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-yellow-500/25 border border-yellow-500 text-yellow-300 flex items-center justify-center font-bold text-lg">
                    176
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-sm group-hover:text-yellow-300">
                      Cables y Alumbrado
                    </h4>
                    <p className="text-[11px] text-slate-300">Cables caídos y postes sin luz</p>
                  </div>
                </div>
                <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-yellow-500 text-slate-950 shadow-sm">
                  Llamar
                </span>
              </a>

              {/* SEMAPA Agua y Alcantarillado */}
              <a
                href="tel:178"
                className="p-4 rounded-2xl bg-[#030712] border-2 border-slate-700 hover:border-cyan-400 flex items-center justify-between transition-all group shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-cyan-600/25 border border-cyan-500 text-cyan-300 flex items-center justify-center font-bold text-lg">
                    178
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-sm group-hover:text-cyan-300">
                      Emergencias de Agua
                    </h4>
                    <p className="text-[11px] text-slate-300">Rotura de cañerías y pozos</p>
                  </div>
                </div>
                <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 shadow-sm">
                  Llamar
                </span>
              </a>
            </div>
          </div>
        )}

        {/* CONTENIDO 2: FORMULARIO DE REPORTE CIUDADANO EN VIVO */}
        {activeTab === 'reportar' && (
          <form onSubmit={handleCreateReport} className="space-y-4 overflow-y-auto pr-1 text-xs">
            {successMsg && (
              <div className="p-3 bg-emerald-950/80 border-2 border-emerald-500 rounded-2xl text-emerald-300 text-center font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>¡Reporte publicado con éxito en el Muro Barrial! La directiva fue notificada.</span>
              </div>
            )}

            <div>
              <label className="font-bold text-slate-200 block mb-1 text-xs">
                ¿Qué tipo de problema o incidente deseas reportar?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'cancha', label: 'Persona en la Cancha / Calle', icon: ShieldAlert },
                  { id: 'seguridad', label: 'Sospechoso / Robo', icon: AlertTriangle },
                  { id: 'luminaria', label: 'Luz de Poste Quemada', icon: Lightbulb },
                  { id: 'agua', label: 'Fuga de Agua / Tubo', icon: Droplets },
                  { id: 'basura', label: 'Basural / Escombros', icon: Trash2 },
                  { id: 'ruido', label: 'Fiesta / Ruido Fuerte', icon: Volume2 }
                ].map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id as any)}
                      className={`p-3 rounded-xl border-2 flex items-center gap-2 text-left font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                          : 'bg-[#020617] border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-[11px] leading-tight">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-200 block mb-1 text-xs">Título del Aviso:</label>
              <input
                type="text"
                required
                placeholder="ej. Alguien echado en la cancha / Foco quemado calle A"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#020617] border-2 border-slate-600 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-amber-400 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-200 block mb-1 text-xs">Ubicación Exacta:</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="ej. Cancha Polifuncional, Manzana B"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[#020617] border-2 border-slate-600 rounded-xl pl-9 pr-3 py-2.5 text-white font-medium focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1 text-xs">Adjuntar Foto (Opcional):</label>
                <label className="border-2 border-dashed border-slate-600 hover:border-amber-400 rounded-xl p-2.5 flex items-center justify-center gap-2 cursor-pointer transition-colors bg-[#020617] text-slate-300">
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span className="truncate text-xs font-semibold">
                    {photoName || 'Tomar o subir foto'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && setPhotoName(e.target.files[0].name)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-200 block mb-1 text-xs">Detalles del Suceso:</label>
              <textarea
                required
                rows={3}
                placeholder="Describe brevemente qué viste, qué hora ocurrió y si la persona o situación requiere ayuda inmediata..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#020617] border-2 border-slate-600 rounded-xl p-3 text-white font-medium focus:outline-none focus:border-amber-400 text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Transmitiendo Alerta al Barrio...' : 'Enviar Alerta Inmediata a la OTB'}</span>
            </button>
          </form>
        )}

        {/* CONTENIDO 3: MURO VECINAL EN VIVO */}
        {activeTab === 'muro' && (
          <div className="space-y-3 overflow-y-auto pr-1">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
              <span>Incidentes y avisos reportados por vecinos de {otbName}:</span>
              <button
                type="button"
                onClick={() => setActiveTab('reportar')}
                className="text-amber-400 hover:underline font-bold"
              >
                + Nuevo Aviso
              </button>
            </div>

            {reports.map((rep) => (
              <div
                key={rep.id}
                className="p-4 rounded-2xl bg-[#030712] border-2 border-slate-700 space-y-2.5 shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                      {rep.category === 'cancha' ? (
                        <ShieldAlert className="w-4 h-4" />
                      ) : rep.category === 'luminaria' ? (
                        <Lightbulb className="w-4 h-4" />
                      ) : (
                        <AlertTriangle className="w-4 h-4" />
                      )}
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-xs sm:text-sm">{rep.title}</h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{rep.location} • {rep.timestamp}</span>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border flex-shrink-0 ${
                      rep.status === 'resuelto'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        : rep.status === 'en_camino'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    }`}
                  >
                    {rep.statusLabel}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-[#0B132B] p-2.5 rounded-xl border border-slate-800">
                  {rep.description}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Reportado por: <strong className="text-slate-200">{rep.reportedBy}</strong></span>
                  <a
                    href="tel:110"
                    className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 font-bold"
                  >
                    <PhoneCall className="w-3 h-3" /> Auxilio Policial
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
