import { create } from 'zustand';

interface AccessibilityState {
  isSeniorMode: boolean;
  fontSizeScale: 'normal' | 'senior';
  toggleSeniorMode: () => void;
  setSeniorMode: (enabled: boolean) => void;
}

const STORAGE_KEY = 'xentra_senior_mode';

export const useAccessibilityStore = create<AccessibilityState>((set) => {
  const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
  const initial = saved === 'true';

  if (typeof window !== 'undefined') {
    document.documentElement.classList.remove('senior-mode');
  }

  return {
    isSeniorMode: initial,
    fontSizeScale: initial ? 'senior' : 'normal',
    toggleSeniorMode: () => {
      set((state) => {
        const next = !state.isSeniorMode;
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, String(next));
        }
        return { isSeniorMode: next, fontSizeScale: next ? 'senior' : 'normal' };
      });
    },
    setSeniorMode: (enabled: boolean) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, String(enabled));
      }
      set({ isSeniorMode: enabled, fontSizeScale: enabled ? 'senior' : 'normal' });
    }
  };
});
