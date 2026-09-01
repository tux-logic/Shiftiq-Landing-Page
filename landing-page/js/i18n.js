/**
 * Shiftiq — i18n (ES / EN)
 */
const I18n = (() => {
  const STORAGE_KEY = 'shiftiq-lang';
  let currentLang = 'es';
  let translations = {};

  async function load(lang) {
    try {
      const res = await fetch(`locales/${lang}.json`);
      if (!res.ok) throw new Error(`Failed to load ${lang}.json`);
      translations = await res.json();
      currentLang = lang;
      document.documentElement.lang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
      apply();
      updateSwitcher();
      document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    } catch (err) {
      console.error('i18n load error:', err);
    }
  }

  function apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[key] !== undefined) {
        el.textContent = translations[key];
      }
    });
    if (window.lucide) lucide.createIcons();
  }

  function updateSwitcher() {
    document.querySelectorAll('.lang-switch__btn').forEach(btn => {
      const isActive = btn.dataset.lang === currentLang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive);
    });
  }

  function detect() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && ['es', 'en'].includes(saved)) return saved;
    const browser = navigator.language?.slice(0, 2);
    return browser === 'en' ? 'en' : 'es';
  }

  function init() {
    const lang = detect();
    load(lang);

    document.querySelectorAll('.lang-switch__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.lang !== currentLang) load(btn.dataset.lang);
      });
    });
  }

  return { init, load, get currentLang() { return currentLang; } };
})();

document.addEventListener('DOMContentLoaded', () => I18n.init());
