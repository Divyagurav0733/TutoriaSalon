import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      port: 5173,
      // Only proxy in development when no VITE_API_URL is set
      proxy: !env.VITE_API_URL
        ? {
            "/api": {
              target: "https://tutoriasalon.onrender.com",
              changeOrigin: true,
              secure: true,
            },
          }
        : undefined,
    },
    build: {
      outDir: "dist",
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
          },
        },
      },
    },
  };
});

