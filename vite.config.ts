import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  css: {
    modules: {
      // nomes legíveis no dev, curtos no build
      generateScopedName: mode === "production" ? "[hash:base64:6]" : "[name]__[local]",
    },
  },
  build: {
    // o three.js (r128, ~600 kB) vai num arquivo próprio, que o navegador guarda em cache
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: { three: ["three"] },
      },
    },
  },
}));
