(() => {
  const hero = document.querySelector('.pf-amber-hero');
  const scene = hero?.querySelector('.pf-amber-scene');
  const canvas = hero?.querySelector('.pf-amber-canvas');
  if (!hero || !canvas || !window.PFAmber) return;
  try { if (!canvas.getContext('2d')) return; } catch (_) { return; }
  const model = window.PFAmber.create(canvas);
  const pauseButton = hero.querySelector('.pf-amber-pause');
  const resetButton = hero.querySelector('.pf-amber-reset');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let storedPause = false;
  try { storedPause = localStorage.getItem('pf-amber-paused') === 'true'; } catch (_) {}
  let paused = reduced.matches || storedPause;
  let visible = false, printing = false, drag = null;
  const activate = () => {
    const active = visible && !document.hidden && !printing;
    hero.dataset.amberActive = String(active);
    model.setActive(active);
  };
  const updatePause = () => {
    hero.dataset.amberPaused = String(paused);
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.setAttribute('aria-label', paused ? 'Play automatic rotation' : 'Pause automatic rotation');
    pauseButton.querySelector('.pf-amber-pause-label').textContent = paused ? 'Play' : 'Pause';
    pauseButton.querySelector('.pf-amber-pause-symbol').textContent = paused ? '▷' : 'Ⅱ';
    model.setPaused(paused);
  };
  const stopDrag = () => {
    if (drag && canvas.hasPointerCapture(drag.id)) canvas.releasePointerCapture(drag.id);
    drag = null;
    canvas.classList.remove('is-dragging');
  };
  canvas.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    drag = {id: event.pointerId, x: event.clientX, y: event.clientY, originX: event.clientX, originY: event.clientY, touch: event.pointerType === 'touch', engaged: event.pointerType !== 'touch'};
    canvas.setPointerCapture(event.pointerId);
    canvas.classList.add('is-dragging');
  });
  canvas.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    if (drag.touch && !drag.engaged) {
      const x = event.clientX - drag.originX, y = event.clientY - drag.originY;
      if (Math.hypot(x,y) < 5) return;
      if (Math.abs(y) > Math.abs(x) * 1.1) { stopDrag(); return; }
      drag.engaged = true;
    }
    const dx = Math.max(-60,Math.min(60,event.clientX - drag.x));
    const dy = Math.max(-60,Math.min(60,event.clientY - drag.y));
    model.rotate(dx * .006, dy * .005);
    drag.x = event.clientX; drag.y = event.clientY;
  });
  canvas.addEventListener('pointerup', stopDrag);
  canvas.addEventListener('pointercancel', stopDrag);
  canvas.addEventListener('lostpointercapture', () => { drag = null; canvas.classList.remove('is-dragging'); });
  canvas.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const step = event.shiftKey ? .20 : .10;
    switch (event.key) {
      case 'ArrowLeft': model.rotate(-step,0); break;
      case 'ArrowRight': model.rotate(step,0); break;
      case 'ArrowUp': model.rotate(0,-step); break;
      case 'ArrowDown': model.rotate(0,step); break;
      case '+': case '=': model.zoom(.05); break;
      case '-': case '_': model.zoom(-.05); break;
      case 'Home': model.reset(); break;
      case ' ': pauseButton.click(); break;
      case 'Escape': stopDrag(); break;
      default: return;
    }
    event.preventDefault();
  });
  pauseButton.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem('pf-amber-paused',String(paused)); } catch (_) {}
    updatePause();
  });
  resetButton.addEventListener('click', () => { stopDrag(); model.reset(); });
  reduced.addEventListener('change', () => { if (reduced.matches) { paused = true; updatePause(); } });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopDrag(); activate(); });
  window.addEventListener('pagehide', () => { stopDrag(); hero.dataset.amberActive = 'false'; model.setActive(false); });
  window.addEventListener('pageshow', activate);
  window.addEventListener('beforeprint', () => { printing = true; activate(); });
  window.addEventListener('afterprint', () => { printing = false; activate(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; activate(); }, {threshold: 0,rootMargin: '30px'}).observe(scene);
  } else { visible = true; }
  if ('ResizeObserver' in window) new ResizeObserver(() => model.resize()).observe(scene);
  window.addEventListener('resize', () => model.resize(), {passive: true});
  canvas.tabIndex = 0;
  canvas.removeAttribute('aria-hidden');
  updatePause();
  hero.classList.add('pf-amber-ready');
  model.resize();
  activate();
})();
