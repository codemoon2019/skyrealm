import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const next = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(next, out);
    else if (entry.name.toLowerCase().endsWith('.webp')) out.push(next);
  }
  return out;
}

function shouldKey(file) {
  const f = file.replaceAll('\\', '/');
  if (f.includes('/environments/')) return false;
  if (f.includes('/ui/logo')) return false;
  if (f.includes('/ui/style_bible')) return false;
  return true;
}

function isScreenGreen(r, g, b, a) {
  if (a < 8) return false;
  return g >= 150 && r <= 110 && b <= 110 && g - r >= 55 && g - b >= 55;
}

const files = walk('public').filter(shouldKey);
let keyedFiles = 0;

for (const file of files) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let keyed = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (isScreenGreen(data[i], data[i + 1], data[i + 2], data[i + 3])) {
      data[i + 3] = 0;
      keyed += 1;
    }
  }
  if (keyed < 20) continue;
  const dest = file.replace(/\.webp$/i, '.keyed.webp');
  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .webp({ quality: 80, alphaQuality: 100, effort: 4 })
    .toFile(dest);
  try {
    fs.rmSync(file);
    fs.renameSync(dest, file);
  } catch {
    fs.copyFileSync(dest, file);
    fs.rmSync(dest);
  }
  keyedFiles += 1;
}

console.log(`keyed green off ${keyedFiles}/${files.length} sprites`);
