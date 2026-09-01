/**
 * Shiftiq — Scroll text reveal (palabra por palabra, estilo Viora)
 */
const ScrollTextReveal = (() => {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function easeOutCubic(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  function setWordState(word, reveal) {
    const eased = easeOutCubic(reveal);
    const alpha = 0.14 + eased * 0.86;
    const y = (1 - eased) * 0.42;
    const blur = (1 - eased) * 0.16;

    word.style.setProperty('--word-alpha', alpha.toFixed(3));
    word.style.setProperty('--word-y', `${y.toFixed(3)}em`);
    word.style.setProperty('--word-blur', `${blur.toFixed(3)}em`);
  }

  function buildWords(element) {
    const text = element.textContent.replace(/\s+/g, ' ').trim();
    element.innerHTML = '';
    const words = [];

    text.split(/(\s+)/).forEach((token) => {
      if (!token) return;

      if (/^\s+$/.test(token)) {
        element.appendChild(document.createTextNode(token));
        return;
      }

      const word = document.createElement('span');
      word.className = 'scroll-reveal-word';
      word.textContent = token;
      element.appendChild(word);
      words.push(word);
    });

    return words;
  }

  function attach(element, options = {}) {
    if (!element || element.dataset.scrollRevealReady === 'true') {
      return element._scrollRevealApi;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let words = [];
    let ticking = false;
    const staggerRange = options.staggerRange ?? 0.72;
    const softness = options.softness ?? 0.2;

    function revealAll() {
      words.forEach((word) => setWordState(word, 1));
    }

    function rebuild() {
      words = buildWords(element);
      if (reducedMotion.matches) {
        revealAll();
      } else if (options.mode === 'scroll') {
        updateScroll();
      } else {
        words.forEach((word) => setWordState(word, 0));
      }
    }

    function updateScroll() {
      if (reducedMotion.matches) {
        revealAll();
        ticking = false;
        return;
      }

      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const revealStart = viewportHeight * 1.02;
      const revealDistance = Math.max(viewportHeight * 0.36, rect.height * 1.35);
      const progress = clamp((revealStart - rect.top) / revealDistance, 0, 1);
      const lastIndex = Math.max(words.length - 1, 1);

      words.forEach((word, index) => {
        const wordStart = (index / lastIndex) * staggerRange;
        const reveal = clamp((progress - wordStart) / softness, 0, 1);
        setWordState(word, reveal);
      });

      ticking = false;
    }

    function requestUpdate() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScroll);
      }
    }

    function playIn(delayMs = 0) {
      if (reducedMotion.matches) {
        revealAll();
        return Promise.resolve();
      }

      words.forEach((word) => setWordState(word, 0));

      return new Promise((resolve) => {
        window.setTimeout(() => {
          const lastIndex = Math.max(words.length - 1, 1);
          words.forEach((word, index) => {
            const wordDelay = (index / lastIndex) * 520;
            window.setTimeout(() => setWordState(word, 1), wordDelay);
          });
          window.setTimeout(resolve, 560);
        }, delayMs);
      });
    }

    rebuild();

    if (options.mode === 'scroll') {
      window.addEventListener('scroll', requestUpdate, { passive: true });
      window.addEventListener('resize', requestUpdate);
      requestUpdate();
    }

    element.dataset.scrollRevealReady = 'true';

    const api = { rebuild, playIn, revealAll, get words() { return words; } };
    element._scrollRevealApi = api;
    return api;
  }

  function observeEntrance(elements, onEnter) {
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        onEnter?.(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });

    elements.forEach((el) => observer.observe(el));
  }

  return { attach, observeEntrance };
})();
