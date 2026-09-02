/**
 * Shiftiq — Pricing (estilo Viora)
 * Flechas = segmentos (1/2). Mensual/Anual = precio del segmento activo.
 */
const Pricing = (() => {
  const SEGMENTS = [
    { segment: 'b2b', index: 0 },
    { segment: 'b2c', index: 1 },
  ];

  function init() {
    const root = document.querySelector('[data-pricing]');
    if (!root) return;

    const panels = [...root.querySelectorAll('[data-pricing-panel]')];
    const prevBtn = root.querySelector('[data-pricing-prev]');
    const nextBtn = root.querySelector('[data-pricing-next]');
    const counter = root.querySelector('[data-pricing-counter]');
    const billingWrap = root.querySelector('[data-pricing-billing]');
    const billingBtns = [...root.querySelectorAll('[data-billing]')];
    const boletoFigure = root.querySelector('[data-pricing-boleto]');
    const card = root.querySelector('[data-pricing-card]');
    const content = root.querySelector('.pricing__content');

    let segmentSlide = 0;
    let billing = 'monthly';
    let animating = false;

    function lang() {
      return document.documentElement.lang === 'en' ? 'en' : 'es';
    }

    function currentMeta() {
      return SEGMENTS[segmentSlide];
    }

    function getActivePanel() {
      const { segment, index } = currentMeta();
      return panels.find((p) => p.dataset.segment === segment && Number(p.dataset.index) === index);
    }

    function setSegmentTheme(segment) {
      if (card) card.dataset.pricingSegment = segment;
      root.dataset.pricingSegment = segment;
    }

    function updateBillingVisibility() {
      const panel = getActivePanel();
      const hideBilling = panel?.hasAttribute('data-no-billing');
      if (billingWrap) {
        billingWrap.hidden = hideBilling;
        billingWrap.style.visibility = hideBilling ? 'hidden' : 'visible';
      }
    }

    function updatePrices() {
      const panel = getActivePanel();
      if (!panel) return;

      const amount = panel.querySelector('.pricing-panel__amount');
      const period = panel.querySelector('.pricing-panel__period');
      const notes = panel.querySelectorAll('[data-pricing-annual-note]');

      if (!amount) return;

      const monthly = amount.dataset.priceMonthly;
      const annual = amount.dataset.priceAnnual;

      if (panel.hasAttribute('data-no-billing') || !monthly) return;

      if (billing === 'annual' && annual) {
        amount.textContent = annual;
        if (period) period.textContent = lang() === 'en' ? '/year' : '/año';
        notes.forEach((n) => { n.hidden = false; });
      } else {
        amount.textContent = monthly;
        if (period) period.textContent = lang() === 'en' ? '/mo' : '/mes';
        notes.forEach((n) => { n.hidden = true; });
      }
    }

    function animateBoleto() {
      if (!boletoFigure) return;
      boletoFigure.classList.remove('is-changing');
      void boletoFigure.offsetWidth;
      boletoFigure.classList.add('is-changing');
    }

    function applyState() {
      const { segment } = currentMeta();
      const activePanel = getActivePanel();

      panels.forEach((p) => {
        const active = p === activePanel;
        p.classList.remove('is-entering', 'is-exiting', 'is-exiting-left', 'is-entering-left');
        p.classList.toggle('is-active', active);
        p.setAttribute('aria-hidden', active ? 'false' : 'true');
      });

      setSegmentTheme(segment);

      if (counter) counter.textContent = `${segmentSlide + 1}/${SEGMENTS.length}`;

      billingBtns.forEach((btn) => {
        btn.classList.toggle('is-active', btn.dataset.billing === billing);
      });

      updateBillingVisibility();
      updatePrices();
    }

    function animateTransition(nextSlide, dir) {
      if (animating || nextSlide === segmentSlide) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        segmentSlide = nextSlide;
        applyState();
        return;
      }

      const current = getActivePanel();
      segmentSlide = nextSlide;
      const nextMeta = currentMeta();
      const nextPanel = getActivePanel();

      if (!current || !nextPanel) {
        applyState();
        return;
      }

      animating = true;

      const exitClass = dir > 0 ? 'is-exiting' : 'is-exiting-left';
      const enterClass = dir > 0 ? 'is-entering' : 'is-entering-left';

      current.classList.add(exitClass);
      current.classList.remove('is-active');

      setSegmentTheme(nextMeta.segment);

      nextPanel.classList.add(enterClass, 'is-active');
      nextPanel.setAttribute('aria-hidden', 'false');

      animateBoleto();
      content?.classList.add('is-switching');

      prevBtn?.classList.add('is-pressed');
      nextBtn?.classList.add('is-pressed');
      window.setTimeout(() => {
        prevBtn?.classList.remove('is-pressed');
        nextBtn?.classList.remove('is-pressed');
      }, 280);

      window.setTimeout(() => {
        panels.forEach((p) => {
          p.classList.remove('is-entering', 'is-exiting', 'is-exiting-left', 'is-entering-left', 'is-active');
          p.setAttribute('aria-hidden', 'true');
        });

        nextPanel.classList.add('is-active');
        nextPanel.classList.remove(enterClass);
        nextPanel.setAttribute('aria-hidden', 'false');

        if (counter) counter.textContent = `${segmentSlide + 1}/${SEGMENTS.length}`;

        billingBtns.forEach((btn) => {
          btn.classList.toggle('is-active', btn.dataset.billing === billing);
        });

        updateBillingVisibility();
        updatePrices();
        content?.classList.remove('is-switching');
        animating = false;
      }, 420);
    }

    function goToSegment(next, dir) {
      const wrapped = (next + SEGMENTS.length) % SEGMENTS.length;
      animateTransition(wrapped, dir);
    }

    prevBtn?.addEventListener('click', () => goToSegment(segmentSlide - 1, -1));
    nextBtn?.addEventListener('click', () => goToSegment(segmentSlide + 1, 1));

    billingBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        billing = btn.dataset.billing;
        applyState();
      });
    });

    document.addEventListener('languageChanged', applyState);

    applyState();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => Pricing.init());
