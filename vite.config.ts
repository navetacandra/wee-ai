import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    cssMinify: "lightningcss",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          md: ["react-markdown"],
          prism: ["prismjs"],
        },
        compact: true,
        indent: false,
      },
    },
  },
});
