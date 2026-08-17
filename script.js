// ============ Nav toggle (mobile) ============
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ============ Menu tabs ============
const tabs = document.querySelectorAll('.menu-tab');
const panels = document.querySelectorAll('.menu-panel');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const panel = document.querySelector(`.menu-panel[data-panel="${tab.dataset.tab}"]`);
    if (panel) panel.classList.add('active');
  });
});

// ============ Footer year ============
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============ Render photo card ============
function renderPhotoCard(item) {
  const hasResponsive = !!item.srcset;
  const picture = hasResponsive
    ? `<picture>
        ${item.webpSrcset ? `<source type="image/webp" srcset="${item.webpSrcset}" sizes="(max-width:700px) 90vw, 380px">` : ''}
        <img src="${item.src}" srcset="${item.srcset}" sizes="(max-width:700px) 90vw, 380px" alt="${item.alt || item.caption || ''}" loading="lazy" width="800" height="600">
      </picture>`
    : `<img src="${item.src}" alt="${item.alt || item.caption || ''}" loading="lazy">`;
  return `<div class="photo-card">${picture}${item.caption ? `<span class="cap">${item.caption}</span>` : ''}</div>`;
}

// ============ Populate Gallery + Party Hall from shared store ============
function renderSection(sectionKey, mountId) {
  const mount = document.getElementById(mountId);
  if (!mount || typeof GPCStore === 'undefined') return;
  const items = GPCStore.getCombined(sectionKey);
  if (!items.length) {
    mount.innerHTML = `<p style="color:var(--ink-soft);">No photos yet — add some from the Admin panel.</p>`;
    return;
  }
  mount.innerHTML = items.map(renderPhotoCard).join('');
}

renderSection('gallery', 'galleryGrid');
renderSection('party', 'partyGrid');
