import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
  },
  publicDir: 'public',
  css: {
    preprocessorOptions: {
      // Opt in to the modern Sass compiler API; the legacy one is removed in Dart Sass 2.0
      scss: { api: 'modern-compiler' },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
