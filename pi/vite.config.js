import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Tailwind é carregado via PostCSS (postcss.config.cjs).
// Não existe pacote oficial '@tailwindcss/vite' — remover o import/plugin
// e usar `tailwindcss` como plugin PostCSS para builds em Vite.
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
})
