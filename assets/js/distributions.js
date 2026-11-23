
const DIFFICULTY_RANK = { Beginner: 1, Intermediate: 2, Advanced: 3, Expert: 4 };
let distros = [];
let sortMode = 'date';

const content = document.getElementById('content');
const searchInput = document.getElementById('search');

function slugifyName(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function releaseYear(value) {
  const match = String(value || '').match(/\b(?:19|20)\d{2}\b/);
  return match ? Number(match[0]) : null;
}

function setSort(mode) {
  sortMode = mode;
  document.querySelectorAll('.sortbtn').forEach(button => {
    const active = button.dataset.sort === mode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  filter();
}

function makeText(tag, className, value) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = value;
  return element;
}

function render(query = '') {
  const term = query.trim().toLocaleLowerCase();
  const list = distros.filter(distro =>
    !term || Object.values(distro).some(value =>
      String(value ?? '').toLocaleLowerCase().includes(term)
    )
  );

  list.sort((a, b) => {
    if (sortMode === 'diff') {
      return (DIFFICULTY_RANK[a.difficulty] || 99) -
        (DIFFICULTY_RANK[b.difficulty] || 99) ||
        a.name.localeCompare(b.name);
    }
    const yearA = releaseYear(a.release) ?? Infinity;
    const yearB = releaseYear(b.release) ?? Infinity;
    return yearA - yearB || a.name.localeCompare(b.name);
  });

  const fragment = document.createDocumentFragment();
  const grid = makeText('div', 'grid', '');
  list.forEach(distro => {
    const card = document.createElement('a');
    card.className = 'card';
    card.href = 'distro.html?id=' + encodeURIComponent(slugifyName(distro.name));

    const year = releaseYear(distro.release);
    const name = makeText('div', 'name', distro.name + (year ? ' · ' + year : ''));
    const meta = makeText('div', 'meta', [distro.family, distro.package_manager].filter(Boolean).join(' · '));
    const base = makeText('span', 'base', distro.based_on || distro.family || 'Base not specified');
    const difficulty = makeText('span', '', distro.difficulty || 'Difficulty not specified');

    card.append(name, meta, base, document.createTextNode(' · '), difficulty);
    grid.appendChild(card);
  });

  const summary = makeText('div', 'count',
    list.length + ' distributions shown (sorted by ' +
    (sortMode === 'date' ? 'release year' : 'difficulty') + ')'
  );
  summary.setAttribute('role', 'status');
  summary.setAttribute('aria-live', 'polite');
  summary.setAttribute('aria-atomic', 'true');
  fragment.appendChild(summary);

  if (list.length) {
    fragment.appendChild(grid);
  } else {
    fragment.appendChild(makeText('p', 'empty', 'No distributions match your search.'));
  }
  content.replaceChildren(fragment);
}

function filter() {
  render(searchInput.value);
}

document.querySelectorAll('.sortbtn').forEach(button => {
  button.addEventListener('click', () => setSort(button.dataset.sort));
  button.setAttribute('aria-pressed', String(button.dataset.sort === sortMode));
});
searchInput.addEventListener('input', filter);

fetch('distros.json')
  .then(response => {
    if (!response.ok) throw new Error('Catalog request failed: ' + response.status);
    return response.json();
  })
  .then(data => {
    if (!Array.isArray(data)) throw new Error('Catalog format is invalid.');
    distros = data;
    render(searchInput.value);
  })
  .catch(error => {
    console.error('LDHY archive:', error);
    content.replaceChildren(makeText('p', 'empty',
      'The distribution catalog could not be loaded. Please try again later.'
    ));
  });
