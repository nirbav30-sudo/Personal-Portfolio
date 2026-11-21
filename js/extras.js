// Card menu, scroll-lit story, project row thumbnails, draggable folders,
// curved text loop. Every piece degrades to plain, readable HTML without JS.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;

  /* ---------- card nav ---------- */
  const btn = $('.menu-btn'), panel = $('#card-nav');
  if (btn && panel) {
    const set = (open) => {
      btn.setAttribute('aria-expanded', String(open));
      document.documentElement.classList.toggle('menu-open', open);
      if (open) { panel.hidden = false; setTimeout(() => panel.classList.add('open'), 20); }
      else { panel.classList.remove('open'); setTimeout(() => { if (btn.getAttribute('aria-expanded') === 'false') panel.hidden = true; }, 350); }
    };
    btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
    panel.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { set(false); btn.focus(); } });
  }

  /* ---------- story: words light up as you scroll through ---------- */
  const story = $('.story');
  if (story && !reduced) {
    const units = [];
    [...story.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(part); return; }
          const w = document.createElement('span'); w.className = 'story-word'; w.textContent = part;
          frag.append(w); units.push(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) { n.classList.add('story-word'); units.push(n); }
    });
    story.classList.add('story-live');
    const light = () => {
      const r = story.getBoundingClientRect();
      // 0 when the paragraph's top hits 85% of the viewport, 1 when its bottom reaches 45%
      const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.4)));
      const lit = Math.round(p * units.length);
      units.forEach((u, i) => u.classList.toggle('lit', i < lit));
    };
    addEventListener('scroll', light, { passive: true });
    addEventListener('resize', light);
    light();
  }

  /* ---------- project rows: thumbnail follows the cursor ---------- */
  const thumb = $('.row-thumb');
  if (thumb && fine) {
    const im = $('img', thumb);
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const loop = () => {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      thumb.style.transform = `translate(${x}px, ${y}px)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(loop) : 0;
    };
    $$('.row[data-thumb]').forEach(row => {
      row.addEventListener('pointerenter', () => { im.src = row.dataset.thumb; thumb.classList.add('show'); });
      row.addEventListener('pointerleave', () => thumb.classList.remove('show'));
    });
    $('.rows').addEventListener('pointermove', (e) => {
      tx = e.clientX + 24; ty = e.clientY - 70;
      if (!raf) raf = requestAnimationFrame(loop);
    });
  }

  /* ---------- writing folders: click to open, drag to move ---------- */
  $$('.folder').forEach((f, i) => {
    f.style.setProperty('--fd', (i * 1.3) + 's');
    const toggle = () => {
      const open = !f.hasAttribute('data-open');
      f.toggleAttribute('data-open', open);
      f.setAttribute('aria-expanded', String(open));
    };
    let start = null, moved = false, dx = 0, dy = 0;
    f.addEventListener('pointerdown', (e) => {
      if (e.target.closest('a') || e.button !== 0) return;
      start = { x: e.clientX - dx, y: e.clientY - dy }; moved = false;
      f.setPointerCapture(e.pointerId);
    });
    f.addEventListener('pointermove', (e) => {
      if (!start) return;
      const nx = e.clientX - start.x, ny = e.clientY - start.y;
      if (!moved && Math.hypot(nx - dx, ny - dy) < 6) return;
      moved = true; f.setAttribute('data-drag', '');
      dx = nx; dy = ny; f.style.setProperty('--dx', dx + 'px'); f.style.setProperty('--dy', dy + 'px');
    });
    const end = () => {
      if (!start) return;
      start = null; f.removeAttribute('data-drag');
      if (!moved) toggle();
    };
    f.addEventListener('pointerup', end);
    f.addEventListener('pointercancel', () => { start = null; f.removeAttribute('data-drag'); });
    f.addEventListener('dblclick', () => { dx = dy = 0; f.style.setProperty('--dx', '0px'); f.style.setProperty('--dy', '0px'); });
    f.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target === f) { e.preventDefault(); toggle(); } });
  });

  /* ---------- curved text loop ---------- */
  const tp = $('.curved-loop textPath');
  if (tp && !reduced) {
    const text = tp.textContent;
    const half = tp.getComputedTextLength ? tp.getComputedTextLength() / 2 : 0;
    if (half > 0) {
      let off = 0, last = performance.now(), boost = 0, lastY = scrollY;
      addEventListener('scroll', () => { boost = Math.min(6, boost + Math.abs(scrollY - lastY) * 0.02); lastY = scrollY; }, { passive: true });
      const tick = (now) => {
        const dt = Math.min(50, now - last); last = now;
        off -= dt * (0.06 + boost * 0.05); boost *= 0.94;
        if (off <= -half) off += half;
        tp.setAttribute('startOffset', off.toFixed(1));
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    } else tp.textContent = text;
  }
})();
