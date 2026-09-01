/**
 * Shiftiq — About section (float cards, team slider, media toggle)
 * Team slider adapted from Viora team-members-panel
 */
const AboutSection = (() => {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function easeOutCubic(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  let footerTextReveal = null;

  function attachScrollTextReveal(textElement) {
    if (!textElement || textElement.dataset.scrollTextRevealInitialized === 'true') {
      return footerTextReveal;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let words = [];
    let ticking = false;

    function setWordState(word, reveal) {
      const eased = easeOutCubic(reveal);
      const alpha = 0.18 + eased * 0.82;
      const y = (1 - eased) * 0.45;
      const blur = (1 - eased) * 0.18;

      word.style.setProperty('--word-alpha', alpha.toFixed(3));
      word.style.setProperty('--word-y', `${y.toFixed(3)}em`);
      word.style.setProperty('--word-blur', `${blur.toFixed(3)}em`);
    }

    function revealAll() {
      words.forEach((word) => setWordState(word, 1));
    }

    function buildWords() {
      const text = textElement.textContent.replace(/\s+/g, ' ').trim();
      textElement.innerHTML = '';
      words = [];

      text.split(/(\s+)/).forEach((token) => {
        if (!token) return;

        if (/^\s+$/.test(token)) {
          textElement.appendChild(document.createTextNode(token));
          return;
        }

        const word = document.createElement('span');
        word.className = 'about-media__reveal-word';
        word.textContent = token;
        textElement.appendChild(word);
        words.push(word);
      });
    }

    function updateReveal() {
      if (reducedMotion.matches) {
        revealAll();
        ticking = false;
        return;
      }

      const rect = textElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const revealStart = viewportHeight * 1.05;
      const revealDistance = Math.max(viewportHeight * 0.38, rect.height * 1.4);
      const progress = clamp((revealStart - rect.top) / revealDistance, 0, 1);
      const staggerRange = 0.72;
      const softness = 0.2;
      const lastIndex = Math.max(words.length - 1, 1);

      words.forEach((word, index) => {
        const wordStart = (index / lastIndex) * staggerRange;
        const reveal = clamp((progress - wordStart) / softness, 0, 1);
        setWordState(word, reveal);
      });

      ticking = false;
    }

    function requestRevealUpdate() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateReveal);
      }
    }

    function rebuild() {
      buildWords();
      requestRevealUpdate();
    }

    buildWords();
    window.addEventListener('scroll', requestRevealUpdate, { passive: true });
    window.addEventListener('resize', requestRevealUpdate);
    requestRevealUpdate();

    textElement.dataset.scrollTextRevealInitialized = 'true';

    return { rebuild };
  }

  function initFooterTextReveal(root) {
    const textElement = root.querySelector('[data-about-scroll-reveal]');
    if (!textElement) return;

    if (!footerTextReveal) {
      footerTextReveal = attachScrollTextReveal(textElement);
      return;
    }

    footerTextReveal.rebuild();
  }

  function initFloats(root) {
    const floats = root.querySelectorAll('[data-about-float]');
    if (!floats.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const side = el.dataset.aboutFloat;
        el.classList.add(side === 'left' ? 'is-visible--left' : 'is-visible--right');
        observer.unobserve(el);
      });
    }, { threshold: 0.3, rootMargin: '0px 0px -40px 0px' });

    floats.forEach((el) => observer.observe(el));
  }

  function initTeamSlider(root) {
    const panel = root.querySelector('[data-about-team-panel]');
    const track = panel?.querySelector('[data-about-team-track]');
    const viewport = panel?.querySelector('[data-about-team-viewport]');
    const progressBar = panel?.querySelector('[data-about-team-progress]');
    if (!panel || !track || !viewport || panel.dataset.aboutTeamReady === 'true') return;

    let isDragging = false;
    let startX = 0;
    let startTranslate = 0;
    let currentTranslate = 0;

    function getTrackStepSize() {
      const firstCard = track.querySelector('.about-team-card');
      if (!firstCard) return 0;
      const cardRect = firstCard.getBoundingClientRect();
      const styles = window.getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap || 0);
      return cardRect.width + gap;
    }

    function getMaxTranslate() {
      const viewportStyles = window.getComputedStyle(viewport);
      const horizontalPadding =
        parseFloat(viewportStyles.paddingLeft || 0) + parseFloat(viewportStyles.paddingRight || 0);
      return Math.max(0, track.scrollWidth - viewport.clientWidth + horizontalPadding);
    }

    function updateProgressBar(translate) {
      if (!progressBar) return;
      const maxT = getMaxTranslate();
      if (maxT <= 0) {
        progressBar.style.width = '100%';
        return;
      }
      progressBar.style.width = `${clamp((Math.abs(translate) / maxT) * 100, 0, 100)}%`;
    }

    function setTranslate(value, animated = true) {
      const maxT = getMaxTranslate();
      const clampedVal = clamp(value, -maxT, 0);

      track.style.transition = animated
        ? 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1)'
        : 'none';
      track.style.transform = `translate3d(${clampedVal}px, 0, 0)`;
      track.dataset.translateX = String(clampedVal);
      currentTranslate = clampedVal;
      updateProgressBar(clampedVal);
    }

    function snapToNearest() {
      const step = getTrackStepSize();
      if (step <= 0) return;

      const maxT = getMaxTranslate();
      const current = Math.abs(currentTranslate);
      const snapPoints = [0, maxT];

      for (let point = step; point < maxT; point += step) {
        snapPoints.push(point);
      }

      const nearestPoint = snapPoints.reduce((nearest, point) => {
        return Math.abs(point - current) < Math.abs(nearest - current) ? point : nearest;
      }, 0);

      setTranslate(-nearestPoint, true);
    }

    function handlePointerDown(event) {
      if (event.pointerType === 'mouse' && event.button !== 0) return;

      isDragging = true;
      startX = event.clientX;
      startTranslate = Number(track.dataset.translateX || 0);
      track.style.transition = 'none';
      viewport.classList.add('is-dragging');
      viewport.setPointerCapture(event.pointerId);
    }

    function handlePointerMove(event) {
      if (!isDragging) return;
      setTranslate(startTranslate + (event.clientX - startX), false);
    }

    function handlePointerUp(event) {
      if (!isDragging) return;
      isDragging = false;
      viewport.classList.remove('is-dragging');

      try {
        viewport.releasePointerCapture(event.pointerId);
      } catch (_) {
        /* ignore */
      }

      snapToNearest();
    }

    viewport.addEventListener('pointerdown', handlePointerDown);
    viewport.addEventListener('pointermove', handlePointerMove);
    viewport.addEventListener('pointerup', handlePointerUp);
    viewport.addEventListener('pointercancel', handlePointerUp);

    window.addEventListener('resize', () => {
      const step = getTrackStepSize();
      if (step > 0) {
        const index = Math.round(Math.abs(currentTranslate) / step);
        setTranslate(-index * step, false);
      } else {
        setTranslate(currentTranslate, false);
      }
    });

    requestAnimationFrame(() => setTranslate(0, false));
    panel.dataset.aboutTeamReady = 'true';
  }

  function initMedia(root) {
    const btns = [...root.querySelectorAll('[data-about-media]')];
    const panels = [...root.querySelectorAll('[data-about-panel]')];
    if (!btns.length) return;

    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.aboutMedia;
        btns.forEach((b) => {
          const active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        panels.forEach((p) => {
          p.classList.toggle('is-active', p.dataset.aboutPanel === mode);
        });
      });
    });
  }

  function initParallax(root) {
    const floats = root.querySelectorAll('.about-float');
    if (!floats.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = root.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
        floats.forEach((el, i) => {
          const dir = i === 0 ? -1 : 1;
          const y = (progress - 0.5) * 24 * dir;
          el.style.translate = `0 ${y}px`;
        });
        ticking = false;
      });
    }, { passive: true });
  }

  function init() {
    const root = document.querySelector('[data-about]');
    if (!root) return;
    initFloats(root);
    initTeamSlider(root);
    initMedia(root);
    initParallax(root);
    initFooterTextReveal(root);
  }

  document.addEventListener('languageChanged', () => {
    const root = document.querySelector('[data-about]');
    if (root) initFooterTextReveal(root);
  });

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => AboutSection.init());
