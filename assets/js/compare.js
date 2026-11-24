const COMPARE_KEY = 'ldhy.compare';
const content = document.getElementById('compare-content');
const fields = [
  ['Description', 'description'],
  ['Family', 'family'],
  ['Difficulty estimate', 'difficulty'],
  ['Creator / developer', 'creator'],
  ['Initial release', 'release'],
  ['Based on', 'based_on'],
  ['Package manager', 'package_manager'],
  ['Maintenance status', 'status'],
  ['Pricing', 'price'],
  ['Last verified', 'verified']
];

function slugifyName(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function readComparison() {
  try {
    const value = JSON.parse(localStorage.getItem(COMPARE_KEY) || '[]');
    return Array.isArray(value) ? [...new Set(value.filter(item => typeof item === 'string'))].slice(0, 3) : [];
  } catch {
    return [];
  }
}

function makeText(tag, className, value) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.textContent = value;
  return node;
}

function safeLink(value, label) {
  try {
    const url = new URL(String(value || ''));
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    const link = makeText('a', '', label);
    link.href = url.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    return link;
  } catch {
    return null;
  }
}

function render(records, ids) {
  const selected = ids.map(id => records.find(item => slugifyName(item.name) === id)).filter(Boolean);
  if (selected.length < 2) {
    const empty = makeText('section', 'compare-empty', '');
    empty.append(
      makeText('p', '', selected.length ? 'Select at least one more distribution to compare.' : 'Choose two or three distributions from the archive to start a comparison.'),
      safeLink('https://animeking138.github.io/LDHY/distributions.html', 'Browse distributions')
    );
    content.replaceChildren(empty);
    return;
  }

  const wrap = makeText('div', 'compare-table-wrap', '');
  const table = document.createElement('table');
  table.className = 'compare-table';
  const head = document.createElement('thead');
  const headRow = document.createElement('tr');
  headRow.appendChild(makeText('th', '', 'Specification'));
  selected.forEach(item => {
    const th = document.createElement('th');
    const link = makeText('a', 'compare-name', item.name);
    link.href = 'distro.html?id=' + encodeURIComponent(slugifyName(item.name));
    const remove = makeText('button', 'compare-remove', 'Remove');
    remove.type = 'button';
    remove.dataset.id = slugifyName(item.name);
    th.append(link, remove);
    headRow.appendChild(th);
  });
  head.appendChild(headRow);
  table.appendChild(head);

  const body = document.createElement('tbody');
  fields.forEach(([label, key]) => {
    const row = document.createElement('tr');
    row.appendChild(makeText('th', '', label));
    selected.forEach(item => row.appendChild(makeText('td', '', item[key] || 'Not listed')));
    body.appendChild(row);
  });

  for (const [label, key, linkLabel] of [
    ['Official website', 'website', 'Visit website ↗'],
    ['Project / download', 'download', 'Open project page ↗']
  ]) {
    const row = document.createElement('tr');
    row.appendChild(makeText('th', '', label));
    selected.forEach(item => {
      const cell = document.createElement('td');
      const link = safeLink(item[key], linkLabel);
      cell.appendChild(link || document.createTextNode('Not listed'));
      row.appendChild(cell);
    });
    body.appendChild(row);
  }
  table.appendChild(body);
  wrap.appendChild(table);
  content.replaceChildren(wrap, makeText('p', 'compare-footnote', 'Blank catalog fields are shown as “Not listed”; this does not mean the feature is unavailable.'));
  wrap.addEventListener('click', event => {
    const button = event.target.closest('.compare-remove');
    if (!button) return;
    const next = readComparison().filter(id => id !== button.dataset.id);
    try { localStorage.setItem(COMPARE_KEY, JSON.stringify(next)); } catch {}
    render(records, next);
  });
}

fetch('distros.json')
  .then(response => {
    if (!response.ok) throw new Error('Catalog request failed: ' + response.status);
    return response.json();
  })
  .then(records => {
    if (!Array.isArray(records)) throw new Error('Catalog format is invalid.');
    render(records, readComparison());
  })
  .catch(() => content.replaceChildren(makeText('p', 'empty', 'The comparison catalog could not be loaded. Please try again later.')));
