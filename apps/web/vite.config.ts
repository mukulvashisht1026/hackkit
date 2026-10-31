import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  // "source" makes the workspace @junction-kit/ui resolve to its TypeScript source: no UI build step, live reload.
  resolve: { conditions: ["source"], dedupe: ["react", "react-dom"] },
  server: { port: 5173, proxy: { "/api": "http://localhost:8000" } },
});
