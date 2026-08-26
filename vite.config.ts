import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    allowedHosts: ['ims-alb-168307589.af-south-1.elb.amazonaws.com'],
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
