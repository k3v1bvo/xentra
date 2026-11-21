import { create } from 'zustand';

interface AccessibilityState {
  isSeniorMode: boolean;
  fontSizeScale: 'normal' | 'senior'; // normal (16px base) vs senior (18-20px base)
  toggleSeniorMode: () => void;
  setSeniorMode: (enabled: boolean) => void;
}

const STORAGE_KEY = 'xentra_senior_mode';

export const useAccessibilityStore = create<AccessibilityState>((set) => {
  const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
  // Por defecto activo o guardado para garantizar máxima accesibilidad a adultos mayores de 50 años
  const initial = saved !== null ? saved === 'true' : true;

  if (typeof window !== 'undefined' && initial) {
    document.documentElement.classList.add('senior-mode');
  }

  return {
    isSeniorMode: initial,
    fontSizeScale: initial ? 'senior' : 'normal',
    toggleSeniorMode: () => {
      set((state) => {
        const next = !state.isSeniorMode;
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, String(next));
          if (next) {
            document.documentElement.classList.add('senior-mode');
          } else {
            document.documentElement.classList.remove('senior-mode');
          }
        }
        return { isSeniorMode: next, fontSizeScale: next ? 'senior' : 'normal' };
      });
    },
    setSeniorMode: (enabled: boolean) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, String(enabled));
        if (enabled) {
          document.documentElement.classList.add('senior-mode');
        } else {
          document.documentElement.classList.remove('senior-mode');
        }
      }
      set({ isSeniorMode: enabled, fontSizeScale: enabled ? 'senior' : 'normal' });
    }
  };
});
