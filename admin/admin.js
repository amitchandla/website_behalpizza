const PIN_KEY = 'gpc_admin_pin';
const SESSION_KEY = 'gpc_admin_unlocked'; // sessionStorage — re-locks when tab closes

function getPin() {
  return localStorage.getItem(PIN_KEY) || '1234';
}

const lockCard = document.getElementById('lockCard');
const adminPanel = document.getElementById('adminPanel');
const pinInput = document.getElementById('pinInput');
const unlockBtn = document.getElementById('unlockBtn');
const lockStatus = document.getElementById('lockStatus');

function showPanel() {
  lockCard.style.display = 'none';
  adminPanel.style.display = 'block';
  renderAll();
}

if (sessionStorage.getItem(SESSION_KEY) === 'true') {
  showPanel();
}

unlockBtn.addEventListener('click', attemptUnlock);
pinInput.addEventListener('keydown', e => { if (e.key === 'Enter') attemptUnlock(); });

function attemptUnlock() {
  if (pinInput.value === getPin()) {
    sessionStorage.setItem(SESSION_KEY, 'true');
    lockStatus.textContent = '';
    showPanel();
  } else {
    lockStatus.textContent = 'Incorrect PIN. Try again.';
    lockStatus.className = 'status-msg err';
  }
}

document.getElementById('changePinBtn').addEventListener('click', () => {
  const current = prompt('Enter your current PIN:');
  if (current === null) return;
  if (current !== getPin()) { alert('Current PIN is incorrect.'); return; }
  const next = prompt('Enter a new PIN (numbers or letters):');
  if (!next) return;
  localStorage.setItem(PIN_KEY, next);
  alert('PIN updated.');
});

document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('This removes all admin-added photos and un-hides any default photos. Continue?')) return;
  GPCStore.resetAll();
  renderAll();
});

// ============ Thumbnail rendering ============
function renderAll() {
  renderThumbs('gallery', 'galleryThumbs');
  renderThumbs('party', 'partyThumbs');
}

function renderThumbs(section, mountId) {
  const mount = document.getElementById(mountId);
  const items = GPCStore.getCombined(section);
  if (!items.length) {
    mount.innerHTML = `<p style="color:var(--cream-dim); font-size:13.5px;">No photos yet — add one below.</p>`;
    return;
  }
  mount.innerHTML = items.map(item => `
    <div class="thumb">
      <img src="${item.isDefault ? '../' + item.src : item.src}" alt="${item.alt || item.caption || ''}">
      <span class="tag">${item.isDefault ? 'Default' : 'Added'}</span>
      <button class="remove-btn" data-section="${section}" data-id="${item.id}" data-default="${item.isDefault}" title="Remove from website" aria-label="Remove photo">✕</button>
    </div>
  `).join('');

  mount.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const { section, id, default: isDefault } = btn.dataset;
      const label = isDefault === 'true' ? 'hide this default photo' : 'remove this photo';
      if (!confirm(`Are you sure you want to ${label}?`)) return;
      if (isDefault === 'true') {
        GPCStore.hideDefault(id);
      } else {
        GPCStore.removeExtra(section, id);
      }
      renderAll();
    });
  });
}

// ============ Upload + client-side resize/optimize ============
function setupUpload(inputId, statusId, section) {
  const input = document.getElementById(inputId);
  const status = document.getElementById(statusId);
  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      status.textContent = 'Please choose an image file.';
      status.className = 'status-msg err';
      return;
    }
    status.textContent = 'Processing…';
    status.className = 'status-msg';

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Resize to a reasonable max width for fast web loading, keep aspect ratio
        const maxW = 1200;
        const scale = Math.min(1, maxW / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);

        const item = {
          id: `${section}-${Date.now()}`,
          src: dataUrl,
          caption: '',
          alt: `${section === 'gallery' ? 'Gallery' : 'Party hall'} photo at Golden Pizza Cafe`
        };
        const success = GPCStore.addExtra(section, item);
        if (success) {
          status.textContent = 'Photo added.';
          status.className = 'status-msg ok';
          renderAll();
        } else {
          status.textContent = 'Could not save — this browser\'s storage may be full. Try a smaller image or remove some existing photos.';
          status.className = 'status-msg err';
        }
        input.value = '';
      };
      img.onerror = () => {
        status.textContent = 'Could not read that image. Try a different file.';
        status.className = 'status-msg err';
      };
      img.src = e.target.result;
    };
    reader.onerror = () => {
      status.textContent = 'Could not read that file.';
      status.className = 'status-msg err';
    };
    reader.readAsDataURL(file);
  });
}

setupUpload('galleryUpload', 'galleryStatus', 'gallery');
setupUpload('partyUpload', 'partyStatus', 'party');
