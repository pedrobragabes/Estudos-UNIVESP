/* eslint-disable @typescript-eslint/no-require-imports */
// Local-only bridge: preserves DOM observations collected through the browser UI.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const dir = path.resolve(__dirname, '../.sources/ava-2026-b4');
fs.mkdirSync(dir, { recursive: true });
http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/capture') {
    let body = '';
    req.on('data', chunk => { body += chunk; if (body.length > 12000000) req.destroy(); });
    req.on('end', () => {
      try {
        const data = JSON.parse(new URLSearchParams(body).get('data'));
        if (!Array.isArray(data.inventory) || !Array.isArray(data.collected)) throw Error('Invalid capture');
        fs.writeFileSync(path.join(dir, 'capture.json'), JSON.stringify(data, null, 2));
        res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        res.end('<h1>Captura salva</h1><p>' + data.collected.length + ' recursos</p><a href="/">Voltar</a>');
      } catch { res.writeHead(400); res.end('Invalid capture'); }
    });
  } else {
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.end('<h1>Salvar fontes locais do AVA</h1><form method="POST" action="/capture"><label>Dados<textarea name="data"></textarea></label><button>Salvar captura</button></form>');
  }
}).listen(4319, '127.0.0.1', () => console.log('Local capture: http://127.0.0.1:4319'));
