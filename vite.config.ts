import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 4800,
    host: '0.0.0.0',
    strictPort: false,
  },
  preview: {
    port: 4173,
    host: '0.0.0.0',
    strictPort: false,
  },
});
