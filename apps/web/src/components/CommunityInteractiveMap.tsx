import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CommunityReport, ReportCategory } from '../stores/communityReportsStore';
import {
  useCommunityMapStore,
  CommunityManzano,
  CommunityFacility
} from '../stores/communityMapStore';
import {
  MapPin,
  ExternalLink,
  ShieldCheck,
  Layers,
  Edit3,
  Check,
  Plus,
  Trash2,
  RotateCcw,
  Save,
  Home,
  Building,
  AlertTriangle,
  X,
  Compass,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';

interface CommunityInteractiveMapProps {
  reports?: CommunityReport[];
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
  heightClass?: string;
  otbName?: string;
  otbId?: string;
  selectedLotName?: string;
  onSelectCoordinates?: (lat: number, lng: number) => void;
  interactiveSelection?: boolean;
  enableAdminEditor?: boolean;
  showControls?: boolean;
}

// Cálculo aproximado de superficie en hectáreas para el perímetro comunal
function calculatePolygonAreaHectares(coords: [number, number][]): number {
  if (coords.length < 3) return 0;
  const earthRadius = 6378137;
  let area = 0;
  for (let i = 0; i < coords.length; i++) {
    const j = (i + 1) % coords.length;
    const p1 = coords[i];
    const p2 = coords[j];
    const lat1 = (p1[0] * Math.PI) / 180;
    const lat2 = (p2[0] * Math.PI) / 180;
    const dLng = ((p2[1] - p1[1]) * Math.PI) / 180;
    area += dLng * (2 + Math.sin(lat1) + Math.sin(lat2));
  }
  area = Math.abs((area * earthRadius * earthRadius) / 2);
  return area / 10000;
}

// Centroide para centrar etiquetas de manzanos
function getPolygonCentroid(pts: [number, number][]): [number, number] {
  if (pts.length === 0) return [-17.41325, -66.16543];
  let latSum = 0;
  let lngSum = 0;
  pts.forEach((p) => {
    latSum += p[0];
    lngSum += p[1];
  });
  return [latSum / pts.length, lngSum / pts.length];
}

export const CommunityInteractiveMap: React.FC<CommunityInteractiveMapProps> = ({
  reports = [],
  centerLat = -17.41325,
  centerLng = -66.16543,
  zoom = 16,
  heightClass = 'h-80 sm:h-[420px]',
  otbName = 'OTB Villa Esperanza',
  otbId = '11111111-1111-1111-1111-111111111111',
  selectedLotName,
  onSelectCoordinates,
  interactiveSelection = false,
  enableAdminEditor = false,
  showControls = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const selectionMarkerRef = useRef<L.Marker | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);
  const editorLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Store de territorio comunal
  const {
    getTerritory,
    updatePerimeter,
    addPerimeterVertex,
    removeLastPerimeterVertex,
    clearPerimeter,
    addManzano,
    deleteManzano,
    addFacility,
    deleteFacility,
    resetToDefault
  } = useCommunityMapStore();

  const territory = getTerritory(otbId);

  // Filtros de visualización para vecinos
  const [layerFilters, setLayerFilters] = useState({
    perimetro: true,
    manzanos: true,
    equipamiento: true,
    reportes: true
  });

  // Estado del Editor Territorial para Administradores
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorTool, setEditorTool] = useState<'perimetro' | 'manzano' | 'equipamiento'>('perimetro');
  const [editingPerimeter, setEditingPerimeter] = useState<[number, number][]>(territory.perimeter);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Formulario de nuevo manzano
  const [newManzanoName, setNewManzanoName] = useState('Manzano E');
  const [newManzanoCode, setNewManzanoCode] = useState('MZE');
  const [newManzanoLots, setNewManzanoLots] = useState(20);
  const [newManzanoColor, setNewManzanoColor] = useState('#EC4899');
  const [newManzanoDesc, setNewManzanoDesc] = useState('Ampliación Sector Oeste');
  const [newManzanoPoints, setNewManzanoPoints] = useState<[number, number][]>([]);

  // Formulario de nuevo equipamiento
  const [newFacName, setNewFacName] = useState('');
  const [newFacCategory, setNewFacCategory] = useState<CommunityFacility['category']>('seguridad');
  const [newFacDesc, setNewFacDesc] = useState('');
  const [newFacCoord, setNewFacCoord] = useState<[number, number] | null>(null);

  // Sincronizar perímetro local al cambiar en store
  useEffect(() => {
    setEditingPerimeter(territory.perimeter);
  }, [territory.perimeter]);

  // =========================================================================
  // 1. INICIALIZACIÓN DEL MAPA BASE LEAFLET
  // =========================================================================
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: zoom,
      scrollWheelZoom: false,
      zoomControl: true
    });
    mapInstanceRef.current = map;

    // Capa base OpenStreetMap 100% Libre
    const primaryTileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    });

    primaryTileLayer.on('tileerror', () => {
      L.tileLayer('https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
    });

    primaryTileLayer.addTo(map);

    // Grupos de capas
    const mainGroup = L.layerGroup().addTo(map);
    layersGroupRef.current = mainGroup;

    const editorGroup = L.layerGroup().addTo(map);
    editorLayerGroupRef.current = editorGroup;

    // Manejo de clic en el mapa
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      // Si está en modo selección interactiva (ej. reportes)
      if (interactiveSelection && onSelectCoordinates) {
        if (selectionMarkerRef.current) {
          selectionMarkerRef.current.setLatLng([lat, lng]);
        } else {
          const clickIcon = L.divIcon({
            html: `
              <div style="background-color: #EF4444; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 4px 14px rgba(239,68,68,0.7);">
                📍
              </div>
            `,
            className: 'click-icon',
            iconSize: [34, 34],
            iconAnchor: [17, 34]
          });
          selectionMarkerRef.current = L.marker([lat, lng], { icon: clickIcon }).addTo(map);
        }
        onSelectCoordinates(lat, lng);
        return;
      }

      // Si el Administrador está dibujando territorio
      if (isEditorOpen) {
        if (editorTool === 'perimetro') {
          setEditingPerimeter((prev) => [...prev, [lat, lng]]);
        } else if (editorTool === 'manzano') {
          setNewManzanoPoints((prev) => [...prev, [lat, lng]]);
        } else if (editorTool === 'equipamiento') {
          setNewFacCoord([lat, lng]);
        }
      }
    });

    // Invalida tamaño para asegurar carga perfecta en tabs y modales
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [centerLat, centerLng, zoom, interactiveSelection, onSelectCoordinates, isEditorOpen, editorTool]);

  // =========================================================================
  // 2. RENDERIZADO DE CAPAS: PERÍMETRO, MANZANOS, EQUIPAMIENTO & VIVIENDA
  // =========================================================================
  useEffect(() => {
    if (!mapInstanceRef.current || !layersGroupRef.current) return;
    const group = layersGroupRef.current;
    group.clearLayers();

    const perimeterToRender = isEditorOpen ? editingPerimeter : territory.perimeter;

    // A. DIBUJAR PERÍMETRO COMUNAL OFICIAL (POLÍGONO DE LÍMITES)
    if (layerFilters.perimetro && perimeterToRender.length >= 3) {
      const areaHa = calculatePolygonAreaHectares(perimeterToRender);

      const perimeterPolygon = L.polygon(perimeterToRender, {
        color: '#2563EB',
        weight: 3.5,
        dashArray: '8, 6',
        fillColor: '#3B82F6',
        fillOpacity: 0.12
      }).addTo(group);

      perimeterPolygon.bindPopup(`
        <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4; min-width: 200px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="font-size: 16px;">🏛️</span>
            <strong style="color: #1E3A8A; font-size: 14px;">Límites de ${otbName}</strong>
          </div>
          <p style="color: #475569; font-size: 12px; margin: 4px 0;">
            Polígono Jurisdiccional Reconocido bajo Personería Jurídica Comunal.
          </p>
          <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 8px; padding: 6px; margin-top: 6px;">
            <span style="font-size: 11px; color: #1D4ED8; font-weight: bold; display: block;">
              Superficie Aprox: ~${areaHa.toFixed(2)} Hectáreas
            </span>
            <span style="font-size: 11px; color: #64748B;">
              Total Vértices de Delimitación: ${perimeterToRender.length} puntos
            </span>
          </div>
        </div>
      `);
    }

    // B. DIBUJAR MANZANOS Y CUADRAS (CON COLOR Y ETIQUETA AL CENTRO)
    if (layerFilters.manzanos) {
      territory.manzanos.forEach((mza) => {
        if (mza.polygon.length >= 3) {
          const mzaPolygon = L.polygon(mza.polygon, {
            color: mza.color,
            weight: 2.5,
            fillColor: mza.color,
            fillOpacity: 0.24
          }).addTo(group);

          mzaPolygon.bindPopup(`
            <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4; min-width: 210px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; border-bottom: 1px solid #E2E8F0; pb: 4px;">
                <strong style="color: ${mza.color}; font-size: 14px;">🏘️ ${mza.name} (${mza.code})</strong>
                <span style="background: ${mza.color}20; color: ${mza.color}; font-weight: bold; font-size: 11px; padding: 2px 6px; border-radius: 6px;">
                  ${mza.lotsCount} Lotes
                </span>
              </div>
              <p style="color: #475569; font-size: 12px; margin: 6px 0;">${mza.description}</p>
              <div style="font-size: 11px; color: #059669; font-weight: bold;">
                ✓ Cuadra integrada al Catastro Comunal
              </div>
            </div>
          `);

          // Etiqueta flotante en el centro del manzano
          const centroid = getPolygonCentroid(mza.polygon);
          const labelIcon = L.divIcon({
            html: `
              <div style="background-color: ${mza.color}; color: white; padding: 2px 7px; border-radius: 12px; font-weight: 900; font-size: 10px; font-family: monospace; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,0.4); border: 1.5px solid white; display: flex; align-items: center; gap: 3px;">
                <span>${mza.code}</span>
                <span style="opacity: 0.85; font-size: 9px;">(${mza.lotsCount})</span>
              </div>
            `,
            className: 'mza-label-icon',
            iconSize: [60, 20],
            iconAnchor: [30, 10]
          });

          L.marker(centroid, { icon: labelIcon, interactive: false }).addTo(group);
        }
      });
    }

    // C. DIBUJAR EQUIPAMIENTO COMUNAL (SEDE, TINGLADO, SEGURIDAD, AGUA)
    if (layerFilters.equipamiento) {
      territory.facilities.forEach((fac) => {
        const getFacilityStyle = (cat: CommunityFacility['category']) => {
          switch (cat) {
            case 'sede':
              return { bg: '#1D4ED8', emoji: '🏛️' };
            case 'cancha':
            case 'tinglado':
              return { bg: '#059669', emoji: '⚽' };
            case 'seguridad':
              return { bg: '#DC2626', emoji: '🚨' };
            case 'agua':
              return { bg: '#0284C7', emoji: '💧' };
            case 'parque':
              return { bg: '#16A34A', emoji: '🛝' };
            case 'salud':
              return { bg: '#E11D48', emoji: '🏥' };
            default:
              return { bg: '#6B7280', emoji: '📍' };
          }
        };

        const { bg, emoji } = getFacilityStyle(fac.category);

        const facIcon = L.divIcon({
          html: `
            <div style="background-color: ${bg}; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 17px; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.45); cursor: pointer;">
              ${emoji}
            </div>
          `,
          className: 'fac-icon',
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });

        L.marker([fac.lat, fac.lng], { icon: facIcon })
          .addTo(group)
          .bindPopup(`
            <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4; min-width: 190px;">
              <strong style="color: ${bg}; font-size: 13.5px; display: block; margin-bottom: 2px;">
                ${fac.name}
              </strong>
              <p style="color: #475569; font-size: 12px; margin: 4px 0;">${fac.description}</p>
              <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #E2E8F0;">
                <a href="https://www.google.com/maps?q=${fac.lat},${fac.lng}" target="_blank" style="color: #2563EB; font-weight: bold; font-size: 11px; text-decoration: none;">
                  Abrir GPS Satelital →
                </a>
              </div>
            </div>
          `);
      });
    }

    // D. DIBUJAR EL LOTE DEL VECINO LOGUEADO (CON EFECTO RADIAL)
    if (selectedLotName) {
      const lotIcon = L.divIcon({
        html: `
          <div style="position: relative;">
            <div style="position: absolute; top: -6px; left: -6px; width: 48px; height: 48px; border-radius: 50%; background: rgba(147, 51, 234, 0.35); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="background-color: #9333EA; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; border: 3px solid white; box-shadow: 0 4px 16px rgba(147,51,234,0.6); position: relative; z-index: 10;">
              🏠
            </div>
          </div>
        `,
        className: 'lot-highlight-icon',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      L.marker([centerLat - 0.0005, centerLng + 0.0008], { icon: lotIcon })
        .addTo(group)
        .bindPopup(`
          <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4; min-width: 190px;">
            <span style="font-size: 10px; font-weight: 900; color: #9333EA; text-transform: uppercase;">Ubicación en el Padrón</span>
            <strong style="color: #0F172A; font-size: 14px; display: block; margin-top: 1px;">🏠 ${selectedLotName}</strong>
            <p style="color: #475569; font-size: 11.5px; margin: 4px 0;">
              Vivienda censada y geolocalizada en el catastro comunal de ${otbName}.
            </p>
          </div>
        `)
        .openPopup();
    }

    // E. DIBUJAR REPORTES ACTIVOS
    if (layerFilters.reportes) {
      reports.forEach((rep) => {
        if (!rep.latitude || !rep.longitude) return;

        const getCategoryEmoji = (cat: ReportCategory) => {
          switch (cat) {
            case 'borracho_cancha': return '🍺';
            case 'perro_peligro': return '🐕';
            case 'fuga_agua': return '💧';
            case 'auto_sospechoso': return '🚗';
            case 'luminaria': return '💡';
            default: return '⚠️';
          }
        };

        const repIcon = L.divIcon({
          html: `
            <div style="background-color: #DC2626; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2.5px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
              ${getCategoryEmoji(rep.category)}
            </div>
          `,
          className: 'rep-icon',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        L.marker([rep.latitude, rep.longitude], { icon: repIcon })
          .addTo(group)
          .bindPopup(`
            <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
              <strong>${getCategoryEmoji(rep.category)} ${rep.title}</strong>
              <p style="color: #475569; margin: 3px 0;">${rep.description}</p>
              <span style="color: #2563EB; font-weight: bold; font-size: 11px;">Por: ${rep.neighborName}</span>
            </div>
          `);
      });
    }
  }, [
    territory,
    editingPerimeter,
    isEditorOpen,
    layerFilters,
    selectedLotName,
    reports,
    otbName,
    centerLat,
    centerLng
  ]);

  // =========================================================================
  // 3. CAPA TEMPORAL DEL EDITOR (VÉRTICES EN VIVO AL DIBUJAR)
  // =========================================================================
  useEffect(() => {
    if (!mapInstanceRef.current || !editorLayerGroupRef.current) return;
    const group = editorLayerGroupRef.current;
    group.clearLayers();

    if (!isEditorOpen) return;

    // A. Si se está trazando el perímetro
    if (editorTool === 'perimetro') {
      editingPerimeter.forEach((pt, idx) => {
        const vertexIcon = L.divIcon({
          html: `
            <div style="background-color: #3B82F6; color: white; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">
              ${idx + 1}
            </div>
          `,
          className: 'vertex-icon',
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        });

        L.marker(pt, { icon: vertexIcon }).addTo(group);
      });
    }

    // B. Si se está trazando un nuevo manzano
    if (editorTool === 'manzano') {
      newManzanoPoints.forEach((pt, idx) => {
        const mzaVertex = L.divIcon({
          html: `
            <div style="background-color: ${newManzanoColor}; color: white; width: 20px; height: 20px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; border: 1.5px solid white;">
              ${idx + 1}
            </div>
          `,
          className: 'mza-vertex',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
        L.marker(pt, { icon: mzaVertex }).addTo(group);
      });

      if (newManzanoPoints.length >= 3) {
        L.polygon(newManzanoPoints, {
          color: newManzanoColor,
          weight: 2,
          dashArray: '4, 4',
          fillColor: newManzanoColor,
          fillOpacity: 0.35
        }).addTo(group);
      }
    }

    // C. Si se seleccionó punto para nuevo equipamiento
    if (editorTool === 'equipamiento' && newFacCoord) {
      const pinIcon = L.divIcon({
        html: `
          <div style="background-color: #EF4444; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(239,68,68,0.7);">
            📍
          </div>
        `,
        className: 'new-pin',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      L.marker(newFacCoord, { icon: pinIcon }).addTo(group);
    }
  }, [isEditorOpen, editorTool, editingPerimeter, newManzanoPoints, newManzanoColor, newFacCoord]);

  // Acciones de guardado del Administrador
  const handleSavePerimeter = () => {
    if (editingPerimeter.length < 3) {
      alert('Debes marcar al menos 3 vértices en el mapa para delimitar el perímetro de la OTB.');
      return;
    }
    updatePerimeter(otbId, editingPerimeter);
    setSaveSuccessMsg('¡Límites de la OTB actualizados y guardados exitosamente!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleSaveNewManzano = () => {
    if (newManzanoPoints.length < 3) {
      alert('Haz clic en el mapa al menos 3 veces para definir la forma del manzano.');
      return;
    }
    addManzano(otbId, {
      code: newManzanoCode.toUpperCase(),
      name: newManzanoName,
      color: newManzanoColor,
      lotsCount: Number(newManzanoLots) || 20,
      description: newManzanoDesc,
      polygon: newManzanoPoints
    });
    setNewManzanoPoints([]);
    setSaveSuccessMsg(`¡${newManzanoName} agregado al catastro con éxito!`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleSaveNewFacility = () => {
    if (!newFacCoord) {
      alert('Haz clic en el mapa para indicar la ubicación exacta del equipamiento.');
      return;
    }
    if (!newFacName.trim()) {
      alert('Ingresa el nombre del equipamiento comunal (ej. Salón Vecinal, Sirena 3).');
      return;
    }

    addFacility(otbId, {
      name: newFacName,
      category: newFacCategory,
      description: newFacDesc || 'Equipamiento comunitario verificado.',
      lat: newFacCoord[0],
      lng: newFacCoord[1]
    });

    setNewFacName('');
    setNewFacDesc('');
    setNewFacCoord(null);
    setSaveSuccessMsg('¡Punto comunal registrado con éxito!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const googleMapsUrl = `https://www.google.com/maps?q=${centerLat},${centerLng}`;
  const totalLots = territory.manzanos.reduce((acc, m) => acc + m.lotsCount, 0);

  return (
    <div className={`w-full ${heightClass} rounded-3xl overflow-hidden border-2 border-slate-700 shadow-2xl relative z-10 flex flex-col bg-[#0B132B]`}>
      
      {/* =================================================================== */}
      {/* 1. BARRA SUPERIOR: ESTADO DEL MAPA & CAPAS INTERACTIVAS             */}
      {/* =================================================================== */}
      <div className="px-3 sm:px-5 py-2.5 bg-[#030712]/95 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2.5 text-xs z-30">
        
        {/* Identificación de la OTB y Métricas Territoriales */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="font-black text-white text-xs sm:text-sm">
              Territorio Comunal: {otbName}
            </span>
            <span className="text-[10px] text-blue-300 font-mono font-bold">
              ({territory.manzanos.length} Manzanos • {totalLots} Lotes Censados)
            </span>
          </div>
        </div>

        {/* Acciones de la barra */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Conmutador de Capas (Visible para Vecinos y Directiva) */}
          {showControls && (
            <div className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
              <button
                onClick={() => setLayerFilters((p) => ({ ...p, perimetro: !p.perimetro }))}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  layerFilters.perimetro ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Mostrar/Ocultar Límites de la OTB"
              >
                <span>🏛️ Perímetro</span>
              </button>

              <button
                onClick={() => setLayerFilters((p) => ({ ...p, manzanos: !p.manzanos }))}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  layerFilters.manzanos ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Mostrar/Ocultar Manzanos (A, B, C, D)"
              >
                <span>🏘️ Manzanos</span>
              </button>

              <button
                onClick={() => setLayerFilters((p) => ({ ...p, equipamiento: !p.equipamiento }))}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  layerFilters.equipamiento ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Mostrar Sede, Tinglado, Agua y Seguridad"
              >
                <span>📍 Equipamiento</span>
              </button>
            </div>
          )}

          {/* Botón Modo Editor para el Administrador de la OTB */}
          {enableAdminEditor && (
            <button
              onClick={() => setIsEditorOpen(!isEditorOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer shadow-md ${
                isEditorOpen
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border border-amber-300'
                  : 'bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditorOpen ? 'Cerrar Editor' : '✏️ Dibujar Territorio'}</span>
            </button>
          )}

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-bold transition-all cursor-pointer"
            title="Abrir satélite en Google Maps"
          >
            <span>GPS Satelital</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Notificación Flotante de Guardado Exitoso */}
      {saveSuccessMsg && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-40 bg-emerald-500 text-slate-950 font-black text-xs sm:text-sm px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-slate-950" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. PANEL DESPLEGABLE DEL EDITOR DE TERRITORIO PARA LA DIRECTIVA     */}
      {/* =================================================================== */}
      {isEditorOpen && enableAdminEditor && (
        <div className="bg-[#0B132B]/98 border-b-2 border-amber-500/50 p-3 sm:p-4 z-30 shadow-2xl space-y-3 text-left">
          
          {/* Selector de Herramienta de Dibujo */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                Herramienta Activa:
              </span>
              <div className="inline-flex rounded-xl bg-slate-900 p-0.5 border border-slate-800 text-xs font-bold">
                <button
                  onClick={() => setEditorTool('perimetro')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    editorTool === 'perimetro' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  1. Perímetro OTB
                </button>
                <button
                  onClick={() => setEditorTool('manzano')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    editorTool === 'manzano' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  2. Nuevo Manzano
                </button>
                <button
                  onClick={() => setEditorTool('equipamiento')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    editorTool === 'equipamiento' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  3. Puntos Clave
                </button>
              </div>
            </div>

            <button
              onClick={() => resetToDefault(otbId)}
              className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 font-bold cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restablecer Todo por Defecto</span>
            </button>
          </div>

          {/* HERRAMIENTA 1: DIBUJAR PERÍMETRO */}
          {editorTool === 'perimetro' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <p className="text-slate-200 font-bold">
                  📍 Haz clic directamente en el mapa para marcar los límites de la OTB ({editingPerimeter.length} vértices marcados).
                </p>
                <span className="text-[11px] text-blue-300 font-mono">
                  Superficie estimada: ~{calculatePolygonAreaHectares(editingPerimeter).toFixed(2)} hectáreas
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => removeLastPerimeterVertex(otbId)}
                  disabled={editingPerimeter.length === 0}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-bold text-xs transition-colors cursor-pointer disabled:opacity-40"
                >
                  ↩️ Deshacer Último
                </button>
                <button
                  onClick={() => clearPerimeter(otbId)}
                  className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-500/40 font-bold text-xs transition-colors cursor-pointer"
                >
                  🗑️ Limpiar
                </button>
                <button
                  onClick={handleSavePerimeter}
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Límites Oficiales</span>
                </button>
              </div>
            </div>
          )}

          {/* HERRAMIENTA 2: NUEVO MANZANO */}
          {editorTool === 'manzano' && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Nombre:</label>
                  <input
                    type="text"
                    value={newManzanoName}
                    onChange={(e) => setNewManzanoName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#030712] border border-slate-700 rounded-xl text-white font-bold"
                    placeholder="Ej. Manzano E"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Código:</label>
                  <input
                    type="text"
                    value={newManzanoCode}
                    onChange={(e) => setNewManzanoCode(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#030712] border border-slate-700 rounded-xl text-white font-mono uppercase font-bold"
                    placeholder="MZE"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">N° de Lotes:</label>
                  <input
                    type="number"
                    value={newManzanoLots}
                    onChange={(e) => setNewManzanoLots(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-[#030712] border border-slate-700 rounded-xl text-white font-mono font-bold"
                    min={1}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Color:</label>
                  <input
                    type="color"
                    value={newManzanoColor}
                    onChange={(e) => setNewManzanoColor(e.target.value)}
                    className="w-full h-8 bg-transparent cursor-pointer rounded-xl"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1 flex items-end">
                  <button
                    onClick={handleSaveNewManzano}
                    className="w-full h-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center justify-center gap-1 cursor-pointer shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Guardar Manzano</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>
                  📍 Haz clic 3 o 4 veces en el mapa para marcar los límites del manzano ({newManzanoPoints.length} puntos seleccionados).
                </span>
                {newManzanoPoints.length > 0 && (
                  <button
                    onClick={() => setNewManzanoPoints([])}
                    className="text-rose-400 hover:underline cursor-pointer"
                  >
                    Borrar puntos del manzano
                  </button>
                )}
              </div>
            </div>
          )}

          {/* HERRAMIENTA 3: AGREGAR EQUIPAMIENTO */}
          {editorTool === 'equipamiento' && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Nombre del Lugar:</label>
                  <input
                    type="text"
                    value={newFacName}
                    onChange={(e) => setNewFacName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#030712] border border-slate-700 rounded-xl text-white font-bold"
                    placeholder="Ej. Salón Comunal, Alarma 3"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Categoría:</label>
                  <select
                    value={newFacCategory}
                    onChange={(e) => setNewFacCategory(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-[#030712] border border-slate-700 rounded-xl text-white font-bold"
                  >
                    <option value="sede">🏛️ Sede Social</option>
                    <option value="cancha">⚽ Cancha / Deporte</option>
                    <option value="tinglado">🏗️ Tinglado</option>
                    <option value="seguridad">🚨 Seguridad / Alarma</option>
                    <option value="agua">💧 Agua / Servicios</option>
                    <option value="parque">🛝 Parque Infantil</option>
                    <option value="salud">🏥 Salud / Primeros Auxilios</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Descripción / Función:</label>
                  <input
                    type="text"
                    value={newFacDesc}
                    onChange={(e) => setNewFacDesc(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#030712] border border-slate-700 rounded-xl text-white font-bold"
                    placeholder="Ej. Circuito preventivo vecinal"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleSaveNewFacility}
                    className="w-full h-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1 cursor-pointer shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Guardar Lugar</span>
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                📍 {newFacCoord ? `Coordenadas seleccionadas: ${newFacCoord[0].toFixed(5)}, ${newFacCoord[1].toFixed(5)}` : 'Haz clic en el punto exacto del mapa donde se encuentra este equipamiento.'}
              </p>
            </div>
          )}

          {/* Lista de Manzanos Actuales con Opción de Eliminar */}
          <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2 text-[11px]">
            <span className="font-bold text-slate-400">Manzanos Registrados:</span>
            {territory.manzanos.map((m) => (
              <span
                key={m.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border font-mono font-bold"
                style={{ backgroundColor: `${m.color}20`, borderColor: m.color, color: m.color }}
              >
                <span>{m.name} ({m.lotsCount})</span>
                <button
                  onClick={() => deleteManzano(otbId, m.id)}
                  title="Eliminar este manzano"
                  className="hover:text-rose-400 cursor-pointer ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

        </div>
      )}

      {/* =================================================================== */}
      {/* 3. CONTENEDOR DEL MAPA LEAFLET                                      */}
      {/* =================================================================== */}
      <div ref={mapContainerRef} className="w-full flex-1 min-h-[240px]" />

      {/* =================================================================== */}
      {/* 4. LEYENDA INFERIOR INSTITUCIONAL (CLARA Y ACCESIBLE)               */}
      {/* =================================================================== */}
      <div className="px-4 py-2 bg-[#030712] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 z-20">
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <span className="flex items-center gap-1.5 text-blue-400 font-bold">
            <span className="w-3 h-3 rounded-md border-2 border-blue-400 bg-blue-500/20 inline-block" />
            <span>Perímetro OTB</span>
          </span>

          <span className="flex items-center gap-1.5 text-indigo-300 font-bold">
            <span className="w-3 h-3 rounded-md border border-indigo-400 bg-indigo-500/30 inline-block" />
            <span>Manzanos (A, B, C, D)</span>
          </span>

          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>Sede Social & Cancha</span>
          </span>

          <span className="flex items-center gap-1.5 text-purple-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
            <span>Vivienda Vecinal</span>
          </span>
        </div>

        <span className="font-mono text-[10px] text-slate-500">
          Catastro Comunal Ley N° 1551 • Cochabamba, Bolivia
        </span>
      </div>

    </div>
  );
};
