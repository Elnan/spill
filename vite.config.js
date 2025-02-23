import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dotenv from "dotenv";

// Laster miljøvariablene fra .env-filen
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  base: "/spill/",
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          firebase: [
            "firebase/app",
            "firebase/auth",
            "firebase/firestore",
            "firebase/storage",
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1200,
  },
});
