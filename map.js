/* map.js - shows a Google Map inside the Venue card.
   Put this file next to index.html and load it AFTER script.js:
   <script src="map.js"></script>
   No CSS edits needed. Reads window.CONFIG.venue from config.js.
   Optional in config.js (venue block):
     showMap: false   to hide the map
     mapEmbed: "https://www.google.com/maps/embed?pb=..."   exact pin from Google Maps > Share > Embed a map (copy only the src link) */
(function () {
  "use strict";

  const venue = window.CONFIG && window.CONFIG.venue;
  if (!venue || venue.enabled === false || venue.showMap === false) return;

  function getMapSrc() {
    if (venue.mapEmbed) {
      try {
        const u = new URL(venue.mapEmbed);
        const hostOk = u.hostname === "www.google.com" || u.hostname === "maps.google.com";
        if (u.protocol === "https:" && hostOk && u.pathname.indexOf("/maps") === 0) return u.href;
      } catch (err) {
        /* bad link: fall back to the automatic address search below */
      }
    }
    const query = [venue.name, venue.address].filter(Boolean).join(", ");
    if (!query) return null;
    return "https://www.google.com/maps?q=" + encodeURIComponent(query) + "&output=embed";
  }

  const mapSrc = getMapSrc();
  if (!mapSrc) return;

  function addStyle() {
    if (document.getElementById("vmap-style")) return;
    const s = document.createElement("style");
    s.id = "vmap-style";
    s.textContent =
      ".vmap{position:relative;display:block;width:100%;margin:1.2rem 0 .6rem;aspect-ratio:16/10;" +
      "border-radius:12px;overflow:hidden;border:1px solid var(--line,#d9c9a3);background:var(--bg-2,#f3e7d3);" +
      "box-shadow:var(--shadow,0 6px 18px rgba(0,0,0,.12))}" +
      ".vmap iframe{position:absolute;top:0;left:0;width:100%;height:100%;border:0}";
    document.head.appendChild(s);
  }

  /* Find the "Get Directions" link by its address (mapUrl), then by its text. */
  function findDirectionsLink() {
    const links = Array.prototype.slice.call(document.querySelectorAll("a[href]"));
    for (let i = 0; i < links.length; i++) {
      if (venue.mapUrl && links[i].getAttribute("href") === venue.mapUrl) return links[i];
    }
    for (let j = 0; j < links.length; j++) {
      if (/direction/i.test(links[j].textContent || "")) return links[j];
    }
    return null;
  }

  /* Fallback: find the venue name heading and use its card. */
  function findNameHeading() {
    if (!venue.name) return null;
    const heads = document.querySelectorAll("h1,h2,h3,h4,p,div");
    for (let i = 0; i < heads.length; i++) {
      if (heads[i].children.length === 0 && (heads[i].textContent || "").trim() === venue.name) return heads[i];
    }
    return null;
  }

  function buildBox() {
    const box = document.createElement("div");
    box.className = "vmap";
    const frame = document.createElement("iframe");
    frame.src = mapSrc;
    frame.title = "Map showing " + (venue.name || "the venue");
    frame.loading = "lazy";
    frame.referrerPolicy = "no-referrer-when-downgrade";
    box.appendChild(frame);
    return box;
  }

  function place() {
    if (document.querySelector(".vmap")) return true;

    const link = findDirectionsLink();
    if (link) {
      const card = link.closest(".vframe") || link.closest(".venue") || link.parentNode;
      let ref = link;
      while (ref.parentNode && ref.parentNode !== card) ref = ref.parentNode;
      addStyle();
      card.insertBefore(buildBox(), ref.parentNode === card ? ref : null);
      return true;
    }

    const heading = findNameHeading();
    if (heading) {
      const card = heading.closest(".vframe") || heading.parentNode;
      addStyle();
      card.appendChild(buildBox());
      return true;
    }
    return false;
  }

  if (!place()) {
    const root = document.getElementById("app") || document.body;
    const observer = new MutationObserver(function () {
      if (place()) observer.disconnect();
    });
    observer.observe(root, { childList: true, subtree: true });
  }
})();