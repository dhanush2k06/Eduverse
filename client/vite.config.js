import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const isCrm = mode === 'crm';
  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_APP_MODE': JSON.stringify(isCrm ? 'crm' : 'public')
    },
    server: {
      port: isCrm ? 5174 : 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true
        }
      }
    }
  };
});
