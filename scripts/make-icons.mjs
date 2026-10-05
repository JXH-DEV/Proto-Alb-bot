// Prodhon assets/*.png nga logoja; pastaj: npx capacitor-assets generate --android

import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'assets');
mkdirSync(out, { recursive: true });

const RED = '#E41E20';
const DARK = '#050505';
// E njëjta formë me logon e header-it (Lucide), në rrjetën 24×24.
const GLYPH = 'M16 8a4 4 0 0 0-3.32-1.78l-1.38-2.74a1 1 0 0 0-1.6 0L8.32 6.22A4 4 0 0 0 5 10c0 2.21 1.79 4 4 4v6l3-3 3 3v-6a4 4 0 0 0 4-4Z';

const glyph = (size, scale, stroke = '#fff') => `
  <g transform="translate(${size / 2} ${size / 2}) scale(${scale}) translate(-12 -11.4)"
     fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="${GLYPH}"/>
  </g>`;

const svg = (size, body) =>
    Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${body}</svg>`);

const write = (name, buf) => sharp(buf).png().toFile(join(out, name)).then(() => console.log('assets/' + name));

// Ikona e plotë (legacy): sfond i kuq, logo e bardhë.
await write('icon-only.png', svg(1024, `<rect width="1024" height="1024" fill="${RED}"/>${glyph(1024, 30)}`));
// Adaptive: logoja brenda zonës së sigurt (~66%), sfondi veçmas.
await write('icon-foreground.png', svg(1024, glyph(1024, 24)));
await write('icon-background.png', svg(1024, `<rect width="1024" height="1024" fill="${RED}"/>`));
// Splash: sfond i errët + logoja në kuadrat të kuq, si te header-i.
const splash = svg(2732, `
  <rect width="2732" height="2732" fill="${DARK}"/>
  <rect x="${2732 / 2 - 260}" y="${2732 / 2 - 260}" width="520" height="520" rx="110" fill="${RED}"/>
  ${glyph(2732, 17)}`);
await write('splash.png', splash);
await write('splash-dark.png', splash);
