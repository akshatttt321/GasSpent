// vite.config.js
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import react from '@vitejs/plugin-react';

const configPath = path.resolve(__dirname, 'config.json');
let envVars = {};

if (fs.existsSync(configPath)) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  envVars = Object.keys(config).reduce((acc, key) => {
    acc[`process.env.${key}`] = config[key];
    return acc;
  }, {});
}

export default defineConfig({
  define: envVars,
   plugins: [react()],
});

