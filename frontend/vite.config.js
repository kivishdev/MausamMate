// File: frontend/vite.config.js
// Purpose: Configures Vite to build our project as a Progressive Web App (PWA).

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa' // 1. Import the PWA plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // 2. Add the VitePWA plugin with our app's configuration
    VitePWA({ 
      registerType: 'autoUpdate',
      manifest: {
        name: 'MausamMate',
        short_name: 'MausamMate',
        description: 'Your intelligent and accessible weather assistant.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
