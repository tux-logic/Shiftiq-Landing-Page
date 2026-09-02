/**
 * Shiftiq — About section (mission cards, team slider, media toggle)
 */
const AboutSection = (() => {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function easeOutCubic(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  const scrollReveals = new Map();

  function attachScrollTextReveal(textElement) {
    if (!textElement || textElement.dataset.scrollTextRevealInitialized === 'true') {
      return scrollReveals.get(textElement);
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

    const controller = { rebuild };
    scrollReveals.set(textElement, controller);
    return controller;
  }

  function initScrollReveals(root) {
    root.querySelectorAll('[data-about-scroll-reveal], [data-about-scroll-statement], [data-about-scroll-story]').forEach((el) => {
      const existing = scrollReveals.get(el);
      if (existing) {
        existing.rebuild();
      } else {
        attachScrollTextReveal(el);
      }
    });
  }

  function initHeroIntro(root) {
    const intro = root.querySelector('[data-about-intro]');
    if (!intro || intro.dataset.aboutIntroReady === 'true') return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        intro.classList.add('is-visible');
        observer.unobserve(intro);
      });
    }, { threshold: 0.35, rootMargin: '0px 0px -8% 0px' });

    observer.observe(intro);
    intro.dataset.aboutIntroReady = 'true';
  }

  function initMissionCards(root) {
    const cards = root.querySelectorAll('[data-about-card]');
    if (!cards.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.25, rootMargin: '0px 0px -6% 0px' });

    cards.forEach((card) => observer.observe(card));
  }

  function initCardTilt(root) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    root.querySelectorAll('[data-about-card]').forEach((card) => {
      if (card.dataset.aboutTiltReady === 'true') return;

      const baseTilt = card.classList.contains('about-mission-card--slate') ? -10 : 10;
      const isLeft = card.classList.contains('about-mission-card--left');
      const baseY = isLeft ? '-38%' : '-32%';

      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        card.style.transform = `
          translateY(${baseY})
          rotateX(${(-y * 8).toFixed(2)}deg)
          rotateY(${(x * 10).toFixed(2)}deg)
          rotate(${baseTilt}deg)
        `;
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = `translateY(${baseY}) rotate(${baseTilt}deg)`;
      });

      card.dataset.aboutTiltReady = 'true';
    });
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

  function init() {
    const root = document.querySelector('[data-about]');
    if (!root) return;
    initHeroIntro(root);
    initMissionCards(root);
    initCardTilt(root);
    initTeamSlider(root);
    initMedia(root);
    initScrollReveals(root);
  }

  document.addEventListener('languageChanged', () => {
    const root = document.querySelector('[data-about]');
    if (root) initScrollReveals(root);
  });

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => AboutSection.init());
