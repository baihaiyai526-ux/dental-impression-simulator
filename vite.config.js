import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(() => {
  const base = process.env.VITE_BASE_PATH || "/";

  return {
    base,
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "auto",
        includeAssets: ["icons/apple-touch-icon.png"],
        manifest: {
          id: ".",
          name: "口腔牙列印模制取虚拟仿真实训系统",
          short_name: "口腔印模实训",
          description: "口腔牙列印模制取虚拟仿真实训与三维交互平台",
          lang: "zh-CN",
          start_url: ".",
          scope: ".",
          display: "standalone",
          orientation: "any",
          background_color: "#eff6ff",
          theme_color: "#2563eb",
          categories: ["education", "medical"],
          icons: [
            {
              src: "icons/pwa-192.png",
              sizes: "192x192",
              type: "image/png"
            },
            {
              src: "icons/pwa-512.png",
              sizes: "512x512",
              type: "image/png"
            },
            {
              src: "icons/pwa-maskable-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable"
            }
          ]
        },
        workbox: {
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          navigateFallback: "index.html",
          globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
          runtimeCaching: [
            {
              urlPattern: /\/models\/.*\.glb$/,
              handler: "CacheFirst",
              options: {
                cacheName: "dental-3d-models-v1",
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 30
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        }
      })
    ]
  };
});
