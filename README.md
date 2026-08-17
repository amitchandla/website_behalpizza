# Golden Pizza Cafe — Website

## What's inside
- `index.html` — the main website (Hero, Menu, Combo Offers, Gallery, Party Hall, Contact)
- `styles.css`, `script.js`, `images-data.js` — styling and behaviour
- `assets/` — all real photos, already optimized into multiple sizes (WebP + JPEG) for fast loading on mobile, tablet and desktop
- `admin/` — the Photo Manager (see below)

## Opening it
Just double-click `index.html` to preview it in a browser, or upload the whole folder to any web host (e.g. Hostinger, GoDaddy, Netlify, Vercel, GitHub Pages). No build step or server-side code is required — it's a static website.

## Managing Gallery & Party Hall photos (Admin panel)
Open `admin/index.html` (or click the small "Admin" link in the website footer).

- Default PIN: **1234** — change it any time with the "Change PIN" button once you're in.
- Add a photo: tap "+ Add gallery photo" or "+ Add party hall photo" and choose an image. It's automatically resized/compressed for the web.
- Remove a photo: tap the ✕ on any photo's thumbnail.
- "Reset to defaults" brings back the original photos and clears anything you've added or hidden.

**Important limitation:** this admin panel saves your changes in your browser's local storage — on your device only. It's great for quickly trying out photo changes and for previewing what the site would look like, but it does **not** publish changes to every visitor automatically, because this is a code-free static site with no shared database. If you want every visitor on every device to see your Gallery/Party Hall updates instantly, ask a developer to connect a small backend (or a service like Cloudinary/Firebase) to the same Admin interface — the panel is already built to make that swap straightforward.

## Content notes
- All menu prices are taken directly from your posters.
- The "Mini Bites" list under Sandwich & Burger reflects a separate, lower-priced flyer you shared (Simple Burger ₹25, half-portion fries/chowmein/momos) — kept as a distinct list so it doesn't conflict with the main-menu prices for the same items.
- Address combines the landmark mentioned on your most recent-looking poster ("near Parshuram Dharamshala, Pilani Road"). Double-check this against your current signage before publishing, since a couple of your posters listed different nearby landmarks.
- No opening hours are shown anywhere on the site since none of your source material stated them — let me know your hours and I'll add them.
