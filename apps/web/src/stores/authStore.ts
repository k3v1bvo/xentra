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
  user: null,
  profile: null,
  currentRole: 'vecino',
  memberships: [],
  isAuthenticated: false,
  isLoading: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setProfile: (profile) => set({ profile }),
  setCurrentRole: (currentRole) => set({ currentRole }),
  setMemberships: (memberships) => set({ memberships }),
  logout: () => set({ user: null, profile: null, isAuthenticated: false, currentRole: 'vecino' })
}));
