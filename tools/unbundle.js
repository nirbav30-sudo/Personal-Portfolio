// One-off: converts the self-unpacking bundled HTML exports into plain HTML + static assets.
// Reads originals from ../files-original-backup, writes ./*.html and ./public/**.
const fs = require('fs'), zlib = require('zlib'), crypto = require('crypto'), path = require('path');
const SRC = path.join(__dirname, '..', '..', 'files-original-backup');
const OUT = path.join(__dirname, '..');
const PAGES = ['index', 'projects', 'services', 'milestones', 'certifications'];

const NAMES = {
  'd845fb63': 'img/beyond-the-bite.jpg',
  '1db29cb2': 'img/more-coming-soon.jpg',
  '2e220537': 'img/certifications-bg.jpg',
  'd17d6933': 'img/nirbav-portrait.jpg',
  '20b3047f': 'img/milestones-bg.jpg',
  '12ee376a': 'img/cbse-helper.png',
  'aab33033': 'img/nav-logo.gif',
  '253e2b6d': 'media/hero-bg.mp4',
  '8549f448': 'media/services-bg.mp4',
  '17b996f7': 'js/dc-runtime.js',
  'f9b6064d': 'js/react.production.min.js',
  '5bf2d50b': 'js/react-dom.production.min.js',
};
const B64_NAMES = [ // inline data: URIs, in order of first appearance (index.html is processed first)
  'img/favicon.png',
  'img/cursor-trail-1.jpg', 'img/cursor-trail-2.jpg', 'img/cursor-trail-3.jpg',
  'img/cursor-trail-4.jpg', 'img/cursor-trail-5.jpg',
  'img/services-web.jpg', 'img/services-app.jpg', 'img/services-iot.jpg',
  'img/services-product.jpg', 'img/services-ai.jpg', 'img/services-patent.jpg',
];

const script = (s, t) => [...s.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)].find(m => m[1].includes(t));
const write = (rel, buf) => { const p = path.join(OUT, 'public', rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, buf); return '/public/' + rel; };

const b64Seen = new Map(); let b64Next = 0;
const fontCount = {};
const report = [];

for (const page of PAGES) {
  const raw = fs.readFileSync(path.join(SRC, page + '.html'), 'utf8');
  const manifest = JSON.parse(script(raw, '__bundler/manifest')[2]);
  const ext = JSON.parse((script(raw, '__bundler/ext_resources') || [, , '[]'])[2]);
  let tpl = JSON.parse(script(raw, '__bundler/template')[2]);

  const urls = {};
  for (const [uuid, e] of Object.entries(manifest)) {
    let buf = Buffer.from(e.data, 'base64');
    if (e.compressed) buf = zlib.gunzipSync(buf);
    let rel = NAMES[uuid.slice(0, 8)];
    if (!rel && e.mime.startsWith('font/')) {
      // name fonts from their @font-face block: family-weight-subset
      const i = tpl.indexOf(uuid); if (i < 0) continue;
      const before = tpl.slice(Math.max(0, i - 400), i);
      const fam = [...before.matchAll(/font-family:\s*'([^']+)'/g)].pop()[1].toLowerCase().replace(/\s+/g, '-');
      const w = [...before.matchAll(/font-weight:\s*(\d+)/g)].pop()[1];
      const sub = ([...before.matchAll(/\/\*\s*([a-z-]+)\s*\*\//g)].pop() || [, 'x'])[1];
      rel = `fonts/${fam}-${w}-${sub}.woff2`;
    }
    if (!rel) throw new Error('unnamed asset ' + uuid);
    urls[uuid] = write(rel, buf);
  }
  for (const [uuid, u] of Object.entries(urls)) tpl = tpl.split(uuid).join(u);

  tpl = tpl.replace(/data:(image\/[a-z+]+);base64,([A-Za-z0-9+\/=]+)/g, (m, mime, data) => {
    const h = crypto.createHash('sha1').update(data).digest('hex');
    if (!b64Seen.has(h)) b64Seen.set(h, write(B64_NAMES[b64Next++], Buffer.from(data, 'base64')));
    return b64Seen.get(h);
  });

  const resources = {};
  for (const r of ext) if (urls[r.uuid]) resources[r.id] = urls[r.uuid];
  const inject = '<script>window.__resources = ' + JSON.stringify(resources) + ';</script>';
  const head = tpl.match(/<head[^>]*>/i);
  tpl = tpl.slice(0, head.index + head[0].length) + inject + tpl.slice(head.index + head[0].length);

  fs.writeFileSync(path.join(OUT, page + '.html'), tpl);
  report.push([page + '.html', raw.length, Buffer.byteLength(tpl)]);
}
console.log('page, before, after');
for (const r of report) console.log(r.join(', '));
