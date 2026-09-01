/**
 * Shiftiq — Footer logo rain (Matter.js physics)
 */
const FooterPhysics = (() => {
  const LOGO_SRC = 'assets/images/hero/Shiptiq-logo-icono.png';
  const MAX_BALLS = 22;
  const BASE_RADIUS = 62;

  function initStatic(container) {
    container.classList.add('is-static');
    for (let i = 0; i < 10; i += 1) {
      const el = document.createElement('div');
      el.className = 'footer-physics__ball footer-physics__ball--static';
      el.innerHTML = `<img src="${LOGO_SRC}" alt="" draggable="false">`;
      container.appendChild(el);
    }
  }

  function init() {
    const root = document.querySelector('[data-footer-physics]');
    const container = document.querySelector('[data-footer-physics-world]');
    if (!root || !container) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.Matter) {
      initStatic(container);
      return;
    }

    const {
      Engine, Runner, Bodies, Composite, Mouse, MouseConstraint, Events, Body,
    } = window.Matter;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const engine = Engine.create();
    engine.gravity.y = 2.2;
    const world = engine.world;

    const staticOpts = { isStatic: true, render: { visible: false } };
    let ground = Bodies.rectangle(width / 2, height + 40, width + 240, 80, staticOpts);
    let leftWall = Bodies.rectangle(-40, height / 2, 80, height * 3, staticOpts);
    let rightWall = Bodies.rectangle(width + 40, height / 2, 80, height * 3, staticOpts);
    Composite.add(world, [ground, leftWall, rightWall]);

    const pairs = [];
    let hasBurst = false;

    const mouse = Mouse.create(container);
    mouse.pixelRatio = window.devicePixelRatio || 1;

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.16,
        damping: 0.08,
        render: { visible: false },
      },
    });
    Composite.add(world, mouseConstraint);

    Events.on(mouseConstraint, 'startdrag', () => root.classList.add('is-grabbing'));
    Events.on(mouseConstraint, 'enddrag', () => root.classList.remove('is-grabbing'));

    function spawn(x, y, skipLimit = false) {
      if (!skipLimit && pairs.length >= MAX_BALLS) return;

      const radius = BASE_RADIUS + Math.random() * 12;
      const spawnX = x ?? radius + Math.random() * (width - radius * 2);
      const spawnY = y ?? -(radius + Math.random() * 160);

      const body = Bodies.circle(spawnX, spawnY, radius, {
        restitution: 0.58 + Math.random() * 0.12,
        friction: 0.04,
        frictionAir: 0.012,
        density: 0.001,
      });

      const el = document.createElement('div');
      el.className = 'footer-physics__ball';
      el.style.width = `${radius * 2}px`;
      el.style.height = `${radius * 2}px`;
      el.innerHTML = `<img src="${LOGO_SRC}" alt="" draggable="false">`;
      container.appendChild(el);

      Composite.add(world, body);
      pairs.push({ body, el, radius });
    }

    function spawnBurst() {
      if (hasBurst) return;
      hasBurst = true;

      for (let i = 0; i < MAX_BALLS; i += 1) {
        const radius = BASE_RADIUS + Math.random() * 12;
        const x = radius + Math.random() * (width - radius * 2);
        const y = -(radius + 20 + Math.random() * 420);
        spawn(x, y, true);
      }
    }

    const visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) spawnBurst();
      });
    }, { threshold: 0.12 });
    visibilityObserver.observe(root);

    if (root.getBoundingClientRect().top < window.innerHeight) {
      spawnBurst();
    }

    Events.on(engine, 'afterUpdate', () => {
      pairs.forEach(({ body, el, radius }) => {
        const { x, y } = body.position;
        el.style.transform = `translate3d(${x - radius}px, ${y - radius}px, 0) rotate(${body.angle}rad)`;
      });
    });

    const runner = Runner.create();
    Runner.run(runner, engine);

    function updateBounds() {
      width = container.clientWidth;
      height = container.clientHeight;

      Body.setPosition(ground, { x: width / 2, y: height + 40 });
      Body.setPosition(leftWall, { x: -40, y: height / 2 });
      Body.setPosition(rightWall, { x: width + 40, y: height / 2 });
    }

    window.addEventListener('resize', updateBounds);
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => FooterPhysics.init());
