/**
 * Shiftiq — Statement + Funciones (scroll reveal + panel ovalado que sube)
 */
const StatementSection = (() => {
  const revealApis = [];
  let marqueeObserver = null;
  let riseRaf = 0;

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

  function syncMarqueeTrack(track) {
    const groups = [...track.querySelectorAll('.marquee__group')];
    if (!groups.length) return;

    const firstGroup = groups[0];
    const groupWidth = Math.ceil(firstGroup.getBoundingClientRect().width);
    if (!groupWidth) return;

    while (track.querySelectorAll('.marquee__group').length < 2) {
      track.appendChild(firstGroup.cloneNode(true));
    }

    const speed = 72;
    const duration = Math.max(18, groupWidth / speed);

    track.style.setProperty('--marquee-offset', `-${groupWidth}px`);
    track.style.setProperty('--marquee-duration', `${duration}s`);
    track.style.animation = 'none';
    void track.offsetWidth;
    track.style.removeProperty('animation');
  }

  function initMarquee() {
    const root = document.querySelector('[data-statement-marquee]');
    if (!root) return;

    const track = root.querySelector('.marquee__track');
    if (!track) return;

    const run = () => syncMarqueeTrack(track);

    if (document.fonts?.ready) {
      document.fonts.ready.then(run).catch(run);
    } else {
      run();
    }

    window.addEventListener('resize', () => {
      clearTimeout(track._marqueeResizeTimer);
      track._marqueeResizeTimer = setTimeout(run, 120);
    });

    if (marqueeObserver) marqueeObserver.disconnect();
    marqueeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        track.classList.toggle('is-paused', !entry.isIntersecting);
      });
    }, { threshold: 0.05 });
    marqueeObserver.observe(root);
  }

  function updatePanelRise() {
    const panel = document.querySelector('[data-statement-panel]');
    if (!panel) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      panel.style.setProperty('--statement-rise', '0px');
      return;
    }

    const rect = panel.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const start = vh * 0.92;
    const end = vh * 0.18;
    const raw = (start - rect.top) / (start - end);
    const progress = Math.max(0, Math.min(1, raw));
    const eased = 1 - Math.pow(1 - progress, 2.2);
    const maxRise = Math.min(120, Math.max(56, window.innerWidth * 0.08));
    const rise = -eased * maxRise;

    panel.style.setProperty('--statement-rise', `${rise.toFixed(2)}px`);
  }

  function requestRiseUpdate() {
    if (riseRaf) return;
    riseRaf = requestAnimationFrame(() => {
      riseRaf = 0;
      updatePanelRise();
    });
  }

  function initPanelRise() {
    const panel = document.querySelector('[data-statement-panel]');
    if (!panel) return;

    updatePanelRise();
    window.addEventListener('scroll', requestRiseUpdate, { passive: true });
    window.addEventListener('resize', requestRiseUpdate, { passive: true });
  }

  function rebuild() {
    document.querySelectorAll('[data-statement-reveal]').forEach((el) => {
      el._scrollRevealApi?.rebuild();
    });
    initMarquee();
    updatePanelRise();
  }

  function init() {
    initScrollReveals();
    initFadeIns();
    initMarquee();
    initPanelRise();
  }

  document.addEventListener('languageChanged', rebuild);

  return { init, rebuild };
})();

document.addEventListener('DOMContentLoaded', () => StatementSection.init());
