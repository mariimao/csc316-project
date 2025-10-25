// Genre selector module: handles search and chip interactions
export function initGenreSelector(root = document) {
  const search = root.getElementById ? root.getElementById('genreSearch') : document.getElementById('genreSearch');
  const chips = root.getElementById ? root.getElementById('genreChips') : document.getElementById('genreChips');
  const explorer = document.querySelector('.genre-explorer');

  if (!search || !chips || !explorer) return { destroy: () => {} };

  const chipButtons = Array.from(chips.querySelectorAll('.genre-chip'));
  const genreCards = Array.from(explorer.querySelectorAll('.genre-card'));

  function selectGenre(name) {
    chipButtons.forEach(b => b.classList.toggle('selected', b.dataset.genre === name));
    genreCards.forEach(c => c.classList.toggle('selected', c.dataset.genre === name));
    const card = genreCards.find(c => c.dataset.genre === name);
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function onChipClick(e) {
    const name = e.currentTarget.dataset.genre;
    selectGenre(name);
  }

  function onSearchInput(e) {
    const q = (e.target.value || '').trim().toLowerCase();
    genreCards.forEach(c => {
      const t = (c.textContent || '').toLowerCase();
      c.style.display = q === '' || t.includes(q) ? '' : 'none';
    });
    const matchChip = chipButtons.find(b => (b.textContent || '').toLowerCase().includes(q));
    if (q !== '' && matchChip) selectGenre(matchChip.dataset.genre);
  }

  chipButtons.forEach(b => b.addEventListener('click', onChipClick));
  search.addEventListener('input', onSearchInput);

  function destroy() {
    chipButtons.forEach(b => b.removeEventListener('click', onChipClick));
    search.removeEventListener('input', onSearchInput);
  }

  return { destroy, selectGenre };
}
