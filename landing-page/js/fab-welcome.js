/**
 * Shiftiq — FAB de bienvenida (inferior derecha)
 * Al entrar: mensaje animado automático (una vez por sesión).
 * Al hacer click: abre/cierra el mensaje de bienvenida.
 */
const FabWelcome = (() => {
  const SESSION_KEY = 'shiftiq-fab-welcome-seen';

  function init() {
    const root = document.querySelector('[data-fab-welcome]');
    const btn = root?.querySelector('[data-fab-btn]');
    if (!root || !btn || root.dataset.fabReady === 'true') return;

    let autoCloseTimer = null;

    function clearAutoClose() {
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
        autoCloseTimer = null;
      }
    }

    function open({ animate = true, autoClose = false } = {}) {
      if (animate) {
        root.classList.add('is-intro');
        requestAnimationFrame(() => {
          root.classList.add('is-open');
        });
      } else {
        root.classList.add('is-open');
      }

      btn.setAttribute('aria-expanded', 'true');
      clearAutoClose();

      if (autoClose) {
        autoCloseTimer = window.setTimeout(close, 5000);
      }
    }

    function close() {
      root.classList.remove('is-open', 'is-intro');
      btn.setAttribute('aria-expanded', 'false');
      clearAutoClose();
    }

    function toggle() {
      if (root.classList.contains('is-open')) {
        close();
        return;
      }
      open({ animate: true, autoClose: false });
    }

    function playIntro() {
      if (sessionStorage.getItem(SESSION_KEY) === '1') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        sessionStorage.setItem(SESSION_KEY, '1');
        return;
      }

      window.setTimeout(() => {
        open({ animate: true, autoClose: true });
        sessionStorage.setItem(SESSION_KEY, '1');
      }, 1400);
    }

    btn.addEventListener('click', () => {
      btn.classList.add('is-tap');
      window.setTimeout(() => btn.classList.remove('is-tap'), 320);
      toggle();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && root.classList.contains('is-open')) {
        close();
      }
    });

    document.addEventListener('click', (event) => {
      if (!root.classList.contains('is-open')) return;
      if (root.contains(event.target)) return;
      close();
    });

    playIntro();
    root.dataset.fabReady = 'true';
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => FabWelcome.init());
