import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [react(), basicSsl()],
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
