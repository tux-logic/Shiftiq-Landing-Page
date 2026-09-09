/**
 * Shiftiq — Hero: parallax + escritura progresiva del copy
 */
const HeroSection = (() => {
  const MAX_MOVE = 14;
  let typewriterSession = 0;
  let typewriterTimer = null;
  let heroCopy = { title: '', subtitle: '' };
  let i18nHandled = false;

  function captureCopyFromDom() {
    const title = document.querySelector('[data-hero-type="title"]');
    const subtitle = document.querySelector('[data-hero-type="subtitle"]');
    if (!title || !subtitle) return false;

    heroCopy = {
      title: title.textContent.trim(),
      subtitle: subtitle.textContent.trim(),
    };
    return Boolean(heroCopy.title);
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

      const finish = () => {
        element.classList.remove('is-typing');
        resolve();
      };

      const step = () => {
        if (session !== typewriterSession) {
          finish();
          return;
        }

        if (index < text.length) {
          element.textContent += text.charAt(index);
          index += 1;
          typewriterTimer = window.setTimeout(step, charDelay);
          return;
        }

        finish();
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
    if (!title || !subtitle || !actions || !heroCopy.title) return;

    typewriterSession += 1;
    if (typewriterTimer) window.clearTimeout(typewriterTimer);

    const titleText = heroCopy.title;
    const subtitleText = heroCopy.subtitle;
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
      hero.dataset.typewriterDone = 'true';
      return;
    }

    await typeText(title, titleText, 32);
    title.classList.add('is-typed');
    await wait(280);
    await typeText(subtitle, subtitleText, 14);
    subtitle.classList.add('is-typed');
    await wait(160);

    content?.classList.add('is-complete');
    actions.classList.add('is-visible');
    hero.dataset.typewriterDone = 'true';
  }

  function initParallax() {
    const hero = document.querySelector('.hero');
    const bg = document.querySelector('[data-hero-bg]');
    if (!hero || !bg || hero.dataset.heroReady === 'true') return;

    const video = bg.querySelector('.hero__video');
    if (video) {
      video.playsInline = true;
      video.muted = true;
      const play = () => {
        const p = video.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      };
      if (video.readyState >= 2) play();
      else video.addEventListener('canplay', play, { once: true });
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (video) {
        video.pause();
        video.removeAttribute('autoplay');
      }
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
      i18nHandled = true;
      captureCopyFromDom();
      runTypewriter();
    });

    window.setTimeout(() => {
      if (i18nHandled) return;
      if (captureCopyFromDom()) {
        runTypewriter();
      }
    }, 2500);
  }

  function init() {
    initParallax();
    initTypewriter();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => HeroSection.init());
