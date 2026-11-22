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
  List,
  ShieldCheck,
  Search,
  KeyRound,
  Lock,
  Maximize2,
  Minimize2
} from 'lucide-react';
import {
  useCommunityReportsStore,
  ReportCategory,
  CATEGORY_METADATA
} from '../stores/communityReportsStore';
import { CommunityInteractiveMap } from './CommunityInteractiveMap';
import {
  findNeighborByCodeOrCi,
  getNeighborsByOtb,
  CensusNeighbor
} from '../data/censusNeighbors';

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
  { id: '11111111-1111-1111-1111-111111111111', name: 'Villa Graciela (Distrito 1)', city: 'Cochabamba', code: 'OTB-CBBA-024', defaultAddress: 'Distrito 1' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Los Pinos', city: 'La Paz', code: 'OTB-LPZ-002', defaultAddress: 'Zona Sur - Calacoto' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Barrio Lindo Plan 4000', city: 'Santa Cruz', code: 'OTB-SCZ-003', defaultAddress: 'Distrito 8 - Plan 3000' }
];

export const CommunityAlertsAndEmergencyModal: React.FC<CommunityAlertsAndEmergencyModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'emergencias',
  otbId = '11111111-1111-1111-1111-111111111111',
  otbName = 'Villa Graciela',
  socioCode,
  neighborName,
  lotName,
  phoneContact
}) => {
  const [activeTab, setActiveTab] = useState<'emergencias' | 'reportar' | 'muro'>(initialTab);
  const [isMaximized, setIsMaximized] = useState(false);

  // Aislamiento estricto por OTB
  const [selectedOtbId, setSelectedOtbId] = useState(otbId);

  React.useEffect(() => {
    if (otbId) setSelectedOtbId(otbId);
  }, [otbId]);

  const currentOtbInfo = OTBS_SISTEMA.find(o => o.id === selectedOtbId) || {
    id: selectedOtbId,
    name: otbName,
    city: 'Bolivia',
    code: 'OTB-REG',
    defaultAddress: 'Sede Social'
  };

  const otbCensusNeighbors = getNeighborsByOtb(selectedOtbId);

  // Inicializar socio verificado si viene pre-autenticado y es específico (ej. Don Juan José en NeighborDashboard)
  const initialResolved = socioCode && socioCode !== 'SOC-001' && socioCode !== 'ADM-PRES' && socioCode !== 'SOC-DEMO'
    ? findNeighborByCodeOrCi(socioCode, selectedOtbId)
    : null;

  const [verifiedNeighbor, setVerifiedNeighbor] = useState<CensusNeighbor | null>(initialResolved);
  const [lookupInput, setLookupInput] = useState('');
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [isUnregistered, setIsUnregistered] = useState(false);

  // Datos manuales para vecinos no censados
  const [manualName, setManualName] = useState(neighborName && neighborName !== 'Vecino OTB' ? neighborName : '');
  const [manualCi, setManualCi] = useState('');
  const [manualPhone, setManualPhone] = useState(phoneContact || '');
  const [manualLot, setManualLot] = useState(lotName && lotName !== 'Manzana A, Lote 01' ? lotName : '');

  const { addReport, updateReportStatus, getReportsByOtb } = useCommunityReportsStore();
  // SOLO reportes de la OTB seleccionada
  const otbReports = getReportsByOtb(selectedOtbId);

  // Formulario de nuevo reporte
  const [category, setCategory] = useState<ReportCategory>('borracho_cancha');
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

  const handleVerifyNeighbor = () => {
    if (!lookupInput.trim()) {
      setLookupError('Por favor ingresa tu código de socio (ej. SOC-012) o tu número de Carnet (C.I.).');
      return;
    }
    const found = findNeighborByCodeOrCi(lookupInput, selectedOtbId);
    if (found) {
      setVerifiedNeighbor(found);
      setLookupError(null);
      setIsUnregistered(false);
    } else {
      setLookupError(`No se encontró el socio o carnet "${lookupInput}" en el padrón de ${currentOtbInfo.name}. Revisa los dígitos o presiona abajo tu nombre para acceso rápido.`);
    }
  };

  const handleSelectNeighbor = (neighbor: CensusNeighbor) => {
    setVerifiedNeighbor(neighbor);
    setLookupError(null);
    setIsUnregistered(false);
  };

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

    if (!verifiedNeighbor && !isUnregistered) {
      setLookupError('⚠️ Paso Obligatorio: Primero debes validar tu Código de Socio o seleccionar la opción de vecino en proceso.');
      return;
    }

    if (isUnregistered && (!manualName.trim() || !manualPhone.trim() || !manualLot.trim())) {
      setLookupError('⚠️ Completa tu nombre, celular y manzana/lote para que la Ronda Vecinal pueda validar el reporte.');
      return;
    }

    const finalSocioCode = verifiedNeighbor ? verifiedNeighbor.socioCode : 'SIN-CÓDIGO';
    const finalNeighborName = verifiedNeighbor ? verifiedNeighbor.name : manualName;
    const finalLotName = verifiedNeighbor ? `${verifiedNeighbor.block}, ${verifiedNeighbor.house}` : manualLot;
    const finalPhone = verifiedNeighbor ? verifiedNeighbor.phone : manualPhone;
    const finalCi = verifiedNeighbor ? verifiedNeighbor.ci : manualCi;

    setIsSubmitting(true);
    setTimeout(() => {
      addReport({
        otbId: selectedOtbId,
        otbName: currentOtbInfo.name,
        category,
        title,
        description,
        location,
        socioCode: finalSocioCode,
        neighborName: finalNeighborName,
        lotName: finalLotName,
        phoneContact: finalPhone,
        ciNumber: finalCi,
        isVerifiedNeighbor: Boolean(verifiedNeighbor),
        reporterType: verifiedNeighbor ? 'socio_acreditado' : 'vecino_externo',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className={`bg-[#0B132B] border-2 border-slate-600 text-white w-full rounded-3xl p-4 sm:p-6 lg:p-7 shadow-2xl relative flex flex-col transition-all duration-300 my-auto ${
        isMaximized
          ? 'w-[98vw] max-w-[98vw] h-[96vh] max-h-[96vh]'
          : 'max-w-6xl max-h-[94vh]'
      }`}>
        {/* Botones de Cabecera: Maximizar y Cerrar */}
        <div className="absolute right-4 top-4 sm:right-6 sm:top-6 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMaximized(!isMaximized)}
            className="hidden sm:flex p-2.5 text-slate-300 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer border border-slate-700"
            title={isMaximized ? "Restaurar tamaño normal" : "Maximizar pantalla completa"}
            aria-label="Maximizar modal"
          >
            {isMaximized ? <Minimize2 className="w-5 h-5 text-blue-400" /> : <Maximize2 className="w-5 h-5 text-slate-300" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 text-slate-300 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer border border-slate-700"
            aria-label="Cerrar modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Encabezado con Selector de OTB Aislado */}
        <div className="mb-4 pr-24 space-y-2">
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

        {/* Identidad del Vecino Conectado / Estado de Acreditación */}
        <div className={`mb-4 p-3 rounded-2xl bg-[#020617] border flex items-center justify-between gap-3 text-xs sm:text-sm ${
          verifiedNeighbor
            ? 'border-emerald-500/60 shadow-lg shadow-emerald-500/10'
            : isUnregistered
            ? 'border-amber-500/60'
            : 'border-blue-500/40'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl text-white font-black flex items-center justify-center text-sm shadow-sm ${
              verifiedNeighbor
                ? 'bg-emerald-600'
                : isUnregistered
                ? 'bg-amber-600'
                : 'bg-blue-600'
            }`}>
              {verifiedNeighbor ? <ShieldCheck className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
            </div>
            <div>
              <span className={`text-[11px] font-bold block uppercase tracking-wide ${
                verifiedNeighbor ? 'text-emerald-300' : isUnregistered ? 'text-amber-300' : 'text-blue-300'
              }`}>
                {verifiedNeighbor
                  ? '✓ Socio Acreditado en Padrón Comunal:'
                  : isUnregistered
                  ? '⚠️ Vecino No Censado (En Verificación):'
                  : 'Acreditación Comunal de Vecino:'}
              </span>
              <strong className="text-white font-extrabold text-xs sm:text-sm">
                {verifiedNeighbor
                  ? `${verifiedNeighbor.name} (${verifiedNeighbor.socioCode} • ${verifiedNeighbor.house})`
                  : isUnregistered
                  ? `${manualName || 'Vecino Externo'} • ${manualLot || 'Sin lote'}`
                  : 'Ingresa tu Código de Socio para emitir reportes'}
              </strong>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-700 whitespace-nowrap">
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
                className="p-5 min-h-[76px] rounded-2xl bg-[#030712] border-2 border-slate-700 hover:border-rose-400 flex items-center justify-between transition-all group shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-rose-600/25 border-2 border-rose-500 text-rose-400 flex items-center justify-center font-black text-2xl flex-shrink-0">
                    110
                  </div>
                  <div>
                    <h4 className="font-black text-white text-base sm:text-lg group-hover:text-rose-300">
                      Radiopatrullas Policía
                    </h4>
                    <p className="text-sm text-slate-100 font-medium mt-0.5">Robos, sospechosos, peleas</p>
                  </div>
                </div>
                <span className="text-sm sm:text-base font-black px-5 py-3 rounded-2xl bg-rose-600 text-white shadow-md flex-shrink-0">
                  Llamar
                </span>
              </a>

              {/* Presidente OTB y Ronda Vecinal */}
              <a
                href="tel:72345678"
                className="p-5 min-h-[76px] rounded-2xl bg-[#030712] border-2 border-blue-500/60 hover:border-blue-400 flex items-center justify-between transition-all group shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600/30 border-2 border-blue-400 text-blue-300 flex items-center justify-center font-black text-base flex-shrink-0">
                    OTB
                  </div>
                  <div>
                    <h4 className="font-black text-white text-base sm:text-lg group-hover:text-blue-300">
                      Presidente de la OTB
                    </h4>
                    <p className="text-sm text-slate-100 font-medium mt-0.5">Don Roberto • Cel: 72345678</p>
                  </div>
                </div>
                <span className="text-sm sm:text-base font-black px-5 py-3 rounded-2xl bg-blue-600 text-white shadow-md flex-shrink-0">
                  Llamar
                </span>
              </a>

              {/* Ambulancia SAMU 165 */}
              <a
                href="tel:165"
                className="p-5 min-h-[76px] rounded-2xl bg-[#030712] border-2 border-slate-700 hover:border-emerald-400 flex items-center justify-between transition-all group shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600/25 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center font-black text-2xl flex-shrink-0">
                    165
                  </div>
                  <div>
                    <h4 className="font-black text-white text-base sm:text-lg group-hover:text-emerald-300">
                      Ambulancia SAMU
                    </h4>
                    <p className="text-sm text-slate-100 font-medium mt-0.5">Desmayos, caídas, auxilio médico</p>
                  </div>
                </div>
                <span className="text-sm sm:text-base font-black px-5 py-3 rounded-2xl bg-emerald-500 text-slate-950 shadow-md flex-shrink-0">
                  Llamar
                </span>
              </a>

              {/* Bomberos 119 */}
              <a
                href="tel:119"
                className="p-5 min-h-[76px] rounded-2xl bg-[#030712] border-2 border-slate-700 hover:border-amber-400 flex items-center justify-between transition-all group shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-amber-600/25 border-2 border-amber-500 text-amber-400 flex items-center justify-center font-black text-2xl flex-shrink-0">
                    119
                  </div>
                  <div>
                    <h4 className="font-black text-white text-base sm:text-lg group-hover:text-amber-300">
                      Bomberos y Rescate
                    </h4>
                    <p className="text-sm text-slate-100 font-medium mt-0.5">Fugas de gas, incendios</p>
                  </div>
                </div>
                <span className="text-sm sm:text-base font-black px-5 py-3 rounded-2xl bg-amber-500 text-slate-950 shadow-md flex-shrink-0">
                  Llamar
                </span>
              </a>

              {/* SEMAPA / Agua Potable 178 */}
              <a
                href="tel:178"
                className="p-5 min-h-[76px] rounded-2xl bg-[#030712] border-2 border-slate-700 hover:border-cyan-400 flex items-center justify-between transition-all group shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-600/25 border-2 border-cyan-500 text-cyan-300 flex items-center justify-center font-black text-2xl flex-shrink-0">
                    178
                  </div>
                  <div>
                    <h4 className="font-black text-white text-base sm:text-lg group-hover:text-cyan-300">
                      Agua y Alcantarillado
                    </h4>
                    <p className="text-sm text-slate-100 font-medium mt-0.5">Rotura de cañería o pozo</p>
                  </div>
                </div>
                <span className="text-sm sm:text-base font-black px-5 py-3 rounded-2xl bg-cyan-500 text-slate-950 shadow-md flex-shrink-0">
                  Llamar
                </span>
              </a>

              {/* ELFEC / Alumbrado 176 */}
              <a
                href="tel:176"
                className="p-5 min-h-[76px] rounded-2xl bg-[#030712] border-2 border-slate-700 hover:border-yellow-400 flex items-center justify-between transition-all group shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-yellow-500/25 border-2 border-yellow-500 text-yellow-300 flex items-center justify-center font-black text-2xl flex-shrink-0">
                    176
                  </div>
                  <div>
                    <h4 className="font-black text-white text-base sm:text-lg group-hover:text-yellow-300">
                      Cables y Postes de Luz
                    </h4>
                    <p className="text-sm text-slate-100 font-medium mt-0.5">Cables caídos y chispas</p>
                  </div>
                </div>
                <span className="text-sm sm:text-base font-black px-5 py-3 rounded-2xl bg-yellow-500 text-slate-950 shadow-md flex-shrink-0">
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

            {/* PASO 1 OBLIGATORIO: CONTROL DE IDENTIDAD Y ACREDITACIÓN DE SOCIO */}
            {!verifiedNeighbor && !isUnregistered ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#020617] border-2 border-amber-500 shadow-xl space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-500 text-amber-400 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white">
                      Paso 1: Acreditación de Socio Obligatoria
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Para la seguridad de <strong className="text-emerald-400">{currentOtbInfo.name}</strong> y evitar falsas alarmas, ingresa tu Código de Socio o Carnet (C.I.):
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                    <input
                      type="text"
                      value={lookupInput}
                      onChange={(e) => {
                        setLookupInput(e.target.value);
                        setLookupError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleVerifyNeighbor();
                        }
                      }}
                      placeholder="Ej: SOC-012, SOC-005 o Carnet 7412589..."
                      className="w-full min-h-[54px] bg-slate-900 border-2 border-slate-600 rounded-2xl pl-11 pr-4 py-3 text-white font-mono font-bold text-sm sm:text-base focus:border-amber-400 placeholder:text-slate-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyNeighbor}
                    className="min-h-[54px] px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/25 whitespace-nowrap"
                  >
                    <UserCheck className="w-5 h-5 text-slate-950" />
                    <span>Validar Mi Socio</span>
                  </button>
                </div>

                {lookupError && (
                  <div className="p-3.5 rounded-xl bg-rose-950/80 border-2 border-rose-500 text-rose-200 text-sm font-bold flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                    <span>{lookupError}</span>
                  </div>
                )}

                {/* Acceso Rápido 1-Toque para Adultos Mayores 50+ */}
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-xs sm:text-sm font-black text-slate-300 block mb-2 uppercase tracking-wide">
                    👴👵 Socios Registrados en {currentOtbInfo.name} (Toca tu nombre):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {otbCensusNeighbors.slice(0, 6).map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => handleSelectNeighbor(n)}
                        className="min-h-[60px] p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 hover:border-amber-400 text-left transition-all cursor-pointer group shadow-sm"
                      >
                        <span className="text-sm font-black text-white block group-hover:text-amber-300 truncate">
                          {n.name}
                        </span>
                        <span className="text-xs font-mono text-emerald-300 font-bold block mt-0.5">
                          {n.socioCode} • {n.house}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-1 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUnregistered(true);
                      setLookupError(null);
                    }}
                    className="text-sm text-blue-300 hover:text-blue-200 font-bold underline cursor-pointer"
                  >
                    ¿Eres nuevo vecino, inquilino o visitante del barrio? Pulsa aquí para reportar →
                  </button>
                </div>
              </div>
            ) : isUnregistered ? (
              <div className="p-5 rounded-2xl bg-amber-950/40 border-2 border-amber-500/70 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-300 font-black text-sm sm:text-base">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    <span>Reporte de Vecino en Proceso de Empadronamiento</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUnregistered(false);
                      setLookupError(null);
                    }}
                    className="text-xs sm:text-sm text-slate-200 hover:text-white underline font-bold cursor-pointer"
                  >
                    Tengo código de socio
                  </button>
                </div>
                <p className="text-sm text-slate-200 font-medium">
                  Ingresa tus datos para vincular el aviso a tu domicilio en {currentOtbInfo.name}:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="Tu Nombre Completo..."
                    className="w-full min-h-[50px] bg-[#020617] border-2 border-slate-600 rounded-xl px-3.5 py-2.5 text-white font-bold text-sm"
                  />
                  <input
                    type="text"
                    required
                    value={manualCi}
                    onChange={(e) => setManualCi(e.target.value)}
                    placeholder="Carnet de Identidad (C.I.)..."
                    className="w-full min-h-[50px] bg-[#020617] border-2 border-slate-600 rounded-xl px-3.5 py-2.5 text-white font-bold text-sm"
                  />
                  <input
                    type="text"
                    required
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="Celular de Contacto..."
                    className="w-full min-h-[50px] bg-[#020617] border-2 border-slate-600 rounded-xl px-3.5 py-2.5 text-white font-bold text-sm"
                  />
                  <input
                    type="text"
                    required
                    value={manualLot}
                    onChange={(e) => setManualLot(e.target.value)}
                    placeholder="Manzana y Lote referencial..."
                    className="w-full min-h-[50px] bg-[#020617] border-2 border-slate-600 rounded-xl px-3.5 py-2.5 text-white font-bold text-sm"
                  />
                </div>
              </div>
            ) : (
              /* Vecino Verificado y Acreditado */
              <div className="p-5 rounded-2xl bg-[#020617] border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center font-black flex-shrink-0">
                    <UserCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-emerald-300 bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-700">
                        ✓ Socio Acreditado en {currentOtbInfo.name}
                      </span>
                      <span className="text-sm font-mono font-black text-white">
                        {verifiedNeighbor?.socioCode}
                      </span>
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-white mt-1">
                      {verifiedNeighbor?.name}
                    </h4>
                    <p className="text-sm text-slate-100 font-medium">
                      📍 {verifiedNeighbor?.block}, {verifiedNeighbor?.house} • C.I. {verifiedNeighbor?.ci} • Cel: {verifiedNeighbor?.phone}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setVerifiedNeighbor(null);
                    setLookupInput('');
                    setLookupError(null);
                  }}
                  className="min-h-[46px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-black border-2 border-slate-600 transition-all cursor-pointer whitespace-nowrap"
                >
                  Cambiar Socio
                </button>
              </div>
            )}

            <div>
              <label className="font-black text-white block mb-2 text-sm sm:text-base uppercase tracking-wide">
                2. Selecciona el problema que estás viendo en {currentOtbInfo.name}:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  centerLat={selectedOtbId.includes('2222') ? -16.54124 : -17.4128}
                  centerLng={selectedOtbId.includes('2222') ? -68.08215 : -66.1654}
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
              disabled={isSubmitting || (!verifiedNeighbor && !isUnregistered)}
              className={`w-full py-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
                !verifiedNeighbor && !isUnregistered
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
              }`}
            >
              <Send className="w-5 h-5" />
              <span>
                {isSubmitting
                  ? 'Transmitiendo Alerta al Barrio...'
                  : !verifiedNeighbor && !isUnregistered
                  ? '⚠️ Primero Valida tu Código de Socio para Transmitir'
                  : `🚨 Publicar Alerta Comunal Acreditada (${verifiedNeighbor ? verifiedNeighbor.socioCode : 'Vecino Externo'})`}
              </span>
            </button>
          </form>
        )}

        {/* TAB 3: MURO VECINAL EN VIVO Y MAPA CATASTRAL HARMONIZADO */}
        {activeTab === 'muro' && (
          <div className="flex-1 overflow-y-auto pr-1 space-y-3">
            {/* Barra Superior de Control del Muro */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-slate-300 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>
                  Incidentes y Catastro en <strong className="text-emerald-400 font-extrabold">{currentOtbInfo.name}</strong> ({otbReports.length} activos)
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Selector Mapa / Lista (en móvil y vistas rápidas) */}
                <div className="flex bg-[#020617] p-1 rounded-xl border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setMuroViewMode('mapa')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all ${
                      muroViewMode === 'mapa'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <MapIcon className="w-3.5 h-3.5" />
                    <span>Mapa Ampliado</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMuroViewMode('lista')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all ${
                      muroViewMode === 'lista'
                        ? 'bg-blue-600 text-white shadow-md'
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
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm whitespace-nowrap shadow-md transition-colors cursor-pointer"
                >
                  + Nuevo Reporte
                </button>
              </div>
            </div>

            {/* VISTA 1: MODO MAPA ARMÓNICO (2 COLUMNAS EN ESCRITORIO / FULL EN MÓVIL) */}
            {muroViewMode === 'mapa' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                {/* COLUMNA PRINCIPAL DEL MAPA (8 de 12 columnas en escritorio) */}
                <div className="lg:col-span-8 flex flex-col space-y-2">
                  <div className="rounded-2xl overflow-hidden border-2 border-slate-700 shadow-xl relative bg-slate-950">
                    <CommunityInteractiveMap
                      reports={otbReports}
                      otbId={selectedOtbId}
                      otbName={currentOtbInfo.name}
                      zoom={16}
                      heightClass={
                        isMaximized
                          ? 'h-[520px] sm:h-[600px] lg:h-[680px]'
                          : 'h-[420px] sm:h-[480px] lg:h-[540px]'
                      }
                    />
                  </div>

                  {/* Leyenda de Pines y Catastro */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300 bg-slate-900/90 p-2.5 rounded-xl border border-slate-700/80 shadow-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-slate-400 uppercase tracking-wider text-[10px]">Pines de auxilio:</span>
                      <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">🏛️ Sede</span>
                      <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">⚽ Cancha</span>
                      <span className="inline-flex items-center gap-1 bg-rose-950/60 text-rose-300 px-2 py-0.5 rounded-md border border-rose-800/50">🍺 Ebrio</span>
                      <span className="inline-flex items-center gap-1 bg-cyan-950/60 text-cyan-300 px-2 py-0.5 rounded-md border border-cyan-800/50">💧 Agua</span>
                      <span className="inline-flex items-center gap-1 bg-amber-950/60 text-amber-300 px-2 py-0.5 rounded-md border border-amber-800/50">🐕 Mascota</span>
                      <span className="inline-flex items-center gap-1 bg-yellow-950/60 text-yellow-300 px-2 py-0.5 rounded-md border border-yellow-800/50">💡 Luz</span>
                    </div>
                    <span className="text-[10.5px] text-emerald-400 font-bold hidden sm:inline">
                      📍 Clic en cualquier manzano para ver lotes
                    </span>
                  </div>
                </div>

                {/* COLUMNA LATERAL DE REPORTES EN ESCRITORIO (4 de 12 columnas) */}
                <div className="lg:col-span-4 flex flex-col space-y-2.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-black text-slate-300 uppercase tracking-wider">
                      Incidentes Reportados ({otbReports.length}):
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">En vivo</span>
                  </div>

                  <div className={`overflow-y-auto pr-1 space-y-2.5 ${
                    isMaximized
                      ? 'max-h-[560px] lg:max-h-[660px]'
                      : 'max-h-[420px] lg:max-h-[540px]'
                  }`}>
                    {otbReports.length === 0 ? (
                      <div className="p-6 text-center bg-[#020617] border border-slate-800 rounded-2xl text-slate-400 space-y-2">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                        <p className="font-bold text-white text-sm">Sin incidentes activos</p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          La zona de {currentOtbInfo.name} se encuentra en orden y tranquilidad.
                        </p>
                      </div>
                    ) : (
                      otbReports.map((rep) => (
                        <div
                          key={rep.id}
                          className="p-3.5 rounded-2xl bg-[#030712] border border-slate-700/80 hover:border-slate-600 transition-all space-y-2 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-700 flex-shrink-0">
                                {getCategoryIcon(rep.category)}
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-black text-white text-xs leading-snug truncate">
                                  {rep.title}
                                </h4>
                                <span className="text-[10.5px] text-slate-400 block truncate">
                                  {rep.timestamp}
                                </span>
                              </div>
                            </div>
                            <span
                              className={`text-[9.5px] font-black px-2 py-0.5 rounded-full border flex-shrink-0 ${
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

                          <p className="text-xs text-slate-200 leading-relaxed bg-[#0B132B]/80 p-2.5 rounded-xl border border-slate-800/80 line-clamp-2">
                            {rep.description}
                          </p>

                          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/60">
                            <span className="text-slate-400 flex items-center gap-1 truncate max-w-[170px]">
                              <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                              <span className="truncate">{rep.location}</span>
                            </span>
                            {rep.photoUrl && (
                              <button
                                type="button"
                                onClick={() => setEnlargedPhoto(rep.photoUrl || null)}
                                className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 text-[11px] cursor-pointer"
                              >
                                <Camera className="w-3.5 h-3.5" />
                                <span>Ver Foto</span>
                              </button>
                            )}
                          </div>

                          {/* Botones rápidos de atención vecinal */}
                          {rep.status !== 'resuelto' && (
                            <div className="flex items-center gap-2 pt-1">
                              {rep.status !== 'en_camino' && (
                                <button
                                  type="button"
                                  onClick={() => updateReportStatus(rep.id, 'en_camino', 'La Ronda Vecinal y Directiva acuden en auxilio.')}
                                  className="flex-1 py-1 rounded-lg bg-rose-600/25 hover:bg-rose-600/40 text-rose-200 border border-rose-500/50 text-[10.5px] font-black cursor-pointer text-center"
                                >
                                  En Camino
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => updateReportStatus(rep.id, 'resuelto', 'Incidente atendido y resuelto favorablemente por la comunidad.')}
                                className="flex-1 py-1 rounded-lg bg-emerald-600/25 hover:bg-emerald-600/40 text-emerald-200 border border-emerald-500/50 text-[10.5px] font-black cursor-pointer text-center flex items-center justify-center gap-1"
                              >
                                <Check className="w-3 h-3" /> Resuelto
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* VISTA 2: SOLO LISTA DETALLADA */
              <div className="space-y-3">
                {otbReports.length === 0 ? (
                  <div className="p-8 text-center bg-[#020617] border border-slate-700 rounded-2xl text-slate-400 space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                    <p className="font-bold text-white text-base">Tranquilidad en {currentOtbInfo.name}</p>
                    <p className="text-xs text-slate-400">
                      No hay incidentes sin resolver reportados en esta OTB. Los datos no se mezclan con otras zonas.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {otbReports.map((rep) => (
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

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {rep.isVerifiedNeighbor !== false ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-black">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                Socio Acreditado:
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                                Vecino No Censado:
                              </span>
                            )}
                            <strong className="text-white font-bold">{rep.neighborName}</strong>
                            <span className="text-slate-400 font-mono text-[11px]">({rep.socioCode} • {rep.lotName})</span>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            {rep.phoneContact && (
                              <a
                                href={`tel:${rep.phoneContact}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/40 text-[11px] font-bold transition-colors"
                              >
                                <PhoneCall className="w-3 h-3 text-blue-300" />
                                <span>Llamar ({rep.phoneContact})</span>
                              </a>
                            )}

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
                    ))}
                  </div>
                )}
              </div>
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
