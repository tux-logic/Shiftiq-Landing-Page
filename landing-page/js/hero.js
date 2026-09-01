/**
 * Shiftiq — Hero: parallax + escritura progresiva del copy
 */
const HeroSection = (() => {
  const MAX_MOVE = 14;
  let typewriterSession = 0;
  let typewriterTimer = null;

  function syncFullText() {
    const title = document.querySelector('[data-hero-type="title"]');
    const subtitle = document.querySelector('[data-hero-type="subtitle"]');
    if (title) title.dataset.fullText = title.textContent.trim();
    if (subtitle) subtitle.dataset.fullText = subtitle.textContent.trim();
  }

  function typeText(element, text, charDelay) {
    return new Promise((resolve) => {
      const session = typewriterSession;
      element.textContent = '';
      element.classList.add('is-typing');
      element.setAttribute('aria-label', text);

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        element.textContent = text;
        element.classList.remove('is-typing');
        resolve();
        return;
      }

      let index = 0;

      const step = () => {
        if (session !== typewriterSession) return;

        if (index < text.length) {
          element.textContent += text.charAt(index);
          index += 1;
          typewriterTimer = window.setTimeout(step, charDelay);
          return;
        }

        element.classList.remove('is-typing');
        resolve();
      };

      step();
    });
  }

  function wait(ms) {
    return new Promise((resolve) => {
      typewriterTimer = window.setTimeout(resolve, ms);
    });
  }

  async function runTypewriter() {
    const hero = document.querySelector('.hero');
    const content = document.querySelector('[data-hero-content]');
    const title = document.querySelector('[data-hero-type="title"]');
    const subtitle = document.querySelector('[data-hero-type="subtitle"]');
    const actions = document.querySelector('[data-hero-actions]');
    if (!title || !subtitle || !actions) return;

    typewriterSession += 1;
    if (typewriterTimer) window.clearTimeout(typewriterTimer);

    syncFullText();

    const titleText = title.dataset.fullText || '';
    const subtitleText = subtitle.dataset.fullText || '';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    actions.classList.remove('is-visible');
    subtitle.textContent = '';
    subtitle.classList.remove('is-typing', 'is-typed');
    title.textContent = '';
    title.classList.remove('is-typing', 'is-typed');
    content?.classList.remove('is-complete');

    if (reduced) {
      title.textContent = titleText;
      subtitle.textContent = subtitleText;
      content?.classList.add('is-complete');
      actions.classList.add('is-visible');
      if (hero) hero.dataset.typewriterDone = 'true';
      return;
    }

    await typeText(title, titleText, 38);
    title.classList.add('is-typed');
    await wait(320);
    await typeText(subtitle, subtitleText, 16);
    subtitle.classList.add('is-typed');
    await wait(180);

    content?.classList.add('is-complete');
    actions.classList.add('is-visible');
    if (hero) hero.dataset.typewriterDone = 'true';
  }

  function initParallax() {
    const hero = document.querySelector('.hero');
    const bg = document.querySelector('[data-hero-bg]');
    if (!hero || !bg || hero.dataset.heroReady === 'true') return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      hero.dataset.heroReady = 'true';
      return;
    }

    hero.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      bg.style.setProperty('--hero-bg-x', `${(x * MAX_MOVE).toFixed(2)}px`);
      bg.style.setProperty('--hero-bg-y', `${(y * MAX_MOVE).toFixed(2)}px`);
    });

    hero.addEventListener('pointerleave', () => {
      bg.style.setProperty('--hero-bg-x', '0px');
      bg.style.setProperty('--hero-bg-y', '0px');
    });

    hero.dataset.heroReady = 'true';
  }

  function initTypewriter() {
    document.addEventListener('languageChanged', () => {
      runTypewriter();
    });

    window.setTimeout(() => {
      const hero = document.querySelector('.hero');
      if (hero && hero.dataset.typewriterDone !== 'true') {
        runTypewriter();
      }
    }, 900);
  }

  function init() {
    initParallax();
    initTypewriter();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => HeroSection.init());
