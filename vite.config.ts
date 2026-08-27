import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/features': '/src/features',
      '@/shared': '/src/shared',
      '@/pages': '/src/pages',
      '@/app': '/src/app',
      '@/components': '/src/components',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://admin-moderator-backend-staging.up.railway.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
