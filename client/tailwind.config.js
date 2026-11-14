/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0f172a',
          navyLight: '#1e293b',
          blue: '#2563eb',
          blueHover: '#1d4ed8',
          blueSoft: '#dbeafe',
          darkBlue: '#172554',
          surface: '#ffffff',
          bg: '#f8fafc',
          border: '#e2e8f0',
          text: '#0f172a',
          muted: '#64748b',
          success: '#16a34a',
          successSoft: '#dcfce7',
          warning: '#d97706',
          warningSoft: '#fef3c7',
          danger: '#dc2626',
          dangerSoft: '#fee2e2'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 25px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}

