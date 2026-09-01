/**
 * Shiftiq — Segments: pill switch + sticky scroll slides
 */
const SegmentsScroll = (() => {
  const STICKY_TOP = 100;
  const scrollers = new Map();
  let activePanel = 'b2b';

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function initScroller(scroller, panelId) {
    const steps = parseInt(scroller.dataset.segSteps, 10) || 4;
    const slides = [...scroller.querySelectorAll('[data-seg-slide]')];
    const counter = scroller.querySelector('[data-seg-counter]');
    const dotsHost = scroller.querySelector('[data-seg-dots]');
    let current = 0;

    if (dotsHost) {
      dotsHost.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'seg-card__vdot';
        dot.setAttribute('aria-label', `Paso ${i + 1}`);
        dot.addEventListener('click', () => goToStep(i, true));
        dotsHost.appendChild(dot);
      });
    }

    function setSlide(index, force = false) {
      const i = Math.max(0, Math.min(steps - 1, index));
      if (!force && i === current) return;
      current = i;
      slides.forEach((slide, j) => slide.classList.toggle('is-active', j === i));
      if (counter) counter.textContent = `${pad(i + 1)} / ${pad(steps)}`;
      dotsHost?.querySelectorAll('.seg-card__vdot').forEach((dot, j) => {
        dot.classList.toggle('is-active', j === i);
      });
    }

    function applyHeight() {
      if (scroller.closest('[data-seg-panel]')?.classList.contains('is-active')) {
        const vh = window.innerWidth < 768 ? 60 : 70;
        scroller.style.height = `${steps * vh}vh`;
      } else {
        scroller.style.height = '0';
      }
    }

    function scrollToStep(index) {
      const top = scroller.offsetTop + (index / steps) * (scroller.offsetHeight - window.innerHeight) + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    }

    function goToStep(index, smooth = false) {
      setSlide(index, true);
      if (smooth) scrollToStep(index);
    }

    function next() {
      const nextIndex = (current + 1) % steps;
      goToStep(nextIndex, true);
    }

    function prev() {
      const prevIndex = (current - 1 + steps) % steps;
      goToStep(prevIndex, true);
    }

    function onScroll() {
      if (activePanel !== panelId) return;
      const rect = scroller.getBoundingClientRect();
      const scrollable = scroller.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const scrolled = Math.max(0, STICKY_TOP - rect.top);
      const progress = Math.min(1, scrolled / scrollable);
      const index = Math.min(steps - 1, Math.floor(progress * steps));
      setSlide(index);
    }

    applyHeight();
    setSlide(0, true);

    const api = { setSlide, next, prev, onScroll, applyHeight, goToStep, get current() { return current; } };
    scrollers.set(panelId, api);
    return api;
  }

  function showPanel(id, initial = false) {
    activePanel = id;
    const root = document.querySelector('[data-segments-scroll]');
    root?.querySelectorAll('[data-seg-panel]').forEach((panel) => {
      panel.classList.toggle('is-active', panel.dataset.segPanel === id);
    });

    document.querySelectorAll('[data-seg-tab]').forEach((tab) => {
      const on = tab.dataset.segTab === id;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', on);
    });

    document.querySelectorAll('[data-seg-intro-text]').forEach((el) => {
      el.hidden = el.dataset.segIntroText !== id;
    });

    scrollers.forEach((api) => api.applyHeight());
    scrollers.get(id)?.setSlide(0, true);

    if (!initial) {
      const panel = root?.querySelector(`[data-seg-panel="${id}"]`);
      const scroller = panel?.querySelector('[data-seg-scroller]');
      if (scroller) {
        const top = scroller.offsetTop - STICKY_TOP;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      }
    }
  }

  function init() {
    const root = document.querySelector('[data-segments-scroll]');
    if (!root) return;

    root.querySelectorAll('[data-seg-scroller]').forEach((scroller) => {
      const panelId = scroller.closest('[data-seg-panel]')?.dataset.segPanel;
      if (panelId) initScroller(scroller, panelId);
    });

    const onScroll = () => scrollers.get(activePanel)?.onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      scrollers.forEach((api) => api.applyHeight());
      onScroll();
    }, { passive: true });

    document.querySelectorAll('[data-seg-tab]').forEach((tab) => {
      tab.addEventListener('click', () => {
        if (tab.dataset.segTab !== activePanel) showPanel(tab.dataset.segTab);
      });
    });

    document.querySelector('[data-seg-arrow="prev"]')?.addEventListener('click', () => {
      scrollers.get(activePanel)?.prev();
    });

    document.querySelector('[data-seg-arrow="next"]')?.addEventListener('click', () => {
      scrollers.get(activePanel)?.next();
    });

    showPanel('b2b', true);
    onScroll();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => SegmentsScroll.init());
