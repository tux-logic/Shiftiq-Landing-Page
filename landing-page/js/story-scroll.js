/**
 * Shiftiq — Story scroll (cards fan out on scroll)
 */
const StoryScroll = (() => {
  const SPREAD_END = 0.55;
  const TEXT_BREAKS = [0, 0.38, 0.72];

  function easeOutCubic(t) {
    return 1 - (1 - t) ** 3;
  }

  function init() {
    const section = document.querySelector('[data-story-scroll]');
    const track = document.querySelector('[data-story-track]');
    const cards = {
      left: document.querySelector('[data-story-card="left"]'),
      center: document.querySelector('[data-story-card="center"]'),
      right: document.querySelector('[data-story-card="right"]'),
    };
    const texts = [...document.querySelectorAll('[data-story-text]')];

    if (!section || !track || !cards.center) return;

    function getProgress() {
      const rect = track.getBoundingClientRect();
      const scrollable = track.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return 0;
      return Math.max(0, Math.min(1, -rect.top / scrollable));
    }

    function updateText(p) {
      let active = 0;
      if (p >= TEXT_BREAKS[2]) active = 2;
      else if (p >= TEXT_BREAKS[1]) active = 1;

      texts.forEach((el, i) => {
        const isActive = i === active;
        el.classList.toggle('is-active', isActive);
        el.classList.toggle('is-exiting', i < active);
      });
    }

    function updateCards(p) {
      const spread = easeOutCubic(Math.min(1, p / SPREAD_END));
      const sideOffset = spread * 118;
      const centerScale = 1.04 - spread * 0.04;
      const sideScale = 0.82 + spread * 0.1;
      const stackOffset = (1 - spread) * 18;
      const sideRotate = spread * 6;

      if (cards.left) {
        cards.left.style.transform = [
          `translate(calc(-50% - ${sideOffset}% + ${stackOffset * 0.5}px), calc(-50% + ${(1 - spread) * 6}px))`,
          `scale(${sideScale})`,
          `rotateY(${sideRotate}deg)`,
        ].join(' ');
        cards.left.style.opacity = String(0.25 + spread * 0.75);
        cards.left.style.zIndex = spread > 0.12 ? '2' : '1';
        cards.left.classList.toggle('is-hero', spread > 0.85);
      }

      if (cards.center) {
        cards.center.style.transform = [
          `translate(-50%, calc(-50% - ${spread * 4}px))`,
          `scale(${centerScale})`,
        ].join(' ');
        cards.center.style.zIndex = '3';
        cards.center.classList.toggle('is-hero', spread < 0.85);
      }

      if (cards.right) {
        cards.right.style.transform = [
          `translate(calc(-50% + ${sideOffset}% - ${stackOffset * 0.5}px), calc(-50% + ${(1 - spread) * 6}px))`,
          `scale(${sideScale})`,
          `rotateY(-${sideRotate}deg)`,
        ].join(' ');
        cards.right.style.opacity = String(0.25 + spread * 0.75);
        cards.right.style.zIndex = spread > 0.12 ? '2' : '1';
        cards.right.classList.toggle('is-hero', spread > 0.85);
      }

      track.style.setProperty('--story-spread', spread);
    }

    function onScroll() {
      const p = getProgress();
      updateText(p);
      updateCards(p);
    }

    function applyHeight() {
      const vh = window.innerWidth < 768 ? 220 : 260;
      track.style.height = `${vh}vh`;
    }

    applyHeight();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      applyHeight();
      onScroll();
    }, { passive: true });

    onScroll();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => StoryScroll.init());

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('[data-story-scroll]').forEach((el) => {
    el.classList.add('story-scroll--reduced');
  });
}
