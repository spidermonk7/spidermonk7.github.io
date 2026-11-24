(() => {
  const exhibit = document.querySelector('.pf-holo');
  const canvas = exhibit?.querySelector('canvas');
  if (!exhibit || !canvas || !window.PFHologram || !canvas.getContext('2d')) return;
  const renderer = window.PFHologram.create(canvas);
  const viewport = exhibit.querySelector('.pf-holo-viewport');
  const art = exhibit.querySelector('.pf-holo-art');
  const description = document.getElementById('pf-holo-description');
  const pauseButton = exhibit.querySelector('.pf-holo-motion');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const read = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };
  let mode = read('pf-holo-view') === 'core' ? 'core' : 'touch';
  let palette = read('pf-holo-palette') === 'amber' ? 'amber' : 'blue';
  let paused = reduced.matches || read('pf-holo-paused') === 'true';
  let visible = false;
  let pointerStart = null;
  let lastPulse = -Infinity;
  const resetTilt = () => {
    exhibit.style.setProperty('--holo-tilt-x', '0deg');
    exhibit.style.setProperty('--holo-tilt-y', '0deg');
    renderer.setPointer(0, 0);
  };
  const updateActive = () => {
    const active = visible && !document.hidden;
    exhibit.dataset.holoActive = String(active);
    renderer.setActive(active);
  };
  const updateAppearance = () => {
    exhibit.dataset.holoMode = mode;
    exhibit.dataset.holoPalette = palette;
    exhibit.querySelectorAll('[data-holo-view]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.holoView === mode)));
    exhibit.querySelectorAll('[data-holo-color]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.holoColor === palette)));
    art.setAttribute('aria-hidden', String(mode === 'core'));
    art.alt = `Two ${palette} holographic hands reaching toward one another, their index fingers almost touching.`;
    description.textContent = mode === 'touch'
      ? `An interactive ${palette} hologram of two hands reaching toward a shared spark. Activate the center to send a pulse.`
      : `An interactive ${palette} hologram of a three-dimensional neural core made of interconnected filaments. Activate the center to send a pulse.`;
    renderer.setMode(mode);
    renderer.setPalette(palette);
  };
  const updatePause = () => {
    exhibit.dataset.holoPaused = String(paused);
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.setAttribute('aria-label', paused ? 'Play hologram animation' : 'Pause hologram animation');
    pauseButton.title = paused ? 'Play animation' : 'Pause animation';
    renderer.setPaused(paused);
    exhibit.querySelector('.pf-holo-pulse').disabled = paused;
    exhibit.querySelector('.pf-holo-hint').textContent = paused ? 'Motion paused' : 'Touch to connect';
    if (paused) resetTilt();
  };
  const pulse = () => {
    const now = performance.now();
    if (now - lastPulse < 700) return;
    lastPulse = now;
    renderer.pulse();
  };
  exhibit.querySelectorAll('[data-holo-view]').forEach(button => button.addEventListener('click', () => {
    mode = button.dataset.holoView;
    save('pf-holo-view', mode);
    updateAppearance();
  }));
  exhibit.querySelectorAll('[data-holo-color]').forEach(button => button.addEventListener('click', () => {
    palette = button.dataset.holoColor;
    save('pf-holo-palette', palette);
    updateAppearance();
  }));
  pauseButton.addEventListener('click', () => { paused = !paused; save('pf-holo-paused', String(paused)); updatePause(); });
  exhibit.querySelector('.pf-holo-pulse').addEventListener('click', pulse);
  viewport.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0 || event.target.closest('button')) return;
    pointerStart = {x: event.clientX, y: event.clientY, time: performance.now(), id: event.pointerId};
  }, {passive: true});
  viewport.addEventListener('pointerup', event => {
    if (!pointerStart || event.pointerId !== pointerStart.id) return;
    const distance = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
    if (distance < 8 && performance.now() - pointerStart.time < 650) pulse();
    pointerStart = null;
  }, {passive: true});
  viewport.addEventListener('pointercancel', () => { pointerStart = null; }, {passive: true});
  viewport.addEventListener('pointermove', event => {
    if (paused || reduced.matches || !fine.matches) return;
    const box = viewport.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - box.left) / box.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - box.top) / box.height * 2 - 1));
    renderer.setPointer(x, y);
    exhibit.style.setProperty('--holo-tilt-x', `${x * 2.2}deg`);
    exhibit.style.setProperty('--holo-tilt-y', `${-y * 2.2}deg`);
  }, {passive: true});
  viewport.addEventListener('pointerleave', () => { pointerStart = null; resetTilt(); }, {passive: true});
  reduced.addEventListener('change', () => { if (reduced.matches) { paused = true; updatePause(); } });
  fine.addEventListener('change', () => { if (!fine.matches) resetTilt(); });
  document.addEventListener('visibilitychange', updateActive);
  window.addEventListener('pagehide', () => { exhibit.dataset.holoActive = 'false'; renderer.setActive(false); });
  window.addEventListener('pageshow', updateActive);
  window.addEventListener('beforeprint', () => { exhibit.dataset.holoActive = 'false'; renderer.setActive(false); });
  window.addEventListener('afterprint', updateActive);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      updateActive();
    }, {threshold: 0, rootMargin: '40px'});
    observer.observe(viewport);
  } else { visible = true; }
  if ('ResizeObserver' in window) new ResizeObserver(() => renderer.resize()).observe(viewport);
  else window.addEventListener('resize', () => renderer.resize(), {passive: true});
  updateAppearance();
  updatePause();
  exhibit.classList.add('pf-holo-ready');
  renderer.resize();
  updateActive();
})();
