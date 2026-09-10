/**
 * Shiftiq — Parallax en splits resultados / marketplace
 */
(() => {
  const VIDEO_PARALLAX_STRENGTH = 2.4;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function attachOutcomesParallax(section) {
    if (section.dataset.outcomesParallaxInitialized === 'true') return;

    const videos = section.querySelectorAll('[data-outcomes-parallax-video]');
    if (!videos.length) return;

    let ticking = false;

    function updateParallax() {
      if (prefersReducedMotion()) {
        videos.forEach((video) => {
          video.style.setProperty('--outcomes-parallax-y', '0px');
        });
        ticking = false;
        return;
      }

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const progress = clamp(
        (viewportHeight - rect.top) / (viewportHeight + rect.height),
        0,
        1
      );
      const centeredProgress = progress - 0.5;

      videos.forEach((video) => {
        const media = video.closest('.sol-split__media, .solution-results__media, .solution-marketplace__media');
        const isBottom = Boolean(
          media?.classList.contains('solution-marketplace__media') ||
          media?.classList.contains('sol-split__media--from-right')
        );
        const direction = isBottom ? 1 : -1;
        const maxTravel = Math.max((video.offsetHeight - (media?.clientHeight || 0)) / 2, 0);
        const translateY = centeredProgress * maxTravel * VIDEO_PARALLAX_STRENGTH * direction;
        video.style.setProperty('--outcomes-parallax-y', `${translateY.toFixed(2)}px`);
      });

      ticking = false;
    }

    function requestUpdate() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateParallax);
      }
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    updateParallax();

    section.dataset.outcomesParallaxInitialized = 'true';
  }

  function init() {
    document.querySelectorAll('[data-outcomes-parallax-section]').forEach(attachOutcomesParallax);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
