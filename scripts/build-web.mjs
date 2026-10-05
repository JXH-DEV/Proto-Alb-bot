// Ndërton www/ (offline): HTML, Tailwind CSS i kompiluar, një skedar JS dhe fonti Inter.

import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'www');
const assetsOut = join(out, 'assets');

rmSync(out, { recursive: true, force: true });
mkdirSync(join(assetsOut, 'fonts'), { recursive: true });

await build({
    entryPoints: [join(root, 'src/app.js')],
    outfile: join(assetsOut, 'app.js'),
    bundle: true,
    format: 'iife',
    target: 'es2020',
    minify: true,
    legalComments: 'none',
    logLevel: 'warning'
});

const tailwindCli = join(root, 'node_modules/tailwindcss/lib/cli.js');
execFileSync(
    process.execPath,
    [tailwindCli, '-c', join(root, 'tailwind.config.js'), '-i', join(root, 'src/input.css'), '-o', join(assetsOut, 'app.css'), '--minify'],
    { stdio: ['ignore', 'inherit', 'inherit'], cwd: root }
);

const fontSrc = join(root, 'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2');
if (!existsSync(fontSrc)) throw new Error(`Mungon fonti: ${fontSrc} (ekzekuto "npm install")`);
cpSync(fontSrc, join(assetsOut, 'fonts/inter-latin-wght-normal.woff2'));

cpSync(join(root, 'src/index.html'), join(out, 'index.html'));
cpSync(join(root, 'src/favicon.svg'), join(assetsOut, 'favicon.svg'));

const html = readFileSync(join(out, 'index.html'), 'utf8');
const css = readFileSync(join(assetsOut, 'app.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, ''); // pa komentet e licencës
const js = readFileSync(join(assetsOut, 'app.js'), 'utf8');
const external = /https?:\/\/(?!www\.w3\.org)[^\s"')]+/g;
const found = [...html.matchAll(external), ...css.matchAll(external), ...js.matchAll(external)].map(m => m[0]);
if (found.length) {
    console.error('Gabim: referenca të jashtme në build:\n  ' + found.join('\n  '));
    process.exit(1);
}

const kb = f => (statSync(f).size / 1024).toFixed(1) + ' KB';
console.log(`www/ gati: app.js ${kb(join(assetsOut, 'app.js'))}, app.css ${kb(join(assetsOut, 'app.css'))}, font ${kb(join(assetsOut, 'fonts/inter-latin-wght-normal.woff2'))}`);
