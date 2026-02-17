import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    define: {
      // Vital: This makes process.env.API_KEY available in the browser
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Polyfill full process.env if needed, though safer to be specific
      'process.env': JSON.stringify({}) 
    }
  }
})