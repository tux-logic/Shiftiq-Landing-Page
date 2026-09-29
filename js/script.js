(() => {
    const loader = document.getElementById('pageLoader');
    if (!loader) return;
    document.documentElement.classList.add('is-loading');
    const started = performance.now();
    const MIN_MS = 1400;
    const MAX_MS = 3600;
    let hidden = false;
    const hide = () => {
        if (hidden) return;
        hidden = true;
        const wait = Math.max(0, MIN_MS - (performance.now() - started));
        window.setTimeout(() => {
            loader.classList.add('is-done');
            document.documentElement.classList.remove('is-loading');
            window.setTimeout(() => loader.remove(), 700);
        }, wait);
    };
    if (document.readyState === 'complete') hide();
    else {
        window.addEventListener('load', hide, { once: true });
        window.setTimeout(hide, MAX_MS);
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#' || this.hasAttribute('data-bs-toggle')) {
                return;
            }
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 88,
                    behavior: 'smooth'
                });
            }
        });
    });

    // IoT Data Simulation Logic
    const initIoTSimulation = () => {
        const tempElement = document.getElementById('iot-temp');
        const humidityElement = document.getElementById('iot-humidity');
        const lightElement = document.getElementById('iot-light');

        if (!tempElement || !humidityElement || !lightElement) return;

        setInterval(() => {
            // Temperature simulation (Range: 2.0 - 8.0 C for vaccines)
            const temp = (2 + Math.random() * 6).toFixed(1);
            tempElement.textContent = temp;

            // Humidity simulation (Range: 35 - 55%)
            const humidity = (35 + Math.random() * 20).toFixed(1);
            humidityElement.textContent = humidity;

            // Light simulation (Range: 100 - 500 Lux)
            const light = Math.floor(100 + Math.random() * 400);
            lightElement.textContent = light;
        }, 2000);
    };

    initIoTSimulation();

    const siteHeader = document.getElementById('siteHeader');
    const navLinks = document.querySelectorAll('.site-header__links .nav-link');
    const navCollapse = document.getElementById('navbarNav');

    const syncHeader = () => {
        if (siteHeader) {
            siteHeader.classList.toggle('is-compact', window.scrollY > 24);
        }
    };
    syncHeader();
    window.addEventListener('scroll', syncHeader, { passive: true });

    const sectionIds = [...navLinks].map((link) => link.getAttribute('href')).filter(Boolean);
    const setActiveLink = () => {
        const marker = window.scrollY + 120;
        let current = sectionIds[0];
        sectionIds.forEach((id) => {
            const section = document.querySelector(id);
            if (section && section.offsetTop <= marker) {
                current = id;
            }
        });
        navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === current);
        });
    };
    setActiveLink();
    window.addEventListener('scroll', setActiveLink, { passive: true });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (navCollapse && navCollapse.classList.contains('show') && window.bootstrap) {
                bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
            }
        });
    });

    // Reveal animations on scroll (Simple Intersection Observer)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.custom-card, .iot-display').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
    // Stats Counter Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 100; // Velocidad del conteo

    const startCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    const statsSection = document.querySelector('.stats-counter-section');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                startCounters();
                statsObserver.unobserve(statsSection);
            }
        }, { threshold: 0.3 });
        statsObserver.observe(statsSection);
    }
    let heroAnimToken = 0;

    const getHeroCopy = () => {
        const i18n = window.KAIROLABS_I18N || window.MEDITRACK_I18N;
        if (i18n && typeof i18n.getHero === 'function') {
            return i18n.getHero();
        }
        return {
            tagline: 'Gestión de talleres · OBD2',
            title: 'Máxima rentabilidad para tu taller, precisión total en cada reparación',
            desc: 'Órdenes, telemetría OBD2, inventario y app móvil en una plataforma hecha para talleres que operan en serio.'
        };
    };

    const typeWriter = (selector, text, i, fnCallback, token) => {
        const el = document.querySelector(selector);
        if (!el || token !== heroAnimToken) return;

        if (i < text.length) {
            el.textContent = text.substring(0, i + 1);
            setTimeout(() => typeWriter(selector, text, i + 1, fnCallback, token), 18);
        } else if (typeof fnCallback == 'function') {
            setTimeout(fnCallback, 280);
        }
    };

    const startHeroAnimation = () => {
        heroAnimToken += 1;
        const token = heroAnimToken;
        const H = getHeroCopy();
        const tag = document.querySelector('#typing-tagline');
        const tit = document.querySelector('#typing-title');
        const dsc = document.querySelector('#typing-desc');
        if (tag) tag.textContent = '';
        if (tit) tit.textContent = '';
        if (dsc) dsc.textContent = '';

        typeWriter('#typing-tagline', H.tagline, 0, () => {
            typeWriter('#typing-title', H.title, 0, () => {
                typeWriter('#typing-desc', H.desc, 0, null, token);
            }, token);
        }, token);
    };

    setTimeout(startHeroAnimation, 400);

    window.addEventListener('kairolabs:i18n', () => {
        startHeroAnimation();
    });
    window.addEventListener('meditrack:i18n', () => {
        startHeroAnimation();
    });

    // Global Reveal Animation Observer
    const genericObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // If it's a list or group, staggered reveal
                if (entry.target.classList.contains('reveal-item') || entry.target.classList.contains('reveal-zoom')) {
                    const parent = entry.target.parentElement;
                    const items = parent.querySelectorAll('.reveal-item, .reveal-zoom');
                    const index = Array.from(items).indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.classList.add('active');
                    }, index * 180);
                } else {
                    entry.target.classList.add('active');
                }
                genericObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal-card, .reveal-left, .reveal-right, .reveal-item, .reveal-zoom, .reveal-watermark').forEach(el => {
        genericObserver.observe(el);
    });

    document.querySelectorAll('.video-poster').forEach(poster => {
        poster.addEventListener('click', function() {
            const videoId = this.getAttribute('data-youtube');
            if (!videoId) return;

            const iframe = document.createElement('iframe');
            iframe.setAttribute('width', '100%');
            iframe.setAttribute('height', '100%');
            iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1`);
            iframe.setAttribute('title', 'YouTube video player');
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
            iframe.setAttribute('allowfullscreen', '');
            iframe.style.borderRadius = '14px';

            this.innerHTML = '';
            this.appendChild(iframe);
        });
    });

    const initYtShowcase = () => {
        const root = document.querySelector('[data-yt-showcase]');
        if (!root) return;
        const stage = root.querySelector('[data-yt-stage]');
        const overlay = root.querySelector('[data-yt-plus-overlay]');
        const playBtns = root.querySelectorAll('[data-yt-play]');
        const plusBtn = root.querySelector('[data-yt-plus]');
        const videoId = 'P4EXeRWgNtw';

        const playVideo = () => {
            if (!stage || stage.dataset.playing === '1') return;
            stage.dataset.playing = '1';
            stage.innerHTML = '';
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
            iframe.title = 'ShiftIQ YouTube';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.allowFullscreen = true;
            iframe.setAttribute('frameborder', '0');
            stage.appendChild(iframe);
        };

        playBtns.forEach((btn) => btn.addEventListener('click', playVideo));

        if (plusBtn && overlay) {
            plusBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const open = overlay.classList.toggle('is-open');
                overlay.hidden = !open;
                root.classList.toggle('is-plus-open', open);
                plusBtn.classList.toggle('is-open', open);
                plusBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
                plusBtn.setAttribute('aria-label', open ? 'Cerrar' : 'Obtener la app');
                const caption = stage && stage.querySelector('.yt-showcase__caption');
                if (caption && !open) {
                    caption.style.animation = 'none';
                    void caption.offsetWidth;
                    caption.style.animation = '';
                }
            });
        }
    };

    initYtShowcase();

    const initOfferCarousel = () => {
        const root = document.querySelector('[data-offer-carousel]');
        if (!root) return;

        const track = root.querySelector('[data-offer-track]');
        const cards = Array.from(track.querySelectorAll('.offer-card'));
        const prevBtn = root.querySelector('[data-offer-prev]');
        const nextBtn = root.querySelector('[data-offer-next]');
        let index = 0;
        let timer = null;

        const visibleCount = () => {
            if (window.innerWidth < 768) return 1;
            if (window.innerWidth < 1100) return 2;
            return 4;
        };

        const maxIndex = () => Math.max(0, cards.length - visibleCount());

        const applySizes = () => {
            const vis = visibleCount();
            track.style.setProperty('--offer-visible', String(vis));
            if (index > maxIndex()) index = 0;
            const first = cards[0];
            const gap = parseFloat(getComputedStyle(track).gap) || 22;
            const step = first.getBoundingClientRect().width + gap;
            track.style.transform = `translateX(-${index * step}px)`;
        };

        const goTo = (next) => {
            const max = maxIndex();
            if (next < 0) index = max;
            else if (next > max) index = 0;
            else index = next;
            applySizes();
        };

        const startAuto = () => {
            clearInterval(timer);
            timer = setInterval(() => goTo(index + 1), 4500);
        };

        prevBtn.addEventListener('click', () => {
            goTo(index - 1);
            startAuto();
        });
        nextBtn.addEventListener('click', () => {
            goTo(index + 1);
            startAuto();
        });

        root.addEventListener('mouseenter', () => clearInterval(timer));
        root.addEventListener('mouseleave', startAuto);
        window.addEventListener('resize', applySizes);

        root.querySelectorAll('[data-offer-image]').forEach((img) => {
            const hideIfEmpty = () => {
                if (!img.getAttribute('src')) img.style.display = 'none';
            };
            img.addEventListener('error', () => {
                img.style.display = 'none';
            });
            hideIfEmpty();
        });

        applySizes();
        startAuto();
    };

    initOfferCarousel();

    const initTeamCarousel = () => {
        const root = document.querySelector('[data-team-carousel]');
        if (!root) return;
        const track = root.querySelector('[data-team-track]');
        const progress = root.querySelector('[data-team-progress]');
        const cards = Array.from(track.querySelectorAll('.team-equipo-card'));
        let index = 0;

        const visibleCount = () => {
            if (window.innerWidth < 768) return 1;
            if (window.innerWidth < 1100) return 2;
            return 3;
        };

        const maxIndex = () => Math.max(0, cards.length - visibleCount());

        const apply = () => {
            if (index > maxIndex()) index = 0;
            const first = cards[0];
            const gap = parseFloat(getComputedStyle(track).gap) || 16;
            const step = first.getBoundingClientRect().width + gap;
            track.style.transform = `translateX(-${index * step}px)`;
            if (progress) {
                const total = maxIndex() + 1;
                progress.style.width = `${((index + 1) / total) * 100}%`;
            }
        };

        root.addEventListener('click', () => {
            index = index >= maxIndex() ? 0 : index + 1;
            apply();
        });
        window.addEventListener('resize', apply);
        apply();
    };

    initTeamCarousel();

    const initTeamMedia = () => {
        const root = document.querySelector('[data-team-media]');
        if (!root) return;
        const tabs = root.querySelectorAll('[data-team-tab]');
        const videoStage = root.querySelector('[data-team-stage="video"]');
        const imageStage = root.querySelector('[data-team-stage="image"]');
        const playBtn = root.querySelector('[data-team-play]');
        const videoId = 'P4EXeRWgNtw';

        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                tabs.forEach((t) => t.classList.remove('is-active'));
                tab.classList.add('is-active');
                const mode = tab.getAttribute('data-team-tab');
                if (mode === 'image') {
                    imageStage.hidden = false;
                    videoStage.hidden = true;
                } else {
                    imageStage.hidden = true;
                    videoStage.hidden = false;
                }
            });
        });

        if (playBtn && videoStage) {
            playBtn.addEventListener('click', () => {
                if (videoStage.dataset.playing === '1') return;
                videoStage.dataset.playing = '1';
                videoStage.innerHTML = '';
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
                iframe.allowFullscreen = true;
                videoStage.appendChild(iframe);
            });
        }
    };

    initTeamMedia();

    const initTeamCopyReveal = () => {
        const elements = Array.from(document.querySelectorAll('[data-team-copy], [data-kairo-expand-copy]'));
        if (!elements.length) return;

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
        const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
        const easeOut = (value) => 1 - Math.pow(1 - value, 3);
        const groups = [];
        let ticking = false;

        const setWord = (word, reveal) => {
            const eased = easeOut(reveal);
            word.style.setProperty('--word-alpha', (0.14 + eased * 0.86).toFixed(3));
            word.style.setProperty('--word-y', `${((1 - eased) * 0.42).toFixed(3)}em`);
            word.style.setProperty('--word-blur', `${((1 - eased) * 0.16).toFixed(3)}em`);
        };

        const buildOne = (element) => {
            const text = element.textContent.replace(/\s+/g, ' ').trim();
            element.innerHTML = '';
            const words = [];
            text.split(/(\s+)/).forEach((token) => {
                if (!token) return;
                if (/^\s+$/.test(token)) {
                    element.appendChild(document.createTextNode(token));
                    return;
                }
                const word = document.createElement('span');
                word.className = 'scroll-reveal-word';
                word.textContent = token;
                element.appendChild(word);
                words.push(word);
            });
            return { element, words };
        };

        const build = () => {
            groups.length = 0;
            elements.forEach((element) => groups.push(buildOne(element)));
            update();
        };

        const update = () => {
            const vh = window.innerHeight || document.documentElement.clientHeight;
            groups.forEach(({ element, words }) => {
                if (reduced.matches) {
                    words.forEach((word) => setWord(word, 1));
                    return;
                }
                const rect = element.getBoundingClientRect();
                const progress = clamp((vh * 1.02 - rect.top) / Math.max(vh * 0.36, rect.height * 1.35), 0, 1);
                const last = Math.max(words.length - 1, 1);
                words.forEach((word, index) => {
                    const start = (index / last) * 0.72;
                    setWord(word, clamp((progress - start) / 0.2, 0, 1));
                });
            });
            ticking = false;
        };

        const requestUpdate = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(update);
        };

        window.addEventListener('scroll', requestUpdate, { passive: true });
        window.addEventListener('resize', requestUpdate);
        window.addEventListener('kairolabs:i18n', build);
        build();
    };

    initTeamCopyReveal();

    const initVideoExpand = () => {
        const section = document.querySelector('[data-video-expand-section]');
        const sticky = section?.querySelector('[data-video-expand-sticky]');
        const placeholder = section?.querySelector('[data-video-expand-placeholder]');
        const media = section?.querySelector('[data-video-expand-media]');
        if (!section || !sticky || !placeholder || !media) return;

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
        const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
        const lerp = (start, end, progress) => start + (end - start) * progress;
        const ease = (progress) => (progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2);
        let ticking = false;

        const setExpanded = () => {
            section.style.setProperty('--media-x', '0px');
            section.style.setProperty('--media-y', '0px');
            section.style.setProperty('--media-width', `${sticky.clientWidth}px`);
            section.style.setProperty('--media-height', `${sticky.clientHeight}px`);
            section.style.setProperty('--media-radius', '0px');
            section.style.setProperty('--intro-opacity', '0');
            section.style.setProperty('--intro-y', '-32px');
            section.style.setProperty('--caption-opacity', '1');
            section.style.setProperty('--caption-y', '0px');
            section.style.setProperty('--media-overlay-opacity', '0.18');
        };

        const update = () => {
            if (reduced.matches) {
                setExpanded();
                ticking = false;
                return;
            }
            const sectionRect = section.getBoundingClientRect();
            const stickyRect = sticky.getBoundingClientRect();
            const placeholderRect = placeholder.getBoundingClientRect();
            const scrollable = Math.max(section.offsetHeight - window.innerHeight, 1);
            const raw = clamp((-sectionRect.top / scrollable) * 1.8, 0, 1);
            const progress = ease(raw);
            section.style.setProperty('--media-x', `${lerp(placeholderRect.left - stickyRect.left, 0, progress)}px`);
            section.style.setProperty('--media-y', `${lerp(placeholderRect.top - stickyRect.top, 0, progress)}px`);
            section.style.setProperty('--media-width', `${lerp(placeholderRect.width, stickyRect.width, progress)}px`);
            section.style.setProperty('--media-height', `${lerp(placeholderRect.height, stickyRect.height, progress)}px`);
            section.style.setProperty('--media-radius', `${lerp(32, 0, progress)}px`);
            section.style.setProperty('--intro-opacity', String(clamp(1 - raw * 2.2, 0, 1)));
            section.style.setProperty('--intro-y', `${raw * -32}px`);
            const caption = clamp((raw - 0.62) / 0.28, 0, 1);
            section.style.setProperty('--caption-opacity', String(caption));
            section.style.setProperty('--caption-y', `${lerp(24, 0, caption)}px`);
            section.style.setProperty('--media-overlay-opacity', String(clamp((raw - 0.55) / 0.35, 0, 0.18)));
            ticking = false;
        };

        const requestUpdate = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(update);
        };

        window.addEventListener('scroll', requestUpdate, { passive: true });
        window.addEventListener('resize', requestUpdate);
        update();
    };

    initVideoExpand();

    const initAboutAccordion = () => {
        const root = document.querySelector('[data-kairo-acc]');
        if (!root) return;
        const items = Array.from(root.querySelectorAll('[data-kairo-acc-item]'));
        items.forEach((item) => {
            item.querySelector('[data-kairo-acc-open]')?.addEventListener('click', () => {
                items.forEach((other) => other.classList.toggle('is-open', other === item));
            });
        });
    };

    initAboutAccordion();

    const initStoryScroll = () => {
        const section = document.querySelector('[data-kairo-story]');
        const track = document.querySelector('[data-kairo-story-track]');
        const cards = {
            left: document.querySelector('[data-kairo-story-card="left"]'),
            center: document.querySelector('[data-kairo-story-card="center"]'),
            right: document.querySelector('[data-kairo-story-card="right"]'),
        };
        const texts = Array.from(document.querySelectorAll('[data-kairo-story-text]'));
        if (!section || !track || !cards.center) return;

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (reduced.matches) {
            section.classList.add('is-reduced');
            return;
        }

        const easeOut = (t) => 1 - (1 - t) ** 3;
        const breaks = [0, 0.38, 0.72];
        let lastActive = -1;

        const getProgress = () => {
            const scrollable = track.offsetHeight - window.innerHeight;
            if (scrollable <= 0) return 0;
            return Math.max(0, Math.min(1, -track.getBoundingClientRect().top / scrollable));
        };

        const updateText = (p) => {
            let active = 0;
            if (p >= breaks[2]) active = 2;
            else if (p >= breaks[1]) active = 1;
            texts.forEach((el, i) => {
                el.classList.toggle('is-active', i === active);
                el.classList.toggle('is-exiting', i < active);
            });
            lastActive = active;
        };

        const updateCards = (p) => {
            const spread = easeOut(Math.min(1, p / 0.55));
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
        };

        const onScroll = () => {
            const p = getProgress();
            updateText(p);
            updateCards(p);
        };

        const applyHeight = () => {
            track.style.height = `${window.innerWidth < 768 ? 240 : 280}vh`;
        };

        applyHeight();
        section.classList.add('is-inview');
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', () => {
            applyHeight();
            onScroll();
        }, { passive: true });
        onScroll();
    };

    initStoryScroll();

    const initFooterPhysics = () => {
        const root = document.querySelector('[data-footer-physics]');
        const worldEl = document.querySelector('[data-footer-physics-world]');
        if (!root || !worldEl) return;

        const logoSrc = 'Imagenes/Shiftiq-Logo-icono.png';
        const maxLogos = window.matchMedia('(max-width: 768px)').matches ? 20 : 30;
        const baseRadius = window.matchMedia('(max-width: 768px)').matches ? 54 : 70;

        const addLogoEl = (size) => {
            const el = document.createElement('div');
            el.className = 'footer-physics__ball';
            el.style.width = `${size}px`;
            el.style.height = `${size}px`;
            const img = document.createElement('img');
            img.src = logoSrc;
            img.alt = '';
            img.draggable = false;
            el.appendChild(img);
            worldEl.appendChild(el);
            return el;
        };

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.Matter) {
            worldEl.classList.add('is-static');
            for (let i = 0; i < 8; i += 1) {
                const el = addLogoEl(110);
                el.classList.add('footer-physics__ball--static');
            }
            return;
        }

        const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint, Events, Body } = window.Matter;
        let width = worldEl.clientWidth;
        let height = worldEl.clientHeight;

        const engine = Engine.create();
        engine.gravity.y = 2.15;
        const world = engine.world;
        const wallOpts = { isStatic: true, render: { visible: false } };
        const ground = Bodies.rectangle(width / 2, height + 36, width + 280, 80, wallOpts);
        const leftWall = Bodies.rectangle(-36, height / 2, 80, height * 3, wallOpts);
        const rightWall = Bodies.rectangle(width + 36, height / 2, 80, height * 3, wallOpts);
        Composite.add(world, [ground, leftWall, rightWall]);

        const items = [];
        const mouse = Mouse.create(worldEl);
        mouse.pixelRatio = window.devicePixelRatio || 1;
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse,
            constraint: { stiffness: 0.16, damping: 0.08, render: { visible: false } }
        });
        Composite.add(world, mouseConstraint);
        if (mouse.mousewheel) {
            worldEl.removeEventListener('wheel', mouse.mousewheel);
            worldEl.removeEventListener('mousewheel', mouse.mousewheel);
            worldEl.removeEventListener('DOMMouseScroll', mouse.mousewheel);
        }
        Events.on(mouseConstraint, 'startdrag', () => root.classList.add('is-grabbing'));
        Events.on(mouseConstraint, 'enddrag', () => root.classList.remove('is-grabbing'));

        const spawnLogo = (x, y) => {
            if (items.length >= maxLogos) return;
            const radius = baseRadius + Math.random() * 16;
            const spawnX = x ?? radius + Math.random() * Math.max(40, width - radius * 2);
            const spawnY = y ?? -(radius + Math.random() * 220);
            const body = Bodies.circle(spawnX, spawnY, radius, {
                restitution: 0.56 + Math.random() * 0.14,
                friction: 0.04,
                frictionAir: 0.012,
                density: 0.001
            });
            const el = addLogoEl(radius * 2);
            Composite.add(world, body);
            items.push({ body, el, radius });
        };

        let rained = false;
        const rainBurst = () => {
            if (rained) return;
            rained = true;
            for (let i = 0; i < maxLogos; i += 1) {
                spawnLogo(
                    baseRadius + Math.random() * Math.max(40, width - baseRadius * 2),
                    -(baseRadius + 24 + Math.random() * 380)
                );
            }
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) rainBurst();
            });
        }, { threshold: 0.12 });
        observer.observe(root);
        if (root.getBoundingClientRect().top < window.innerHeight) rainBurst();

        Events.on(engine, 'afterUpdate', () => {
            items.forEach(({ body, el, radius }) => {
                el.style.transform = `translate3d(${body.position.x - radius}px, ${body.position.y - radius}px, 0) rotate(${body.angle}rad)`;
            });
        });

        Runner.run(Runner.create(), engine);

        window.addEventListener('resize', () => {
            width = worldEl.clientWidth;
            height = worldEl.clientHeight;
            Body.setPosition(ground, { x: width / 2, y: height + 36 });
            Body.setPosition(leftWall, { x: -36, y: height / 2 });
            Body.setPosition(rightWall, { x: width + 36, y: height / 2 });
        });
    };

    initFooterPhysics();

    const initPricingFan = () => {
        const section = document.querySelector('[data-pricing-fan]');
        const viewport = section?.querySelector('[data-pricing-fan-viewport]');
        if (!section || !viewport) return;

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
        const mobile = window.matchMedia('(max-width: 768px)');
        const dragDistance = 200;
        let activeIndex = 2;
        let pointerId = null;
        let startX = 0;
        let startIndex = 0;
        let lastMoveX = 0;
        let lastMoveTime = 0;
        let velocity = 0;
        let hasDragged = false;
        let frameId = null;
        let clickSuppressed = false;

        const cards = () => Array.from(viewport.querySelectorAll('[data-pricing-fan-card]'));
        const wrap = (value, total) => ((value % total) + total) % total;
        const circular = (index, center, total) => {
            let distance = index - center;
            const half = total / 2;
            while (distance > half) distance -= total;
            while (distance < -half) distance += total;
            return distance;
        };
        const easeOut = (value) => 1 - Math.pow(1 - value, 3);

        const render = () => {
            const list = cards();
            const total = list.length;
            const visible = mobile.matches ? 1 : 2;
            list.forEach((card, index) => {
                const distance = circular(index, activeIndex, total);
                const abs = Math.abs(distance);
                const direction = distance < 0 ? -1 : 1;
                const progress = Math.min(abs, visible);
                const fanX = mobile.matches
                    ? direction * Math.pow(progress, 0.82) * 54
                    : distance * 16 + direction * Math.pow(progress, 1.1) * 86;
                const fanY = mobile.matches
                    ? Math.pow(progress, 1.05) * 12
                    : Math.pow(progress, 1.2) * 24;
                const rotation = mobile.matches ? distance * 5.5 : distance * 6;
                const scale = mobile.matches
                    ? Math.max(0.84, 1 - progress * 0.14)
                    : Math.max(0.86, 1 - progress * 0.05);
                card.style.setProperty('--deck-x', `${fanX.toFixed(2)}px`);
                card.style.setProperty('--deck-y', `${fanY.toFixed(2)}px`);
                card.style.setProperty('--deck-rotate', `${rotation.toFixed(2)}deg`);
                card.style.setProperty('--deck-scale', scale.toFixed(3));
                card.style.setProperty('--deck-opacity', abs <= visible + 0.2 ? '1' : '0');
                card.style.zIndex = String(Math.round((visible + 2 - Math.min(abs, visible + 1)) * 20));
                card.classList.toggle('is-active', abs < 0.45);
                card.setAttribute('aria-hidden', abs > visible + 0.2 ? 'true' : 'false');
            });
        };

        const animateTo = (targetIndex) => {
            if (frameId) cancelAnimationFrame(frameId);
            const total = cards().length;
            if (!total) return;
            const fromIndex = activeIndex;
            const delta = circular(wrap(targetIndex, total), fromIndex, total);
            const toIndex = fromIndex + delta;
            const duration = reduced.matches ? 0 : 420;
            const start = performance.now();
            if (!duration) {
                activeIndex = wrap(toIndex, total);
                render();
                return;
            }
            const tick = (now) => {
                const elapsed = Math.min((now - start) / duration, 1);
                activeIndex = fromIndex + delta * easeOut(elapsed);
                activeIndex = wrap(activeIndex, total);
                render();
                if (elapsed < 1) {
                    frameId = requestAnimationFrame(tick);
                    return;
                }
                frameId = null;
                activeIndex = wrap(Math.round(toIndex), total);
                render();
            };
            frameId = requestAnimationFrame(tick);
        };

        viewport.addEventListener('pointerdown', (event) => {
            if (event.button !== undefined && event.button !== 0) return;
            if (event.target.closest('a') && event.pointerType === 'mouse') return;
            if (frameId) cancelAnimationFrame(frameId);
            pointerId = event.pointerId;
            startX = event.clientX;
            startIndex = activeIndex;
            lastMoveX = event.clientX;
            lastMoveTime = performance.now();
            velocity = 0;
            hasDragged = false;
            viewport.classList.add('is-dragging');
            viewport.setPointerCapture(pointerId);
        });

        viewport.addEventListener('pointermove', (event) => {
            if (event.pointerId !== pointerId) return;
            const deltaX = event.clientX - startX;
            const now = performance.now();
            velocity = (event.clientX - lastMoveX) / Math.max(now - lastMoveTime, 1);
            activeIndex = wrap(startIndex - deltaX / dragDistance, cards().length);
            if (Math.abs(deltaX) > 6) hasDragged = true;
            lastMoveX = event.clientX;
            lastMoveTime = now;
            render();
        });

        const endDrag = (event) => {
            if (event.pointerId !== pointerId) return;
            viewport.classList.remove('is-dragging');
            if (viewport.hasPointerCapture?.(pointerId)) viewport.releasePointerCapture(pointerId);
            pointerId = null;
            if (hasDragged) clickSuppressed = true;
            animateTo(wrap(Math.round(activeIndex - velocity * 0.48), cards().length));
        };

        viewport.addEventListener('pointerup', endDrag);
        viewport.addEventListener('pointercancel', endDrag);
        viewport.addEventListener('click', (event) => {
            if (!clickSuppressed) return;
            event.preventDefault();
            event.stopPropagation();
            clickSuppressed = false;
        }, true);

        window.addEventListener('resize', render);
        render();
    };

    initPricingFan();

    const initKairoOrbit = () => {
        const section = document.querySelector('[data-kairo-orbit]');
        if (!section) return;

        const items = Array.from(section.querySelectorAll('[data-kairo-orbit-item]'));
        const layout = [
            { x: '-36vw', y: '0vh', delay: 0, floatDelay: '0s', floatDuration: '2.5s' },
            { x: '-18vw', y: '-26vh', delay: 80, floatDelay: '0.1s', floatDuration: '2.2s' },
            { x: '-18vw', y: '26vh', delay: 160, floatDelay: '0.2s', floatDuration: '2.4s' },
            { x: '0vw', y: '-34vh', delay: 240, floatDelay: '0.3s', floatDuration: '2s' },
            { x: '0vw', y: '34vh', delay: 320, floatDelay: '0.4s', floatDuration: '2.3s' },
            { x: '18vw', y: '-26vh', delay: 400, floatDelay: '0.5s', floatDuration: '2.6s' },
            { x: '18vw', y: '26vh', delay: 480, floatDelay: '0.6s', floatDuration: '2.2s' },
            { x: '36vw', y: '0vh', delay: 560, floatDelay: '0.7s', floatDuration: '2.5s' }
        ];

        items.forEach((item, index) => {
            const config = layout[index];
            if (!config) return;
            item.style.setProperty('--bubble-x', config.x);
            item.style.setProperty('--bubble-y', config.y);
            item.style.setProperty('--orbit-item-delay', `${config.delay}ms`);
            item.style.setProperty('--orbit-float-delay', config.floatDelay);
            item.style.setProperty('--orbit-float-duration', config.floatDuration);
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                section.classList.toggle('is-visible', entry.isIntersecting);
            });
        }, { threshold: 0.35 });
        observer.observe(section);

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            section.classList.add('is-visible');
        }
    };

    initKairoOrbit();

    const initKairoCta = () => {
        const section = document.querySelector('[data-kairo-cta]');
        if (!section) return;

        const revealEls = Array.from(section.querySelectorAll('[data-kairo-cta-reveal]'));
        const extraEls = Array.from(section.querySelectorAll('[data-kairo-cta-extra]'));
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
        const mobile = window.matchMedia('(max-width: 768px)');
        let lineGroups = [];
        let ticking = false;

        const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
        const easeOut = (value) => 1 - Math.pow(1 - value, 3);
        const mix = (from, to, t) => Math.round(from + (to - from) * t);
        const rgb = (from, to, t, alpha = 1) => {
            const color = `${mix(from[0], to[0], t)}, ${mix(from[1], to[1], t)}, ${mix(from[2], to[2], t)}`;
            return alpha < 1 ? `rgba(${color}, ${alpha})` : `rgb(${color})`;
        };

        const buildLines = (element) => {
            const text = (element.textContent || '').trim();
            const fragment = document.createDocumentFragment();
            const lines = [];
            element.innerHTML = '';
            text.split('\n').forEach((line, index, all) => {
                const span = document.createElement('span');
                span.className = 'kairo-cta__line';
                span.textContent = line.trim();
                fragment.appendChild(span);
                lines.push(span);
                if (index < all.length - 1) fragment.appendChild(document.createElement('br'));
            });
            element.appendChild(fragment);
            return lines;
        };

        const setWipe = (progress) => {
            const eased = easeOut(progress);
            const peak = Math.sin(progress * Math.PI) * (mobile.matches ? 26 : 30);
            section.style.setProperty('--kairo-cta-wipe-progress', eased.toFixed(4));
            section.style.setProperty('--kairo-cta-wipe-y', `${(100 - progress * 100).toFixed(2)}%`);
            section.style.setProperty('--kairo-cta-wipe-peak', `${peak.toFixed(2)}vh`);
            section.style.setProperty('--kairo-cta-title-on', rgb([255, 255, 255], [17, 36, 51], eased));
            section.style.setProperty('--kairo-cta-title-off', rgb([255, 255, 255], [100, 116, 139], eased, 0.2));
            section.style.setProperty('--kairo-cta-sub-on', rgb([255, 255, 255], [100, 116, 139], eased, 0.64));
            section.style.setProperty('--kairo-cta-sub-off', rgb([255, 255, 255], [100, 116, 139], eased, 0.18));
            section.style.setProperty('--kairo-cta-extra-opacity', clamp((progress - 0.7) / 0.3, 0, 1).toFixed(3));
            section.style.setProperty('--kairo-cta-extra-y', `${((1 - clamp((progress - 0.7) / 0.3, 0, 1)) * 18).toFixed(1)}px`);
        };

        const rebuild = () => {
            lineGroups = revealEls.map((element) => ({
                element,
                lines: buildLines(element)
            }));
            requestUpdate();
        };

        const update = () => {
            if (reduced.matches) {
                lineGroups.forEach((group) => {
                    group.lines.forEach((line) => line.style.setProperty('--kairo-cta-line-progress', '100%'));
                });
                setWipe(1);
                extraEls.forEach((el) => {
                    el.style.opacity = '1';
                    el.style.transform = 'none';
                });
                ticking = false;
                return;
            }

            const vh = window.innerHeight || document.documentElement.clientHeight;
            const rect = section.getBoundingClientRect();
            const wipeStart = vh * (mobile.matches ? 0.9 : 0.52);
            const wipeRange = vh * (mobile.matches ? 0.9 : 0.52);
            const wipeProgress = clamp((wipeStart - rect.top) / wipeRange, 0, 1);
            setWipe(wipeProgress);

            lineGroups.forEach(({ element, lines }) => {
                const lineRect = element.getBoundingClientRect();
                const progress = clamp((vh * 0.94 - lineRect.top) / (vh * 0.62), 0, 1);
                const last = Math.max(lines.length - 1, 1);
                lines.forEach((line, index) => {
                    const start = (index / last) * 0.38;
                    const reveal = clamp((progress - start) / 0.68, 0, 1);
                    line.style.setProperty('--kairo-cta-line-progress', `${(easeOut(reveal) * 100).toFixed(2)}%`);
                });
            });
            ticking = false;
        };

        const requestUpdate = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(update);
        };

        window.addEventListener('scroll', requestUpdate, { passive: true });
        window.addEventListener('resize', requestUpdate);
        window.addEventListener('kairolabs:i18n', rebuild);
        setWipe(0);
        rebuild();
    };

    initKairoCta();
});
