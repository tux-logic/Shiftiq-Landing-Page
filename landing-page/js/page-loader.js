/**
 * Shiftiq — Pantalla de carga (logo + luz)
 */
(() => {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;

  document.documentElement.classList.add('is-loading');
  const started = performance.now();
  const MIN_MS = 1400;

  function hide() {
    const wait = Math.max(0, MIN_MS - (performance.now() - started));
    window.setTimeout(() => {
      loader.classList.add('is-done');
      document.documentElement.classList.remove('is-loading');
      window.setTimeout(() => {
        loader.remove();
      }, 700);
    }, wait);
  }

  if (document.readyState === 'complete') {
    hide();
  } else {
    window.addEventListener('load', hide, { once: true });
  }
})();
