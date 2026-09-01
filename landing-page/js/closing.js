/**
 * Shiftiq — Closing sections (orbit + fan deck + CTA scroll reveal)
 * CTA animation adapted from Viora final-cta-section (scroll-driven curtain + line wipe)
 */
const Closing = (() => {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function easeOutCubic(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  function easeInOutCubic(value) {
    return value < 0.5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2;
  }

  function interpolateChannel(from, to, progress) {
    return Math.round(from + (to - from) * progress);
  }

  function interpolateRgb(from, to, progress, alpha = 1) {
    const r = interpolateChannel(from[0], to[0], progress);
    const g = interpolateChannel(from[1], to[1], progress);
    const b = interpolateChannel(from[2], to[2], progress);
    return alpha < 1 ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgb(${r}, ${g}, ${b})`;
  }

  function setLineState(line, reveal) {
    line.style.setProperty('--closing-cta-line-progress', `${(easeOutCubic(reveal) * 100).toFixed(2)}%`);
  }

  function buildRevealText(element) {
    const text = (element.textContent || '').trim();
    const fragment = document.createDocumentFragment();
    const revealLines = [];

    element.innerHTML = '';

    text.split('\n').forEach((line, lineIndex, allLines) => {
      const lineElement = document.createElement('span');
      lineElement.className = 'closing-cta__line';
      lineElement.textContent = line.trim();

      fragment.appendChild(lineElement);
      revealLines.push(lineElement);

      if (lineIndex < allLines.length - 1) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    element.appendChild(fragment);
    return revealLines;
  }

  function initOrbit() {
    const section = document.querySelector('[data-closing-orbit-section]');
    if (!section || section.dataset.closingOrbitReady === 'true') return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const items = Array.from(section.querySelectorAll('[data-closing-orbit-item]'));
    const bubbleLayout = [
      { x: '-36vw', y: '0vh', delay: 0, floatDelay: '0s', floatDuration: '2.5s' },
      { x: '-18vw', y: '-26vh', delay: 80, floatDelay: '0.1s', floatDuration: '2.2s' },
      { x: '-18vw', y: '26vh', delay: 160, floatDelay: '0.2s', floatDuration: '2.4s' },
      { x: '0vw', y: '-34vh', delay: 240, floatDelay: '0.3s', floatDuration: '2s' },
      { x: '0vw', y: '34vh', delay: 320, floatDelay: '0.4s', floatDuration: '2.3s' },
      { x: '18vw', y: '-26vh', delay: 400, floatDelay: '0.5s', floatDuration: '2.6s' },
      { x: '18vw', y: '26vh', delay: 480, floatDelay: '0.6s', floatDuration: '2.2s' },
      { x: '36vw', y: '0vh', delay: 560, floatDelay: '0.7s', floatDuration: '2.5s' },
    ];

    items.forEach((item, index) => {
      const config = bubbleLayout[index];
      if (!config) return;
      item.style.setProperty('--bubble-x', config.x);
      item.style.setProperty('--bubble-y', config.y);
      item.style.setProperty('--orbit-item-delay', `${config.delay}ms`);
      item.style.setProperty('--orbit-float-delay', config.floatDelay);
      item.style.setProperty('--orbit-float-duration', config.floatDuration);
    });

    const motionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        section.classList.toggle('is-visible', entry.isIntersecting);
      });
    }, { threshold: 0.35 });

    motionObserver.observe(section);

    if (reducedMotion.matches) {
      section.classList.add('is-visible');
    }

    section.dataset.closingOrbitReady = 'true';
  }

  function initFan() {
    const section = document.querySelector('[data-closing-fan]');
    const viewport = section?.querySelector('[data-closing-fan-viewport]');
    if (!section || !viewport || section.dataset.closingFanReady === 'true') return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileDeck = window.matchMedia('(max-width: 768px)');
    const DRAG_DISTANCE = 200;
    const VISIBLE_RADIUS = 2;
    const MOBILE_VISIBLE_RADIUS = 1;

    let activeIndex = 2;
    let pointerId = null;
    let startX = 0;
    let startIndex = 0;
    let lastMoveX = 0;
    let lastMoveTime = 0;
    let velocity = 0;
    let hasDragged = false;
    let frameId = null;
    let clickSuppressed = false;

    function getCards() {
      return Array.from(viewport.querySelectorAll('[data-closing-fan-card]'));
    }

    function wrapIndex(value, total) {
      if (!total) return 0;
      return ((value % total) + total) % total;
    }

    function getCircularDistance(index, center, total) {
      if (!total) return 0;
      let distance = index - center;
      const half = total / 2;
      while (distance > half) distance -= total;
      while (distance < -half) distance += total;
      return distance;
    }

    function renderDeck() {
      const cards = getCards();
      const total = cards.length;
      const isMobile = mobileDeck.matches;
      const visibleRadius = isMobile ? MOBILE_VISIBLE_RADIUS : VISIBLE_RADIUS;

      cards.forEach((card, index) => {
        const distance = getCircularDistance(index, activeIndex, total);
        const absDistance = Math.abs(distance);
        const direction = distance < 0 ? -1 : 1;
        const clamped = Math.min(absDistance, visibleRadius + 1);
        const progress = Math.min(absDistance, visibleRadius);
        const fanX = isMobile
          ? direction * Math.pow(progress, 0.82) * 52
          : distance * 14 + direction * Math.pow(progress, 1.1) * 72;
        const fanY = isMobile
          ? Math.pow(progress, 1.05) * 10
          : Math.pow(progress, 1.2) * 22;
        const rotation = isMobile ? distance * 5.5 : distance * 5.8;
        const scale = isMobile
          ? Math.max(0.84, 1 - progress * 0.14)
          : Math.max(0.86, 1 - progress * 0.05);
        const opacity = absDistance <= visibleRadius + 0.2 ? 1 : 0;
        const zIndex = Math.round((visibleRadius + 2 - clamped) * 20);

        card.style.setProperty('--deck-x', `${fanX.toFixed(2)}px`);
        card.style.setProperty('--deck-y', `${fanY.toFixed(2)}px`);
        card.style.setProperty('--deck-rotate', `${rotation.toFixed(2)}deg`);
        card.style.setProperty('--deck-scale', scale.toFixed(3));
        card.style.setProperty('--deck-opacity', opacity.toFixed(3));
        card.style.zIndex = String(zIndex);
        card.classList.toggle('is-active', absDistance < 0.45);
        card.setAttribute('aria-hidden', absDistance > visibleRadius + 0.2 ? 'true' : 'false');
      });
    }

    function normalizeActiveIndex() {
      activeIndex = wrapIndex(activeIndex, getCards().length);
    }

    function stopAnimation() {
      if (!frameId) return;
      cancelAnimationFrame(frameId);
      frameId = null;
    }

    function animateTo(targetIndex) {
      stopAnimation();
      const total = getCards().length;
      if (!total) return;

      const fromIndex = activeIndex;
      const shortestDelta = getCircularDistance(wrapIndex(targetIndex, total), fromIndex, total);
      const toIndex = fromIndex + shortestDelta;
      const duration = reducedMotion.matches ? 0 : 420;
      const startTime = performance.now();

      if (!duration) {
        activeIndex = wrapIndex(toIndex, total);
        renderDeck();
        return;
      }

      function tick(now) {
        const elapsed = Math.min((now - startTime) / duration, 1);
        activeIndex = fromIndex + shortestDelta * easeOutCubic(elapsed);
        normalizeActiveIndex();
        renderDeck();
        if (elapsed < 1) {
          frameId = requestAnimationFrame(tick);
          return;
        }
        frameId = null;
        activeIndex = wrapIndex(Math.round(toIndex), total);
        renderDeck();
      }

      frameId = requestAnimationFrame(tick);
    }

    function snapToNearest() {
      const total = getCards().length;
      if (!total) return;
      const projectedIndex = activeIndex - velocity * 0.48;
      animateTo(wrapIndex(Math.round(projectedIndex), total));
    }

    viewport.addEventListener('pointerdown', (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      if (event.target.closest('a') && event.pointerType === 'mouse') return;

      stopAnimation();
      pointerId = event.pointerId;
      startX = event.clientX;
      startIndex = activeIndex;
      lastMoveX = event.clientX;
      lastMoveTime = performance.now();
      velocity = 0;
      hasDragged = false;
      viewport.classList.add('is-dragging');
      viewport.setPointerCapture(pointerId);
    });

    viewport.addEventListener('pointermove', (event) => {
      if (event.pointerId !== pointerId) return;

      const deltaX = event.clientX - startX;
      const now = performance.now();
      const elapsed = Math.max(now - lastMoveTime, 1);

      velocity = (event.clientX - lastMoveX) / elapsed;
      activeIndex = startIndex - deltaX / DRAG_DISTANCE;
      normalizeActiveIndex();

      if (Math.abs(deltaX) > 6) hasDragged = true;

      lastMoveX = event.clientX;
      lastMoveTime = now;
      renderDeck();
    });

    function endDrag(event) {
      if (event.pointerId !== pointerId) return;
      viewport.classList.remove('is-dragging');
      if (viewport.hasPointerCapture?.(pointerId)) {
        viewport.releasePointerCapture(pointerId);
      }
      pointerId = null;
      if (hasDragged) clickSuppressed = true;
      snapToNearest();
    }

    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
    viewport.addEventListener('click', (event) => {
      if (!clickSuppressed) return;
      event.preventDefault();
      event.stopPropagation();
      clickSuppressed = false;
    }, true);

    mobileDeck.addEventListener?.('change', renderDeck);
    window.addEventListener('resize', renderDeck);

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        section.classList.toggle('is-visible', entry.isIntersecting);
        if (entry.isIntersecting) renderDeck();
      });
    }, { threshold: 0.2 });

    revealObserver.observe(section);
    requestAnimationFrame(renderDeck);
    section.dataset.closingFanReady = 'true';
  }

  function initCta() {
    const section = document.querySelector('[data-closing-cta]');
    if (!section || section.dataset.closingCtaInitialized === 'true') return;

    const revealElements = Array.from(section.querySelectorAll('[data-closing-cta-reveal]'));
    const extraElements = Array.from(section.querySelectorAll('[data-closing-cta-extra]'));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileMotion = window.matchMedia('(max-width: 768px)');
    let lineGroups = [];
    let ticking = false;

    function palette() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      return {
        white: [255, 255, 255],
        primary: isDark ? [241, 245, 249] : [10, 25, 47],
        ink: isDark ? [148, 163, 184] : [100, 116, 139],
        accent: [37, 99, 235],
        btnBgFrom: isDark ? [37, 99, 235] : [10, 25, 47],
        btnBgTo: isDark ? [29, 78, 216] : [30, 58, 95],
        btnTextFrom: isDark ? [255, 255, 255] : [255, 255, 255],
        btnTextTo: isDark ? [255, 255, 255] : [255, 255, 255],
      };
    }

    function setWipeState(progress) {
      const colors = palette();
      const isMobileMotion = mobileMotion.matches;
      const eased = isMobileMotion ? easeInOutCubic(progress) : easeOutCubic(progress);
      const wipeY = 100 - progress * 100;
      const peakHeight = isMobileMotion ? 24 : 26;
      const peak = Math.sin(progress * Math.PI) * peakHeight;

      section.style.setProperty('--closing-cta-wipe-progress', eased.toFixed(4));
      section.style.setProperty('--closing-cta-wipe-y', `${wipeY.toFixed(2)}%`);
      section.style.setProperty('--closing-cta-wipe-peak', `${peak.toFixed(2)}vh`);
      section.style.setProperty('--closing-cta-title-active-color', interpolateRgb(colors.white, colors.primary, eased));
      section.style.setProperty('--closing-cta-title-muted-color', interpolateRgb(colors.white, colors.ink, eased, 0.2));
      section.style.setProperty('--closing-cta-sub-active-color', interpolateRgb(colors.white, colors.ink, eased, 0.64));
      section.style.setProperty('--closing-cta-sub-muted-color', interpolateRgb(colors.white, colors.ink, eased, 0.18));
      section.style.setProperty('--closing-cta-btn-bg', interpolateRgb(colors.btnBgFrom, colors.btnBgFrom, eased));
      section.style.setProperty('--closing-cta-btn-color', interpolateRgb(colors.btnTextFrom, colors.btnTextTo, eased));
      section.style.setProperty('--closing-cta-extra-opacity', clamp((progress - 0.72) / 0.28, 0, 1).toFixed(3));
      section.style.setProperty('--closing-cta-extra-y', `${((1 - clamp((progress - 0.72) / 0.28, 0, 1)) * 18).toFixed(1)}px`);
    }

    function rebuild() {
      lineGroups = revealElements.map((element) => ({
        element,
        lines: buildRevealText(element),
      }));
      requestUpdate();
    }

    function revealAll() {
      lineGroups.forEach((group) => {
        group.lines.forEach((line) => setLineState(line, 1));
      });
      setWipeState(1);
    }

    function updateReveal() {
      if (reducedMotion.matches) {
        revealAll();
        extraElements.forEach((el) => {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
        ticking = false;
        return;
      }

      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const staggerRange = 0.38;
      const softness = 0.68;
      const sectionRect = section.getBoundingClientRect();
      const wipeStart = viewportHeight * (mobileMotion.matches ? 0.9 : 0.5);
      const wipeRange = viewportHeight * (mobileMotion.matches ? 0.88 : 0.5);
      const wipeProgress = clamp((wipeStart - sectionRect.top) / wipeRange, 0, 1);

      setWipeState(wipeProgress);

      lineGroups.forEach(({ element, lines }) => {
        const rect = element.getBoundingClientRect();
        const progress = mobileMotion.matches
          ? clamp((viewportHeight * 1.05 - rect.top) / (viewportHeight * 0.52), 0, 1)
          : clamp((viewportHeight * 0.94 - rect.top) / (viewportHeight * 0.62), 0, 1);
        const lastIndex = Math.max(lines.length - 1, 1);

        lines.forEach((line, index) => {
          const lineStart = (index / lastIndex) * staggerRange;
          const reveal = clamp((progress - lineStart) / softness, 0, 1);
          setLineState(line, reveal);
        });
      });

      ticking = false;
    }

    function requestUpdate() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateReveal);
      }
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    document.addEventListener('languageChanged', rebuild);

    document.querySelectorAll('.theme-switch__btn').forEach((btn) => {
      btn.addEventListener('click', () => requestAnimationFrame(requestUpdate));
    });

    setWipeState(0);
    rebuild();

    section.dataset.closingCtaInitialized = 'true';
  }

  function init() {
    initOrbit();
    initFan();
    initCta();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => Closing.init());
