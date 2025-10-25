// Cursor module: creates a custom spotlight cursor that follows the mouse
export function initCustomCursor() {
  if (typeof window === 'undefined' || 'ontouchstart' in window) return { destroy: () => {} };

  const stage = document.getElementById('curtainStage');
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor cursor--hidden';
  document.body.appendChild(cursor);
  document.body.classList.add('use-custom-cursor');

  function updateCursorState(clientX, clientY) {
    cursor.style.left = clientX + 'px';
    cursor.style.top = clientY + 'px';

    const el = document.elementFromPoint(clientX, clientY);
    const overCurtain = el && (el.closest && (el.closest('.curtain') || el.closest('.curtain-billboard')));
    const stageHidden = stage && stage.getAttribute('aria-hidden') === 'true';

    if (overCurtain && !stageHidden) {
      cursor.classList.remove('cursor--small', 'cursor--hidden');
      cursor.classList.add('cursor--big');
    } else {
      cursor.classList.remove('cursor--big', 'cursor--hidden');
      cursor.classList.add('cursor--small');
    }
  }

  function onMouseMove(e) { updateCursorState(e.clientX, e.clientY); }
  function onMouseOut(e) { if (!e.relatedTarget) cursor.classList.add('cursor--hidden'); }
  function onMouseEnter() { cursor.classList.remove('cursor--hidden'); }

  document.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('mouseout', onMouseOut);
  window.addEventListener('mouseenter', onMouseEnter);

  const mo = (stage && window.MutationObserver) ? new MutationObserver(() => {
    const evt = window._lastMouseEvent;
    if (evt) updateCursorState(evt.clientX, evt.clientY);
  }) : null;
  if (mo && stage) mo.observe(stage, { attributes: true, attributeFilter: ['aria-hidden'] });

  // store last pointer
  document.addEventListener('mousemove', (e) => { window._lastMouseEvent = e; }, { passive: true });

  function destroy() {
    document.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseout', onMouseOut);
    window.removeEventListener('mouseenter', onMouseEnter);
    if (mo) mo.disconnect();
    if (cursor && cursor.parentNode) cursor.parentNode.removeChild(cursor);
    document.body.classList.remove('use-custom-cursor');
  }

  return { destroy };
}
