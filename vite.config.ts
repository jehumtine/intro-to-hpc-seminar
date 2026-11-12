import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' so the built site works offline from any folder and on GitHub Pages
export default defineConfig({ plugins: [react()], base: './' });
