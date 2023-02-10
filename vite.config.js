import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    preserveSymlinks: true,
  },
  base : './',
  server : {
    host : '192.168.10.10',
    port : 3001
  }
})
