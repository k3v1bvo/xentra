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
  EyeOff,
  PenTool,
  Maximize2,
  Download,
  Users,
  Info
} from 'lucide-react';

export interface MapNeighbor {
  id: string;
  name: string;
  socioCode: string;
  block: string;
  house: string;
  status: 'Al Día' | 'En Mora';
  debt: number;
  latitude: number;
  longitude: number;
  phone?: string;
}

interface CommunityInteractiveMapProps {
  reports?: CommunityReport[];
  neighbors?: MapNeighbor[];
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

// Cálculo de superficie en hectáreas usando aproximación esférica (Shoelace)
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

// Centroide para centrar etiquetas
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

// Paleta oficial de colores catastrales inspirada en el Gobierno Autónomo Municipal de Cochabamba (GAMC - DOT)
const COCHABAMBA_CADASTRE_PALETTE = [
  { name: 'Rosa Distrito (GAMC)', color: '#FCA5A5' },
  { name: 'Lavanda Queru Queru', color: '#D8B4FE' },
  { name: 'Amarillo Comunal', color: '#FDE047' },
  { name: 'Azul Cielo Catastral', color: '#93C5FD' },
  { name: 'Durazno Melocotón', color: '#FDBA74' },
  { name: 'Área Verde DOT', color: '#16A34A' },
  { name: 'Verde Preservación', color: '#15803D' },
  { name: 'Verde Lima', color: '#86EFAC' }
];

export const CommunityInteractiveMap: React.FC<CommunityInteractiveMapProps> = ({
  reports = [],
  neighbors = [],
  centerLat = -17.41325,
  centerLng = -66.16543,
  zoom = 16,
  heightClass = 'h-80 sm:h-[450px]',
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
  const freehandPolylineRef = useRef<L.Polyline | null>(null);

  // Referencias para trazo con lápiz a mano alzada
  const isPencilDrawingRef = useRef(false);
  const pencilStrokePointsRef = useRef<[number, number][]>([]);

  // Store territorial
  const {
    getTerritory,
    updatePerimeter,
    removeLastPerimeterVertex,
    clearPerimeter,
    addManzano,
    deleteManzano,
    addFacility,
    deleteFacility,
    resetToDefault
  } = useCommunityMapStore();

  const territory = getTerritory(otbId);

  // Filtros de visualización
  const [layerFilters, setLayerFilters] = useState({
    perimetro: true,
    manzanos: true,
    equipamiento: true,
    vecinos: true,
    reportes: true
  });

  // Editor Territorial Admin
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [drawingMethod, setDrawingMethod] = useState<'pencil' | 'click'>('pencil'); // Lápiz vs Clics
  const [editorTool, setEditorTool] = useState<'perimetro' | 'manzano' | 'equipamiento'>('perimetro');
  const [editingPerimeter, setEditingPerimeter] = useState<[number, number][]>(territory.perimeter);
  const [isCurrentlyDrawingPencil, setIsCurrentlyDrawingPencil] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Manzano seleccionado para inspección
  const [inspectedManzano, setInspectedManzano] = useState<CommunityManzano | null>(null);
  const [showCadastralReferences, setShowCadastralReferences] = useState(false);

  // Formulario nuevo manzano
  const [newManzanoName, setNewManzanoName] = useState('Manzano E');
  const [newManzanoCode, setNewManzanoCode] = useState('MZE');
  const [newManzanoLots, setNewManzanoLots] = useState(20);
  const [newManzanoColor, setNewManzanoColor] = useState('#EC4899');
  const [newManzanoDesc, setNewManzanoDesc] = useState('Ampliación Sector Oeste');
  const [newManzanoPoints, setNewManzanoPoints] = useState<[number, number][]>([]);

  // Formulario nuevo equipamiento
  const [newFacName, setNewFacName] = useState('');
  const [newFacCategory, setNewFacCategory] = useState<CommunityFacility['category']>('seguridad');
  const [newFacDesc, setNewFacDesc] = useState('');
  const [newFacCoord, setNewFacCoord] = useState<[number, number] | null>(null);

  // Sincronizar perímetro local
  useEffect(() => {
    setEditingPerimeter(territory.perimeter);
  }, [territory.perimeter]);

  // =========================================================================
  // 1. INICIALIZAR MAPA Y MANEJO DE EVENTOS (LÁPIZ / CLICK)
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

    const mainGroup = L.layerGroup().addTo(map);
    layersGroupRef.current = mainGroup;

    const editorGroup = L.layerGroup().addTo(map);
    editorLayerGroupRef.current = editorGroup;

    // EVENTO MOUSE DOWN: INICIAR TRAZO CON LÁPIZ
    map.on('mousedown', (e: L.LeafletMouseEvent) => {
      if (!isEditorOpen || drawingMethod !== 'pencil') return;

      isPencilDrawingRef.current = true;
      setIsCurrentlyDrawingPencil(true);
      map.dragging.disable();

      const startPt: [number, number] = [e.latlng.lat, e.latlng.lng];
      pencilStrokePointsRef.current = [startPt];

      if (freehandPolylineRef.current) {
        freehandPolylineRef.current.remove();
      }

      freehandPolylineRef.current = L.polyline([startPt], {
        color: editorTool === 'manzano' ? newManzanoColor : '#3B82F6',
        weight: 4,
        opacity: 0.9,
        dashArray: '3, 6'
      }).addTo(editorGroup);
    });

    // EVENTO MOUSE MOVE: DIBUJAR LÍNEA CON LÁPIZ FLUIDO
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      if (!isPencilDrawingRef.current || !isEditorOpen || drawingMethod !== 'pencil') return;

      const pts = pencilStrokePointsRef.current;
      const last = pts[pts.length - 1];
      const dist = Math.hypot(e.latlng.lat - last[0], e.latlng.lng - last[1]);

      // Filtrar puntos demasiado cercanos para mantener rendimiento óptimo
      if (dist > 0.00008) {
        pts.push([e.latlng.lat, e.latlng.lng]);
        if (freehandPolylineRef.current) {
          freehandPolylineRef.current.setLatLngs(pts);
        }
      }
    });

    // EVENTO MOUSE UP: CERRAR POLÍGONO DE LÁPIZ
    const handleEndDrawing = () => {
      if (!isPencilDrawingRef.current) return;
      isPencilDrawingRef.current = false;
      setIsCurrentlyDrawingPencil(false);
      map.dragging.enable();

      if (freehandPolylineRef.current) {
        freehandPolylineRef.current.remove();
        freehandPolylineRef.current = null;
      }

      const drawnPts = pencilStrokePointsRef.current;
      if (drawnPts.length >= 3) {
        if (editorTool === 'perimetro') {
          setEditingPerimeter(drawnPts);
          setSaveSuccessMsg(`¡Perímetro trazado con lápiz (${drawnPts.length} vértices)!`);
          setTimeout(() => setSaveSuccessMsg(null), 3500);
        } else if (editorTool === 'manzano') {
          setNewManzanoPoints(drawnPts);
          setSaveSuccessMsg(`¡Límites del manzano trazados (${drawnPts.length} vértices)!`);
          setTimeout(() => setSaveSuccessMsg(null), 3500);
        }
      }
    };

    map.on('mouseup', handleEndDrawing);
    mapContainerRef.current.addEventListener('mouseleave', handleEndDrawing);

    // EVENTO CLICK GENERAL (MODO CLIC O SELECCIÓN)
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      // Modo selección de coordenadas para reportes o puntos
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

      // Si el Administrador usa modo CLIC punto a punto
      if (isEditorOpen && drawingMethod === 'click') {
        if (editorTool === 'perimetro') {
          setEditingPerimeter((prev) => [...prev, [lat, lng]]);
        } else if (editorTool === 'manzano') {
          setNewManzanoPoints((prev) => [...prev, [lat, lng]]);
        } else if (editorTool === 'equipamiento') {
          setNewFacCoord([lat, lng]);
        }
      }
    });

    // Invalida tamaño en múltiples ciclos
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
  }, [centerLat, centerLng, zoom, interactiveSelection, onSelectCoordinates, isEditorOpen, drawingMethod, editorTool, newManzanoColor]);

  // =========================================================================
  // 2. RENDERIZADO DE CAPAS (PERÍMETRO, MANZANOS, VECINOS, EQUIPAMIENTO)
  // =========================================================================
  useEffect(() => {
    if (!mapInstanceRef.current || !layersGroupRef.current) return;
    const group = layersGroupRef.current;
    group.clearLayers();

    const perimeterToRender = isEditorOpen ? editingPerimeter : territory.perimeter;

    // A. DIBUJAR PERÍMETRO COMUNAL OFICIAL
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
        <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4; min-width: 210px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="font-size: 16px;">🏛️</span>
            <strong style="color: #1E3A8A; font-size: 14px;">Jurisdicción Oficial ${otbName}</strong>
          </div>
          <p style="color: #475569; font-size: 12px; margin: 4px 0;">
            Límites territoriales delimitados según Ley N° 1551 de Participación Popular.
          </p>
          <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 8px; padding: 6px; margin-top: 6px;">
            <span style="font-size: 11px; color: #1D4ED8; font-weight: bold; display: block;">
              Superficie: ~${areaHa.toFixed(2)} Hectáreas (~${(areaHa * 10000).toLocaleString('es-BO')} m²)
            </span>
            <span style="font-size: 10.5px; color: #64748B;">
              Delimitación geométrica de ${perimeterToRender.length} vértices
            </span>
          </div>
        </div>
      `);
    }

    // B. DIBUJAR MANZANOS Y CUADRAS
    if (layerFilters.manzanos) {
      territory.manzanos.forEach((mza) => {
        if (mza.polygon.length >= 3) {
          // Filtrar vecinos que pertenecen a este manzano
          const neighborsInBlock = neighbors.filter(
            (n) => n.block.toLowerCase().includes(mza.name.toLowerCase()) || n.block.toLowerCase().includes(mza.code.toLowerCase())
          );

          const isGreenArea =
            mza.color.toLowerCase() === '#16a34a' ||
            mza.color.toLowerCase() === '#15803d' ||
            mza.name.toLowerCase().includes('verde') ||
            mza.name.toLowerCase().includes('parque') ||
            mza.name.toLowerCase().includes('ecol');

          const mzaPolygon = L.polygon(mza.polygon, {
            color: isGreenArea ? '#14532D' : '#1E293B',
            weight: isGreenArea ? 2.5 : 2,
            fillColor: mza.color,
            fillOpacity: isGreenArea ? 0.72 : 0.45
          }).addTo(group);

          mzaPolygon.on('click', () => {
            setInspectedManzano(mza);
          });

          mzaPolygon.bindPopup(`
            <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4; min-width: 230px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px;">
                <strong style="color: ${isGreenArea ? '#15803D' : '#0F172A'}; font-size: 14px;">
                  ${isGreenArea ? '🌳 ' : '🏘️ '}${mza.name}
                </strong>
                <span style="background: ${mza.color}35; color: ${isGreenArea ? '#14532D' : '#0F172A'}; font-weight: 900; font-size: 11px; padding: 2px 7px; border-radius: 6px; border: 1px solid ${mza.color};">
                  ${mza.lotsCount > 0 ? `${mza.lotsCount} Lotes` : 'Área Comunal'}
                </span>
              </div>
              <p style="color: #475569; font-size: 12px; margin: 4px 0;">${mza.description}</p>
              
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 6px; margin: 6px 0;">
                <span style="font-size: 11px; font-weight: bold; color: #0F172A; display: block;">
                  ${isGreenArea ? '🌲 Equipamiento / Espacio Público OTB' : `Vecinos Registrados en Padrón: ${neighborsInBlock.length}`}
                </span>
                ${
                  !isGreenArea
                    ? `<span style="font-size: 10px; color: #64748B;">
                        ${neighborsInBlock.length > 0 ? neighborsInBlock.map(n => `${n.name.split(' ')[0]} (${n.house})`).join(', ') : 'Lotes disponibles para empadronar'}
                       </span>`
                    : '<span style="font-size: 10px; color: #16A34A; font-weight: bold;">Uso comunal, deportivo y recreativo de los vecinos</span>'
                }
              </div>

              <div style="font-size: 11px; color: #059669; font-weight: bold;">
                ✓ Cuadra integrada al Catastro Comunal (GAMC)
              </div>
            </div>
          `);

          // Insignia en el centro del manzano estilo Catastro Cochabamba
          const centroid = getPolygonCentroid(mza.polygon);
          const labelIcon = L.divIcon({
            html: `
              <div style="background-color: ${isGreenArea ? '#15803D' : '#FFFFFF'}; color: ${isGreenArea ? '#FFFFFF' : '#0F172A'}; padding: 3px 9px; border-radius: 14px; font-weight: 900; font-size: 12px; font-family: ui-monospace, monospace; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.45); border: 2px solid ${isGreenArea ? '#86EFAC' : mza.color}; display: flex; align-items: center; gap: 4px; cursor: pointer;">
                <span>${isGreenArea ? '🌳 ' : ''}${mza.code}</span>
                ${mza.lotsCount > 0 ? `<span style="opacity: 0.8; font-size: 9.5px; font-weight: 700;">(${mza.lotsCount}L)</span>` : ''}
              </div>
            `,
            className: 'mza-label-icon',
            iconSize: [54, 26],
            iconAnchor: [27, 13]
          });

          const labelMarker = L.marker(centroid, { icon: labelIcon }).addTo(group);
          labelMarker.on('click', () => setInspectedManzano(mza));
        }
      });
    }

    // C. DIBUJAR VIVIENDAS DE LOS VECINOS REGISTRADOS
    if (layerFilters.vecinos && neighbors.length > 0) {
      neighbors.forEach((neighbor) => {
        if (!neighbor.latitude || !neighbor.longitude) return;

        const isSettled = neighbor.status === 'Al Día';
        const houseIcon = L.divIcon({
          html: `
            <div style="background-color: ${isSettled ? '#059669' : '#D97706'}; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; border: 2px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.35); cursor: pointer;" title="${neighbor.name} (${neighbor.house})">
              🏠
            </div>
          `,
          className: 'neighbor-house-icon',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        L.marker([neighbor.latitude, neighbor.longitude], { icon: houseIcon })
          .addTo(group)
          .bindPopup(`
            <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4; min-width: 190px;">
              <div style="font-size: 10.5px; font-weight: bold; color: #64748B;">${neighbor.socioCode} • ${neighbor.block}</div>
              <strong style="color: #0F172A; font-size: 14px; display: block; margin: 2px 0;">${neighbor.name}</strong>
              <div style="color: #334155; font-size: 12px; margin-bottom: 4px;">Inmueble: <strong>${neighbor.house}</strong></div>
              
              <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #E2E8F0; padding-top: 5px;">
                <span style="font-size: 11px; font-weight: bold; color: ${isSettled ? '#16A34A' : '#DC2626'};">
                  ${isSettled ? '✓ Al Día con Cuotas' : `⚠️ Deuda: Bs. ${neighbor.debt.toFixed(2)}`}
                </span>
                <span style="font-size: 10.5px; color: #2563EB; font-weight: bold;">
                  Tel: ${neighbor.phone || 'S/N'}
                </span>
              </div>
            </div>
          `);
      });
    }

    // D. DIBUJAR EQUIPAMIENTO COMUNAL
    if (layerFilters.equipamiento) {
      territory.facilities.forEach((fac) => {
        const getFacilityStyle = (cat: CommunityFacility['category']) => {
          switch (cat) {
            case 'sede': return { bg: '#1D4ED8', emoji: '🏛️' };
            case 'cancha':
            case 'tinglado': return { bg: '#059669', emoji: '⚽' };
            case 'seguridad': return { bg: '#DC2626', emoji: '🚨' };
            case 'agua': return { bg: '#0284C7', emoji: '💧' };
            case 'parque': return { bg: '#16A34A', emoji: '🛝' };
            case 'salud': return { bg: '#E11D48', emoji: '🏥' };
            default: return { bg: '#6B7280', emoji: '📍' };
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

    // E. DIBUJAR LOTE DEL VECINO DESTACADO (SI APLICA)
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
            <span style="font-size: 10px; font-weight: 900; color: #9333EA; text-transform: uppercase;">Ubicación Censada</span>
            <strong style="color: #0F172A; font-size: 14px; display: block; margin-top: 1px;">🏠 ${selectedLotName}</strong>
            <p style="color: #475569; font-size: 11.5px; margin: 4px 0;">
              Vivienda geolocalizada en el catastro comunal de ${otbName}.
            </p>
          </div>
        `)
        .openPopup();
    }

    // F. DIBUJAR REPORTES BARRIALES
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
    neighbors,
    otbName,
    centerLat,
    centerLng
  ]);

  // =========================================================================
  // 3. CAPA TEMPORAL DEL EDITOR EN MODO DIBUJO
  // =========================================================================
  useEffect(() => {
    if (!mapInstanceRef.current || !editorLayerGroupRef.current) return;
    const group = editorLayerGroupRef.current;
    group.clearLayers();

    if (!isEditorOpen) return;

    // Marcadores de vértices al usar modo clic
    if (drawingMethod === 'click' && editorTool === 'perimetro') {
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

    // Vértices del nuevo manzano
    if (editorTool === 'manzano' && newManzanoPoints.length > 0) {
      if (newManzanoPoints.length >= 3) {
        L.polygon(newManzanoPoints, {
          color: newManzanoColor,
          weight: 2.5,
          dashArray: '4, 4',
          fillColor: newManzanoColor,
          fillOpacity: 0.35
        }).addTo(group);
      }
    }

    // Pin del nuevo equipamiento
    if (editorTool === 'equipamiento' && newFacCoord) {
      const pinIcon = L.divIcon({
        html: `
          <div style="background-color: #EF4444; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 17px; border: 2.5px solid white; box-shadow: 0 4px 14px rgba(239,68,68,0.7);">
            📍
          </div>
        `,
        className: 'new-pin',
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });
      L.marker(newFacCoord, { icon: pinIcon }).addTo(group);
    }
  }, [isEditorOpen, drawingMethod, editorTool, editingPerimeter, newManzanoPoints, newManzanoColor, newFacCoord]);

  // Acciones de Guardado del Administrador
  const handleSavePerimeter = () => {
    if (editingPerimeter.length < 3) {
      alert('Debes trazar al menos 3 puntos o encerrar un área con el lápiz para guardar el perímetro.');
      return;
    }
    updatePerimeter(otbId, editingPerimeter);
    setSaveSuccessMsg('¡Perímetro comunal guardado en el catastro oficial!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleSaveNewManzano = () => {
    if (newManzanoPoints.length < 3) {
      alert('Traza el contorno del manzano con el lápiz o haz al menos 3 clics.');
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
    setSaveSuccessMsg(`¡${newManzanoName} registrado con éxito en el mapa!`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleSaveNewFacility = () => {
    if (!newFacCoord) {
      alert('Haz clic en el mapa para marcar el lugar del equipamiento.');
      return;
    }
    if (!newFacName.trim()) {
      alert('Escribe el nombre del equipamiento comunal (ej. Salón Vecinal, Sirena 3).');
      return;
    }

    addFacility(otbId, {
      name: newFacName,
      category: newFacCategory,
      description: newFacDesc || 'Equipamiento comunal verificado.',
      lat: newFacCoord[0],
      lng: newFacCoord[1]
    });

    setNewFacName('');
    setNewFacDesc('');
    setNewFacCoord(null);
    setSaveSuccessMsg('¡Lugar comunal registrado exitosamente!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Exportar Catastro a GeoJSON Oficial
  const handleExportGeoJson = () => {
    const geoJsonData = {
      type: 'FeatureCollection',
      name: `Catastro_${otbName.replace(/\s+/g, '_')}`,
      features: [
        {
          type: 'Feature',
          properties: {
            tipo: 'Perimetro_Jurisdiccional',
            otb: otbName,
            superficie_ha: calculatePolygonAreaHectares(territory.perimeter).toFixed(2),
            normativa: 'Ley N° 1551 de Participación Popular'
          },
          geometry: {
            type: 'Polygon',
            coordinates: [territory.perimeter.map(([lat, lng]) => [lng, lat])]
          }
        },
        ...territory.manzanos.map((m) => ({
          type: 'Feature',
          properties: {
            tipo: 'Manzano',
            codigo: m.code,
            nombre: m.name,
            lotes: m.lotsCount,
            descripcion: m.description
          },
          geometry: {
            type: 'Polygon',
            coordinates: [m.polygon.map(([lat, lng]) => [lng, lat])]
          }
        }))
      ]
    };

    const blob = new Blob([JSON.stringify(geoJsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Catastro_Oficial_${otbName.replace(/\s+/g, '_')}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const googleMapsUrl = `https://www.google.com/maps?q=${centerLat},${centerLng}`;
  const totalLots = territory.manzanos.reduce((acc, m) => acc + m.lotsCount, 0);

  return (
    <div className={`w-full ${heightClass} rounded-3xl overflow-hidden border-2 border-slate-700 shadow-2xl relative z-10 flex flex-col bg-[#0B132B]`}>
      
      {/* =================================================================== */}
      {/* 1. BARRA SUPERIOR DE CONTROL, CAPAS Y HERRAMIENTA LÁPIZ             */}
      {/* =================================================================== */}
      <div className="px-3 sm:px-5 py-2.5 bg-[#030712]/95 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2.5 text-xs z-30">
        
        {/* Identidad de la OTB y Métricas Territoriales */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="font-black text-white text-xs sm:text-sm">
              {otbName}
            </span>
            <span className="text-[10px] text-blue-300 font-mono font-bold">
              ({territory.manzanos.length} Manzanos • {totalLots} Lotes • {neighbors.length} Vecinos)
            </span>
          </div>
        </div>

        {/* Acciones de la barra */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Conmutador de Capas Interactivas */}
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
                onClick={() => setLayerFilters((p) => ({ ...p, vecinos: !p.vecinos }))}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  layerFilters.vecinos ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Mostrar Casas de los Vecinos"
              >
                <span>🏠 Vecinos ({neighbors.length})</span>
              </button>

              <button
                onClick={() => setLayerFilters((p) => ({ ...p, equipamiento: !p.equipamiento }))}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  layerFilters.equipamiento ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Mostrar Sede, Tinglado, Agua y Seguridad"
              >
                <span>📍 Puntos Clave</span>
              </button>
            </div>
          )}

          {/* Exportar GeoJSON Oficial */}
          {enableAdminEditor && (
            <button
              onClick={handleExportGeoJson}
              title="Descargar Catastro Comunal en GeoJSON Oficial para Alcaldía"
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-bold transition-all cursor-pointer"
            >
              <Download className="w-3 h-3 text-blue-400" />
              <span>GeoJSON</span>
            </button>
          )}

          {/* Botón Maestro: Modo Dibujo / Editor para la Directiva */}
          {enableAdminEditor && (
            <button
              onClick={() => setIsEditorOpen(!isEditorOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer shadow-md ${
                isEditorOpen
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border border-amber-300'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/25'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>{isEditorOpen ? 'Finalizar Dibujo' : '✏️ Dibujar con Lápiz'}</span>
            </button>
          )}

          {/* Botón Referencias Catastrales (Estilo GAMC Cochabamba) */}
          <button
            onClick={() => setShowCadastralReferences(!showCadastralReferences)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
              showCadastralReferences
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700'
            }`}
            title="Ver Cajetín de Referencias de Manzanos y Áreas Verdes (DOT GAMC)"
          >
            <span>📋 Referencias GAMC</span>
          </button>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-bold transition-all cursor-pointer"
          >
            <span>GPS Satelital</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Alerta de Dibujo con Lápiz en Vivo */}
      {isCurrentlyDrawingPencil && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-40 bg-blue-600 text-white font-black text-xs px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2 border-2 border-blue-400 animate-pulse">
          <PenTool className="w-4 h-4 text-white" />
          <span>Trazando libremente con el lápiz... Suelta para cerrar el área.</span>
        </div>
      )}

      {/* Notificación Flotante de Éxito */}
      {saveSuccessMsg && !isCurrentlyDrawingPencil && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-40 bg-emerald-500 text-slate-950 font-black text-xs sm:text-sm px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-slate-950" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. PANEL DEL EDITOR TERRITORIAL CON LÁPIZ Y VÉRTICES                */}
      {/* =================================================================== */}
      {isEditorOpen && enableAdminEditor && (
        <div className="bg-[#0B132B]/98 border-b-2 border-amber-500/50 p-3 sm:p-4 z-30 shadow-2xl space-y-3 text-left">
          
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                Modalidad:
              </span>

              {/* Conmutador Lápiz vs Clics */}
              <div className="inline-flex rounded-xl bg-slate-900 p-0.5 border border-slate-800 text-xs font-bold">
                <button
                  onClick={() => setDrawingMethod('pencil')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                    drawingMethod === 'pencil' ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Trazo Libre (Lápiz)</span>
                </button>
                <button
                  onClick={() => setDrawingMethod('click')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                    drawingMethod === 'click' ? 'bg-blue-600 text-white font-black shadow-sm' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Punto a Punto (Vértices)</span>
                </button>
              </div>

              {/* Qué se está delimitando */}
              <div className="inline-flex rounded-xl bg-slate-900 p-0.5 border border-slate-800 text-xs font-bold ml-1">
                <button
                  onClick={() => setEditorTool('perimetro')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    editorTool === 'perimetro' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  1. Perímetro OTB
                </button>
                <button
                  onClick={() => setEditorTool('manzano')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    editorTool === 'manzano' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  2. Nuevo Manzano
                </button>
                <button
                  onClick={() => setEditorTool('equipamiento')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
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
              <span>Restablecer OTB por Defecto</span>
            </button>
          </div>

          {/* HERRAMIENTA 1: PERÍMETRO */}
          {editorTool === 'perimetro' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <p className="text-slate-200 font-bold flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-blue-400" />
                  <span>
                    {drawingMethod === 'pencil'
                      ? 'Mantén presionado el botón izquierdo del mouse o la pantalla táctil y arrastra para dibujar el contorno de la OTB como si fuera un lápiz.'
                      : `Haz clic en las esquinas de la OTB para añadir vértices (${editingPerimeter.length} vértices marcados).`}
                  </span>
                </p>
                <span className="text-[11px] text-blue-300 font-mono block">
                  Superficie calculada: ~{calculatePolygonAreaHectares(editingPerimeter).toFixed(2)} hectáreas ({editingPerimeter.length} vértices)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => removeLastPerimeterVertex(otbId)}
                  disabled={editingPerimeter.length === 0}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-bold text-xs cursor-pointer disabled:opacity-40"
                >
                  ↩️ Deshacer Último
                </button>
                <button
                  onClick={() => clearPerimeter(otbId)}
                  className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-500/40 font-bold text-xs cursor-pointer"
                >
                  🗑️ Limpiar
                </button>
                <button
                  onClick={handleSavePerimeter}
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Límites de la OTB</span>
                </button>
              </div>
            </div>
          )}

          {/* HERRAMIENTA 2: NUEVO MANZANO */}
          {editorTool === 'manzano' && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Nombre Manzano:</label>
                  <input
                    type="text"
                    value={newManzanoName}
                    onChange={(e) => setNewManzanoName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#030712] border border-slate-700 rounded-xl text-white font-bold"
                    placeholder="Ej. Manzano E"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Código Oficial:</label>
                  <input
                    type="text"
                    value={newManzanoCode}
                    onChange={(e) => setNewManzanoCode(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#030712] border border-slate-700 rounded-xl text-white font-mono uppercase font-bold"
                    placeholder="MZE"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Total Lotes:</label>
                  <input
                    type="number"
                    value={newManzanoLots}
                    onChange={(e) => setNewManzanoLots(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-[#030712] border border-slate-700 rounded-xl text-white font-mono font-bold"
                    min={1}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Color Catastral GAMC:</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={newManzanoColor}
                      onChange={(e) => setNewManzanoColor(e.target.value)}
                      className="w-8 h-8 bg-transparent cursor-pointer rounded-lg flex-shrink-0"
                    />
                    <div className="flex flex-wrap gap-1">
                      {COCHABAMBA_CADASTRE_PALETTE.slice(0, 6).map((pal) => (
                        <button
                          key={pal.color}
                          type="button"
                          onClick={() => {
                            setNewManzanoColor(pal.color);
                            if (pal.color === '#16A34A' || pal.color === '#15803D') {
                              setNewManzanoName('Área Verde Comunal');
                              setNewManzanoCode('AV');
                              setNewManzanoLots(0);
                            }
                          }}
                          style={{ backgroundColor: pal.color }}
                          title={pal.name}
                          className="w-4 h-4 rounded border border-slate-600 hover:scale-125 transition-transform cursor-pointer shadow-sm"
                        />
                      ))}
                    </div>
                  </div>
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
                  {drawingMethod === 'pencil'
                    ? `✏️ Dibuja el contorno del manzano arrastrando el lápiz en el mapa (${newManzanoPoints.length} vértices trazados).`
                    : `📍 Haz clic en el mapa para marcar las esquinas del manzano (${newManzanoPoints.length} puntos seleccionados).`}
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

          {/* HERRAMIENTA 3: EQUIPAMIENTO COMUNAL */}
          {editorTool === 'equipamiento' && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Nombre del Espacio:</label>
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
                    <option value="cancha">⚽ Cancha Polifuncional</option>
                    <option value="tinglado">🏗️ Tinglado Deportivo</option>
                    <option value="seguridad">🚨 Sirena / Cámara de Seguridad</option>
                    <option value="agua">💧 Tanque de Agua / Válvula</option>
                    <option value="parque">🛝 Parque Infantil / Área Verde</option>
                    <option value="salud">🏥 Posta Sanitaria / Primeros Auxilios</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Función Comunitaria:</label>
                  <input
                    type="text"
                    value={newFacDesc}
                    onChange={(e) => setNewFacDesc(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#030712] border border-slate-700 rounded-xl text-white font-bold"
                    placeholder="Ej. Punto de auxilio vecinal 24/7"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleSaveNewFacility}
                    className="w-full h-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1 cursor-pointer shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Guardar Punto</span>
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                📍 {newFacCoord ? `Ubicación marcada: ${newFacCoord[0].toFixed(5)}, ${newFacCoord[1].toFixed(5)}` : 'Haz clic en el mapa en el lugar exacto del equipamiento.'}
              </p>
            </div>
          )}

          {/* Manzanos Existentes con Borrado Rápido */}
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
      {/* 3. MODAL / CARD DE INSPECCIÓN DE MANZANO SELECCIONADO               */}
      {/* =================================================================== */}
      {inspectedManzano && (
        <div className="absolute bottom-12 right-4 z-40 max-w-sm w-full bg-[#0B132B]/98 border-2 border-slate-700 rounded-2xl p-4 shadow-2xl backdrop-blur-xl space-y-3 animate-in fade-in slide-in-from-bottom-2 text-left">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: inspectedManzano.color }} />
              <strong className="text-sm font-black text-white">{inspectedManzano.name} ({inspectedManzano.code})</strong>
            </div>
            <button
              onClick={() => setInspectedManzano(null)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5 text-xs text-slate-300">
            <p className="text-slate-400">{inspectedManzano.description}</p>
            <div className="grid grid-cols-2 gap-2 py-1">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Capacidad</span>
                <strong className="text-white text-sm font-mono font-black">{inspectedManzano.lotsCount} Lotes</strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Empadronados</span>
                <strong className="text-emerald-400 text-sm font-mono font-black">
                  {neighbors.filter((n) => n.block.toLowerCase().includes(inspectedManzano.name.toLowerCase()) || n.block.toLowerCase().includes(inspectedManzano.code.toLowerCase())).length} Socios
                </strong>
              </div>
            </div>

            {/* Lista de Vecinos en este manzano */}
            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Vecinos en esta cuadra:</span>
              <div className="max-h-28 overflow-y-auto space-y-1 pr-1 font-mono text-[11px]">
                {neighbors
                  .filter((n) => n.block.toLowerCase().includes(inspectedManzano.name.toLowerCase()) || n.block.toLowerCase().includes(inspectedManzano.code.toLowerCase()))
                  .map((n) => (
                    <div key={n.id} className="flex justify-between items-center p-1.5 rounded-lg bg-[#030712] border border-slate-800">
                      <span className="text-white font-bold truncate max-w-[170px]">{n.name}</span>
                      <span className={n.status === 'Al Día' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                        {n.house}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4. CAJETÍN OFICIAL DE REFERENCIAS URBANAS GAMC - DOT COCHABAMBA     */}
      {/* =================================================================== */}
      {showCadastralReferences && (
        <div className="absolute top-16 right-4 z-30 max-w-xs w-full bg-[#030712]/95 backdrop-blur-md border-2 border-emerald-500/60 rounded-2xl p-3 shadow-2xl space-y-2 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 block">
                Cajetín Catastral Oficial
              </span>
              <h4 className="text-xs font-black text-white">REFERENCIAS • GAMC - DOT</h4>
            </div>
            <button
              onClick={() => setShowCadastralReferences(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[11px] text-slate-400">
            Plano de OTB y Manzanos • Cochabamba
          </div>

          <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 font-mono text-[11px]">
            {territory.manzanos.map((m) => {
              const isGreen =
                m.color.toLowerCase() === '#16a34a' ||
                m.color.toLowerCase() === '#15803d' ||
                m.name.toLowerCase().includes('verde') ||
                m.name.toLowerCase().includes('parque');

              return (
                <div
                  key={m.id}
                  onClick={() => setInspectedManzano(m)}
                  className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/90 border border-slate-800/80 hover:border-emerald-500/50 cursor-pointer transition-colors"
                >
                  <span
                    className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black text-slate-950 flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: m.color }}
                  >
                    {m.code}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-xs truncate">
                      {isGreen ? '🌳 ' : ''}{m.name}
                    </p>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {m.lotsCount > 0 ? `${m.lotsCount} Lotes Censados` : 'Área Verde Comunal'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between items-center">
            <span>GAMC • Distrito Municipal</span>
            <span className="text-emerald-400 font-bold">DOT</span>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 5. CONTENEDOR DEL MAPA LEAFLET                                      */}
      {/* =================================================================== */}
      <div
        ref={mapContainerRef}
        className={`w-full flex-1 min-h-[260px] ${isEditorOpen && drawingMethod === 'pencil' ? 'cursor-crosshair' : ''}`}
      />

      {/* =================================================================== */}
      {/* 5. LEYENDA INFERIOR INSTITUCIONAL (CLARA Y ACCESIBLE)               */}
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

          <span className="flex items-center gap-1.5 text-purple-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
            <span>Viviendas de Vecinos</span>
          </span>

          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>Sede & Tinglado</span>
          </span>
        </div>

        <span className="font-mono text-[10px] text-slate-500">
          Catastro Comunal Ley N° 1551 • Bolivia
        </span>
      </div>

    </div>
  );
};
