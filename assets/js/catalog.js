(() => {
  'use strict';
  const DIFFICULTY_RANK = { Beginner: 1, Intermediate: 2, Advanced: 3, Expert: 4 };
  const COMPARE_KEY = 'ldhy.compare';
  const LIMIT = 3;
  let distros = [];
  let sortMode = 'newest';
  let selected = readSelection();
  const $ = id => document.getElementById(id);
  const content = $('content'), search = $('search'), family = $('family-filter'), difficulty = $('difficulty-filter');
  const bar = $('compare-bar'), count = $('compare-count'), openCompare = $('compare-open');
  const panel = $('comparison-panel'), compareContent = $('compare-content');
  const slug = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const year = value => { const match = String(value || '').match(/\b(?:19|20)\d{2}\b/); return match ? Number(match[0]) : null; };
  function readSelection() { try { const value = JSON.parse(localStorage.getItem(COMPARE_KEY) || '[]'); return Array.isArray(value) ? [...new Set(value.filter(x => typeof x === 'string'))].slice(0, LIMIT) : []; } catch { return []; } }
  function saveSelection() { try { localStorage.setItem(COMPARE_KEY, JSON.stringify(selected)); } catch {} updateSelection(); }
  function node(tag, className, text) { const el = document.createElement(tag); if (className) el.className = className; if (text !== undefined) el.textContent = text; return el; }
  function updateSelection() {
    bar.hidden = selected.length === 0;
    count.textContent = selected.length + ' of ' + LIMIT + ' selected';
    openCompare.disabled = selected.length < 2;
    document.querySelectorAll('.compare-toggle').forEach(button => {
      const active = selected.includes(button.dataset.id);
      button.setAttribute('aria-pressed', String(active));
      button.textContent = active ? 'Added ✓' : 'Compare';
      button.disabled = !active && selected.length >= LIMIT;
    });
  }
  function toggle(id) { selected = selected.includes(id) ? selected.filter(x => x !== id) : selected.length < LIMIT ? [...selected, id] : selected; saveSelection(); }
  function populateFilters() {
    for (const [select, values, label] of [[family, [...new Set(distros.map(x => x.family).filter(Boolean))].sort(), 'All families'], [difficulty, Object.keys(DIFFICULTY_RANK), 'All difficulties']]) {
      select.replaceChildren(); const option = node('option', '', label); option.value = ''; select.append(option);
      values.forEach(value => { const opt = node('option', '', value); opt.value = value; select.append(opt); });
    }
  }
  function render() {
    const term = search.value.trim().toLocaleLowerCase();
    const list = distros.filter(item => (!term || Object.values(item).some(v => String(v ?? '').toLocaleLowerCase().includes(term))) && (!family.value || item.family === family.value) && (!difficulty.value || item.difficulty === difficulty.value));
    list.sort((a,b) => {
      if (sortMode === 'name') return a.name.localeCompare(b.name);
      if (sortMode === 'diff') return (DIFFICULTY_RANK[a.difficulty] || 99) - (DIFFICULTY_RANK[b.difficulty] || 99) || a.name.localeCompare(b.name);
      const ay=year(a.release), by=year(b.release);
      if (ay === null) return by === null ? a.name.localeCompare(b.name) : 1;
      if (by === null) return -1;
      return (sortMode === 'oldest' ? ay-by : by-ay) || a.name.localeCompare(b.name);
    });
    const fragment = document.createDocumentFragment(), grid = node('div','grid catalog-cards');
    list.forEach(item => {
      const id=slug(item.name), card=node('article','catalog-card'), link=node('a','catalog-link');
      link.href='distro.html?id='+encodeURIComponent(id);
      link.append(node('strong','catalog-name',item.name));
      link.append(node('span','catalog-meta',[item.family,item.package_manager].filter(Boolean).join(' · ') || 'Details not listed'));
      link.append(node('span','catalog-base',item.based_on || 'Base not specified'));
      link.append(node('span','catalog-difficulty',item.difficulty || 'Not specified'));
      const compare=node('button','compare-toggle','Compare'); compare.type='button'; compare.dataset.id=id; compare.addEventListener('click',()=>toggle(id));
      card.append(link,compare); grid.append(card);
    });
    $('catalog-count').textContent=list.length+' / '+distros.length;
    $('results-status').textContent=list.length+' distributions found.';
    if(list.length) fragment.append(grid); else fragment.append(node('p','empty','No distributions match your search.'));
    content.replaceChildren(fragment); updateSelection();
  }
  const fields=[['Description','description'],['Family','family'],['Difficulty estimate','difficulty'],['Creator / developer','creator'],['Initial release','release'],['Based on','based_on'],['Package manager','package_manager'],['Maintenance status','status'],['Pricing','price'],['Last verified','verified']];
  function safeLink(value,label) { try { const url=new URL(String(value||'')); if(!['http:','https:'].includes(url.protocol)) return null; const a=node('a','',label); a.href=url.href; a.target='_blank'; a.rel='noopener noreferrer'; return a; } catch { return null; } }
  function renderComparison() {
    const items=selected.map(id=>distros.find(item=>slug(item.name)===id)).filter(Boolean);
    if(items.length<2) { compareContent.replaceChildren(node('p','empty','Select at least two distributions from the catalog.')); return; }
    const wrap=node('div','compare-table-wrap'), table=node('table','compare-table'), thead=document.createElement('thead'), head=document.createElement('tr');
    head.append(node('th','','Specification'));
    items.forEach(item=>{const th=document.createElement('th'),a=node('a','compare-name',item.name),remove=node('button','compare-remove','Remove');a.href='distro.html?id='+encodeURIComponent(slug(item.name));remove.type='button';remove.dataset.id=slug(item.name);th.append(a,remove);head.append(th);});
    thead.append(head);table.append(thead);const tbody=document.createElement('tbody');
    fields.forEach(([label,key])=>{const row=document.createElement('tr');row.append(node('th','',label));items.forEach(item=>row.append(node('td','',item[key]||'Not listed')));tbody.append(row);});
    [['Official website','website','Visit website ↗'],['Project / download','download','Open project page ↗']].forEach(([label,key,linkLabel])=>{const row=document.createElement('tr');row.append(node('th','',label));items.forEach(item=>{const td=document.createElement('td');td.append(safeLink(item[key],linkLabel)||document.createTextNode('Not listed'));row.append(td);});tbody.append(row);});
    table.append(tbody);wrap.append(table);compareContent.replaceChildren(wrap,node('p','compare-footnote','Blank catalog fields are shown as “Not listed”; this does not mean the feature is unavailable.'));
    wrap.addEventListener('click',event=>{const button=event.target.closest('.compare-remove');if(!button)return;selected=selected.filter(id=>id!==button.dataset.id);saveSelection();renderComparison();});
  }
  function showComparison() { panel.hidden=false; $('catalog-heading').scrollIntoView({behavior:'smooth',block:'start'}); renderComparison(); }
  document.querySelectorAll('.sortbtn').forEach(button=>button.addEventListener('click',()=>{sortMode=button.dataset.sort;document.querySelectorAll('.sortbtn').forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active));});render();}));
  search.addEventListener('input',render);family.addEventListener('change',render);difficulty.addEventListener('change',render);
  $('compare-clear').addEventListener('click',()=>{selected=[];saveSelection();});
  openCompare.addEventListener('click',showComparison);
  $('comparison-close').addEventListener('click',()=>{panel.hidden=true;content.scrollIntoView({behavior:'smooth',block:'start'});});
  fetch('distros.json').then(response=>{if(!response.ok)throw new Error('Catalog request failed: '+response.status);return response.json();}).then(records=>{
    if(!Array.isArray(records))throw new Error('Catalog format is invalid.');
    distros=records;const valid=new Set(distros.map(item=>slug(item.name)));selected=selected.filter(id=>valid.has(id));saveSelection();populateFilters();render();
    if(location.hash==='#compare')showComparison();
  }).catch(error=>{console.error('LDHY catalog:',error);content.replaceChildren(node('p','empty','The distribution catalog could not be loaded. Please try again later.'));});
})();