import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api/oauth': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        secure: true,
      },
      '/api/organizations': {
        target: 'https://claude.ai',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
