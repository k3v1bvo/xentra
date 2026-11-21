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
  HeartPulse,
  Radio,
  Eye,
  Check,
  Building,
  UserCheck,
  Crosshair,
  Navigation,
  ExternalLink,
  Loader2,
  Map as MapIcon,
  List
} from 'lucide-react';
import {
  useCommunityReportsStore,
  ReportCategory,
  CATEGORY_METADATA
} from '../stores/communityReportsStore';
import { CommunityInteractiveMap } from './CommunityInteractiveMap';

interface CommunityAlertsAndEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'emergencias' | 'reportar' | 'muro';
  otbId?: string;
  otbName?: string;
  socioCode?: string;
  neighborName?: string;
  lotName?: string;
  phoneContact?: string;
}

const OTBS_SISTEMA = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Villa Esperanza', city: 'Cochabamba', code: 'OTB-CBBA-001', defaultAddress: 'Av. Petrolera Km 4' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Los Pinos', city: 'La Paz', code: 'OTB-LPZ-002', defaultAddress: 'Zona Sur - Calacoto' }
];

export const CommunityAlertsAndEmergencyModal: React.FC<CommunityAlertsAndEmergencyModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'emergencias',
  otbId = '11111111-1111-1111-1111-111111111111',
  otbName = 'Villa Esperanza',
  socioCode = 'SOC-012',
  neighborName = 'Juan José Flores Morales',
  lotName = 'Manzana A, Lote 12',
  phoneContact = '74567890'
}) => {
  const [activeTab, setActiveTab] = useState<'emergencias' | 'reportar' | 'muro'>(initialTab);

  // Aislamiento estricto por OTB
  const [selectedOtbId, setSelectedOtbId] = useState(otbId);
  const currentOtbInfo = OTBS_SISTEMA.find(o => o.id === selectedOtbId) || {
    id: selectedOtbId,
    name: otbName,
    city: 'Bolivia',
    code: 'OTB-REG',
    defaultAddress: 'Sede Social'
  };

  const { addReport, updateReportStatus, getReportsByOtb } = useCommunityReportsStore();
  // SOLO reportes de la OTB seleccionada
  const otbReports = getReportsByOtb(selectedOtbId);

  // Formulario de nuevo reporte
  const [category, setCategory] = useState<ReportCategory>('borracho_cancha');
  const [customSocioCode, setCustomSocioCode] = useState(socioCode);
  const [customLotName, setCustomLotName] = useState(lotName);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Cancha Polifuncional - Manzana B');
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [enlargedPhoto, setEnlargedPhoto] = useState<string | null>(null);

  // Geolocalización GPS Real
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);
  const [muroViewMode, setMuroViewMode] = useState<'lista' | 'mapa'>('mapa');

  if (!isOpen) return null;

  const handleGetGPS = () => {
    if (!navigator.geolocation) {
      setGpsStatus('Tu dispositivo o navegador no soporta GPS.');
      return;
    }

    setIsLocating(true);
    setGpsStatus('Conectando satélites GPS en tiempo real...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const acc = Math.round(pos.coords.accuracy);
        setLatitude(lat);
        setLongitude(lng);
        setGpsAccuracy(acc);
        setLocation(`Ubicación GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)} (${currentOtbInfo.name})`);
        setGpsStatus(`✓ GPS fijado con precisión ±${acc}m`);
        setIsLocating(false);
      },
      (err) => {
        console.warn('GPS error:', err);
        // Coordenadas geográficas representativas según la OTB
        const fallbackLat = selectedOtbId.includes('2222') ? -16.54124 : -17.41325;
        const fallbackLng = selectedOtbId.includes('2222') ? -68.08215 : -66.16543;
        setLatitude(fallbackLat);
        setLongitude(fallbackLng);
        setGpsAccuracy(12);
        setLocation(`GPS Referencial: ${fallbackLat.toFixed(5)}, ${fallbackLng.toFixed(5)} (${currentOtbInfo.name})`);
        setGpsStatus(`✓ Coordenadas de la OTB fijadas (${currentOtbInfo.city})`);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsSubmitting(true);
    setTimeout(() => {
      addReport({
        otbId: selectedOtbId,
        otbName: currentOtbInfo.name,
        category,
        title,
        description,
        location,
        socioCode: customSocioCode || socioCode,
        neighborName: neighborName || 'Vecino Acreditado',
        lotName: customLotName || lotName,
        phoneContact,
        photoName: photoName || undefined,
        photoUrl: photoUrl || undefined,
        latitude: latitude || undefined,
        longitude: longitude || undefined,
        gpsAccuracy: gpsAccuracy || undefined
      });

      setIsSubmitting(false);
      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        setActiveTab('muro');
        setTitle('');
        setDescription('');
        setPhotoName(null);
        setPhotoUrl(null);
        setLatitude(null);
        setLongitude(null);
        setGpsStatus(null);
      }, 1000);
    }, 600);
  };

  const getCategoryIcon = (cat: ReportCategory) => {
    switch (cat) {
      case 'borracho_cancha':
        return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case 'perro_peligro':
        return <HeartPulse className="w-5 h-5 text-amber-400" />;
      case 'fuga_agua':
        return <Droplets className="w-5 h-5 text-cyan-400" />;
      case 'auto_sospechoso':
        return <Eye className="w-5 h-5 text-rose-400" />;
      case 'luminaria':
        return <Lightbulb className="w-5 h-5 text-yellow-400" />;
      case 'basura':
        return <Trash2 className="w-5 h-5 text-slate-300" />;
      case 'ruido':
        return <Volume2 className="w-5 h-5 text-purple-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0B132B] border-2 border-slate-600 text-white w-full max-w-2xl rounded-3xl p-5 sm:p-8 shadow-2xl relative max-h-[94vh] flex flex-col my-auto">
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 sm:right-6 sm:top-6 p-2.5 text-slate-300 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Encabezado con Selector de OTB Aislado */}
        <div className="mb-4 pr-12 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs sm:text-sm font-black border border-rose-500/40">
              <Radio className="w-4 h-4 animate-pulse text-rose-400" />
              <span>Red Vecinal 24/7</span>
            </span>

            {/* Selector de OTB Estricto: Ningún vecino ve reportes de otra comunidad */}
            <div className="flex items-center gap-1.5 bg-[#020617] px-2.5 py-1 rounded-xl border border-slate-700">
              <Building className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] text-slate-400 font-bold hidden sm:inline">OTB:</span>
              <select
                value={selectedOtbId}
                onChange={(e) => setSelectedOtbId(e.target.value)}
                className="bg-transparent text-emerald-300 font-black text-xs cursor-pointer focus:outline-none"
              >
                {OTBS_SISTEMA.map((o) => (
                  <option key={o.id} value={o.id} className="bg-slate-900 text-white">
                    {o.name} ({o.city} • {o.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
            Centro de Auxilio y Reportes Barriales
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Estás consultando y reportando exclusivamente en <strong className="text-emerald-400">{currentOtbInfo.name} ({currentOtbInfo.city})</strong>.
          </p>
        </div>

        {/* Identidad del Vecino Conectado */}
        <div className="mb-4 p-3 rounded-2xl bg-[#020617] border border-blue-500/40 flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-sm">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-blue-300 font-bold block uppercase tracking-wide">
                Identificado como Socio Oficial:
              </span>
              <strong className="text-white font-extrabold text-sm sm:text-base">
                {customSocioCode} • {customLotName}
              </strong>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-700">
            {currentOtbInfo.name}
          </span>
        </div>

        {/* Pestañas Gigantes Fáciles de Tocar */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[#020617] border-2 border-slate-700 mb-5">
          <button
            type="button"
            onClick={() => setActiveTab('emergencias')}
            className={`py-3.5 px-2 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'emergencias'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40 scale-[1.02]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <PhoneCall className="w-4 h-4 sm:w-5 h-5 text-rose-300" />
            <span>Llamar Auxilio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reportar')}
            className={`py-3.5 px-2 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'reportar'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/40 scale-[1.02]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <AlertTriangle className="w-4 h-4 sm:w-5 h-5 text-slate-950" />
            <span>Hacer Reporte</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('muro')}
            className={`py-3.5 px-2 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'muro'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 scale-[1.02]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldAlert className="w-4 h-4 sm:w-5 h-5 text-blue-300" />
            <span>Muro ({otbReports.length})</span>
          </button>
        </div>

        {/* TAB 1: LLAMADAS DIRECTAS DE EMERGENCIA EN BOLIVIA A 1 SOLO TOQUE */}
        {activeTab === 'emergencias' && (
          <div className="space-y-3.5 overflow-y-auto pr-1">
            <div className="p-3.5 rounded-2xl bg-rose-950/50 border-2 border-rose-500/60 text-xs sm:text-sm text-rose-200 flex items-start gap-3">
              <PhoneCall className="w-6 h-6 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white font-bold text-sm sm:text-base">
                  Llamada Directa Inmediata:
                </strong>
                <span>Presiona el botón para marcar al instante sin tener que memorizar el número.</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Radiopatrullas 110 */}
              <a
                href="tel:110"
                className="p-4 rounded-2xl bg-[#030712] border-2 border-slate-700 hover:border-rose-400 flex items-center justify-between transition-all group shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-600/25 border-2 border-rose-500 text-rose-400 flex items-center justify-center font-black text-xl">
                    110
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-sm sm:text-base group-hover:text-rose-300">
                      Radiopatrullas Policía
                    </h4>
                    <p className="text-xs text-slate-300">Robos, sospechosos, peleas</p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-black px-4 py-2 rounded-xl bg-rose-600 text-white shadow-md">
                  Llamar
                </span>
              </a>

              {/* Presidente OTB y Ronda Vecinal */}
              <a
                href="tel:72345678"
                className="p-4 rounded-2xl bg-[#030712] border-2 border-blue-500/60 hover:border-blue-400 flex items-center justify-between transition-all group shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border-2 border-blue-400 text-blue-300 flex items-center justify-center font-black text-sm">
                    OTB
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-sm sm:text-base group-hover:text-blue-300">
                      Presidente de la OTB
                    </h4>
                    <p className="text-xs text-slate-300">Don Roberto • Cel: 72345678</p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-black px-4 py-2 rounded-xl bg-blue-600 text-white shadow-md">
                  Llamar
                </span>
              </a>

              {/* Ambulancia SAMU 165 */}
              <a
                href="tel:165"
                className="p-4 rounded-2xl bg-[#030712] border-2 border-slate-700 hover:border-emerald-400 flex items-center justify-between transition-all group shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600/25 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center font-black text-xl">
                    165
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-sm sm:text-base group-hover:text-emerald-300">
                      Ambulancia SAMU
                    </h4>
                    <p className="text-xs text-slate-300">Desmayos, heridos, infartos</p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-black px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 shadow-md">
                  Llamar
                </span>
              </a>

              {/* Bomberos 119 */}
              <a
                href="tel:119"
                className="p-4 rounded-2xl bg-[#030712] border-2 border-slate-700 hover:border-amber-400 flex items-center justify-between transition-all group shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-600/25 border-2 border-amber-500 text-amber-400 flex items-center justify-center font-black text-xl">
                    119
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-sm sm:text-base group-hover:text-amber-300">
                      Bomberos y Rescate
                    </h4>
                    <p className="text-xs text-slate-300">Fugas de gas, incendios</p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-black px-4 py-2 rounded-xl bg-amber-500 text-slate-950 shadow-md">
                  Llamar
                </span>
              </a>

              {/* SEMAPA / Agua Potable 178 */}
              <a
                href="tel:178"
                className="p-4 rounded-2xl bg-[#030712] border-2 border-slate-700 hover:border-cyan-400 flex items-center justify-between transition-all group shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-600/25 border-2 border-cyan-500 text-cyan-300 flex items-center justify-center font-black text-xl">
                    178
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-sm sm:text-base group-hover:text-cyan-300">
                      Agua y Alcantarillado
                    </h4>
                    <p className="text-xs text-slate-300">Rotura de cañería o pozo</p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-black px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 shadow-md">
                  Llamar
                </span>
              </a>

              {/* ELFEC / Alumbrado 176 */}
              <a
                href="tel:176"
                className="p-4 rounded-2xl bg-[#030712] border-2 border-slate-700 hover:border-yellow-400 flex items-center justify-between transition-all group shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-500/25 border-2 border-yellow-500 text-yellow-300 flex items-center justify-center font-black text-xl">
                    176
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-sm sm:text-base group-hover:text-yellow-300">
                      Cables y Postes de Luz
                    </h4>
                    <p className="text-xs text-slate-300">Cables caídos y chispas</p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-black px-4 py-2 rounded-xl bg-yellow-500 text-slate-950 shadow-md">
                  Llamar
                </span>
              </a>
            </div>
          </div>
        )}

        {/* TAB 2: FORMULARIO DE REPORTE CON GPS REAL Y FOTO */}
        {activeTab === 'reportar' && (
          <form onSubmit={handleCreateReport} className="space-y-4 overflow-y-auto pr-1 text-xs sm:text-sm">
            {successMsg && (
              <div className="p-4 bg-emerald-950/90 border-2 border-emerald-500 rounded-2xl text-emerald-300 text-center font-extrabold flex items-center justify-center gap-2.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <span className="text-sm sm:text-base">
                  ¡Reporte publicado con éxito en {currentOtbInfo.name}! La Directiva y la Ronda Vecinal han sido alertadas.
                </span>
              </div>
            )}

            <div>
              <label className="font-black text-slate-200 block mb-2 text-xs sm:text-sm uppercase tracking-wide">
                1. Selecciona el problema que estás viendo en {currentOtbInfo.name}:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(Object.keys(CATEGORY_METADATA) as ReportCategory[]).map((catKey) => {
                  const meta = CATEGORY_METADATA[catKey];
                  const isSelected = category === catKey;
                  return (
                    <button
                      key={catKey}
                      type="button"
                      onClick={() => {
                        setCategory(catKey);
                        if (!title) {
                          if (catKey === 'borracho_cancha') setTitle('Alguien echado en la cancha / calle');
                          if (catKey === 'perro_peligro') setTitle('Perrito atropellado o en peligro');
                          if (catKey === 'fuga_agua') setTitle('Fuga de agua potable en la calle');
                          if (catKey === 'auto_sospechoso') setTitle('Auto o personas sospechosas rondando');
                          if (catKey === 'luminaria') setTitle('Poste de luz quemado / calle a oscuras');
                          if (catKey === 'basura') setTitle('Basural clandestino o escombros');
                          if (catKey === 'ruido') setTitle('Fiesta clandestina con exceso de bulla');
                        }
                      }}
                      className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 text-left font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/20'
                          : 'bg-[#020617] border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 flex-shrink-0">
                        {getCategoryIcon(catKey)}
                      </div>
                      <span className="text-xs sm:text-sm leading-snug">{meta.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Código de Socio y Lote */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-black text-slate-200 block mb-1 text-xs">
                  Tu Código de Socio / Cliente:
                </label>
                <input
                  type="text"
                  required
                  value={customSocioCode}
                  onChange={(e) => setCustomSocioCode(e.target.value)}
                  placeholder="ej. SOC-012"
                  className="w-full bg-[#020617] border-2 border-slate-600 rounded-xl px-3.5 py-2.5 text-white font-mono font-bold focus:border-amber-400 text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="font-black text-slate-200 block mb-1 text-xs">
                  Tu Manzana y Lote:
                </label>
                <input
                  type="text"
                  required
                  value={customLotName}
                  onChange={(e) => setCustomLotName(e.target.value)}
                  placeholder="ej. Manzana A, Lote 12"
                  className="w-full bg-[#020617] border-2 border-slate-600 rounded-xl px-3.5 py-2.5 text-white font-bold focus:border-amber-400 text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Título */}
            <div>
              <label className="font-black text-slate-200 block mb-1 text-xs sm:text-sm">
                Título Resumido del Aviso:
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ej. Alguien echado en la cancha / Perrito herido en la acera"
                className="w-full bg-[#020617] border-2 border-slate-600 rounded-xl px-3.5 py-2.5 text-white font-bold focus:border-amber-400 text-xs sm:text-sm"
              />
            </div>

            {/* Ubicación y Detección GPS Real */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-black text-slate-200 text-xs sm:text-sm">
                  ¿En qué calle o sector está ocurriendo?
                </label>
                <button
                  type="button"
                  onClick={handleGetGPS}
                  disabled={isLocating}
                  className="px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                >
                  {isLocating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Crosshair className="w-3.5 h-3.5 text-emerald-300" />
                  )}
                  <span>{isLocating ? 'Obteniendo GPS...' : '📍 Detectar mi GPS Real'}</span>
                </button>
              </div>

              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="ej. Cancha Polifuncional, Manzana B"
                  className="w-full bg-[#020617] border-2 border-slate-600 rounded-xl pl-9 pr-3 py-2.5 text-white font-medium focus:border-amber-400 text-xs sm:text-sm"
                />
              </div>

              {gpsStatus && (
                <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <Navigation className="w-3 h-3" />
                  <span>{gpsStatus}</span>
                </p>
              )}

              {/* Mapa Comunal Interactivo para Seleccionar Ubicación Táctil */}
              <div className="pt-1 space-y-1">
                <span className="text-[11px] text-slate-300 font-semibold block">
                  📍 O toca/haz clic en el mapa para marcar el lugar exacto:
                </span>
                <CommunityInteractiveMap
                  centerLat={selectedOtbId.includes('2222') ? -16.54124 : -17.41325}
                  centerLng={selectedOtbId.includes('2222') ? -68.08215 : -66.16543}
                  zoom={16}
                  heightClass="h-44 sm:h-52"
                  otbName={currentOtbInfo.name}
                  interactiveSelection={true}
                  onSelectCoordinates={(lat, lng) => {
                    setLatitude(lat);
                    setLongitude(lng);
                    setGpsAccuracy(5);
                    setLocation(`Ubicación marcada en mapa: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
                    setGpsStatus('✓ Punto exacto fijado en el mapa comunal');
                  }}
                />
              </div>
            </div>

            {/* Foto de Respaldo */}
            <div>
              <label className="font-black text-slate-200 block mb-1 text-xs sm:text-sm">
                Foto de Respaldo o Evidencia (Cámara / Galería):
              </label>
              {photoUrl ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/60 p-2 bg-[#020617] flex items-center gap-3">
                  <img
                    src={photoUrl}
                    alt="Foto Evidencia"
                    className="w-14 h-14 object-cover rounded-xl border border-slate-700"
                  />
                  <div className="flex-1 truncate">
                    <span className="text-xs font-bold text-white block truncate">{photoName || 'Foto adjuntada'}</span>
                    <span className="text-[10px] text-emerald-400 font-bold">✓ Evidencia lista para transmitir</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoName(null);
                      setPhotoUrl(null);
                    }}
                    className="p-1.5 rounded-lg bg-rose-600/30 text-rose-300 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer text-xs font-bold"
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-600 hover:border-amber-400 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-colors bg-[#020617] text-slate-300">
                  <Camera className="w-5 h-5 text-amber-400" />
                  <span className="truncate text-xs sm:text-sm font-semibold">
                    Tomar foto con el celular o subir desde galería
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Detalles */}
            <div>
              <label className="font-black text-slate-200 block mb-1 text-xs sm:text-sm">
                Describe qué está pasando:
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Indica qué viste, si la persona o animalito necesita abrigo o auxilio médico, color de auto o si el agua se está desbordando..."
                className="w-full bg-[#020617] border-2 border-slate-600 rounded-xl p-3 text-white font-medium focus:border-amber-400 text-xs sm:text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 transition-all cursor-pointer"
            >
              <Send className="w-5 h-5 text-slate-950" />
              <span>{isSubmitting ? 'Transmitiendo Alerta al Barrio...' : `Publicar Alerta Inmediata en ${currentOtbInfo.name}`}</span>
            </button>
          </form>
        )}

        {/* TAB 3: MURO VECINAL EN VIVO ESTRICTO DE LA OTB */}
        {activeTab === 'muro' && (
          <div className="space-y-3 overflow-y-auto pr-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-slate-300 pb-1">
              <span>
                Reportes comunitarios activos en <strong className="text-emerald-400">{currentOtbInfo.name}</strong>:
              </span>

              <div className="flex items-center gap-2">
                <div className="flex bg-[#020617] p-1 rounded-xl border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setMuroViewMode('mapa')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                      muroViewMode === 'mapa'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <MapIcon className="w-3.5 h-3.5" />
                    <span>Mapa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMuroViewMode('lista')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                      muroViewMode === 'lista'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>Lista ({otbReports.length})</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('reportar')}
                  className="text-amber-400 hover:underline font-black text-xs sm:text-sm whitespace-nowrap"
                >
                  + Nuevo Reporte
                </button>
              </div>
            </div>

            {/* Vista 1: Mapa Comunal de Incidentes */}
            {muroViewMode === 'mapa' && (
              <div className="space-y-2">
                <CommunityInteractiveMap
                  reports={otbReports}
                  centerLat={selectedOtbId.includes('2222') ? -16.54124 : -17.41325}
                  centerLng={selectedOtbId.includes('2222') ? -68.08215 : -66.16543}
                  zoom={16}
                  heightClass="h-72 sm:h-80"
                  otbName={currentOtbInfo.name}
                />
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
                  <span className="font-bold text-slate-400">Pines en el mapa:</span>
                  <span className="inline-flex items-center gap-1">🏛️ Sede</span>
                  <span className="inline-flex items-center gap-1">⚽ Cancha</span>
                  <span className="inline-flex items-center gap-1">🍺 Ebrio</span>
                  <span className="inline-flex items-center gap-1">💧 Agua</span>
                  <span className="inline-flex items-center gap-1">🐕 Mascota</span>
                  <span className="inline-flex items-center gap-1">💡 Luz</span>
                </div>
              </div>
            )}

            {/* Vista 2: Lista de Reportes (o si no hay mapa activo) */}
            {(muroViewMode === 'lista' || otbReports.length === 0) && (
              <>
                {otbReports.length === 0 ? (
                  <div className="p-8 text-center bg-[#020617] border border-slate-700 rounded-2xl text-slate-400 space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                    <p className="font-bold text-white text-base">Tranquilidad en {currentOtbInfo.name}</p>
                    <p className="text-xs text-slate-400">
                      No hay incidentes sin resolver reportados en esta OTB. Los datos no se mezclan con otras zonas.
                    </p>
                  </div>
                ) : (
                  otbReports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-2xl bg-[#030712] border-2 border-slate-700 space-y-3 shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 flex-shrink-0">
                        {getCategoryIcon(rep.category)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-white text-sm sm:text-base leading-snug">
                          {rep.title}
                        </h4>
                        <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{rep.location} • <strong className="text-amber-400">{rep.timestamp}</strong></span>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[11px] font-black px-3 py-1 rounded-full border flex-shrink-0 ${
                        rep.status === 'resuelto'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                          : rep.status === 'en_camino'
                          ? 'bg-rose-500/25 text-rose-300 border-rose-500/60 animate-pulse'
                          : rep.status === 'atendiendo'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                      }`}
                    >
                      {rep.statusLabel}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-[#0B132B] p-3 rounded-xl border border-slate-800">
                    {rep.description}
                  </p>

                  {/* Foto de Evidencia Adjunta si existe */}
                  {rep.photoUrl && (
                    <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700 bg-black/60 max-h-56 group">
                      <img
                        src={rep.photoUrl}
                        alt="Evidencia fotográfica del reporte"
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform cursor-pointer"
                        onClick={() => setEnlargedPhoto(rep.photoUrl || null)}
                      />
                      <button
                        type="button"
                        onClick={() => setEnlargedPhoto(rep.photoUrl || null)}
                        className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/75 hover:bg-black text-white text-[11px] font-bold border border-white/20 flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-400" />
                        <span>Ver Foto Completa</span>
                      </button>
                    </div>
                  )}

                  {/* Botón GPS Google Maps si tiene coordenadas */}
                  {rep.mapUrl && (
                    <div className="pt-1">
                      <a
                        href={rep.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/80 hover:bg-blue-900 border border-blue-500/50 text-blue-300 text-xs font-bold transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                        <span>📍 Abrir Ubicación en Google Maps (GPS)</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    </div>
                  )}

                  {rep.actionNotes && (
                    <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-500/40 text-xs text-blue-200">
                      <strong className="text-white block font-bold mb-0.5">Respuesta de la Mesa Directiva:</strong>
                      {rep.actionNotes}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      Reportado por: <strong className="text-slate-200 font-bold">{rep.reportedByPublic}</strong>
                    </span>

                    {/* Acciones de Mesa Directiva / Vecinos para cambiar estado */}
                    <div className="flex items-center gap-1.5">
                      {rep.status !== 'en_camino' && rep.status !== 'resuelto' && (
                        <button
                          type="button"
                          onClick={() => updateReportStatus(rep.id, 'en_camino', 'La Ronda Vecinal y Directiva acuden en auxilio.')}
                          className="px-2.5 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/50 text-[11px] font-black cursor-pointer"
                        >
                          Marcar "En Camino"
                        </button>
                      )}
                      {rep.status !== 'resuelto' && (
                        <button
                          type="button"
                          onClick={() => updateReportStatus(rep.id, 'resuelto', 'Incidente atendido y resuelto favorablemente por la comunidad.')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/50 text-[11px] font-black cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Resuelto
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Lightbox / Foto Ampliada en Pantalla Completa */}
      {enlargedPhoto && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setEnlargedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden border-2 border-slate-600 bg-black">
            <button
              onClick={() => setEnlargedPhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-black/80 text-white hover:bg-rose-600 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={enlargedPhoto}
              alt="Foto Evidencia Completa"
              className="w-full h-full object-contain"
            />
            <div className="p-3 bg-slate-900/90 text-center text-xs text-slate-300">
              Evidencia fotográfica transmitida en vivo a la Directiva y Ronda Vecinal
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
