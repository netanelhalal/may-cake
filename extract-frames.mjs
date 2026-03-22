/**
 * extract-frames.mjs
 * Extracts frames from the bakery video using FFmpeg
 * Run: node extract-frames.mjs
 * Requires FFmpeg in PATH or set FFMPEG_PATH env variable
 */

import { execSync } from 'child_process';
import { mkdirSync, existsSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));

const VIDEO  = join(__dir, 'fd6a5e7df2f14dbf8cf0b4d57e428440_1774187612 (1).mp4');
const FRAMES = join(__dir, 'frames');
const FFMPEG = process.env.FFMPEG_PATH || 'ffmpeg';

// ── Settings ──────────────────────────────────────────
const FPS    = 12;     // frames per second to extract  (12 fps × video length = total frames)
const WIDTH  = 1440;   // output width in px            (height auto-calculated)
const QUALITY = 3;     // JPEG quality 1–31 (lower = better, 2-4 is ideal)
// ──────────────────────────────────────────────────────

if (!existsSync(FRAMES)) mkdirSync(FRAMES, { recursive: true });

console.log('\n🎬  Extracting frames from video...');
console.log(`    FPS: ${FPS}  |  Width: ${WIDTH}px  |  Quality: ${QUALITY}\n`);

try {
  execSync(
    `"${FFMPEG}" -y -i "${VIDEO}" -vf "fps=${FPS},scale=${WIDTH}:-2" -q:v ${QUALITY} "${FRAMES}/frame_%04d.jpg"`,
    { stdio: 'inherit' }
  );
} catch (e) {
  console.error('\n❌  FFmpeg failed. Make sure FFmpeg is installed and in your PATH.');
  console.error('    Download: https://ffmpeg.org/download.html');
  console.error('    Or set: FFMPEG_PATH=C:\\ffmpeg\\bin\\ffmpeg.exe node extract-frames.mjs\n');
  process.exit(1);
}

// Write manifest so the website knows how many frames exist
const count = readdirSync(FRAMES).filter(f => f.match(/frame_\d+\.jpg$/)).length;
writeFileSync(join(FRAMES, 'count.json'), JSON.stringify({ count, fps: FPS, width: WIDTH }));

console.log(`\n✅  Done! Extracted ${count} frames → frames/`);
console.log(`    Scroll animation will cover ~${Math.round(count * 22 / 100) / 10}m of scroll.\n`);
