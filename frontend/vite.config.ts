import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Bundle analyzer - run with ANALYZE=true npm run build
    process.env.ANALYZE === 'true' && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined, // Disable manual chunking to avoid circular dependency issues
      },
    },
    chunkSizeWarningLimit: 1000,
    // Optimize chunk size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
    // Disable source maps in production for smaller bundle
    sourcemap: process.env.NODE_ENV === 'development',
    // Enable CSS code splitting
    cssCodeSplit: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
    // Exclude large dependencies from pre-bundling if needed
    exclude: [],
  },
})
