/**
 * Shiftiq — Video expand al scroll
 */
(() => {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(start, end, progress) {
    return start + (end - start) * progress;
  }

  function easeInOutCubic(progress) {
    return progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function setExpanded(section, sticky) {
    section.style.setProperty('--media-x', '0px');
    section.style.setProperty('--media-y', '0px');
    section.style.setProperty('--media-width', `${sticky.clientWidth}px`);
    section.style.setProperty('--media-height', `${sticky.clientHeight}px`);
    section.style.setProperty('--media-radius', '0px');
    section.style.setProperty('--intro-opacity', '0');
    section.style.setProperty('--intro-y', '-32px');
    section.style.setProperty('--caption-opacity', '1');
    section.style.setProperty('--caption-y', '0px');
    section.style.setProperty('--media-overlay-opacity', '0.82');
  }

  function attachVideoExpandEffect(section) {
    if (section.dataset.videoExpandInitialized === 'true') return;

    const sticky = section.querySelector('[data-video-expand-sticky]');
    const placeholder = section.querySelector('[data-video-expand-placeholder]');
    const media = section.querySelector('[data-video-expand-media]');

    if (!sticky || !placeholder || !media) return;

    let ticking = false;

    function update() {
      if (prefersReducedMotion()) {
        setExpanded(section, sticky);
        ticking = false;
        return;
      }

      const sectionRect = section.getBoundingClientRect();
      const stickyRect = sticky.getBoundingClientRect();
      const placeholderRect = placeholder.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollableDistance = Math.max(section.offsetHeight - viewportHeight, 1);

      const rawProgress = clamp((-sectionRect.top / scrollableDistance) * 1.8, 0, 1);
      const progress = easeInOutCubic(rawProgress);

      const start = {
        x: placeholderRect.left - stickyRect.left,
        y: placeholderRect.top - stickyRect.top,
        width: placeholderRect.width,
        height: placeholderRect.height,
        radius: 32,
      };

      const end = {
        x: 0,
        y: 0,
        width: stickyRect.width,
        height: stickyRect.height,
        radius: 0,
      };

      section.style.setProperty('--media-x', `${lerp(start.x, end.x, progress)}px`);
      section.style.setProperty('--media-y', `${lerp(start.y, end.y, progress)}px`);
      section.style.setProperty('--media-width', `${lerp(start.width, end.width, progress)}px`);
      section.style.setProperty('--media-height', `${lerp(start.height, end.height, progress)}px`);
      section.style.setProperty('--media-radius', `${lerp(start.radius, end.radius, progress)}px`);

      section.style.setProperty('--intro-opacity', String(clamp(1 - rawProgress * 2.2, 0, 1)));
      section.style.setProperty('--intro-y', `${rawProgress * -32}px`);

      const captionOpacity = clamp((rawProgress - 0.62) / 0.28, 0, 1);
      section.style.setProperty('--caption-opacity', String(captionOpacity));
      section.style.setProperty('--caption-y', `${lerp(24, 0, captionOpacity)}px`);
      section.style.setProperty(
        '--media-overlay-opacity',
        String(clamp((rawProgress - 0.35) / 0.45, 0, 0.82))
      );

      ticking = false;
    }

    function requestUpdate() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    update();

    section.dataset.videoExpandInitialized = 'true';
  }

  function init() {
    document.querySelectorAll('[data-video-expand-section]').forEach(attachVideoExpandEffect);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
