import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/.netlify/functions/api-proxy': {
        target: 'http://localhost:8888', // Netlify Dev
        changeOrigin: true,
        rewrite: path => path
      }
    }
  }
})
