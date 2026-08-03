/**
 * clean_audio.js
 * Removes all generated audio files from public/assets/audio/
 * Usage: node scripts/clean_audio.js
 */
import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR   = path.join(__dirname, '..', 'public', 'assets', 'audio');

if (!fs.existsSync(OUT_DIR)) { console.log('Nothing to clean.'); process.exit(0); }

const files = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith('.mp3'));
files.forEach((f) => fs.unlinkSync(path.join(OUT_DIR, f)));
console.log(`🗑  Removed ${files.length} audio file(s).`);
