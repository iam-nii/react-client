import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost/pdn1",
        // target: "https://sapr3.lti-gti.ru/pdn1/",
      },
    },
  },
  plugins: [react()],
});
