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
  // OTB Villa Graciela (OTB No. 24 - Distrito 1 GAMC Cochabamba) / Villa Esperanza
  '11111111-1111-1111-1111-111111111111': {
    otbId: '11111111-1111-1111-1111-111111111111',
    otbName: 'OTB Villa Graciela (Distrito 1)',
    centerLat: -17.41315,
    centerLng: -66.16495,
    zoom: 16,
    // Perímetro trazado por el eje de las avenidas y calles limítrofes oficiales
    perimeter: [
      [-17.4110, -66.1680], // Esquina NO: Av. Circunvalación esq. Av. Ecológica
      [-17.4110, -66.1619], // Esquina NE: Av. Circunvalación esq. Calle Los Pinos (Límite con OTB 6 Pacata Central)
      [-17.4153, -66.1619], // Esquina SE: Av. Litoral Sur esq. Calle Los Pinos
      [-17.4153, -66.1680]  // Esquina SO: Av. Litoral Sur esq. Av. Ecológica
    ],
    // Manzanos trazados con cuadrícula y corredores viales reales (Calles 12m-15m)
    manzanos: [
      // FILA NORTE (Bordeando Av. Circunvalación Norte)
      {
        id: 'mza-263',
        code: '263',
        name: 'Manzano 263',
        color: '#FDBA74', // Durazno Melocotón (Plano GAMC OTB 24)
        polygon: [
          [-17.4114, -66.1676],
          [-17.4114, -66.1660],
          [-17.4124, -66.1660],
          [-17.4124, -66.1676]
        ],
        lotsCount: 22,
        description: 'Av. Circunvalación esq. Calle Cochabamba • 22 Lotes Censados'
      },
      {
        id: 'mza-262',
        code: '262',
        name: 'Manzano 262',
        color: '#FDBA74',
        polygon: [
          [-17.4114, -66.1656],
          [-17.4114, -66.1641],
          [-17.4124, -66.1641],
          [-17.4124, -66.1656]
        ],
        lotsCount: 24,
        description: 'Sector Central Norte • 24 Lotes Censados'
      },
      {
        id: 'mza-261',
        code: '261',
        name: 'Manzano 261',
        color: '#FDBA74',
        polygon: [
          [-17.4114, -66.1637],
          [-17.4114, -66.1623],
          [-17.4124, -66.1623],
          [-17.4124, -66.1637]
        ],
        lotsCount: 20,
        description: 'Av. Circunvalación esq. Calle Los Pinos • 20 Lotes Censados'
      },

      // FILA CENTRAL (Bordeando Calle Los Ceibos y Calle Las Retamas)
      {
        id: 'mza-267',
        code: '267',
        name: 'Manzano 267',
        color: '#FDBA74',
        polygon: [
          [-17.4127, -66.1676],
          [-17.4127, -66.1660],
          [-17.4136, -66.1660],
          [-17.4136, -66.1676]
        ],
        lotsCount: 26,
        description: 'Sector Residencial Oeste • 26 Lotes Censados'
      },
      {
        id: 'mza-266',
        code: '266',
        name: 'Manzano 266',
        color: '#FDBA74',
        polygon: [
          [-17.4127, -66.1656],
          [-17.4127, -66.1641],
          [-17.4136, -66.1641],
          [-17.4136, -66.1656]
        ],
        lotsCount: 28,
        description: 'Corazón de la OTB • 28 Lotes Censados (Incluye Sede Social)'
      },
      {
        id: 'mza-av5',
        code: '5',
        name: 'Área Verde 5 (Parque & Cancha Comunal)',
        color: '#16A34A', // Verde Bosque Oficial DOT
        polygon: [
          [-17.4127, -66.1637],
          [-17.4127, -66.1623],
          [-17.4136, -66.1623],
          [-17.4136, -66.1637]
        ],
        lotsCount: 0,
        description: '🌳 Equipamiento Comunal GAMC: Tinglado Deportivo, Cancha Polifuncional y Parque Infantil'
      },

      // FILA SUR (Bordeando Av. Litoral Sur)
      {
        id: 'mza-270',
        code: '270',
        name: 'Manzano 270',
        color: '#FDBA74',
        polygon: [
          [-17.4139, -66.1676],
          [-17.4139, -66.1654],
          [-17.4149, -66.1654],
          [-17.4149, -66.1676]
        ],
        lotsCount: 36,
        description: 'Gran Manzano Suroeste • 36 Lotes Censados'
      },
      {
        id: 'mza-269',
        code: '269',
        name: 'Manzano 269',
        color: '#FDBA74',
        polygon: [
          [-17.4139, -66.1650],
          [-17.4139, -66.1638],
          [-17.4149, -66.1638],
          [-17.4149, -66.1650]
        ],
        lotsCount: 18,
        description: 'Sector Sur Central • 18 Lotes Censados'
      },
      {
        id: 'mza-268',
        code: '268',
        name: 'Manzano 268',
        color: '#FDBA74',
        polygon: [
          [-17.4139, -66.1635],
          [-17.4139, -66.1623],
          [-17.4149, -66.1623],
          [-17.4149, -66.1635]
        ],
        lotsCount: 20,
        description: 'Sector Pasaje Los Pinos Sur • 20 Lotes Censados'
      }
    ],
    facilities: [
      {
        id: 'fac-1',
        name: '🏛️ Sede Social OTB Villa Graciela',
        category: 'sede',
        lat: -17.4131,
        lng: -66.1648,
        description: 'Salón de Asambleas Generales, Oficina de Presidencia y Secretaría.'
      },
      {
        id: 'fac-2',
        name: '⚽ Cancha Polifuncional & Tinglado',
        category: 'cancha',
        lat: -17.4131,
        lng: -66.1630,
        description: 'Complejo deportivo barrial con obra de tinglado metálico e iluminación LED.'
      },
      {
        id: 'fac-3',
        name: '🚨 Alarma Vecinal & Cámara de Seguridad (Acceso Norte)',
        category: 'seguridad',
        lat: -17.4111,
        lng: -66.1650,
        description: 'Pulsador de pánico vecinal y monitoreo de ingreso por Av. Circunvalación.'
      },
      {
        id: 'fac-4',
        name: '🚨 Alarma Vecinal & Cámara de Seguridad (Acceso Sur)',
        category: 'seguridad',
        lat: -17.4151,
        lng: -66.1650,
        description: 'Circuito preventivo en Av. Litoral.'
      },
      {
        id: 'fac-5',
        name: '💧 Tanque Comunitario y Válvula Matriz',
        category: 'agua',
        lat: -17.4144,
        lng: -66.1630,
        description: 'Punto de distribución de agua potable y control de presión barrial.'
      },
      {
        id: 'fac-6',
        name: '🛝 Parque Infantil y Área Verde',
        category: 'parque',
        lat: -17.4134,
        lng: -66.1630,
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
      name: 'xentra_community_territory_v2_gamc'
    }
  )
);
