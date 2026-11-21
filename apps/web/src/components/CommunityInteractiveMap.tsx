import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CommunityReport, ReportCategory } from '../stores/communityReportsStore';
import { MapPin, Navigation, ExternalLink, ShieldCheck } from 'lucide-react';

interface CommunityInteractiveMapProps {
  reports?: CommunityReport[];
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
  heightClass?: string;
  otbName?: string;
  selectedLotName?: string;
  onSelectCoordinates?: (lat: number, lng: number) => void;
  interactiveSelection?: boolean;
}

export const CommunityInteractiveMap: React.FC<CommunityInteractiveMapProps> = ({
  reports = [],
  centerLat = -17.41325,
  centerLng = -66.16543,
  zoom = 16,
  heightClass = 'h-72 sm:h-96',
  otbName = 'OTB Villa Esperanza',
  selectedLotName,
  onSelectCoordinates,
  interactiveSelection = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const selectionMarkerRef = useRef<L.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destruir mapa previo si existía para evitar solapamientos
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Inicializar mapa de Leaflet
    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: zoom,
      scrollWheelZoom: false,
      zoomControl: true
    });
    mapInstanceRef.current = map;

    // Capa base de OpenStreetMap oficial 100% LIBRE (No requiere NINGUNA API KEY)
    const primaryTileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
    });

    primaryTileLayer.on('tileerror', () => {
      // Fallback automático al servidor humanitario OSM si hubiese congestión de red
      L.tileLayer('https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors, Humanitarian OpenStreetMap Team'
      }).addTo(map);
    });

    primaryTileLayer.addTo(map);

    // Pin de la Sede Social de la OTB
    const sedeIcon = L.divIcon({
      html: `
        <div style="background-color: #1D4ED8; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.45); cursor: pointer;">
          🏛️
        </div>
      `,
      className: 'sede-icon',
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    L.marker([centerLat, centerLng], { icon: sedeIcon })
      .addTo(map)
      .bindPopup(`
        <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4; min-width: 190px;">
          <strong style="color: #1E3A8A; font-size: 14px; display: block;">🏛️ Sede Social ${otbName}</strong>
          <span style="color: #475569;">Av. Petrolera Km 4 • Centro de Asambleas y Cobranzas</span><br/>
          <span style="color: #16A34A; font-weight: bold; display: block; margin-top: 4px;">Atención: Sábados y Domingos 08:30 a 12:30</span>
          <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #E2E8F0;">
            <a href="https://www.google.com/maps?q=${centerLat},${centerLng}" target="_blank" style="color: #2563EB; font-weight: bold; font-size: 11px; text-decoration: none;">
              Abrir en Google Maps GPS →
            </a>
          </div>
        </div>
      `);

    // Pin de la Cancha Polifuncional
    const canchaIcon = L.divIcon({
      html: `
        <div style="background-color: #059669; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.35); cursor: pointer;">
          ⚽
        </div>
      `,
      className: 'cancha-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    L.marker([centerLat + 0.0007, centerLng - 0.0006], { icon: canchaIcon })
      .addTo(map)
      .bindPopup(`
        <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4; min-width: 180px;">
          <strong style="color: #065F46; font-size: 14px; display: block;">⚽ Cancha Polifuncional</strong>
          <span style="color: #475569;">Espacio Deportivo Comunitario</span><br/>
          <span style="color: #2563EB; font-weight: bold; font-size: 11px;">Proyecto Tinglado en Ejecución</span>
          <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #E2E8F0;">
            <a href="https://www.google.com/maps?q=${centerLat + 0.0007},${centerLng - 0.0006}" target="_blank" style="color: #2563EB; font-weight: bold; font-size: 11px; text-decoration: none;">
              Abrir en Google Maps GPS →
            </a>
          </div>
        </div>
      `);

    // Si se pasa un lote seleccionado del vecino
    if (selectedLotName) {
      const lotIcon = L.divIcon({
        html: `
          <div style="background-color: #9333EA; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 17px; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.45); cursor: pointer;">
            🏠
          </div>
        `,
        className: 'lot-icon',
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      L.marker([centerLat - 0.0005, centerLng + 0.0008], { icon: lotIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4;">
            <strong style="color: #6B21A8; font-size: 14px; display: block;">🏠 Tu Inmueble: ${selectedLotName}</strong>
            <span style="color: #475569;">Ubicación Censada en el Padrón OTB</span>
          </div>
        `)
        .openPopup();
    }

    // Dibujar los reportes activos en el mapa
    reports.forEach((rep) => {
      if (!rep.latitude || !rep.longitude) return;

      const getCategoryEmoji = (cat: ReportCategory) => {
        switch (cat) {
          case 'borracho_cancha': return '🍺';
          case 'perro_peligro': return '🐕';
          case 'fuga_agua': return '💧';
          case 'auto_sospechoso': return '🚗';
          case 'luminaria': return '💡';
          case 'basura': return '🗑️';
          case 'ruido': return '🔊';
          default: return '⚠️';
        }
      };

      const getCategoryColor = (cat: ReportCategory) => {
        switch (cat) {
          case 'borracho_cancha': return '#DC2626';
          case 'perro_peligro': return '#D97706';
          case 'fuga_agua': return '#0284C7';
          case 'auto_sospechoso': return '#9333EA';
          case 'luminaria': return '#EAB308';
          default: return '#EF4444';
        }
      };

      const repIcon = L.divIcon({
        html: `
          <div style="background-color: ${getCategoryColor(rep.category)}; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 15px; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.5); cursor: pointer;">
            ${getCategoryEmoji(rep.category)}
          </div>
        `,
        className: 'rep-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([rep.latitude, rep.longitude], { icon: repIcon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4; min-width: 190px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="font-size: 16px;">${getCategoryEmoji(rep.category)}</span>
            <strong style="color: #0F172A; font-size: 13px;">${rep.title}</strong>
          </div>
          <p style="color: #475569; font-size: 12px; margin: 4px 0;">${rep.description}</p>
          <div style="color: #64748B; font-size: 11px;">📍 ${rep.location}</div>
          <div style="color: #2563EB; font-weight: bold; font-size: 11px; margin-top: 4px;">Por: ${rep.neighborName} (${rep.lotName})</div>
          <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 10px; font-weight: bold; color: ${rep.status === 'resuelto' ? '#16A34A' : '#D97706'};">
              ${rep.status.toUpperCase()}
            </span>
            <a href="https://www.google.com/maps?q=${rep.latitude},${rep.longitude}" target="_blank" style="font-size: 11px; color: #2563EB; font-weight: bold; text-decoration: none;">
              Abrir GPS →
            </a>
          </div>
        </div>
      `);
    });

    // Modo interactivo: hacer clic en el mapa para marcar el incidente
    if (interactiveSelection && onSelectCoordinates) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;

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
      });
    }

    // Invalida tamaño en múltiples ciclos para garantizar que cargue sin fallos en modales y pestañas
    const timer1 = setTimeout(() => {
      map.invalidateSize();
      setMapLoaded(true);
    }, 150);

    const timer2 = setTimeout(() => {
      map.invalidateSize();
    }, 450);

    const timer3 = setTimeout(() => {
      map.invalidateSize();
    }, 900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [centerLat, centerLng, zoom, reports, selectedLotName, interactiveSelection, onSelectCoordinates, otbName]);

  const googleMapsUrl = `https://www.google.com/maps?q=${centerLat},${centerLng}`;

  return (
    <div className={`w-full ${heightClass} rounded-3xl overflow-hidden border-2 border-slate-700 shadow-2xl relative z-10 flex flex-col bg-[#0B132B]`}>
      {/* Barra de estado del mapa y acceso GPS */}
      <div className="px-4 py-2 bg-[#030712]/90 border-b border-slate-800 flex items-center justify-between text-xs z-20">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-slate-300">
            Mapa Vecinal Oficial ({otbName})
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-mono">
            OpenStreetMap • 100% Libre
          </span>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-[11px] font-black transition-all cursor-pointer"
        >
          <span>Abrir GPS Satelital</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Contenedor del Mapa Leaflet */}
      <div ref={mapContainerRef} className="w-full flex-1 min-h-[220px]" />
    </div>
  );
};
