
(function() {
  const title = document.getElementById('typed-title');
  const titleText = 'LDHY';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (title && !reducedMotion) {
    title.textContent = '';
    let position = 0;
    const typeNextCharacter = () => {
      if (position >= titleText.length) return;
      title.textContent += titleText[position++];
      window.setTimeout(typeNextCharacter, 140);
    };
    window.setTimeout(typeNextCharacter, 250);
  }

  const searchInput = document.getElementById('search');
  const difficultyFilter = document.getElementById('difficulty-filter');
  const familyFilter = document.getElementById('family-filter');
  const sections = document.querySelectorAll('main > section');
  const emptyState = document.getElementById('empty-state');
  const resultsStatus = document.getElementById('results-status');

  function updateFamilyOptions() {
    Array.from(familyFilter.options).forEach(option => {
      if (option.value === 'all') return;
      const section = document.querySelector(`main > section[data-section="${option.value}"]`);
      option.hidden = !section || section.querySelectorAll('.card').length === 0;
    });

    if (familyFilter.selectedOptions[0]?.hidden) {
      familyFilter.value = 'all';
    }
  }

  function filterCards() {
    updateFamilyOptions();
    const query = searchInput.value.toLowerCase().trim();
    const difficulty = difficultyFilter.value;
    const family = familyFilter.value;
    let visibleCount = 0;

    document.querySelectorAll('main > section .card').forEach(card => {
      const name = card.querySelector('h3').textContent.toLowerCase();
      const cardDifficulty = card.dataset.diff || '';
      const cardFamily = card.closest('section').dataset.section;
      const matchesSearch = !query || name.includes(query);
      const matchesDifficulty = difficulty === 'all' || cardDifficulty === difficulty;
      const matchesFamily = family === 'all' || cardFamily === family;

      const isVisible = matchesSearch && matchesDifficulty && matchesFamily;
      card.hidden = !isVisible;
      if (isVisible) visibleCount++;
    });

    sections.forEach(section => {
      const visibleCountInSection = section.querySelectorAll('.card:not([hidden])').length;
      const count = section.querySelector('.count');
      if (count) count.textContent = visibleCountInSection;
      section.hidden = visibleCountInSection === 0;
    });

    emptyState.classList.toggle('visible', visibleCount === 0);
    resultsStatus.textContent = `${visibleCount} ${visibleCount === 1 ? 'distribution' : 'distributions'} found.`;
  }

  searchInput.addEventListener('input', filterCards);
  difficultyFilter.addEventListener('change', filterCards);
  familyFilter.addEventListener('change', filterCards);

  // Apply visibility rules immediately, including hiding empty categories on page load.
  filterCards();
})();
