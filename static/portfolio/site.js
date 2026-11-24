(() => {
  const toggle = document.querySelector('.pf-menu-toggle');
  const menu = document.getElementById('pf-menu');
  if (!toggle || !menu) return;
  const close = () => { menu.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
  });
  menu.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('is-open')) { close(); toggle.focus(); } });
  document.addEventListener('click', e => { if (!e.target.closest('.pf-nav')) close(); });
  matchMedia('(min-width: 801px)').addEventListener('change', close);
})();
