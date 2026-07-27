import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { transformWithEsbuild } from 'vite'

export default defineConfig({
  plugins: [
    {
      name: 'treat-js-files-as-jsx',
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) return null
        return transformWithEsbuild(code, id, { loader: 'jsx' })
      },
    },
    react(),
  ],
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
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
