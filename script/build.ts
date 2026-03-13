import { execSync } from 'child_process';
import { existsSync, mkdirSync, copyFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// Build client
console.log('Building client...');
execSync('npx vite build', { stdio: 'inherit' });

// Build server 
console.log('Building server...');
execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });

// Copy public files
const clientDist = 'dist/public';
if (!existsSync(clientDist)) {
  mkdirSync(clientDist, { recursive: true });
}

console.log('Build complete!');
