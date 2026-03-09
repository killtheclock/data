/* ============================================================
   ΕΠΙΣΤΗΜΟΝΙΚΕΣ ΣΗΜΕΙΩΣΕΙΣ — main.js
   ============================================================ */
'use strict';

const CATEGORIES = {
  math:       { label: 'Μαθηματικά',  color: '#7eb8f7' },
  physics:    { label: 'Φυσική',      color: '#a78cf0' },
  chemistry:  { label: 'Χημεία',      color: '#6ddbb4' },
  literature: { label: 'Λογοτεχνία', color: '#f0a96e' },
  notes:      { label: 'Σημειώσεις', color: '#e07898' },
};

let allPages     = [];
let activeCat    = 'all';
let activeSubcat = 'all';

const loadingEl   = document.getElementById('loading');
const gridEl      = document.getElementById('grid');
const emptyEl     = document.getElementById('empty-state');
const subtabBar   = document.getElementById('subtab-bar');
const subtabInner = document.getElementById('subtab-inner');
const tabs        = document.querySelectorAll('.tab');

// ── BACKGROUND CANVAS ────────────────────────────────────────
function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let dots = [], W, H;
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  function buildDots() {
    dots = [];
    const cols = Math.floor(W / 32), rows = Math.floor(H / 32);
    for (let x = 0; x <= cols; x++)
      for (let y = 0; y <= rows; y++)
        dots.push({ x: x*32, y: y*32, r: Math.random() });
  }
  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    dots.forEach(d => {
      const alpha = 0.12 + 0.08 * Math.sin(t * 0.0004 + d.r * 6.28);
      ctx.fillStyle = `rgba(100,120,180,${alpha})`;
      ctx.beginPath();
      ctx.arc(d.x, d.y, 1, 0, Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  resize(); buildDots();
  window.addEventListener('resize', () => { resize(); buildDots(); });
  requestAnimationFrame(draw);
}

// ── MATHJAX ──────────────────────────────────────────────────
async function typesetElement(el) {
  if (!window.MathJax || !el) return;
  await MathJax.startup.promise;
  await MathJax.typesetPromise([el]);
}

// ── BUILD CARD ───────────────────────────────────────────────
function buildCard(page, index) {
  const cat    = page.category    || 'notes';
  const subcat = page.subcategory || '';
  const label  = CATEGORIES[cat]?.label || cat;

  const a = document.createElement('a');
  a.className   = 'card';
  a.dataset.cat = cat;
  if (subcat) a.dataset.subcat = subcat.toLowerCase();
  a.href = page.url || '#';
  a.style.animationDelay = `${index * 0.055}s`;

  const tagHtml = subcat
    ? `<span class="card-tag">${label} <span class="card-tag-sub">/ ${subcat}</span></span>`
    : `<span class="card-tag">${label}</span>`;

  const formulaHtml = page.formula
    ? `<div class="card-formula">\\( ${page.formula} \\)</div>`
    : '';

  a.innerHTML = `
    ${tagHtml}
    <h2 class="card-title">${page.title}</h2>
    ${formulaHtml}
    ${page.description ? `<p class="card-desc">${page.description}</p>` : ''}
    <div class="card-footer">
      <span class="card-date">${page.date || ''}</span>
      <span class="card-arrow">→</span>
    </div>
  `;
  return a;
}

// ── COUNTS ───────────────────────────────────────────────────
function updateCounts(pages) {
  const counts = { all: pages.length };
  pages.forEach(p => {
    const c = p.category || 'notes';
    counts[c] = (counts[c] || 0) + 1;
  });
  Object.entries(counts).forEach(([cat, n]) => {
    const el = document.getElementById(`cnt-${cat}`);
    if (el) el.textContent = n;
  });
}

// ── SUB-TABS ─────────────────────────────────────────────────
function buildSubtabs(cat) {
  subtabInner.innerHTML = '';
  const subcats = [...new Set(
    allPages
      .filter(p => p.category === cat && p.subcategory)
      .map(p => p.subcategory.toLowerCase())
  )].sort();

  if (subcats.length === 0) { subtabBar.hidden = true; return; }

  const allBtn = document.createElement('button');
  allBtn.className = 'subtab active';
  allBtn.dataset.subcat = 'all';
  allBtn.innerHTML = `<span class="subtab-label">Όλα</span>`;
  subtabInner.appendChild(allBtn);

  subcats.forEach(sc => {
    const count = allPages.filter(
      p => p.category === cat && (p.subcategory || '').toLowerCase() === sc
    ).length;
    const btn = document.createElement('button');
    btn.className = 'subtab';
    btn.dataset.subcat = sc;
    btn.innerHTML = `<span class="subtab-label">${sc.charAt(0).toUpperCase() + sc.slice(1)}</span><span class="subtab-count">${count}</span>`;
    subtabInner.appendChild(btn);
  });

  subtabBar.style.setProperty('--subcat-accent', CATEGORIES[cat]?.color || '#8a92b2');
  subtabBar.hidden = false;
  activeSubcat = 'all';

  subtabInner.querySelectorAll('.subtab').forEach(btn => {
    btn.addEventListener('click', () => {
      subtabInner.querySelectorAll('.subtab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeSubcat = btn.dataset.subcat;
      applyFilter();
    });
  });
}

// ── FILTER ───────────────────────────────────────────────────
function applyFilter() {
  const cards = gridEl.querySelectorAll('.card[data-cat]');
  let visible = 0;
  cards.forEach(card => {
    const catOk    = activeCat === 'all' || card.dataset.cat === activeCat;
    const subcatOk = activeSubcat === 'all' || (card.dataset.subcat || '') === activeSubcat;
    const show = catOk && subcatOk;
    card.classList.toggle('hidden', !show);
    if (show) visible++;
  });
  emptyEl.hidden = visible > 0;
}

// ── TABS ─────────────────────────────────────────────────────
function initTabs() {
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-pressed','false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-pressed','true');
      activeCat    = tab.dataset.cat;
      activeSubcat = 'all';
      activeCat === 'all' ? (subtabBar.hidden = true) : buildSubtabs(activeCat);
      applyFilter();
    });
  });
}

// ── LOAD pages.json ──────────────────────────────────────────
async function loadPages() {
  // Χρησιμοποιούμε την τρέχουσα URL του document
  // ώστε να λειτουργεί σωστά σε subfolder (π.χ. /data/)
  const base = document.baseURI || window.location.href;
  const jsonUrl = new URL('pages.json', base).href;

  try {
    const res = await fetch(jsonUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status} — ${jsonUrl}`);
    allPages = await res.json();
  } catch (err) {
    loadingEl.innerHTML = `<span class="loading-text" style="color:#e07898">// Σφάλμα φόρτωσης: ${err.message}</span>`;
    return;
  }

  loadingEl.hidden = true;
  gridEl.hidden    = false;
  updateCounts(allPages);

  const fragment = document.createDocumentFragment();
  allPages.forEach((page, i) => fragment.appendChild(buildCard(page, i)));
  gridEl.insertBefore(fragment, emptyEl);

  await typesetElement(document.getElementById('header-formula'));
  await typesetElement(gridEl);
}

// ── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  initTabs();
  loadPages();
});
