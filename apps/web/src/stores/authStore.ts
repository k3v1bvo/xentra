import { create } from 'zustand';
import { AppRole, Profile, OtbMember } from '@xentra/shared';

interface AuthState {
  user: { id: string; email?: string } | null;
  profile: Profile | null;
  currentRole: AppRole;
  memberships: OtbMember[];
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: { id: string; email?: string } | null) => void;
  setProfile: (profile: Profile | null) => void;
  setCurrentRole: (role: AppRole) => void;
  setMemberships: (memberships: OtbMember[]) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    email: 'marina.tesoreria@xentra.app'
  },
  profile: {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    first_name: 'Marina',
    last_name: 'Condori Rocha',
    ci_number: '6398412',
    ci_extension: 'CBBA',
    phone: '73456789',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  currentRole: 'tesorero',
  memberships: [
    {
      id: 'mem-001',
      otb_id: '11111111-1111-1111-1111-111111111111',
      user_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      role: 'tesorero',
      is_active: true,
      joined_at: new Date().toISOString()
    }
  ],
  isAuthenticated: true,
  isLoading: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setProfile: (profile) => set({ profile }),
  setCurrentRole: (currentRole) => set({ currentRole }),
  setMemberships: (memberships) => set({ memberships }),
  logout: () => set({ user: null, profile: null, isAuthenticated: false, currentRole: 'vecino' })
}));
