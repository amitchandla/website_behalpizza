/* ============================================================
   GOLDEN PIZZA CAFE — image data + simple local storage layer
   ------------------------------------------------------------
   This lets the Admin panel (/admin/index.html) add or remove
   Gallery and Party Hall photos WITHOUT touching any website
   code. Photos you add in Admin are saved in this browser's
   localStorage and layered on top of the default photo set
   below. Default photos can also be hidden (not deleted) from
   Admin if you'd rather not show them anymore.

   IMPORTANT — how this storage works:
   localStorage lives in ONE browser on ONE device. Changes you
   make in Admin on your phone will show on the website when
   YOU view it in that same browser. They will NOT automatically
   show up for every visitor on their own phones/computers,
   because this site has no server/database behind it. If you
   need every visitor everywhere to see admin-managed photos,
   the images need to be hosted on a small backend/CMS instead
   of localStorage — ask your developer to wire this up if you
   reach that point. For a single-device kiosk/display or for
   previewing changes before you ask your developer to publish
   them, this works great as-is.
   ============================================================ */

const GPC_DEFAULT_GALLERY = [
  {
    id: "gallery-seating",
    caption: "Café seating",
    src: "assets/gallery/gallery-seating-800.jpg",
    srcset: "assets/gallery/gallery-seating-480.jpg 480w, assets/gallery/gallery-seating-800.jpg 800w, assets/gallery/gallery-seating-1200.jpg 1200w",
    webpSrcset: "assets/gallery/gallery-seating-480.webp 480w, assets/gallery/gallery-seating-800.webp 800w, assets/gallery/gallery-seating-1200.webp 1200w",
    alt: "Colourfully lit seating area at Golden Pizza Cafe"
  },
  {
    id: "gallery-corner",
    caption: "Cosy corner",
    src: "assets/gallery/gallery-corner-800.jpg",
    srcset: "assets/gallery/gallery-corner-480.jpg 480w, assets/gallery/gallery-corner-800.jpg 800w, assets/gallery/gallery-corner-1200.jpg 1200w",
    webpSrcset: "assets/gallery/gallery-corner-480.webp 480w, assets/gallery/gallery-corner-800.webp 800w, assets/gallery/gallery-corner-1200.webp 1200w",
    alt: "Cosy table corner with mood lighting at Golden Pizza Cafe"
  }
];

const GPC_DEFAULT_PARTY = [
  {
    id: "party-lounge",
    caption: "Private lounge seating",
    src: "assets/party-hall/party-lounge-800.jpg",
    srcset: "assets/party-hall/party-lounge-480.jpg 480w, assets/party-hall/party-lounge-800.jpg 800w, assets/party-hall/party-lounge-1200.jpg 1200w",
    webpSrcset: "assets/party-hall/party-lounge-480.webp 480w, assets/party-hall/party-lounge-800.webp 800w, assets/party-hall/party-lounge-1200.webp 1200w",
    alt: "Curtained private lounge seating for parties at Golden Pizza Cafe"
  },
  {
    id: "party-floor",
    caption: "Party hall floor",
    src: "assets/party-hall/party-floor-800.jpg",
    srcset: "assets/party-hall/party-floor-480.jpg 480w, assets/party-hall/party-floor-800.jpg 800w, assets/party-hall/party-floor-1200.jpg 1200w",
    webpSrcset: "assets/party-hall/party-floor-480.webp 480w, assets/party-hall/party-floor-800.webp 800w, assets/party-hall/party-floor-1200.webp 1200w",
    alt: "Open party hall floor with Golden Pizza Cafe sign lit up"
  }
];

const GPC_KEYS = {
  galleryExtra: "gpc_gallery_extra",
  partyExtra: "gpc_partyhall_extra",
  hidden: "gpc_hidden_defaults"
};

const GPCStore = {
  _read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.error("Storage read failed:", e);
      return fallback;
    }
  },
  _write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error("Storage write failed (browser storage may be full or disabled):", e);
      return false;
    }
  },
  getHidden() {
    return this._read(GPC_KEYS.hidden, []);
  },
  hideDefault(id) {
    const hidden = this.getHidden();
    if (!hidden.includes(id)) hidden.push(id);
    return this._write(GPC_KEYS.hidden, hidden);
  },
  unhideDefault(id) {
    const hidden = this.getHidden().filter(h => h !== id);
    return this._write(GPC_KEYS.hidden, hidden);
  },
  getExtra(section) {
    const key = section === "gallery" ? GPC_KEYS.galleryExtra : GPC_KEYS.partyExtra;
    return this._read(key, []);
  },
  addExtra(section, item) {
    const key = section === "gallery" ? GPC_KEYS.galleryExtra : GPC_KEYS.partyExtra;
    const list = this.getExtra(section);
    list.push(item);
    return this._write(key, list);
  },
  removeExtra(section, id) {
    const key = section === "gallery" ? GPC_KEYS.galleryExtra : GPC_KEYS.partyExtra;
    const list = this.getExtra(section).filter(i => i.id !== id);
    return this._write(key, list);
  },
  resetAll() {
    localStorage.removeItem(GPC_KEYS.galleryExtra);
    localStorage.removeItem(GPC_KEYS.partyExtra);
    localStorage.removeItem(GPC_KEYS.hidden);
  },
  /** Combined, render-ready list: visible defaults + admin-added extras */
  getCombined(section) {
    const defaults = section === "gallery" ? GPC_DEFAULT_GALLERY : GPC_DEFAULT_PARTY;
    const hidden = this.getHidden();
    const visibleDefaults = defaults.filter(d => !hidden.includes(d.id)).map(d => ({...d, isDefault: true}));
    const extras = this.getExtra(section).map(e => ({...e, isDefault: false}));
    return [...visibleDefaults, ...extras];
  }
};
