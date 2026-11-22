import { create } from 'zustand';
import { Otb } from '@xentra/shared';

interface ExtendedOtb extends Otb {
  president_name?: string;
  treasurer_name?: string;
  contact_phone?: string;
}

interface TenantState {
  currentOtb: ExtendedOtb | null;
  availableOtbs: ExtendedOtb[];
  setCurrentOtb: (otb: ExtendedOtb) => void;
  setAvailableOtbs: (otbs: ExtendedOtb[]) => void;
  updateOtb: (otbId: string, updatedFields: Partial<ExtendedOtb>) => void;
}

const STORAGE_KEY = 'xentra_tenant_otbs_v4_clean';

const DEFAULT_OTBS: ExtendedOtb[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    code: 'OTB-CBBA-024',
    name: 'Villa Graciela (Distrito 1)',
    department: 'Cochabamba',
    municipality: 'Cochabamba (Cercado)',
    zone: 'Distrito 1',
    address: 'Av. 6 de Agosto esq. Calle Sipe Sipe',
    logo_url: 'bolivia',
    currency: 'BOB',
    is_active: true,
    president_name: 'Roberto Gutiérrez Vargas',
    treasurer_name: 'Silvia Rojas Torrico',
    contact_phone: '76543210',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    code: 'OTB-LPZ-002',
    name: 'Los Pinos',
    department: 'La Paz',
    municipality: 'La Paz (Murillo)',
    zone: 'Zona Sur - Calacoto',
    address: 'Calle 25 de Calacoto #120',
    logo_url: 'bolivia',
    currency: 'BOB',
    is_active: true,
    president_name: 'Marina Condori Rocha',
    treasurer_name: 'Pedro Gonzalo Canaviri',
    contact_phone: '72345678',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    code: 'OTB-SCZ-003',
    name: 'Barrio Lindo Plan 4000',
    department: 'Santa Cruz',
    municipality: 'Santa Cruz de la Sierra',
    zone: 'Villa 1ro de Mayo',
    address: 'Av. Che Guevara #450',
    logo_url: 'bolivia',
    currency: 'BOB',
    is_active: true,
    president_name: 'Carmen Rosa Salvatierra',
    treasurer_name: 'Faustino Choque',
    contact_phone: '76891234',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const loadInitialOtbs = (): ExtendedOtb[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Error reading tenant OTBs from localStorage', err);
  }
  return DEFAULT_OTBS;
};

const saveOtbsToStorage = (otbs: ExtendedOtb[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(otbs));
  } catch (err) {
    console.warn('Error saving tenant OTBs to localStorage', err);
  }
};

const initialOtbs = loadInitialOtbs();

export const useTenantStore = create<TenantState>((set, get) => ({
  currentOtb: initialOtbs[0] || DEFAULT_OTBS[0],
  availableOtbs: initialOtbs,
  setCurrentOtb: (currentOtb) => set({ currentOtb }),
  setAvailableOtbs: (availableOtbs) => {
    saveOtbsToStorage(availableOtbs);
    set({ availableOtbs });
  },
  updateOtb: (otbId, updatedFields) => {
    const state = get();
    const updated = state.availableOtbs.map((otb) => {
      if (otb.id === otbId) {
        return {
          ...otb,
          ...updatedFields,
          updated_at: new Date().toISOString()
        };
      }
      return otb;
    });

    saveOtbsToStorage(updated);

    const isCurrent = state.currentOtb?.id === otbId;
    set({
      availableOtbs: updated,
      currentOtb: (isCurrent && state.currentOtb)
        ? { ...state.currentOtb, ...updatedFields, updated_at: new Date().toISOString() }
        : state.currentOtb
    });
  }
}));
