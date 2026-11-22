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
  // OTB Villa Graciela (Distrito 1 - Cochabamba)
  '11111111-1111-1111-1111-111111111111': {
    otbId: '11111111-1111-1111-1111-111111111111',
    otbName: 'OTB Villa Graciela (Distrito 1)',
    centerLat: -17.4128,
    centerLng: -66.1654,
    zoom: 16,
    // Perímetro oficial único de la OTB delimitado por las calles limítrofes reales
    perimeter: [
      [-17.4105, -66.1672], // NO: Av. 6 de Agosto esq. Calle Villar / José Aguirre Gainsborg
      [-17.4108, -66.1648], // N: Av. 6 de Agosto (frente a Plaza Walter Arze)
      [-17.4112, -66.1632], // N-NE: Av. 6 de Agosto curva
      [-17.4116, -66.1622], // NE: Av. 6 de Agosto esq. Calle Carlos Taboada
      [-17.4130, -66.1622], // Este: Calle Carlos Taboada
      [-17.4146, -66.1622], // SE: Calle Carlos Taboada esq. Calle Viloma
      [-17.4146, -66.1665], // Sur: Calle Viloma
      [-17.4145, -66.1682], // SO: Calle Viloma esq. Calle Villar
      [-17.4137, -66.1680], // Oeste: Calle Villar
      [-17.4125, -66.1678]  // NO: Curva hacia Av. 6 de Agosto
    ],
    // Manzanos trazados respetando los corredores de calles reales de OpenStreetMap
    manzanos: [
      // FILA NORTE (Delimitados entre Av. 6 de Agosto y Calle Guaqui)
      {
        id: 'mza-263',
        code: '263',
        name: 'Manzano 263',
        color: '#FDBA74',
        polygon: [
          [-17.4109, -66.1674],
          [-17.4111, -66.1669],
          [-17.4116, -66.1669],
          [-17.4116, -66.1676],
          [-17.4112, -66.1676]
        ],
        lotsCount: 22,
        description: 'Sector Noroeste • Av. 6 de Agosto esq. Calle Sipe Sipe (22 Lotes)'
      },
      {
        id: 'mza-262',
        code: '262',
        name: 'Manzano 262',
        color: '#FDBA74',
        polygon: [
          [-17.4112, -66.1664],
          [-17.4114, -66.1650],
          [-17.4116, -66.1650],
          [-17.4116, -66.1664]
        ],
        lotsCount: 24,
        description: 'Sector Norte Central • Calle Sipe Sipe hacia Av. de la Fuerza Aérea (24 Lotes)'
      },
      {
        id: 'mza-261',
        code: '261',
        name: 'Manzano 261',
        color: '#FDBA74',
        polygon: [
          [-17.4115, -66.1644],
          [-17.4118, -66.1624],
          [-17.4121, -66.1624],
          [-17.4121, -66.1644]
        ],
        lotsCount: 20,
        description: 'Sector Noreste • Av. 6 de Agosto esq. Calle Carlos Taboada (20 Lotes)'
      },

      // FILA MEDIA (Delimitados entre Calle Guaqui y Calle Tablas)
      {
        id: 'mza-267',
        code: '267',
        name: 'Manzano 267',
        color: '#FDBA74',
        polygon: [
          [-17.4120, -66.1677],
          [-17.4120, -66.1669],
          [-17.4135, -66.1669],
          [-17.4135, -66.1678],
          [-17.4128, -66.1678]
        ],
        lotsCount: 26,
        description: 'Sector Oeste • Calle Villar esq. Calle Ayoma (26 Lotes)'
      },
      {
        id: 'mza-266',
        code: '266',
        name: 'Manzano 266',
        color: '#FDBA74',
        polygon: [
          [-17.4120, -66.1664],
          [-17.4120, -66.1650],
          [-17.4135, -66.1650],
          [-17.4135, -66.1664]
        ],
        lotsCount: 28,
        description: 'Sector Central • Sede Social de la OTB y salón comunal (28 Lotes)'
      },
      {
        id: 'mza-265',
        code: '265',
        name: 'Área Verde & Cancha Comunal',
        color: '#16A34A',
        polygon: [
          [-17.4124, -66.1644],
          [-17.4124, -66.1624],
          [-17.4135, -66.1624],
          [-17.4135, -66.1644]
        ],
        lotsCount: 0,
        description: '🌳 Complejo Deportivo, Cancha Polifuncional con Tinglado y Parque Infantil'
      },

      // FILA SUR (Delimitados entre Calle Tablas y Calle Viloma)
      {
        id: 'mza-270',
        code: '270',
        name: 'Manzano 270 (Gran Manzano Suroeste)',
        color: '#FDBA74',
        polygon: [
          [-17.4139, -66.1680],
          [-17.4139, -66.1665],
          [-17.4144, -66.1665],
          [-17.4144, -66.1681],
          [-17.4141, -66.1681]
        ],
        lotsCount: 36,
        description: 'Gran Manzano Suroeste • Calle Villar y Calle Viloma (36 Lotes)'
      },
      {
        id: 'mza-268',
        code: '268',
        name: 'Manzano 268',
        color: '#FDBA74',
        polygon: [
          [-17.4139, -66.1660],
          [-17.4139, -66.1650],
          [-17.4144, -66.1650],
          [-17.4144, -66.1660]
        ],
        lotsCount: 20,
        description: 'Sector Sur Central • Calle Viloma esq. Calle Colomi (20 Lotes)'
      },
      {
        id: 'mza-269',
        code: '269',
        name: 'Manzano 269',
        color: '#FDBA74',
        polygon: [
          [-17.4139, -66.1644],
          [-17.4139, -66.1624],
          [-17.4144, -66.1624],
          [-17.4144, -66.1644]
        ],
        lotsCount: 18,
        description: 'Sector Sureste • Calle Viloma esq. Calle Carlos Taboada (18 Lotes)'
      }
    ],
    facilities: [
      {
        id: 'fac-1',
        name: '🏛️ Sede Social OTB Villa Graciela',
        category: 'sede',
        lat: -17.4127,
        lng: -66.1657,
        description: 'Salón de Asambleas Generales, Oficina de Presidencia y Secretaría.'
      },
      {
        id: 'fac-2',
        name: '⚽ Cancha Polifuncional & Tinglado',
        category: 'cancha',
        lat: -17.4129,
        lng: -66.1634,
        description: 'Complejo deportivo barrial con obra de tinglado metálico e iluminación LED.'
      },
      {
        id: 'fac-3',
        name: '🚨 Alarma Vecinal & Cámara de Seguridad (Acceso Norte)',
        category: 'seguridad',
        lat: -17.4110,
        lng: -66.1666,
        description: 'Pulsador de pánico vecinal e ingreso por Av. 6 de Agosto y Calle Sipe Sipe.'
      },
      {
        id: 'fac-4',
        name: '🚨 Alarma Vecinal & Cámara de Seguridad (Acceso Sur)',
        category: 'seguridad',
        lat: -17.4145,
        lng: -66.1663,
        description: 'Circuito preventivo en Calle Viloma y Calle Sipe Sipe.'
      },
      {
        id: 'fac-5',
        name: '💧 Tanque Comunitario y Válvula Matriz',
        category: 'agua',
        lat: -17.4132,
        lng: -66.1634,
        description: 'Punto de distribución de agua potable y control de presión barrial.'
      },
      {
        id: 'fac-6',
        name: '🛝 Parque Infantil y Área Verde',
        category: 'parque',
        lat: -17.4126,
        lng: -66.1634,
        description: 'Juegos infantiles, jardines comunales y bancos de descanso vecinal.'
      }
    ],
    updatedAt: new Date().toISOString()
  },

  // OTB Los Pinos (OTB No. 002 - La Paz, Murillo - Zona Sur Calacoto)
  '22222222-2222-2222-2222-222222222222': {
    otbId: '22222222-2222-2222-2222-222222222222',
    otbName: 'OTB Los Pinos (La Paz)',
    centerLat: -16.5385,
    centerLng: -68.0820,
    zoom: 16,
    perimeter: [
      [-16.5365, -68.0845],
      [-16.5365, -68.0795],
      [-16.5405, -68.0795],
      [-16.5405, -68.0845]
    ],
    manzanos: [
      {
        id: 'mza-lpz-1',
        code: '1',
        name: 'Manzano 1 (Bloques Centrales)',
        color: '#93C5FD', // Azul Cielo
        polygon: [
          [-16.5370, -68.0840],
          [-16.5370, -68.0818],
          [-16.5385, -68.0818],
          [-16.5385, -68.0840]
        ],
        lotsCount: 32,
        description: 'Av. Ballivián esq. Calle 25 • 32 Familias Empadronadas'
      },
      {
        id: 'mza-lpz-2',
        code: '2',
        name: 'Manzano 2 (Paseo Los Sauces)',
        color: '#D8B4FE', // Lavanda
        polygon: [
          [-16.5370, -68.0814],
          [-16.5370, -68.0798],
          [-16.5385, -68.0798],
          [-16.5385, -68.0814]
        ],
        lotsCount: 24,
        description: 'Sector Este y Pasaje Los Sauces • 24 Lotes Registrados'
      },
      {
        id: 'mza-lpz-av',
        code: 'AV',
        name: 'Área Verde & Cancha Los Pinos',
        color: '#16A34A', // Verde Bosque
        polygon: [
          [-16.5388, -68.0840],
          [-16.5388, -68.0818],
          [-16.5400, -68.0818],
          [-16.5400, -68.0840]
        ],
        lotsCount: 0,
        description: '🌳 Complejo Deportivo Los Pinos: Cancha de Futsal y Tinglado Comunal'
      },
      {
        id: 'mza-lpz-3',
        code: '3',
        name: 'Manzano 3 (Residencial Sur)',
        color: '#FDE047', // Amarillo
        polygon: [
          [-16.5388, -68.0814],
          [-16.5388, -68.0798],
          [-16.5400, -68.0798],
          [-16.5400, -68.0814]
        ],
        lotsCount: 28,
        description: 'Sector Residencial Sur • 28 Lotes Registrados'
      }
    ],
    facilities: [
      {
        id: 'fac-lpz-1',
        name: '🏛️ Sede Social OTB Los Pinos',
        category: 'sede',
        lat: -16.5378,
        lng: -68.0825,
        description: 'Oficina Vecinal y Salón de Actos Zona Sur.'
      },
      {
        id: 'fac-lpz-2',
        name: '⚽ Cancha Polifuncional & Tinglado',
        category: 'cancha',
        lat: -16.5394,
        lng: -68.0828,
        description: 'Complejo deportivo barrial Los Pinos.'
      }
    ],
    updatedAt: new Date().toISOString()
  },

  // OTB Barrio Lindo Plan 4000 (OTB No. 003 - Santa Cruz, Villa 1ro de Mayo)
  '33333333-3333-3333-3333-333333333333': {
    otbId: '33333333-3333-3333-3333-333333333333',
    otbName: 'Barrio Lindo Plan 4000 (Santa Cruz)',
    centerLat: -17.7845,
    centerLng: -63.1420,
    zoom: 16,
    perimeter: [
      [-17.7825, -63.1445],
      [-17.7825, -63.1395],
      [-17.7865, -63.1395],
      [-17.7865, -63.1445]
    ],
    manzanos: [
      {
        id: 'mza-scz-1',
        code: '12',
        name: 'Manzano 12 (Av. Che Guevara)',
        color: '#FCA5A5', // Rosa
        polygon: [
          [-17.7830, -63.1440],
          [-17.7830, -63.1418],
          [-17.7845, -63.1418],
          [-17.7845, -63.1440]
        ],
        lotsCount: 30,
        description: 'Av. Che Guevara • 30 Lotes Empadronados'
      },
      {
        id: 'mza-scz-2',
        code: '13',
        name: 'Manzano 13 (Calle 4)',
        color: '#FDBA74', // Durazno
        polygon: [
          [-17.7830, -63.1414],
          [-17.7830, -63.1398],
          [-17.7845, -63.1398],
          [-17.7845, -63.1414]
        ],
        lotsCount: 25,
        description: 'Sector Calle 4 Este • 25 Lotes Registrados'
      },
      {
        id: 'mza-scz-av',
        code: 'AV',
        name: 'Plaza & Cancha Comunal Barrio Lindo',
        color: '#16A34A', // Verde
        polygon: [
          [-17.7848, -63.1440],
          [-17.7848, -63.1418],
          [-17.7860, -63.1418],
          [-17.7860, -63.1440]
        ],
        lotsCount: 0,
        description: '🌳 Plaza de Recreación y Cancha Polifuncional Municipal'
      },
      {
        id: 'mza-scz-3',
        code: '14',
        name: 'Manzano 14 (Pasaje Los Ceibos)',
        color: '#93C5FD', // Azul
        polygon: [
          [-17.7848, -63.1414],
          [-17.7848, -63.1398],
          [-17.7860, -63.1398],
          [-17.7860, -63.1414]
        ],
        lotsCount: 22,
        description: 'Sector Residencial Sur • 22 Lotes Registrados'
      }
    ],
    facilities: [
      {
        id: 'fac-scz-1',
        name: '🏛️ Sede Social Barrio Lindo Plan 4000',
        category: 'sede',
        lat: -17.7838,
        lng: -63.1425,
        description: 'Salón de Asambleas Vecinales y Administración Comunal.'
      },
      {
        id: 'fac-scz-2',
        name: '⚽ Cancha Polifuncional Comunal',
        category: 'cancha',
        lat: -17.7854,
        lng: -63.1430,
        description: 'Complejo deportivo vecinal Plan 4000.'
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

        // Si existe en el catálogo inicial oficial por defecto
        if (DEFAULT_TERRITORIES[id]) {
          return DEFAULT_TERRITORIES[id];
        }

        // Si es una OTB nueva registrada por la directiva o superadmin, territorio limpio independiente
        const fallback: OtbTerritoryConfig = {
          otbId: id,
          otbName: 'Nueva OTB',
          centerLat: -17.41315,
          centerLng: -66.16495,
          zoom: 16,
          perimeter: [],
          manzanos: [],
          facilities: [],
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
            [otbId]: DEFAULT_TERRITORIES[otbId] || {
              otbId,
              otbName: 'Comunidad OTB',
              centerLat: -17.41315,
              centerLng: -66.16495,
              zoom: 16,
              perimeter: [],
              manzanos: [],
              facilities: [],
              updatedAt: new Date().toISOString()
            }
          }
        }));
      }
    }),
    {
      name: 'xentra_community_territory_v6_single_otb_streets_real'
    }
  )
);
