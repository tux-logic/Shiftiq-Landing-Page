/**
 * Shiftiq — Pricing section (segment tabs, plan carousel, billing toggle)
 */
const Pricing = (() => {
  const SEGMENT_COUNTS = { b2b: 3, b2c: 3 };

  function init() {
    const root = document.querySelector('[data-pricing]');
    if (!root) return;

    const panels = [...root.querySelectorAll('[data-pricing-panel]')];
    const segmentBtns = [...root.querySelectorAll('[data-pricing-segment]')];
    const prevBtn = root.querySelector('[data-pricing-prev]');
    const nextBtn = root.querySelector('[data-pricing-next]');
    const counter = root.querySelector('[data-pricing-counter]');
    const billingWrap = root.querySelector('[data-pricing-billing]');
    const billingBtns = [...root.querySelectorAll('[data-billing]')];
    const boletoStage = root.querySelector('[data-pricing-boleto]');

    let segment = 'b2b';
    let index = 0;
    let billing = 'monthly';

    function getActivePanel() {
      return panels.find((p) => p.dataset.segment === segment && Number(p.dataset.index) === index);
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
        if (period) {
          const isEnterprise = segment === 'b2b' && index === 2;
          period.textContent = isEnterprise
            ? (document.documentElement.lang === 'en' ? 'custom' : 'a medida')
            : (document.documentElement.lang === 'en' ? '/year' : '/año');
        }
        notes.forEach((n) => { n.hidden = false; });
      } else {
        amount.textContent = monthly;
        if (period) {
          period.textContent = document.documentElement.lang === 'en' ? '/mo' : '/mes';
        }
        notes.forEach((n) => { n.hidden = true; });
      }
    }

    function updateTicket() {
      if (!boletoStage) return;
      boletoStage.classList.remove('is-changing');
      void boletoStage.offsetWidth;
      boletoStage.classList.add('is-changing');
    }

    function render() {
      const total = SEGMENT_COUNTS[segment];

      panels.forEach((p) => {
        const active = p.dataset.segment === segment && Number(p.dataset.index) === index;
        p.classList.toggle('is-active', active);
        p.setAttribute('aria-hidden', active ? 'false' : 'true');
      });

      segmentBtns.forEach((btn) => {
        const isActive = btn.dataset.pricingSegment === segment;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      if (counter) counter.textContent = `${index + 1}/${total}`;

      billingBtns.forEach((btn) => {
        btn.classList.toggle('is-active', btn.dataset.billing === billing);
      });

      updateBillingVisibility();
      updatePrices();
      updateTicket();
    }

    function goTo(newSegment, newIndex) {
      segment = newSegment;
      index = Math.max(0, Math.min(SEGMENT_COUNTS[segment] - 1, newIndex));
      render();
    }

    segmentBtns.forEach((btn) => {
      btn.addEventListener('click', () => goTo(btn.dataset.pricingSegment, 0));
    });

    prevBtn?.addEventListener('click', () => {
      const next = index - 1;
      goTo(segment, next < 0 ? SEGMENT_COUNTS[segment] - 1 : next);
    });

    nextBtn?.addEventListener('click', () => {
      const next = index + 1;
      goTo(segment, next >= SEGMENT_COUNTS[segment] ? 0 : next);
    });

    billingBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        billing = btn.dataset.billing;
        render();
      });
    });

    document.addEventListener('languageChanged', () => {
      updatePrices();
    });

    render();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => Pricing.init());
