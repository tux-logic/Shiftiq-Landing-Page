/**
 * Shiftiq — Theme (light / dark)
 */
const Theme = (() => {
  const STORAGE_KEY = 'shiftiq-theme';

  function getPreferred() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggle(theme);
    if (window.lucide) lucide.createIcons();
  }

  function updateToggle(theme) {
    document.querySelectorAll('.theme-switch__btn').forEach(btn => {
      const isActive = btn.dataset.themeValue === theme;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive);
    });
  }

  function toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    apply(current === 'light' ? 'dark' : 'light');
  }

  function init() {
    apply(getPreferred());

    document.querySelectorAll('.theme-switch__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.themeValue !== document.documentElement.getAttribute('data-theme')) {
          apply(btn.dataset.themeValue);
        }
      });
    });
  }

  return { init, toggle, apply };
})();

// Apply before DOM ready if loaded early
if (document.documentElement) {
  const saved = localStorage.getItem('shiftiq-theme');
  if (saved === 'dark' || saved === 'light') {
    document.documentElement.setAttribute('data-theme', saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}

document.addEventListener('DOMContentLoaded', () => Theme.init());
