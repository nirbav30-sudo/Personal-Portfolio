// Rebuilds the GridMotion band in index.html: node tools/build-grid.js
const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');

// Tile pool: [key, html]. At most two copies of anything; copies are kept apart by the solver.
const logo = (f) => `<span class="gm-tile gm-logo"><img src="assets/img/${f}" alt="" loading="lazy" decoding="async"></span>`;
const photo = (f) => `<span class="gm-tile gm-img"><img src="assets/img/${f}" alt="" loading="lazy" decoding="async"></span>`;
const text = (t, accent) => `<span class="gm-tile${accent ? ' gm-accent' : ''}">${t}</span>`;
const pool = [];
const add = (key, html, n = 1) => { for (let i = 0; i < n; i++) pool.push({ key, html, accent: html.includes('gm-accent') }); };
add('gavel', logo('mun-gavel.png'), 2);
add('sodmun', logo('sodmun-logo.png'), 2);
add('fulminare', logo('fulminare-logo.png'), 2);
add('myth', logo('dropout-myth-logo.png'), 2);
add('falcon', logo('falcon-motorsport-logo.png'), 2);
add('ybs', logo('ybs-logo.png'), 2);
add('btb', logo('beyond-the-bite-logo.png'), 2);
add('chess', logo('chess-tile.svg'), 1);
add('portrait', photo('nirbav-portrait.jpg'), 2);
add('inspire', photo('inspire-26-prototype.jpg'), 2);
add('cbse', photo('cbse-helper.png'), 2);
for (const [t, a] of [['Jason', 1], ['Ship it', 1], ['Research', 1], ['AI agents', 1], ]) add(t, text(t, a));
const SIZES = [7, 6, 6, 6];                       // plain dark text tiles were removed; 25 tiles left
if (pool.length !== SIZES.reduce((a, b) => a + b)) throw 'pool is ' + pool.length;

// Seeded shuffle + rejection: no repeats within a row (so no neighbours, incl. the loop seam),
// no same tile directly above/below, and no two accent tiles touching in a row.
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
let rows, tries = 0;
for (;;) {
  tries++;
  const p = pool.slice();
  for (let i = p.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
  let at = 0;
  rows = SIZES.map(n => p.slice(at, (at += n)));
  const ok = rows.every((row, r) =>
    new Set(row.map(t => t.key)).size === row.length &&
    row.every((t, c) => !(t.accent && row[(c + 1) % row.length].accent)) &&
    (r === 0 || row.every((t, c) => !rows[r - 1][c] || t.key !== rows[r - 1][c].key)));
  if (ok) break;
}
const html = rows.map(r => { const h = r.map(t => t.html).join(''); return `    <div class="gm-row">${h.repeat(4)}</div>`; }).join('\n'); // 4 copies: seamless even on wide screens
const a = s.indexOf('<div class="gm-tilt">'), b = s.indexOf('  </div>\n  </div>', a);
if (a < 0 || b < 0) throw 'grid not found';
s = s.slice(0, a) + '<div class="gm-tilt">\n' + html + '\n' + s.slice(b);

// SODMUN V card links to sodmun.com
const foot = '<div class="card-foot mono">Conference tech</div>';
if (s.includes(foot)) s = s.replace(foot, '<div class="card-foot mono"><a href="https://sodmun.com">sodmun.com ↗</a></div>');
fs.writeFileSync('index.html', s);
console.log('solved after', tries, 'shuffles');
rows.forEach((r, i) => console.log('row', i + 1, r.map(t => t.key).join(' | ')));
