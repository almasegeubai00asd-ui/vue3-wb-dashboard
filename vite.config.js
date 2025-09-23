import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://109.73.206.144:6969',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
