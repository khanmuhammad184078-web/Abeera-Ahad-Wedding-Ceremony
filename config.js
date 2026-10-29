// ALL customer content lives here. Edit this file only.
window.CONFIG = {
  meta: { title: "Abeera & Ahad | Wedding Invitation", description: "Join us on 12 Nov 2026", language: "en", googleFonts: true },
  // preset: "ivory-champagne" (default) | "blush-rose" | "midnight-luxury" | "floral-garden"
  theme: {
  preset: "ivory-champagne",
  overrides: {
    "--env": "#E8C2C4",
    "--env-2": "#b4a6a3",
    "--gold-3": "#F7E9E5",
    "--liner": "#0e0d0d",
    "--seal-1": "#F5D4D8",
    "--seal-2": "#E8C2C4",
    "--seal-3": "#D9B9A5",
    "--seal-ink": "#860808"
  }
},          // overrides e.g. { "--accent": "#8a1f3d" }
  reveal: { monogram: "A & A", hint: "Tap the to open envolope", durationMs: 2200, holdMs: 500 },  // durationMs = safety net only; holdMs = pause after the card is out, before the envelope exits
  hero: { eyebrow: "Together with their families", names: "Abeera & Ahad", dateText: "Saturday, 12 Nov 2026", subtitle: "request the pleasure of your company" },
  blessing: { enabled: true, text: "With the blessings of Allah Almighty, we warmly invite you to celebrate the wedding of our beloved children." },
  countdown: { enabled: true, title: "Counting the Days", targetISO: "2026-11-12T17:00:00+05:00", doneText: "Today is the day!", labels: { d: "Days", h: "Hours", m: "Minutes", s: "Seconds" } },
  timeline: { enabled: true, title: "Schedule of Events", items: [
    { time: "5:00 PM", title: "Arrival", note: "" },
    { time: "6:00 PM", title: "Ceremony", note: "" },
    { time: "7:30 PM", title: "Dinner", note: "" }
  ] },
  venue: { enabled: true, title: "Venue", name: "Rose Wedding Hall", address: "Kaplar petrol pump, S Canal Rd, Abdarra, Peshawar",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Rose+Wedding+Hall+Abdarra+Peshawar", note: "Parking available on site" },
  gallery: { enabled: true, title: "Our Moments", items: [   // put JPG/WebP files in assets/; missing files show an elegant placeholder
    { src: "assets/photo-01.jpg", alt: "Abeera and Ahad laughing together", caption: "The day we met", focus: "50% 35%" },
    { src: "assets/photo-02.jpg", alt: "Abeera and Ahad at sunset", caption: "Our first trip", focus: "50% 40%" },
    { src: "assets/photo-03.jpg", alt: "The proposal", caption: "The proposal", focus: "50% 40%" },
    { src: "assets/photo-04.jpg", alt: "Abeera and Ahad with family", caption: "Family", focus: "50% 40%" }
  ] },
  rsvp: { enabled: true, title: "Kindly Respond", method: "whatsapp", target: "+923321840789", deadlineText: "by 1 Nov 2026",
    fields: [
      { id: "name", label: "Your name", type: "text", required: true },
      { id: "guests", label: "Number of guests", type: "number", required: true },
      { id: "attending", label: "Will you attend?", type: "choice", options: ["InshaAllah, We’ll Join You!", "We’ll Try Our Best to Come!"], required: true },
    ] },
  closing: { title: "With Love", text: "We cannot wait to celebrate with you.", signature: "Abeera & Ahad" },

  // ---- NEW (all optional; remove them and the site still works) ----
  // Background music: save a small licensed MP3 as assets/music.mp3, then set enabled: true.
  // It starts when the guest taps the seal, and a small play/pause button appears.
  music: { enabled: false, src: "assets/music.mp3", label: "Music" },
  // Set any of these to false to turn that effect off.
  effects: { particles: true, petals: true, cursorTrail: true, autoplayGallery: true }
};
