/**
 * Shiftiq — Segments: pill switch + sticky scroll slides (stacked cards)
 */
const SegmentsScroll = (() => {
  const STICKY_TOP = 100;
  const scrollers = new Map();
  let activePanel = 'b2b';
  let panelObserver = null;

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

    slides.forEach((slide) => {
      slide.querySelectorAll('.seg-card__content > *, .seg-card__visual').forEach((el) => {
        el.setAttribute('data-seg-animate', '');
      });
    });

    function setSlide(index, force = false) {
      const i = Math.max(0, Math.min(steps - 1, index));
      if (!force && i === current) return;
      current = i;
      slides.forEach((slide, j) => {
        const isActive = j === i;
        slide.classList.toggle('is-active', isActive);
        if (isActive) animateSlide(slide);
      });
      if (counter) counter.textContent = `${pad(i + 1)} / ${pad(steps)}`;
      dotsHost?.querySelectorAll('.seg-card__vdot').forEach((dot, j) => {
        dot.classList.toggle('is-active', j === i);
      });
    }

    function animateSlide(slide) {
      const items = slide.querySelectorAll('[data-seg-animate]');
      items.forEach((item) => {
        item.classList.remove('is-animated');
        void item.offsetWidth;
        item.classList.add('is-animated');
      });
    }

    function applyHeight() {
      const vh = window.innerWidth < 768 ? 60 : 70;
      scroller.style.height = `${steps * vh}vh`;
    }

    function scrollToStep(index) {
      const scrollable = scroller.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const top = scroller.getBoundingClientRect().top + window.scrollY + (index / steps) * scrollable + 1;
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

    const api = { setSlide, next, prev, onScroll, applyHeight, goToStep, get current() { return current; }, panelId };
    scrollers.set(panelId, api);
    return api;
  }

  function updateTabs(id) {
    activePanel = id;

    document.querySelectorAll('[data-seg-tab]').forEach((tab) => {
      const on = tab.dataset.segTab === id;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', on);
    });

    document.querySelectorAll('[data-seg-intro-text]').forEach((el) => {
      el.hidden = el.dataset.segIntroText !== id;
    });

    const root = document.querySelector('[data-segments-scroll]');
    root?.querySelectorAll('[data-seg-panel]').forEach((panel) => {
      panel.classList.toggle('is-active', panel.dataset.segPanel === id);
    });
  }

  function scrollToPanel(id) {
    const root = document.querySelector('[data-segments-scroll]');
    const panel = root?.querySelector(`[data-seg-panel="${id}"]`);
    const scroller = panel?.querySelector('[data-seg-scroller]');
    if (!scroller) return;

    const top = scroller.getBoundingClientRect().top + window.scrollY - STICKY_TOP;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  function showPanel(id, initial = false) {
    updateTabs(id);
    scrollers.get(id)?.setSlide(0, true);

    if (!initial) scrollToPanel(id);
  }

  function initPanelObserver() {
    const root = document.querySelector('[data-segments-scroll]');
    if (!root || panelObserver) return;

    const panels = [...root.querySelectorAll('[data-seg-panel]')];
    panelObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      const id = visible.target.dataset.segPanel;
      if (id && id !== activePanel) updateTabs(id);
    }, {
      root: null,
      threshold: [0.25, 0.45, 0.65],
      rootMargin: '-20% 0px -35% 0px',
    });

    panels.forEach((panel) => panelObserver.observe(panel));
  }

  function initSegReveal() {
    const items = document.querySelectorAll('.seg-reveal');
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    items.forEach((el) => observer.observe(el));
  }

  function init() {
    const root = document.querySelector('[data-segments-scroll]');
    if (!root) return;

    initSegReveal();
    initPanelObserver();

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
      showPanel('b2b');
    });

    document.querySelector('[data-seg-arrow="next"]')?.addEventListener('click', () => {
      showPanel('b2c');
    });

    showPanel('b2b', true);
    onScroll();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => SegmentsScroll.init());
