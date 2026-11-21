import { create } from 'zustand';
import { Otb } from '@xentra/shared';

interface TenantState {
  currentOtb: Otb | null;
  availableOtbs: Otb[];
  setCurrentOtb: (otb: Otb) => void;
  setAvailableOtbs: (otbs: Otb[]) => void;
}

export const useTenantStore = create<TenantState>((set) => ({
  currentOtb: {
    id: '11111111-1111-1111-1111-111111111111',
    code: 'OTB-CBBA-001',
    name: 'Villa Esperanza',
    department: 'Cochabamba',
    municipality: 'Cochabamba (Cercado)',
    zone: 'Zona Sud - Distrito 8',
    address: 'Av. Petrolera Km 4',
    currency: 'BOB',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  availableOtbs: [
    {
      id: '11111111-1111-1111-1111-111111111111',
      code: 'OTB-CBBA-001',
      name: 'Villa Esperanza',
      department: 'Cochabamba',
      municipality: 'Cochabamba (Cercado)',
      zone: 'Zona Sud - Distrito 8',
      address: 'Av. Petrolera Km 4',
      currency: 'BOB',
      is_active: true,
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
      currency: 'BOB',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  setCurrentOtb: (currentOtb) => set({ currentOtb }),
  setAvailableOtbs: (availableOtbs) => set({ availableOtbs })
}));
