/**
 * Shiftiq — Main JS
 */
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
  initHeader();
  initAccordion();
  initReveal();
  initSmoothNav();
});

function initHeader() {
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  const navLinks = nav?.querySelectorAll('.nav__link[data-section]');
  const sectionIds = ['inicio', 'funciones', 'solucion', 'segmentos', 'planes', 'nosotros'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  const SCROLL_THRESHOLD = 80;

  function setCompact(compact) {
    header.classList.toggle('header--compact', compact);
    document.documentElement.style.setProperty('--header-h', compact ? '64px' : '88px');
  }

  function setActiveLink(current, animate = false) {
    navLinks?.forEach(link => {
      const isActive = link.dataset.section === current;
      link.classList.toggle('active', isActive);
      if (animate && isActive) {
        link.classList.remove('nav__link--pulse');
        void link.offsetWidth;
        link.classList.add('nav__link--pulse');
        link.addEventListener('animationend', () => {
          link.classList.remove('nav__link--pulse');
        }, { once: true });
      }
    });
  }

  function onScroll() {
    setCompact(window.scrollY > SCROLL_THRESHOLD);
    updateActiveLink();
  }

  function updateActiveLink() {
    if (!navLinks?.length || !sections.length) return;

    const offset = (header.classList.contains('header--compact') ? 80 : 100) + 40;
    let current = sections[0].id;

    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - offset) {
        current = section.id;
      }
    });

    setActiveLink(current, false);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  navToggle?.addEventListener('click', () => {
    const isOpen = header.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  nav?.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      const section = link.dataset.section;
      if (section) setActiveLink(section, true);
      header.classList.remove('nav-open');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!header.contains(e.target) && header.classList.contains('nav-open')) {
      header.classList.remove('nav-open');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  });
}

function initAccordion() {
  const accordion = document.getElementById('challengeAccordion');
  if (!accordion) return;

  accordion.querySelectorAll('.acc-panel__trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.acc-panel__item');
      const body = item.querySelector('.acc-panel__body');
      const isOpen = item.classList.contains('is-open');

      accordion.querySelectorAll('.acc-panel__item').forEach(other => {
        other.classList.remove('is-open');
        other.querySelector('.acc-panel__trigger')?.setAttribute('aria-expanded', 'false');
        other.querySelector('.acc-panel__body')?.classList.remove('open');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        body.classList.add('open');
      }

      if (window.lucide) lucide.createIcons();
    });
  });
}

function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

function initSmoothNav() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerH = document.getElementById('header')?.classList.contains('header--compact') ? 80 : 100;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}
