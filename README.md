# Wedding Invitation Website (Premium animated edition)

Plain HTML + CSS + JavaScript. No build step, no paid services.

## Customize (edit ONLY config.js)
- Names, date, blessing, schedule, venue, closing message: edit the matching block in `config.js`.
- Hide any section: set `enabled: false`.
- Countdown: `targetISO` needs a timezone offset, e.g. `2027-06-12T17:00:00+05:00`.
- Photos: save as `photo-01.jpg` ... (under ~300 KB each, lowercase names) and list them in `gallery.items`. Missing files show a soft placeholder with your monogram.
- Directions: paste your Google Maps share link into `venue.mapUrl` (must start with https://).
- RSVP: `method` is `"whatsapp"` (digits only with country code in `target`) or `"mailto"` (email in `target`). Replies open your app; the site stores nothing.
- Colors: pick `theme.preset` = `"ivory-champagne"` (default), `"blush-rose"`, `"midnight-luxury"` or `"floral-garden"`, then fine-tune with `theme.overrides`, e.g. `{ "--accent": "#8a1f3d", "--gold": "#c9a46a" }`.
- Fonts: `meta.googleFonts: false` turns off the Google Fonts request (fallback fonts are used).

## What the animation does
- Floating envelope with a 3D flap flip, card rising out, gold sparkle burst, and a zoom-through into the invitation.
  The envelope only starts to exit after the flap and card have really finished moving, then holds a moment so the guest sees the card.
  `reveal.holdMs` (default 500) sets that pause. `reveal.durationMs` is now only a safety net (minimum 3000 ms) and cannot cut the animation short.
- Names appear letter by letter; corner flourishes and dividers draw themselves; the date and subtitle follow in sequence.
- Gold sparkles and soft petals drift across the page; a sparkle trail follows the mouse on computers.
- Flip-style countdown digits, a timeline whose line grows as you scroll, a gallery in an arch frame with slow zoom and auto-advance, a signature that writes itself, and a petal celebration at the end.
- A thin gold progress bar shows how far down the page the guest is.
- Everything switches itself off for guests who use "reduce motion" in their device settings.

## Optional extras (all in config.js)
- Music: save a small, licensed MP3 as `assets/music.mp3` (under 2 MB), set `music.enabled: true`. It starts when the guest taps the seal, and a small play/pause button appears. Browsers never allow music without a tap, so there is no autoplay.
- Effects: set any of `effects.particles`, `effects.petals`, `effects.cursorTrail`, `effects.autoplayGallery` to `false` to turn it off (useful for older phones).

## Free hosting (GitHub Pages)
1. Create a free GitHub account and a new repository.
2. Upload the CONTENTS of this folder (index.html must be at the top level).
3. Settings > Pages > Deploy from a branch > main > / (root) > Save.
4. After ~1 minute: https://YOUR-USER.github.io/REPO-NAME/
Alternatives: Netlify Drop (drag the folder) or Cloudflare Pages. A public repo exposes config.js and photos; the page is marked noindex.
