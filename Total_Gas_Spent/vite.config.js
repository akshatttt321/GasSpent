import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'fs';

// Read and parse the config.json file
const config = JSON.parse(readFileSync('./src/config.json', 'utf-8'));

// Define the Vite configuration
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_ETHKEY': JSON.stringify(config.VITE_API_ETHKEY),
    'import.meta.env.VITE_API_BASEKEY': JSON.stringify(config.VITE_API_BASEKEY),
    'import.meta.env.VITE_API_OPKEY': JSON.stringify(config.VITE_API_OPKEY),
    'import.meta.env.VITE_API_ARBKEY': JSON.stringify(config.VITE_API_ARBKEY),
    'import.meta.env.VITE_API_LINEAKEY': JSON.stringify(config.VITE_API_LINEAKEY),
  },
});
