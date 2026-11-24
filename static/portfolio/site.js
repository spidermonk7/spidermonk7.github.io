(() => {
  const toggle = document.querySelector('.pf-menu-toggle');
  const menu = document.getElementById('pf-menu');
  if (!toggle || !menu) return;
  const close = () => { menu.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    if (open) menu.querySelector('a')?.focus();
  });
  menu.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('is-open')) { close(); toggle.focus(); } });
  document.addEventListener('click', e => { if (!e.target.closest('.pf-nav')) close(); });
  matchMedia('(min-width: 801px)').addEventListener('change', close);
})();

(() => {
  const dialog = document.querySelector('.pf-figure-dialog');
  if (!dialog) return;
  const image = dialog.querySelector('img');
  const heading = dialog.querySelector('h2');
  const sizeButton = dialog.querySelector('.pf-figure-size');
  let opener;
  document.querySelectorAll('[data-figure-src]').forEach(button => {
    button.addEventListener('click', () => {
      opener = button;
      image.src = button.dataset.figureSrc;
      image.alt = button.dataset.figureCaption;
      heading.textContent = button.dataset.figureCaption;
      dialog.classList.remove('is-actual');
      sizeButton.textContent = 'Actual size';
      sizeButton.setAttribute('aria-pressed', 'false');
      dialog.showModal();
      document.body.classList.add('pf-viewing-figure');
      dialog.querySelector('.pf-figure-close').focus();
    });
  });
  sizeButton.addEventListener('click', () => {
    const actual = dialog.classList.toggle('is-actual');
    sizeButton.setAttribute('aria-pressed', String(actual));
    sizeButton.textContent = actual ? 'Fit to screen' : 'Actual size';
    dialog.querySelector('.pf-figure-scroll').scrollTo(0, 0);
  });
  dialog.querySelector('.pf-figure-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('pf-viewing-figure');
    if (opener) opener.focus({preventScroll: true});
  });
})();

(() => {
  const root = document.documentElement;
  root.dataset.pfTheme = 'dark';
  root.classList.add('dark');
  root.style.colorScheme = 'dark';
  document.dispatchEvent(new CustomEvent('hbThemeChange', {detail: {isDarkTheme: () => true}}));

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.pf-header');
  const track = document.querySelector('.pf-reading-track');
  let queued = false;
  const updateScroll = () => {
    queued = false;
    header?.classList.toggle('is-scrolled', scrollY > 20);
    const range = root.scrollHeight - innerHeight;
    const progress = range > 0 ? Math.min(1, Math.max(0, scrollY / range)) : 0;
    track?.style.setProperty('--read-progress', reduced.matches ? '0' : String(progress));
  };
  const queueScroll = () => { if (!queued) { queued = true; requestAnimationFrame(updateScroll); } };
  addEventListener('scroll', queueScroll, {passive: true});
  addEventListener('resize', queueScroll, {passive: true});
  updateScroll();

  let observer;
  const revealAll = () => {
    document.body.classList.remove('pf-enter');
    document.querySelectorAll('.pf-reveal-ready').forEach(el => el.classList.add('is-revealed'));
    observer?.disconnect();
  };
  if (!reduced.matches) {
    document.body.classList.add('pf-enter');
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); observer.unobserve(entry.target); }
        });
      }, {rootMargin: '0px 0px 80px 0px', threshold: 0.03});
      document.querySelectorAll('.pf-section-head, .pf-paper, .pf-project, .pf-notebook, .pf-talk-card, .pf-focus-grid>article, .pf-footer-top').forEach(el => {
        if (el.getBoundingClientRect().top > innerHeight + 40) {
          el.classList.add('pf-reveal-ready');
          observer.observe(el);
        }
      });
    }
  }
  document.addEventListener('focusin', event => {
    let current = event.target;
    while (current instanceof Element) {
      if (current.classList.contains('pf-reveal-ready')) { current.classList.add('is-revealed'); observer?.unobserve(current); }
      current = current.parentElement;
    }
  });
  reduced.addEventListener('change', () => { if (reduced.matches) revealAll(); updateScroll(); });
  addEventListener('beforeprint', revealAll);

  const stage = document.querySelector('.pf-portrait-stage');
  const field = stage?.querySelector('.pf-field');
  if (stage && field && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let pointerFrame = false, x = 0, y = 0;
    stage.addEventListener('pointermove', event => {
      if (reduced.matches) return;
      const bounds = stage.getBoundingClientRect();
      x = (event.clientX - bounds.left - bounds.width / 2) / bounds.width * 14;
      y = (event.clientY - bounds.top - bounds.height / 2) / bounds.height * 14;
      if (!pointerFrame) {
        pointerFrame = true;
        requestAnimationFrame(() => { field.style.setProperty('--field-x', `${x}px`); field.style.setProperty('--field-y', `${y}px`); pointerFrame = false; });
      }
    });
    stage.addEventListener('pointerleave', () => { field.style.setProperty('--field-x', '0px'); field.style.setProperty('--field-y', '0px'); });
  }
})();
