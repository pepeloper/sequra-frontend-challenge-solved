import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue({ customElement: true })
  ],

  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.js'),
      name: 'sequra-widget',
      fileName: 'sequra-widget'
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env': process.env
  }
})
