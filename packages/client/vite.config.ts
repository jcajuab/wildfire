import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    outDir: "../../dist/static",
    emptyOutDir: true,
  },
  plugins: [
    tanstackRouter({
      target: "react",
      quoteStyle: "double",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
