// Highlights the nav link for the section in view. The site is a single
// fixed green, so this no longer changes colour; each <section data-hue>
// still sets --h, which makes a future per-section hue a one-attribute change.
(() => {
  const root = document.documentElement;
  const navLinks = document.querySelectorAll('.nav ul a');

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target;
      root.style.setProperty('--h', el.dataset.hue);
      root.style.setProperty('--l', (el.dataset.l || 58) + '%');
      navLinks.forEach(a => a.setAttribute('aria-current', a.hash === '#' + el.id ? 'true' : 'false'));
    }
  }, { rootMargin: '-40% 0px -60% 0px' });
  document.querySelectorAll('[data-hue]').forEach(s => io.observe(s));
})();
