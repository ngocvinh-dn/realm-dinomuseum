import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import cesium from 'vite-plugin-cesium'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    cesium({
      rebuildCesium: true
    })
  ],

  resolve: {
    dedupe: ['react', 'react-dom'],
  },

  define: {
    CESIUM_BASE_URL: JSON.stringify('/cesium')
  },

  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: false,
    open: true,
  },

  build: {
    assetsInlineLimit: 0,
  }
})