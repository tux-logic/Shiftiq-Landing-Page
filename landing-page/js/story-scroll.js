/**
 * Shiftiq — Story scroll (cards fan out + texto reveal estilo Viora)
 */
const StoryScroll = (() => {
  const SPREAD_END = 0.55;
  const TEXT_BREAKS = [0, 0.38, 0.72];

  let revealApis = new Map();
  let lastActive = -1;
  let animatingText = false;

  function easeOutCubic(t) {
    return 1 - (1 - t) ** 3;
  }

  function initTextReveals() {
    document.querySelectorAll('[data-story-reveal]').forEach((el) => {
      revealApis.set(el, ScrollTextReveal.attach(el));
    });
  }

  async function playActiveText(index) {
    if (animatingText || index === lastActive) return;
    lastActive = index;

    const block = document.querySelector(`[data-story-text="${index}"]`);
    if (!block) return;

    const title = block.querySelector('.story-text__title');
    const desc = block.querySelector('.story-text__desc');
    if (!title || !desc) return;

    animatingText = true;

    revealApis.get(title)?.rebuild();
    revealApis.get(desc)?.rebuild();

    await revealApis.get(title)?.playIn(0);
    await revealApis.get(desc)?.playIn(80);

    animatingText = false;
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

    initTextReveals();

    ScrollTextReveal.observeEntrance([section], () => {
      section.classList.add('is-inview');
      lastActive = -1;
      playActiveText(0);
    });

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

      if (section.classList.contains('is-inview') && active !== lastActive) {
        playActiveText(active);
      }
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
      const vh = window.innerWidth < 768 ? 240 : 280;
      track.style.height = `${vh}vh`;
    }

    applyHeight();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      applyHeight();
      onScroll();
    }, { passive: true });

    document.addEventListener('languageChanged', () => {
      revealApis.forEach((api) => api.rebuild());
      lastActive = -1;
      const p = getProgress();
      let active = 0;
      if (p >= TEXT_BREAKS[2]) active = 2;
      else if (p >= TEXT_BREAKS[1]) active = 1;
      playActiveText(active);
    });

    onScroll();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-story-scroll]').forEach((el) => {
      el.classList.add('story-scroll--reduced');
    });
  }
  StoryScroll.init();
});
