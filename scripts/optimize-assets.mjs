import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const next = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(next, out);
    else if (entry.name.toLowerCase().endsWith('.png')) out.push(next);
  }
  return out;
}

function maxEdge(file) {
  const f = file.replaceAll('\\', '/');
  if (f.includes('/environments/')) return 960;
  if (f.includes('_icon')) return 128;
  if (f.includes('/icons/') || f.includes('/powerups/') || f.includes('/eggs/') || f.includes('/particles/')) {
    return 160;
  }
  if (f.includes('/bosses/')) return 512;
  if (f.includes('/ui/')) return 640;
  if (f.includes('/sprites/')) return 256;
  return 384;
}

const roots = ['public', 'src/assets'];
const files = roots.flatMap((root) => (fs.existsSync(root) ? walk(root) : []));
let bytesIn = 0;
let bytesOut = 0;

for (const file of files) {
  const max = maxEdge(file);
  const dest = file.replace(/\.png$/i, '.webp');
  bytesIn += fs.statSync(file).size;
  await sharp(file)
    .resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 74, effort: 4, alphaQuality: 82 })
    .toFile(dest);
  bytesOut += fs.statSync(dest).size;
  fs.unlinkSync(file);
}

console.log(
  `optimized ${files.length} pngs: ${(bytesIn / 1048576).toFixed(1)} MB -> ${(bytesOut / 1048576).toFixed(1)} MB webp`,
);
