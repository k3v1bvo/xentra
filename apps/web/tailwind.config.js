/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        xentra: {
          blue: '#2563EB',      // Azul eléctrico
          dark: '#0F172A',      // Azul oscuro
          bg: '#F8FAFC',        // Fondo claro
          card: '#FFFFFF',      // Blanco
          text: '#1E293B',      // Texto principal
          muted: '#64748B',     // Texto secundario
          border: '#E2E8F0',    // Bordes sutiles
          emerald: '#10B981',   // Estados positivos
          amber: '#F59E0B',     // Advertencias
          rose: '#EF4444'       // Errores y alertas críticas
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'fintech': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'fintech-lg': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)',
        'fintech-glow': '0 0 20px -3px rgba(37, 99, 235, 0.25)',
      }
    },
  },
  plugins: [],
}
