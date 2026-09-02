/**
 * Shiftiq — Statement + Funciones (scroll reveal borroso estilo Viora)
 */
const StatementSection = (() => {
  const revealApis = [];

  function initScrollReveals() {
    revealApis.length = 0;

    document.querySelectorAll('[data-statement-reveal]').forEach((el) => {
      if (el.dataset.scrollRevealReady === 'true') {
        el.dataset.scrollRevealReady = '';
        el._scrollRevealApi = null;
      }

      const api = ScrollTextReveal.attach(el, {
        mode: 'scroll',
        staggerRange: 0.78,
        softness: 0.18,
      });

      if (api) revealApis.push(api);
    });
  }

  function initFadeIns() {
    const items = document.querySelectorAll('[data-statement-fade]');
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });

    items.forEach((el) => observer.observe(el));
  }

  function rebuild() {
    document.querySelectorAll('[data-statement-reveal]').forEach((el) => {
      el._scrollRevealApi?.rebuild();
    });
  }

  function init() {
    initScrollReveals();
    initFadeIns();
  }

  document.addEventListener('languageChanged', rebuild);

  return { init, rebuild };
})();

document.addEventListener('DOMContentLoaded', () => StatementSection.init());
