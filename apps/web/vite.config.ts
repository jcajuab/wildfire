import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: '../../dist/static',
    emptyOutDir: true,
  },
  logLevel: 'error',
  plugins: [
    tanstackRouter({
      target: 'react',
      disableLogging: true,
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    {
      name: 'logger-override',
      configureServer(server) {
        const { port } = server.config.server
        console.log(`Running at http://localhost:${port}`)
      },
    },
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
