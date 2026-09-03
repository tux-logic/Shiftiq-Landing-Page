/**
 * Shiftiq — Video dock (play inline, YouTube, expand in-place) — patrón Viora
 */
const SolutionVideo = (() => {
  function parseYouTubeId(frame) {
    const id = (frame.dataset.youtubeId || '').trim();
    if (id) return id;

    const url = (frame.dataset.youtubeUrl || frame.dataset.videoUrl || '').trim();
    if (!url) return '';

    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes('youtu.be')) {
        return parsed.pathname.replace('/', '').split('?')[0];
      }
      if (parsed.searchParams.has('v')) {
        return parsed.searchParams.get('v');
      }
      const parts = parsed.pathname.split('/').filter(Boolean);
      const embedIndex = parts.indexOf('embed');
      if (embedIndex >= 0 && parts[embedIndex + 1]) {
        return parts[embedIndex + 1];
      }
    } catch {
      return '';
    }
    return '';
  }

  function youtubeWatchUrl(id) {
    return `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`;
  }

  function embedIframe(id) {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&modestbranding=1`;
    iframe.title = 'Shiftiq platform video';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    return iframe;
  }

  function collapseExpand(frame) {
    const expandPanel = frame.querySelector('[data-video-expand-panel]');
    const expandBtn = frame.querySelector('[data-video-expand]');

    frame.classList.remove('is-expanded');
    expandBtn?.setAttribute('aria-expanded', 'false');

    if (expandPanel) {
      expandPanel.hidden = true;
      expandPanel.setAttribute('aria-hidden', 'true');
    }
  }

  function toggleExpand(frame) {
    const expandPanel = frame.querySelector('[data-video-expand-panel]');
    const expandBtn = frame.querySelector('[data-video-expand]');
    const isExpanded = frame.classList.contains('is-expanded');

    if (isExpanded) {
      collapseExpand(frame);
      return;
    }

    frame.classList.remove('is-playing');
    const player = frame.querySelector('.solution-video__player');
    if (player) {
      player.hidden = true;
      player.setAttribute('aria-hidden', 'true');
      player.innerHTML = '';
    }

    frame.classList.add('is-expanded');
    expandBtn?.setAttribute('aria-expanded', 'true');

    if (expandPanel) {
      expandPanel.hidden = false;
      expandPanel.setAttribute('aria-hidden', 'false');
    }

    if (window.lucide) lucide.createIcons();
  }

  function playInline(frame) {
    const id = parseYouTubeId(frame);
    const player = frame.querySelector('.solution-video__player');
    if (!id || !player) return;

    collapseExpand(frame);

    if (player.querySelector('iframe')) {
      frame.classList.add('is-playing');
      player.hidden = false;
      player.setAttribute('aria-hidden', 'false');
      return;
    }

    player.innerHTML = '';
    player.appendChild(embedIframe(id));
    frame.classList.add('is-playing');
    player.hidden = false;
    player.setAttribute('aria-hidden', 'false');
  }

  function init() {
    const frame = document.querySelector('[data-solution-video]');
    if (!frame) return;

    const youtubeBtn = frame.querySelector('[data-video-youtube]');
    const playBtn = frame.querySelector('[data-video-play]');
    const expandBtn = frame.querySelector('[data-video-expand]');

    function refreshYouTubeLink() {
      const id = parseYouTubeId(frame);
      if (!youtubeBtn) return;

      if (id) {
        youtubeBtn.href = youtubeWatchUrl(id);
        youtubeBtn.classList.remove('is-disabled');
        youtubeBtn.removeAttribute('aria-disabled');
      } else {
        youtubeBtn.href = '#';
        youtubeBtn.classList.add('is-disabled');
        youtubeBtn.setAttribute('aria-disabled', 'true');
      }
    }

    refreshYouTubeLink();

    playBtn?.addEventListener('click', () => playInline(frame));

    youtubeBtn?.addEventListener('click', (e) => {
      if (!parseYouTubeId(frame)) e.preventDefault();
    });

    expandBtn?.addEventListener('click', () => toggleExpand(frame));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && frame.classList.contains('is-expanded')) {
        collapseExpand(frame);
      }
    });

    document.addEventListener('languageChanged', refreshYouTubeLink);

    if (window.lucide) lucide.createIcons();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => SolutionVideo.init());
