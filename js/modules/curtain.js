// Curtain module: handles scroll-driven curtain reveal
export function initCurtain({ openFactor = 1.6 } = {}) {
  const left = document.getElementById('curtainLeft');
  const right = document.getElementById('curtainRight');
  const stage = document.getElementById('curtainStage');
  const hint = document.getElementById('openHint');

  if (!left || !right || !stage || !hint) {
    return { destroy: () => {} };
  }

  const OPEN_FACTOR = openFactor;

  function getProgress() {
    const y = window.scrollY || window.pageYOffset;
    const h = window.innerHeight || document.documentElement.clientHeight;
    return Math.min(Math.max((y / h) * OPEN_FACTOR, 0), 1);
  }

  let rafId = null;
  function onScroll() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const p = getProgress();
      const leftX = -p * 110;
      const rightX = p * 110;
      left.style.transform = `translateX(${leftX}%)`;
      right.style.transform = `translateX(${rightX}%)`;

      if (p >= 0.995) {
        left.classList.add('open-left');
        right.classList.add('open-right');
        stage.setAttribute('aria-hidden', 'true');
        hint.style.opacity = '0';
        hint.style.pointerEvents = 'none';
      } else {
        left.classList.remove('open-left');
        right.classList.remove('open-right');
        stage.setAttribute('aria-hidden', 'false');
        hint.style.opacity = '1';
        hint.style.pointerEvents = 'auto';
      }
    });
  }

  function onHintClick() {
    const target = Math.max(0, window.innerHeight / OPEN_FACTOR);
    window.scrollTo({ top: target, behavior: 'smooth' });
  }

  function init() {
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    hint.addEventListener('click', onHintClick);
  }

  function destroy() {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    hint.removeEventListener('click', onHintClick);
    if (rafId) cancelAnimationFrame(rafId);
  }

  init();
  return { destroy, getProgress };
}
