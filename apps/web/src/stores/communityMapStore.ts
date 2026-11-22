import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CommunityManzano {
  id: string;
  code: string;
  name: string;
  color: string;
  polygon: [number, number][];
  lotsCount: number;
  description: string;
}

export interface CommunityFacility {
  id: string;
  name: string;
  category: 'sede' | 'cancha' | 'tinglado' | 'salud' | 'seguridad' | 'agua' | 'parque';
  lat: number;
  lng: number;
  description: string;
}

export interface OtbTerritoryConfig {
  otbId: string;
  otbName: string;
  centerLat: number;
  centerLng: number;
  zoom: number;
  perimeter: [number, number][];
  manzanos: CommunityManzano[];
  facilities: CommunityFacility[];
  updatedAt: string;
}

const DEFAULT_TERRITORIES: Record<string, OtbTerritoryConfig> = {
  // OTB Villa Esperanza (Cochabamba - Av. Petrolera Km 4)
  '11111111-1111-1111-1111-111111111111': {
    otbId: '11111111-1111-1111-1111-111111111111',
    otbName: 'OTB Villa Esperanza',
    centerLat: -17.41325,
    centerLng: -66.16543,
    zoom: 16,
    perimeter: [
      [-17.4115, -66.1670],
      [-17.4110, -66.1635],
      [-17.4128, -66.1625],
      [-17.4145, -66.1627],
      [-17.4155, -66.1648],
      [-17.4148, -66.1672]
    ],
    manzanos: [
      {
        id: 'mza-a',
        code: 'MZA',
        name: 'Manzano A',
        color: '#3B82F6', // Azul institucional
        polygon: [
          [-17.4117, -66.1666],
          [-17.4114, -66.1650],
          [-17.4128, -66.1648],
          [-17.4130, -66.1664]
        ],
        lotsCount: 24,
        description: 'Sector Central y Av. Petrolera • 24 Lotes Censados (Incluye Sede Social y Lote 12)'
      },
      {
        id: 'mza-b',
        code: 'MZB',
        name: 'Manzano B',
        color: '#10B981', // Verde esmeralda
        polygon: [
          [-17.4114, -66.1648],
          [-17.4111, -66.1636],
          [-17.4125, -66.1634],
          [-17.4128, -66.1646]
        ],
        lotsCount: 28,
        description: 'Sector Este y Calle Las Retamas • 28 Lotes Censados'
      },
      {
        id: 'mza-c',
        code: 'MZC',
        name: 'Manzano C',
        color: '#F59E0B', // Ámbar deportivo
        polygon: [
          [-17.4132, -66.1664],
          [-17.4130, -66.1648],
          [-17.4144, -66.1646],
          [-17.4146, -66.1662]
        ],
        lotsCount: 26,
        description: 'Sector Polifuncional y Tinglado Comunal • 26 Lotes Censados'
      },
      {
        id: 'mza-d',
        code: 'MZD',
        name: 'Manzano D',
        color: '#8B5CF6', // Púrpura comunitario
        polygon: [
          [-17.4130, -66.1646],
          [-17.4127, -66.1634],
          [-17.4142, -66.1630],
          [-17.4144, -66.1644]
        ],
        lotsCount: 22,
        description: 'Sector Sur, Parque Infantil y Tanque de Agua • 22 Lotes Censados'
      }
    ],
    facilities: [
      {
        id: 'fac-1',
        name: '🏛️ Sede Social OTB Villa Esperanza',
        category: 'sede',
        lat: -17.4124,
        lng: -66.1655,
        description: 'Salón de Asambleas Generales, Oficina de Secretaría y Tesorería Comunal.'
      },
      {
        id: 'fac-2',
        name: '⚽ Cancha Polifuncional & Tinglado',
        category: 'cancha',
        lat: -17.4137,
        lng: -66.1654,
        description: 'Complejo deportivo barrial con obra de tinglado metálico e iluminación LED.'
      },
      {
        id: 'fac-3',
        name: '🚨 Alarma Vecinal & Cámara de Seguridad (Acceso Norte)',
        category: 'seguridad',
        lat: -17.4116,
        lng: -66.1656,
        description: 'Pulsador de pánico vecinal y monitoreo de ingreso principal al barrio.'
      },
      {
        id: 'fac-4',
        name: '🚨 Alarma Vecinal & Cámara de Seguridad (Acceso Sur)',
        category: 'seguridad',
        lat: -17.4144,
        lng: -66.1638,
        description: 'Circuito preventivo en Pasaje Los Pinos.'
      },
      {
        id: 'fac-5',
        name: '💧 Tanque Comunitario y Válvula Matriz',
        category: 'agua',
        lat: -17.4136,
        lng: -66.1635,
        description: 'Punto de distribución de agua potable y control de presión barrial.'
      },
      {
        id: 'fac-6',
        name: '🛝 Parque Infantil y Área Verde',
        category: 'parque',
        lat: -17.4140,
        lng: -66.1637,
        description: 'Juegos infantiles, jardines comunales y bancos de descanso vecinal.'
      }
    ],
    updatedAt: new Date().toISOString()
  }
};

interface CommunityMapState {
  territories: Record<string, OtbTerritoryConfig>;
  getTerritory: (otbId?: string) => OtbTerritoryConfig;
  updatePerimeter: (otbId: string, perimeter: [number, number][]) => void;
  addPerimeterVertex: (otbId: string, vertex: [number, number]) => void;
  removeLastPerimeterVertex: (otbId: string) => void;
  clearPerimeter: (otbId: string) => void;
  addManzano: (otbId: string, manzano: Omit<CommunityManzano, 'id'>) => void;
  updateManzano: (otbId: string, manzanoId: string, data: Partial<CommunityManzano>) => void;
  deleteManzano: (otbId: string, manzanoId: string) => void;
  addFacility: (otbId: string, facility: Omit<CommunityFacility, 'id'>) => void;
  deleteFacility: (otbId: string, facilityId: string) => void;
  resetToDefault: (otbId: string) => void;
}

export const useCommunityMapStore = create<CommunityMapState>()(
  persist(
    (set, get) => ({
      territories: DEFAULT_TERRITORIES,

      getTerritory: (otbId) => {
        const id = otbId || '11111111-1111-1111-1111-111111111111';
        const current = get().territories[id];
        if (current) return current;

        // Si no existe, crear una configuración basada en default
        const fallback: OtbTerritoryConfig = {
          otbId: id,
          otbName: 'Comunidad OTB',
          centerLat: -17.41325,
          centerLng: -66.16543,
          zoom: 16,
          perimeter: DEFAULT_TERRITORIES['11111111-1111-1111-1111-111111111111'].perimeter,
          manzanos: DEFAULT_TERRITORIES['11111111-1111-1111-1111-111111111111'].manzanos,
          facilities: DEFAULT_TERRITORIES['11111111-1111-1111-1111-111111111111'].facilities,
          updatedAt: new Date().toISOString()
        };
        return fallback;
      },

      updatePerimeter: (otbId, perimeter) => {
        set((state) => {
          const current = state.getTerritory(otbId);
          return {
            territories: {
              ...state.territories,
              [otbId]: {
                ...current,
                perimeter,
                updatedAt: new Date().toISOString()
              }
            }
          };
        });
      },

      addPerimeterVertex: (otbId, vertex) => {
        set((state) => {
          const current = state.getTerritory(otbId);
          return {
            territories: {
              ...state.territories,
              [otbId]: {
                ...current,
                perimeter: [...current.perimeter, vertex],
                updatedAt: new Date().toISOString()
              }
            }
          };
        });
      },

      removeLastPerimeterVertex: (otbId) => {
        set((state) => {
          const current = state.getTerritory(otbId);
          if (current.perimeter.length === 0) return state;
          return {
            territories: {
              ...state.territories,
              [otbId]: {
                ...current,
                perimeter: current.perimeter.slice(0, -1),
                updatedAt: new Date().toISOString()
              }
            }
          };
        });
      },

      clearPerimeter: (otbId) => {
        set((state) => {
          const current = state.getTerritory(otbId);
          return {
            territories: {
              ...state.territories,
              [otbId]: {
                ...current,
                perimeter: [],
                updatedAt: new Date().toISOString()
              }
            }
          };
        });
      },

      addManzano: (otbId, manzanoData) => {
        set((state) => {
          const current = state.getTerritory(otbId);
          const newManzano: CommunityManzano = {
            ...manzanoData,
            id: `mza-${Date.now()}`
          };
          return {
            territories: {
              ...state.territories,
              [otbId]: {
                ...current,
                manzanos: [...current.manzanos, newManzano],
                updatedAt: new Date().toISOString()
              }
            }
          };
        });
      },

      updateManzano: (otbId, manzanoId, data) => {
        set((state) => {
          const current = state.getTerritory(otbId);
          return {
            territories: {
              ...state.territories,
              [otbId]: {
                ...current,
                manzanos: current.manzanos.map((m) =>
                  m.id === manzanoId ? { ...m, ...data } : m
                ),
                updatedAt: new Date().toISOString()
              }
            }
          };
        });
      },

      deleteManzano: (otbId, manzanoId) => {
        set((state) => {
          const current = state.getTerritory(otbId);
          return {
            territories: {
              ...state.territories,
              [otbId]: {
                ...current,
                manzanos: current.manzanos.filter((m) => m.id !== manzanoId),
                updatedAt: new Date().toISOString()
              }
            }
          };
        });
      },

      addFacility: (otbId, facilityData) => {
        set((state) => {
          const current = state.getTerritory(otbId);
          const newFacility: CommunityFacility = {
            ...facilityData,
            id: `fac-${Date.now()}`
          };
          return {
            territories: {
              ...state.territories,
              [otbId]: {
                ...current,
                facilities: [...current.facilities, newFacility],
                updatedAt: new Date().toISOString()
              }
            }
          };
        });
      },

      deleteFacility: (otbId, facilityId) => {
        set((state) => {
          const current = state.getTerritory(otbId);
          return {
            territories: {
              ...state.territories,
              [otbId]: {
                ...current,
                facilities: current.facilities.filter((f) => f.id !== facilityId),
                updatedAt: new Date().toISOString()
              }
            }
          };
        });
      },

      resetToDefault: (otbId) => {
        set((state) => ({
          territories: {
            ...state.territories,
            [otbId]: DEFAULT_TERRITORIES['11111111-1111-1111-1111-111111111111']
          }
        }));
      }
    }),
    {
      name: 'xentra_community_territory_v1'
    }
  )
);
