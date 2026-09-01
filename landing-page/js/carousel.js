/**
 * Shiftiq — Carousel (vanilla JS)
 */
const Carousel = (() => {
  const instances = new Map();

  function initCarousel(el) {
    const id = el.dataset.carousel;
    const slides = [...el.querySelectorAll('.carousel__slide')];
    const dotsContainer = el.querySelector(`[data-dots="${id}"]`);
    const prevBtn = el.querySelector('.carousel__btn--prev');
    const nextBtn = el.querySelector('.carousel__btn--next');
    let current = 0;
    let interval = null;

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('active', i === current));
      if (dotsContainer) {
        dotsContainer.querySelectorAll('.carousel__dot').forEach((d, i) => {
          d.classList.toggle('active', i === current);
        });
      }
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'carousel__dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => { goTo(i); resetAuto(); });
        dotsContainer.appendChild(dot);
      });
    }

    prevBtn?.addEventListener('click', () => { prev(); resetAuto(); });
    nextBtn?.addEventListener('click', () => { next(); resetAuto(); });

    function startAuto() {
      if (id === 'solution') {
        interval = setInterval(next, 5000);
      }
    }

    function resetAuto() {
      clearInterval(interval);
      startAuto();
    }

    startAuto();
    instances.set(id, { goTo, next, prev });
  }

  function init() {
    document.querySelectorAll('[data-carousel]').forEach(initCarousel);
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => Carousel.init());
