/**
 * Shiftiq — Video placeholder (sección Solución)
 * Asigna data-video-url en el HTML para activar el botón play.
 */
const SolutionVideo = (() => {
  function init() {
    const frame = document.querySelector('[data-solution-video]');
    if (!frame) return;

    const playBtn = frame.querySelector('.solution-video__play');
    if (!playBtn) return;

    function bindVideo() {
      const url = (frame.dataset.videoUrl || '').trim();
      if (!url) {
        playBtn.disabled = true;
        return;
      }

      playBtn.disabled = false;
      playBtn.onclick = () => {
        window.open(url, '_blank', 'noopener,noreferrer');
      };
    }

    bindVideo();
    document.addEventListener('languageChanged', bindVideo);
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => SolutionVideo.init());
