import { initCurtain } from './modules/curtain.js';
import { initGenreSelector } from './modules/genreSelector.js';
import { initCustomCursor } from './modules/cursor.js';

// Entry point: wire modules and initialize them on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const curtain = initCurtain({ openFactor: 1.6 });
  const selector = initGenreSelector(document);
  const cursor = initCustomCursor();

  // expose for debugging in dev console
  window.__app = { curtain, selector, cursor };
});

