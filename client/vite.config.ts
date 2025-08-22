import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.',              // root is now the client folder
  build: {
    outDir: 'dist',       // built files go to client/dist
    emptyOutDir: true,    // clear dist before building
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'), // entry HTML
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),         // optional: allows imports like "@/components/..."
    },
  },
  server: {
    port: 5173,            // default Vite dev server port
    open: true,            // opens browser automatically
  },
});
