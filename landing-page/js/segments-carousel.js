/**
 * Shiftiq — Segmentos: pill switch + carrusel manual (4 pasos por segmento)
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
    const prevBtn = scroller.querySelector('[data-seg-prev]');
    const nextBtn = scroller.querySelector('[data-seg-next]');
    let current = 0;

    if (dotsHost) {
      dotsHost.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'seg-card__vdot';
        dot.setAttribute('aria-label', `Paso ${i + 1}`);
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          goToStep(i);
        });
        dotsHost.appendChild(dot);
      });
    }

    slides.forEach((slide) => {
      slide.querySelectorAll('.seg-card__head, .seg-card__title, .seg-card__text, .seg-card__features, .seg-card__cta, .seg-card__visual').forEach((el) => {
        el.setAttribute('data-seg-animate', '');
      });
    });

    function updateNavState() {
      if (prevBtn) {
        prevBtn.disabled = current <= 0;
        prevBtn.classList.toggle('is-disabled', current <= 0);
      }
      if (nextBtn) {
        nextBtn.disabled = current >= steps - 1;
        nextBtn.classList.toggle('is-disabled', current >= steps - 1);
      }
    }

    function setSlide(index) {
      const i = Math.max(0, Math.min(steps - 1, index));
      if (i === current && slides[i]?.classList.contains('is-active')) {
        updateNavState();
        return;
      }
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
      updateNavState();
    }

    function animateSlide(slide) {
      slide.querySelectorAll('[data-seg-animate]').forEach((item) => {
        item.classList.remove('is-animated');
        void item.offsetWidth;
        item.classList.add('is-animated');
      });
    }

    function goToStep(index) {
      setSlide(index);
    }

    function next() {
      if (current < steps - 1) setSlide(current + 1);
    }

    function prev() {
      if (current > 0) setSlide(current - 1);
    }

    prevBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      prev();
    });

    nextBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      next();
    });

    scroller.style.height = 'auto';
    setSlide(0);

    const api = { setSlide, next, prev, goToStep, panelId };
    scrollers.set(panelId, api);
    return api;
  }

  function updateTabs(id) {
    activePanel = id;
    document.querySelector('[data-seg-root]')?.setAttribute('data-seg-active', id);

    document.querySelectorAll('[data-seg-tab]').forEach((tab) => {
      const on = tab.dataset.segTab === id;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', on);
    });

    document.querySelectorAll('[data-seg-intro-text]').forEach((el) => {
      el.hidden = el.dataset.segIntroText !== id;
    });

    document.querySelector('[data-segments-scroll]')?.querySelectorAll('[data-seg-panel]').forEach((panel) => {
      panel.classList.toggle('is-active', panel.dataset.segPanel === id);
    });
  }

  function scrollToPanel(id) {
    const panel = document.querySelector(`[data-seg-panel="${id}"]`);
    if (!panel) return;
    const top = panel.getBoundingClientRect().top + window.scrollY - STICKY_TOP + 8;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  function showPanel(id, initial = false) {
    updateTabs(id);
    if (!initial) scrollToPanel(id);
  }

  function initSegReveal() {
    const section = document.getElementById('segmentos');
    const items = document.querySelectorAll('#segmentos .seg-reveal');
    if (!items.length) return;

    function reveal(el) {
      el.classList.add('is-visible');
    }

    function revealAllInSection() {
      items.forEach(reveal);
    }

    if (section) {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.94 && rect.bottom > 0) {
        revealAllInSection();
        return;
      }

      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          revealAllInSection();
          sectionObserver.disconnect();
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });

      sectionObserver.observe(section);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -2% 0px' });

    items.forEach((el) => {
      if (el.classList.contains('is-visible')) return;
      observer.observe(el);
    });
  }

  function init() {
    const root = document.querySelector('[data-segments-scroll]');
    if (!root) return;

    initSegReveal();

    root.querySelectorAll('[data-seg-scroller]').forEach((scroller) => {
      const panelId = scroller.closest('[data-seg-panel]')?.dataset.segPanel;
      if (panelId) initScroller(scroller, panelId);
    });

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

    if (window.lucide) lucide.createIcons();

    if (window.location.hash === '#segmentos') {
      document.querySelectorAll('#segmentos .seg-reveal').forEach((el) => {
        el.classList.add('is-visible');
      });
    }
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => SegmentsScroll.init());
