import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  build: {
    outDir: "../api/dist/static",
    emptyOutDir: true,
  },
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/trpc": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
