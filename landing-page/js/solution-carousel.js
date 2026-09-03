/**
 * Shiftiq — Solution infinite spotlight carousel
 */
const SolutionCarousel = (() => {
  const TRANSITION_MS = 600;
  const AUTO_MS = 5800;
  let interval = null;

  function init() {
    const root = document.querySelector('[data-solution-carousel]');
    if (!root) return;

    const viewport = root.querySelector('.sol-carousel__viewport');
    const track = root.querySelector('.sol-carousel__track');
    const prevBtn = root.querySelector('[data-sol-prev]');
    const nextBtn = root.querySelector('[data-sol-next]');

    const originals = [...track.children].map((node) => node.cloneNode(true));
    const REAL = originals.length;
    if (!REAL) return;

    track.innerHTML = '';
    for (let r = 0; r < 3; r += 1) {
      originals.forEach((node, i) => {
        const clone = node.cloneNode(true);
        clone.dataset.realIndex = String(i);
        track.appendChild(clone);
      });
    }

    let cards = [...track.querySelectorAll('.sol-card')];
    let current = REAL;
    let isAnimating = false;

    function realIndex() {
      return ((current % REAL) + REAL) % REAL;
    }

    function getOffset(index) {
      const card = cards[index];
      if (!card || !viewport) return 0;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      return cardCenter - viewport.offsetWidth / 2;
    }

    function applyTransform(index, animate = true) {
      track.style.transition = animate
        ? `transform ${TRANSITION_MS}ms cubic-bezier(0.25, 0.1, 0.25, 1)`
        : 'none';
      track.style.transform = `translateX(${-getOffset(index)}px)`;
    }

    function updateState() {
      cards.forEach((card, i) => {
        const dist = Math.abs(i - current);
        card.classList.toggle('is-active', i === current);
        card.classList.toggle('is-adjacent', dist === 1);
        card.classList.toggle('is-near', dist === 2);
      });
    }

    function snapIfNeeded() {
      if (current >= REAL * 2) {
        current -= REAL;
        applyTransform(current, false);
      } else if (current < REAL) {
        current += REAL;
        applyTransform(current, false);
      }
      updateState();
      isAnimating = false;
    }

    function goTo(index, animate = true) {
      if (isAnimating && animate) return;
      current = index;
      updateState();
      applyTransform(current, animate);

      if (animate) {
        isAnimating = true;
        clearTimeout(track._snapTimer);
        track._snapTimer = setTimeout(snapIfNeeded, TRANSITION_MS + 40);
      } else {
        isAnimating = false;
      }
    }

    function goToReal(targetReal) {
      if (targetReal === realIndex()) return;
      current = REAL + targetReal;
      updateState();
      applyTransform(current, false);
      resetAuto();
    }

    function next() {
      goTo(current + 1);
      resetAuto();
    }

    function prev() {
      goTo(current - 1);
      resetAuto();
    }

    function resetAuto() {
      clearInterval(interval);
      interval = setInterval(next, AUTO_MS);
    }

    function bindClicks() {
      cards.forEach((card, i) => {
        card.querySelector('.sol-card__btn')?.addEventListener('click', () => {
          if (i !== current) {
            goTo(i);
            resetAuto();
          }
        });
      });
    }

    function bindSwipe() {
      let startX = 0;
      let startY = 0;

      viewport.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }, { passive: true });

      viewport.addEventListener('touchend', (e) => {
        const dx = startX - e.changedTouches[0].clientX;
        const dy = Math.abs(startY - e.changedTouches[0].clientY);
        if (Math.abs(dx) > 45 && dy < 60) {
          if (dx > 0) next();
          else prev();
        }
      }, { passive: true });
    }

    bindClicks();
    bindSwipe();

    if (window.lucide) {
      lucide.createIcons({
        attrs: {
          'stroke-width': 1.5,
        },
      });
    }

    prevBtn?.addEventListener('click', prev);
    nextBtn?.addEventListener('click', next);

    root.addEventListener('mouseenter', () => clearInterval(interval));
    root.addEventListener('mouseleave', resetAuto);

    track.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'transform') snapIfNeeded();
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => applyTransform(current, false), 80);
    });

    requestAnimationFrame(() => {
      goTo(current, false);
      requestAnimationFrame(() => applyTransform(current, false));
    });

    resetAuto();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => SolutionCarousel.init());
