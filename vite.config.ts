import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base '/fharmacuentos/' permite publicar directamente en GitHub Pages
// (https://<usuario>.github.io/fharmacuentos/). Cambia a '/' si despliegas
// en la raíz de un dominio propio.
export default defineConfig({
  base: '/fharmacuentos/',
  plugins: [react()],
})
