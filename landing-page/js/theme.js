/**
 * Shiftiq — Tema fijo oscuro (header y secciones oscuras)
 */
const Theme = (() => {
  function apply() {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (window.lucide) lucide.createIcons();
  }

  function init() {
    apply();
  }

  return { init, apply };
})();

document.documentElement.setAttribute('data-theme', 'dark');
document.addEventListener('DOMContentLoaded', () => Theme.init());
