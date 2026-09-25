// Scroll and pointer motion. All content is visible without this file;
// it only adds classes/variables, and does nothing under reduced motion.
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const root = document.documentElement;
  root.classList.add('motion');
  setTimeout(() => root.classList.add('loaded'), 7000); // failsafe if the loader never reports
  const $$ = (s) => [...document.querySelectorAll(s)];
  const fine = matchMedia('(pointer: fine)').matches;

  /* 1. reveal on scroll, staggered within each group */
  const groups = ['.marker', '.section-title', 'section:not(.hero) .lede', '.into-grid > *', '.cards > li', '.tl-year', '.tl-items > li', '.writing > li', '.thesis p', '.contact .btn', '.contact .links li'];
  const targets = [];
  groups.forEach(sel => $$(sel).forEach((el, i) => {
    el.classList.add('rv');
    el.style.setProperty('--d', (Math.min(i, 8) * 70) + 'ms');
    targets.push(el);
  }));
  // Plain position check (not IntersectionObserver) so nothing can stay hidden
  // if observers are throttled; runs on scroll, resize and load.
  let pending = targets.slice();
  const reveal = () => {
    const line = innerHeight * 0.92;
    pending = pending.filter(el => {
      if (el.getBoundingClientRect().top < line) { el.classList.add('in'); return false; }
      return true;
    });
  };
  addEventListener('scroll', reveal, { passive: true });
  addEventListener('resize', reveal);
  addEventListener('load', reveal);
  reveal();
  // Anything the reader jumped past (anchor links) shows immediately.
  addEventListener('hashchange', () => setTimeout(reveal, 50));

  /* 2. hero headline: words rise in after the loader */
  const h1 = document.querySelector('.hero h1');
  if (h1) {
    let k = 0;
    const wrap = (node) => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(part); return; }
            const w = document.createElement('span');
            w.className = 'w'; w.style.setProperty('--i', k++);
            w.textContent = part; frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) {
          n.classList.add('w'); n.style.setProperty('--i', k++);
        }
      });
    };
    wrap(h1);
    h1.setAttribute('aria-label', h1.textContent.replace(/\s+/g, ' ').trim());
  }

  /* 3. stat counters (real numbers only; suffix like "+" kept) */
  const count = (dd) => {
    const m = dd.textContent.trim().match(/^(\d+)(.*)$/); if (!m) return;
    const end = +m[1], suffix = m[2], t0 = performance.now(), dur = 1400;
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      dd.textContent = Math.round(end * e) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const statIO = new IntersectionObserver((es) => es.forEach(e => {
    if (!e.isIntersecting) return;
    statIO.unobserve(e.target);
    const go = () => setTimeout(() => count(e.target), 900);
    if (root.classList.contains('loaded')) go();
    else new MutationObserver((_, mo) => { if (root.classList.contains('loaded')) { mo.disconnect(); go(); } }).observe(root, { attributes: true, attributeFilter: ['class'] });
  }));
  $$('.stats dd').forEach(dd => statIO.observe(dd));

  /* 4. scroll progress bar + timeline rail that draws itself */
  const bar = document.querySelector('.progress');
  const rails = $$('.tl-items');
  let ticking = false;
  const onScroll = () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const max = root.scrollHeight - innerHeight;
      if (bar) bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
      rails.forEach(r => {
        const b = r.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (innerHeight * 0.75 - b.top) / b.height));
        r.style.setProperty('--rail', p.toFixed(3));
      });
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (!fine) return; // pointer effects below are desktop-only

  /* 5. spotlight: panels glow where the cursor is */
  $$('.panel').forEach(p => p.addEventListener('pointermove', (e) => {
    const r = p.getBoundingClientRect();
    p.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    p.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));

  /* 6. cards tilt slightly toward the cursor */
  $$('.card').forEach(c => {
    c.addEventListener('pointermove', (e) => {
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      c.style.transform = `perspective(700px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
    });
    c.addEventListener('pointerleave', () => (c.style.transform = ''));
  });

  /* 7. magnetic buttons (the dodging button keeps its own behaviour) */
  $$('.btn:not(.catch-me)').forEach(b => {
    b.addEventListener('pointermove', (e) => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${((e.clientX - r.left) / r.width - 0.5) * 10}px, ${((e.clientY - r.top) / r.height - 0.5) * 8}px)`;
    });
    b.addEventListener('pointerleave', () => (b.style.transform = ''));
  });

  /* 8. hero windows follow the cursor a little (parallax) */
  const stack = document.querySelector('.stack');
  const hero = document.querySelector('.hero');
  if (stack && hero) hero.addEventListener('pointermove', (e) => {
    const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
    stack.style.translate = `${(x * -18).toFixed(1)}px ${(y * -14).toFixed(1)}px`;
  });
})();
