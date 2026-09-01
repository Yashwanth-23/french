const fs = require('fs');
const https = require('https');
const http = require('http');

const resources = JSON.parse(fs.readFileSync('./src/data/resources.json', 'utf8'));

console.log(`Starting Live HTTP Audit on ${resources.length} resources...`);

function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(url);
      const client = parsedUrl.protocol === 'https:' ? https : http;
      const req = client.request(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000 }, (res) => {
        resolve({ url, status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 400 });
      });
      req.on('timeout', () => { req.destroy(); resolve({ url, status: 'TIMEOUT', ok: false }); });
      req.on('error', (e) => {
        // Retry with GET if HEAD is blocked
        const getReq = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000 }, (res2) => {
          resolve({ url, status: res2.statusCode, ok: res2.statusCode >= 200 && res2.statusCode < 400 });
        });
        getReq.on('error', (err2) => resolve({ url, status: 'ERR: ' + err2.message, ok: false }));
        getReq.on('timeout', () => { getReq.destroy(); resolve({ url, status: 'TIMEOUT', ok: false }); });
      });
      req.end();
    } catch (e) {
      resolve({ url, status: 'INVALID URL', ok: false });
    }
  });
}

(async () => {
  const results = [];
  for (const r of resources) {
    const res = await checkUrl(r.url);
    results.push({ id: r.id, title: r.title, url: r.url, status: res.status, ok: res.ok });
    console.log(`[${res.ok ? 'OK' : 'CHECK'}] ${r.id}: ${res.status} -> ${r.url}`);
  }
  console.log('Live HTTP Audit Complete.');
})();
