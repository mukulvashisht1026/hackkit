import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Library build: one ESM file + dist/style.css; React stays a peer dependency.
export default defineConfig({
  plugins: [react()],
  build: {
    lib: { entry: "src/index.ts", formats: ["es"], fileName: () => "index.js" },
    cssCodeSplit: false,
    sourcemap: true,
    rollupOptions: {
      external: ["react", "react-dom", "react-dom/client", "react/jsx-runtime"],
      // every component uses hooks or the DOM, so mark the bundle for React Server Components setups
      output: { banner: '"use client";', assetFileNames: "style.css" },
    },
  },
});
