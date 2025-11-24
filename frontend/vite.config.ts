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
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'yup'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    // Use esbuild minification (more reliable than terser)
    minify: 'esbuild',
    // Disable source maps in production for smaller bundle
    sourcemap: process.env.NODE_ENV === 'development',
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Common chunk splitting strategy
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
    // Exclude large dependencies from pre-bundling if needed
    exclude: [],
  },
})
