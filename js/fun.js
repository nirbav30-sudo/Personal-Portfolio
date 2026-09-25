// Vanilla ports of LatticeLoader and DodgeField, plus the easter eggs.
// Everything here is an enhancement: with JS off the page reads the same.
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);

  /* ---------- LatticeLoader: 3x3 orbit, timer, "Done in" ---------- */
  const loader = $('.loader');
  const markLoaded = () => document.documentElement.classList.add('loaded');
  if (!loader) markLoaded();
  if (loader) {
    const cells = [...loader.querySelectorAll('.lattice i')];
    const time = $('.loader-time', loader);
    const label = $('.loader-label', loader);
    const orbit = [0, 1, 2, 5, 8, 7, 6, 3];
    const trail = [1, 0.6, 0.35];
    // Intro: equaliser bars sweep in from the left, pulse, then scatter,
    // and the lattice takes over. Skipped under reduced motion.
    const INTRO = reduced ? 0 : 1800;
    const STEP = 90, IDLE = 0.15, MIN = INTRO + (reduced ? 250 : 800);
    const t0 = performance.now();
    let pos = 0, lastStep = 0, raf;

    if (INTRO) {
      loader.classList.add('intro');
      const bars = document.createElement('div');
      bars.className = 'intro-bars';
      bars.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < 26; i++) {
        const b = document.createElement('i');
        b.style.setProperty('--i', i);
        b.style.setProperty('--h', (30 + Math.round(Math.random() * 70)) + '%');
        b.style.setProperty('--sx', (Math.random() * 2 - 1) * 60 + 'vw');
        b.style.setProperty('--sy', (Math.random() * 2 - 1) * 45 + 'vh');
        b.style.setProperty('--sr', Math.round(Math.random() * 180 - 90) + 'deg');
        bars.append(b);
      }
      loader.prepend(bars);
      setTimeout(() => loader.classList.add('scatter'), 1250);
      setTimeout(() => { bars.remove(); loader.classList.remove('intro', 'scatter'); }, INTRO);
    }

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      time.textContent = ((now - t0) / 1000).toFixed(1) + 's';
      if (now - lastStep < STEP) return;
      lastStep = now;
      cells.forEach(c => (c.style.opacity = IDLE));
      trail.forEach((o, k) => (cells[orbit[(pos - k + 8) % 8]].style.opacity = o));
      pos = (pos + 1) % 8;
    };
    raf = requestAnimationFrame(frame);

    const finish = () => {
      const wait = Math.max(0, MIN - (performance.now() - t0));
      setTimeout(() => {
        cancelAnimationFrame(raf);
        const secs = ((performance.now() - t0) / 1000).toFixed(2);
        loader.classList.add('done');
        cells.forEach(c => (c.style.opacity = 1));
        label.textContent = 'Done in';
        time.textContent = secs + 's';
        setTimeout(() => {
          loader.classList.add('out');
          markLoaded(); // hero entrance starts as the loader fades
          setTimeout(() => loader.remove(), 400);
        }, reduced ? 150 : 450);
      }, wait);
    };
    document.readyState === 'complete' ? finish() : addEventListener('load', finish, { once: true });
  }

  /* ---------- toast ---------- */
  let toastTimer;
  const toast = (msg) => {
    let t = $('.toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast mono';
      t.setAttribute('role', 'status');
      document.body.append(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
  };

  /* ---------- DodgeField ---------- */
  // Moves `el` away from the pointer. After `patience` dodges it gives up.
  function dodge(el, { reach = 72, radius = 120, falloff = 2, flee = 130, back = 620, patience = 4, onDodge, onGive } = {}) {
    const state = { dodges: 0, gave: false, fleeing: false };
    const ease = `cubic-bezier(.34, 1.56, .64, 1)`; // small overshoot = returnBounce
    const move = (x, y, ms, e) => {
      el.style.transition = `transform ${ms}ms ${e}`;
      el.style.transform = `translate(${x}px, ${y}px)`;
    };
    const clamp = (x, y) => {
      const wall = (el.offsetParent || document.body).getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const [cx, cy] = (el.style.transform.match(/-?[\d.]+/g) || [0, 0]).map(Number);
      const baseL = r.left - cx, baseT = r.top - cy;
      return [
        Math.min(Math.max(x, wall.left - baseL), wall.right - baseL - r.width),
        Math.min(Math.max(y, wall.top - baseT), wall.bottom - baseT - r.height),
      ];
    };
    const flight = (px, py) => {
      if (state.gave) return;
      const r = el.getBoundingClientRect();
      const [cx, cy] = (el.style.transform.match(/-?[\d.]+/g) || [0, 0]).map(Number);
      const ox = r.left - cx + r.width / 2, oy = r.top - cy + r.height / 2;
      const dx = ox - px, dy = oy - py, d = Math.hypot(dx, dy) || 1;
      if (d > radius) {
        if (state.fleeing) { state.fleeing = false; move(0, 0, back, ease); }
        return;
      }
      if (!state.fleeing) {
        state.fleeing = true;
        state.dodges++;
        onDodge && onDodge(state);
        if (state.dodges >= patience) { state.gave = true; move(0, 0, back, ease); onGive && onGive(state); return; }
      }
      const push = reach * Math.pow(1 - d / radius, 1 / falloff) + 12;
      move(...clamp((dx / d) * push, (dy / d) * push), flee, 'ease-out');
    };
    if (!reduced) {
      addEventListener('pointermove', (e) => e.pointerType === 'mouse' && flight(e.clientX, e.clientY), { passive: true });
    }
    // Touch has no hover, so a tap is what makes it dodge.
    el.addEventListener('pointerdown', (e) => {
      if (state.gave || e.pointerType === 'mouse') return;
      e.preventDefault();
      state.fleeing = false;
      const a = Math.random() * Math.PI * 2;
      flight(el.getBoundingClientRect().left + 1 + Math.cos(a), el.getBoundingClientRect().top + 1 + Math.sin(a));
      setTimeout(() => { state.fleeing = false; if (!state.gave) move(0, 0, back, ease); }, 700);
    });
    return state;
  }

  /* ---------- egg 1: the jobless button ---------- */
  const btn = $('.catch-me');
  if (btn) {
    let clicks = 0;
    const st = dodge(btn, {
      patience: 4,
      onDodge: (s) => (btn.textContent = `Nope x${s.dodges}`),
      onGive: () => (btn.textContent = 'Okay, okay'),
    });
    btn.addEventListener('click', () => {
      if (!st.gave) return;
      clicks++;
      btn.textContent = clicks === 1 ? 'u r jobless. stop clicking me' : `still jobless x${clicks}`;
    });
  }

  /* ---------- egg 2: you read the whole site ---------- */
  const end = $('.the-end');
  if (end) {
    let seen = false;
    try { seen = sessionStorage.getItem('read-all') === '1'; } catch {}
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || seen) return;
      seen = true;
      try { sessionStorage.setItem('read-all', '1'); } catch {}
      toast('you read my whole website. respect.');
      io.disconnect();
    });
    if (!seen) io.observe(end);
  }

  /* ---------- egg 3: type "bocajuniors" or "mun" for bugs ---------- */
  const codes = { bocajuniors: '¡Dale Boca! bugs released.', mun: 'point of order: there are bugs on the floor.' };
  let typed = '';
  addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
    if (e.target.closest && e.target.closest('input, textarea, [contenteditable]')) return;
    typed = (typed + e.key.toLowerCase()).slice(-11);
    for (const [code, msg] of Object.entries(codes)) {
      if (typed.endsWith(code)) { typed = ''; releaseBugs(code === 'bocajuniors'); toast(msg + ' click to squash, esc to clear.'); }
    }
  });
  addEventListener('keydown', (e) => e.key === 'Escape' && document.querySelectorAll('.bug').forEach(b => b.remove()));

  // Phones have no keyboard: 5 quick taps on the logo = mun bugs,
  // 5 quick taps on the giant footer wordmark = Boca bugs.
  const tapCode = (el, boca, msg) => {
    if (!el) return;
    let taps = 0, timer;
    el.addEventListener('click', (e) => {
      taps++;
      clearTimeout(timer);
      timer = setTimeout(() => (taps = 0), 1500);
      if (taps >= 3) e.preventDefault();          // stop the jump to top while tapping
      if (taps === 5) { taps = 0; releaseBugs(boca); toast(msg + ' tap to squash.'); }
    });
  };
  tapCode($('.nav-mark'), false, codes.mun);
  tapCode($('footer .ghost'), true, codes.bocajuniors);

  function releaseBugs(boca) {
    let field = $('.bug-field');
    if (!field) {
      field = document.createElement('div');
      field.className = 'bug-field';
      document.body.append(field);
    }
    const n = innerWidth < 600 ? 7 : 14;
    for (let i = 0; i < n; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'bug' + (boca ? ' boca' : '');
      b.setAttribute('aria-label', 'Squash bug');
      b.style.left = 5 + Math.random() * 88 + '%';
      b.style.top = 10 + Math.random() * 78 + '%';
      b.style.setProperty('--r', Math.round(Math.random() * 360) + 'deg');
      field.append(b);
      dodge(b, { reach: 90, radius: 110, patience: 6 + Math.floor(Math.random() * 4) });
      b.addEventListener('click', () => {
        b.classList.add('squashed');
        setTimeout(() => {
          b.remove();
          if (!field.querySelector('.bug')) toast('all bugs squashed. ship it.');
        }, 300);
      });
    }
  }
})();
