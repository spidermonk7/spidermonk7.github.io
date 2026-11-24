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
