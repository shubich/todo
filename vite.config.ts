import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves from /<repo-name>/. Set in CI via VITE_BASE.
  base: process.env.VITE_BASE ?? '/',
})
