// Server statik për www/ (zhvillim): npm run serve [port]

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'www');
const port = Number(process.argv[2] ?? process.env.PORT ?? 5173);

const types = {
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.woff2': 'font/woff2',
    '.png': 'image/png', '.json': 'application/json'
};

createServer(async (req, res) => {
    try {
        const pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
        const rel = pathname.endsWith('/') ? pathname + 'index.html' : pathname;
        const file = normalize(join(root, rel));
        if (file !== root && !file.startsWith(root + sep)) {
            res.writeHead(403).end('Forbidden');
            return;
        }
        const body = await readFile(file);
        res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
        res.end(body);
    } catch {
        res.writeHead(404).end('Not found');
    }
}).listen(port, '127.0.0.1', () => console.log(`http://127.0.0.1:${port}/  (www/)`));
