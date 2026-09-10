/**
 * Shiftiq — Segmentos scroll-story
 * Talleres (navy) + Propietarios (gold)
 */
const SegmentsScroll = (() => {
  const STICKY_OFFSET = 96;
  const VISUAL_SLOT_SPACING = 1.28;
  const TEXT_SWITCH_RATIO = 0.42;

  const STORY_CONFIG = {
    b2b: {
      tagKey: 'segments.b2b.tag',
      steps: [
        { image: 'assets/icons/solution/dashboard.png', title: 'segments.b2b.s1.title', text: 'segments.b2b.s1.text', b1: 'segments.b2b.s1.b1', b2: 'segments.b2b.s1.b2', b3: 'segments.b2b.s1.b3', cta: 'segments.b2b.s1.cta' },
        { image: 'assets/icons/solution/obd.png', title: 'segments.b2b.s2.title', text: 'segments.b2b.s2.text', b1: 'segments.b2b.s2.b1', b2: 'segments.b2b.s2.b2', b3: 'segments.b2b.s2.b3', cta: 'segments.b2b.s2.cta' },
        { image: 'assets/icons/solution/inventory.png', title: 'segments.b2b.s3.title', text: 'segments.b2b.s3.text', b1: 'segments.b2b.s3.b1', b2: 'segments.b2b.s3.b2', b3: 'segments.b2b.s3.b3', cta: 'segments.b2b.s3.cta' },
        { image: 'assets/icons/solution/work-order.png', title: 'segments.b2b.s4.title', text: 'segments.b2b.s4.text', b1: 'segments.b2b.s4.b1', b2: 'segments.b2b.s4.b2', b3: 'segments.b2b.s4.b3', cta: 'segments.b2b.s4.cta' },
      ],
    },
    b2c: {
      tagKey: 'segments.b2c.tag',
      steps: [
        { image: 'assets/icons/solution/mobile-app.png', title: 'segments.b2c.s1.title', text: 'segments.b2c.s1.text', b1: 'segments.b2c.s1.b1', b2: 'segments.b2c.s1.b2', b3: 'segments.b2c.s1.b3', cta: 'segments.b2c.s1.cta' },
        { image: 'assets/icons/solution/obd.png', title: 'segments.b2c.s2.title', text: 'segments.b2c.s2.text', b1: 'segments.b2c.s2.b1', b2: 'segments.b2c.s2.b2', b3: 'segments.b2c.s2.b3', cta: 'segments.b2c.s2.cta' },
        { image: 'assets/icons/solution/work-order.png', title: 'segments.b2c.s3.title', text: 'segments.b2c.s3.text', b1: 'segments.b2c.s3.b1', b2: 'segments.b2c.s3.b2', b3: 'segments.b2c.s3.b3', cta: 'segments.b2c.s3.cta' },
        { image: 'assets/icons/solution/mobile-app.png', title: 'segments.b2c.s4.title', text: 'segments.b2c.s4.text', b1: 'segments.b2c.s4.b1', b2: 'segments.b2c.s4.b2', b3: 'segments.b2c.s4.b3', cta: 'segments.b2c.s4.cta' },
      ],
    },
  };

  function t(key, fallback = '') {
    if (typeof I18n !== 'undefined' && typeof I18n.t === 'function') {
      const value = I18n.t(key);
      if (value) return value;
    }
    return fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function formatCounter(index) {
    return String(index + 1).padStart(2, '0');
  }

  function getStepText(storyKey, index) {
    const config = STORY_CONFIG[storyKey];
    const step = config.steps[index];
    return {
      eyebrow: t(config.tagKey),
      title: t(step.title),
      description: t(step.text),
      bullets: [t(step.b1), t(step.b2), t(step.b3)].filter(Boolean),
      cta: t(step.cta),
    };
  }

  function createVisualMarkup(config) {
    return `
      <div class="segment-story__image-stage">
        <div class="segment-story__image-track">
          ${config.steps.map((step, stepIndex) => `
            <div class="segment-story__image-slot" style="--segment-slot-index: ${stepIndex};" data-segment-slot="${stepIndex}">
              <div class="segment-story__visual-plate">
                <img class="segment-story__character" src="${step.image}" alt="" loading="lazy" aria-hidden="true" />
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderDots(container, count, activeIndex) {
    if (!container) return;
    container.innerHTML = Array.from({ length: count }, (_, index) => (
      `<button type="button" class="segment-story__dot${index === activeIndex ? ' segment-story__dot--active' : ''}" data-segment-dot="${index}" aria-label="Paso ${index + 1}"></button>`
    )).join('');
  }

  function renderBullets(list, bullets) {
    if (!list) return;
    list.innerHTML = bullets.map((bullet) => `<li>${bullet}</li>`).join('');
  }

  function renderStep(section, storyKey, index, force = false) {
    const config = STORY_CONFIG[storyKey];
    const text = getStepText(storyKey, index);
    const eyebrow = section.querySelector('[data-segment-eyebrow]');
    const title = section.querySelector('[data-segment-title]');
    const description = section.querySelector('[data-segment-description]');
    const bullets = section.querySelector('[data-segment-bullets]');
    const cta = section.querySelector('[data-segment-cta]');
    const current = section.querySelector('[data-segment-current]');
    const dots = section.querySelector('[data-segment-dots]');
    const content = section.querySelector('.segment-story__content');

    const update = () => {
      if (eyebrow) eyebrow.textContent = text.eyebrow;
      if (title) title.textContent = text.title;
      if (description) description.textContent = text.description;
      if (cta) cta.textContent = text.cta;
      if (current) current.textContent = formatCounter(index);
      renderBullets(bullets, text.bullets);
      renderDots(dots, config.steps.length, index);
      section.dataset.activeSegmentStep = String(index);
      section.querySelectorAll('[data-segment-slot]').forEach((slot) => {
        const slotIndex = Number(slot.dataset.segmentSlot);
        slot.classList.toggle('is-active', slotIndex === index);
        slot.classList.toggle('is-near', Math.abs(slotIndex - index) === 1);
      });
    };

    if (force) {
      update();
      return;
    }

    content?.classList.add('segment-story__content--switching');
    window.setTimeout(() => {
      update();
      content?.classList.remove('segment-story__content--switching');
    }, 180);
  }

  function createMobileCard(storyKey, index) {
    const config = STORY_CONFIG[storyKey];
    const text = getStepText(storyKey, index);
    const step = config.steps[index];
    const bullets = text.bullets.map((bullet) => `<li>${bullet}</li>`).join('');

    return `
      <article class="segment-story__mobile-card">
        <div class="segment-story__mobile-visual" aria-hidden="true">
          <div class="segment-story__visual-plate">
            <img class="segment-story__mobile-character" src="${step.image}" alt="" loading="lazy" />
          </div>
        </div>
        <div class="segment-story__mobile-content">
          <span class="segment-story__mobile-count">${formatCounter(index)} / ${String(config.steps.length).padStart(2, '0')}</span>
          <h3>${text.title}</h3>
          <p>${text.description}</p>
          <ul>${bullets}</ul>
          <a class="segment-story__cta" href="#planes">${text.cta}</a>
        </div>
      </article>
    `;
  }

  function renderMobileList(section, storyKey) {
    const config = STORY_CONFIG[storyKey];
    const list = section.querySelector('[data-segment-mobile-list]');
    if (!list) return;
    list.innerHTML = config.steps.map((_, index) => createMobileCard(storyKey, index)).join('');
  }

  function scrollToStep(section, config, index) {
    const target = clamp(index, 0, config.steps.length - 1);
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const scrollableDistance = Math.max(section.offsetHeight - viewportHeight, 1);
    const maxStep = Math.max(config.steps.length - 1, 1);
    const progress = target / maxStep;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const targetTop = sectionTop - STICKY_OFFSET + progress * scrollableDistance;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  }

  function attachSegmentStory(section) {
    if (!section || section.dataset.segmentStoryInitialized === 'true') return;

    const storyKey = section.dataset.segmentStory;
    const config = STORY_CONFIG[storyKey];
    if (!config) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let ticking = false;

    function updateFromScroll() {
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const rect = section.getBoundingClientRect();
      const scrollableDistance = Math.max(section.offsetHeight - viewportHeight, 1);
      const scrolled = clamp(-rect.top + STICKY_OFFSET, 0, scrollableDistance);
      const progress = clamp(scrolled / scrollableDistance, 0, 1);
      const maxVisualStep = config.steps.length - 1;
      const visualTrackPosition = progress * maxVisualStep * VISUAL_SLOT_SPACING;
      const visualStepPosition = visualTrackPosition / VISUAL_SLOT_SPACING;
      const activeIndex = clamp(
        Math.floor(visualStepPosition + TEXT_SWITCH_RATIO),
        0,
        config.steps.length - 1
      );
      const currentIndex = Number(section.dataset.activeSegmentStep || 0);
      const renderedTrackPosition = reducedMotion.matches
        ? activeIndex * VISUAL_SLOT_SPACING
        : visualTrackPosition;

      section.style.setProperty('--segment-track-position', renderedTrackPosition.toFixed(3));
      section.style.setProperty('--segment-visual-scale', '1');

      if (activeIndex !== currentIndex) {
        renderStep(section, storyKey, activeIndex);
      }

      ticking = false;
    }

    function requestUpdate() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateFromScroll);
      }
    }

    function rebuild() {
      const activeIndex = Number(section.dataset.activeSegmentStep || 0);
      const visual = section.querySelector('[data-segment-visual]');

      if (visual && visual.dataset.segmentVisualRendered !== 'true') {
        visual.innerHTML = createVisualMarkup(config);
        visual.dataset.segmentVisualRendered = 'true';
      }

      renderStep(section, storyKey, activeIndex, true);
      renderMobileList(section, storyKey);
      requestUpdate();
      if (window.lucide) lucide.createIcons();
    }

    section.querySelector('[data-segment-dots]')?.addEventListener('click', (event) => {
      const dot = event.target.closest('[data-segment-dot]');
      if (!dot) return;
      scrollToStep(section, config, Number(dot.dataset.segmentDot));
    });

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    document.addEventListener('languageChanged', () => {
      renderStep(section, storyKey, Number(section.dataset.activeSegmentStep || 0), true);
      renderMobileList(section, storyKey);
    });

    section.dataset.activeSegmentStep = '0';
    rebuild();
    section.dataset.segmentStoryInitialized = 'true';
  }

  function init() {
    document.querySelectorAll('[data-segment-story]').forEach(attachSegmentStory);
    if (window.lucide) lucide.createIcons();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => SegmentsScroll.init());
