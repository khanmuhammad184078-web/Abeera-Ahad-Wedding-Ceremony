(function () {
  'use strict';
  var C = window.CONFIG, NS = 'http://www.w3.org/2000/svg', app = document.getElementById('app');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function el(t, a, x) { var n = document.createElement(t); if (a) for (var k in a) n.setAttribute(k, a[k]); if (x != null) n.textContent = String(x); return n; }
  function on(b) { return b && b.enabled; }
  function https(u) { return typeof u === 'string' && /^https:\/\//.test(u); }
  function each(list, fn) { Array.prototype.forEach.call(list, fn); }
  function use(id, cls, vb) { var s = document.createElementNS(NS, 'svg'), u = document.createElementNS(NS, 'use'); s.setAttribute('class', cls); s.setAttribute('viewBox', vb); s.setAttribute('aria-hidden', 'true'); s.setAttribute('focusable', 'false'); u.setAttribute('href', '#' + id); s.appendChild(u); return s; }
  function validate(c) {
    var e = [];
    if (!c || !c.meta || !c.meta.title) e.push('meta.title is required');
    if (!c || !c.hero || !c.hero.names) e.push('hero.names is required');
    if (c && on(c.countdown) && isNaN(Date.parse(c.countdown.targetISO))) e.push('countdown.targetISO is not a valid ISO date');
    if (c && on(c.venue) && c.venue.mapUrl && !https(c.venue.mapUrl)) e.push('venue.mapUrl must start with https://');
    if (c && on(c.rsvp) && !c.rsvp.target) e.push('rsvp.target is required');
    if (c && on(c.music) && !/^(assets\/|https:\/\/)/.test(String(c.music.src || ''))) e.push('music.src must start with assets/ or https://');
    return e;
  }
  var errors = validate(C);
  if (errors.length) { document.getElementById('cover').hidden = true; document.body.classList.remove('locked'); app.appendChild(el('pre', { class: 'err' }, 'config.js problems:\n- ' + errors.join('\n- '))); return; }

  var FXC = C.effects || {};
  function fxOn(k) { return FXC[k] !== false; }

  document.documentElement.lang = C.meta.language || 'en';
  document.title = C.meta.title;
  var md = document.querySelector('meta[name="description"]');
  if (!md) { md = el('meta', { name: 'description' }); document.head.appendChild(md); }
  md.setAttribute('content', C.meta.description || '');
  if (C.theme && C.theme.preset) document.documentElement.setAttribute('data-theme', String(C.theme.preset).replace(/[^\w-]/g, ''));
  if (C.theme && C.theme.overrides) Object.keys(C.theme.overrides).forEach(function (k) { if (/^--[\w-]+$/.test(k)) document.documentElement.style.setProperty(k, String(C.theme.overrides[k])); });
  if (C.meta.googleFonts) { var l = el('link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Pinyon+Script&family=Lora:wght@400;500&display=swap' }); document.head.appendChild(l); }

  /* ================= particle engine (canvas) ================= */
  var FX = (function () {
    var api = { burst: function () {}, trail: function () {}, enter: function () {} };
    if (reduce || !fxOn('particles')) return api;
    var cv = el('canvas', { id: 'fx', 'aria-hidden': 'true' }), ctx = cv.getContext && cv.getContext('2d');
    if (!ctx) return api;
    document.body.appendChild(cv);
    function cssv(n, f) { var s = getComputedStyle(document.documentElement).getPropertyValue(n).trim(); return s || f; }
    var col = { gold: cssv('--gold', '#b8955a'), gold3: cssv('--gold-3', '#f6e7bd'), p1: cssv('--petal-1', '#f2bfca'), p2: cssv('--petal-2', '#d98d9f'), acc: cssv('--accent', '#8e4a5e') };
    var W = 0, H = 0, dpr = 1, P = [], raf = 0, last = 0, CAP = 260, rt = 0;
    function size() { dpr = Math.min(window.devicePixelRatio || 1, 2); W = window.innerWidth; H = window.innerHeight; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size();
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(size, 150); });
    function rnd(a, b) { return a + Math.random() * (b - a); }
    function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

    function sparkle(y) { return { k: 'spark', amb: 1, x: rnd(0, W), y: y == null ? rnd(0, H) : y, vx: rnd(-6, 6), vy: -rnd(8, 22), s: rnd(2.5, 6), a: rnd(.35, .7), tw: rnd(1.5, 3.5), ph: rnd(0, 6.28), rot: 0, vr: 0, age: 0, c: pick([col.gold, col.gold3, col.gold]) }; }
    function petal(y) { return { k: 'petal', amb: 1, x: rnd(0, W), y: y == null ? rnd(-20, H) : y, vx: rnd(-8, 8), vy: rnd(22, 48), sway: rnd(14, 34), swf: rnd(.8, 1.6), s: rnd(6, 10), a: rnd(.4, .65), ph: rnd(0, 6.28), rot: rnd(0, 6.28), vr: rnd(-1.2, 1.2), fl: rnd(1, 2.4), age: 0, c: pick([col.p1, col.p2]) }; }
    var nS = W < 600 ? 14 : 26, nP = W < 600 ? 8 : 14, i;
    for (i = 0; i < nS; i++) P.push(sparkle());

    function star(s) { ctx.beginPath(); ctx.moveTo(0, -s); ctx.quadraticCurveTo(s * .12, -s * .12, s, 0); ctx.quadraticCurveTo(s * .12, s * .12, 0, s); ctx.quadraticCurveTo(-s * .12, s * .12, -s, 0); ctx.quadraticCurveTo(-s * .12, -s * .12, 0, -s); ctx.fill(); }
    function heart(s) { var h = s * .5; ctx.beginPath(); ctx.moveTo(0, h * 1.3); ctx.bezierCurveTo(-h * 2.2, -h * .2, -h * 1.1, -h * 1.7, 0, -h * .6); ctx.bezierCurveTo(h * 1.1, -h * 1.7, h * 2.2, -h * .2, 0, h * 1.3); ctx.fill(); }
    function draw(p, al) {
      ctx.save(); ctx.translate(p.x, p.y); ctx.globalAlpha = Math.max(0, Math.min(1, al)); ctx.fillStyle = p.c;
      if (p.k === 'spark') { ctx.rotate(p.rot); star(p.s); }
      else if (p.k === 'dot') { ctx.beginPath(); ctx.arc(0, 0, p.s * .45, 0, 6.283); ctx.fill(); }
      else if (p.k === 'petal') { ctx.rotate(p.rot); ctx.scale(1, Math.abs(Math.cos(p.age * (p.fl || 2)))*.8 + .2); ctx.beginPath(); ctx.ellipse(0, 0, p.s * .5, p.s, 0, 0, 6.283); ctx.fill(); }
      else if (p.k === 'heart') { ctx.rotate(p.rot * .3); heart(p.s); }
      ctx.restore();
    }
    function frame(ts) {
      raf = 0;
      if (document.hidden) return;
      var dt = Math.min(.05, (ts - last) / 1000 || .016); last = ts;
      ctx.clearRect(0, 0, W, H);
      for (var j = P.length - 1; j >= 0; j--) {
        var p = P[j], al;
        p.age += dt;
        if (p.amb) {
          if (p.k === 'spark') { p.x += p.vx * dt; p.y += p.vy * dt; al = p.a * (.5 + .5 * Math.sin(p.age * p.tw + p.ph)); p.rot += dt * .4; if (p.y < -12) { p.y = H + 12; p.x = rnd(0, W); } }
          else { p.x += (p.vx + Math.cos(p.age * p.swf + p.ph) * p.sway) * dt; p.y += p.vy * dt; p.rot += p.vr * dt; al = p.a; if (p.y > H + 20) { p.y = -20; p.x = rnd(0, W); } }
        } else {
          p.vx *= Math.pow(p.drag, dt); p.vy = p.vy * Math.pow(p.drag, dt) + p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
          var t = p.age / p.life; if (t >= 1) { P.splice(j, 1); continue; }
          al = (1 - t * t) * (p.a || 1);
        }
        draw(p, al);
      }
      raf = requestAnimationFrame(frame);
    }
    function start() { if (raf || document.hidden) return; last = performance.now(); raf = requestAnimationFrame(frame); }
    document.addEventListener('visibilitychange', function () { if (!document.hidden) start(); });
    start();

    api.enter = function () { if (!fxOn('petals')) return; for (var n = 0; n < nP; n++) P.push(petal(rnd(-H * .3, H))); };
    api.burst = function (x, y, o) {
      o = o || {};
      var n = o.n || 60, kinds = o.kinds || ['spark', 'dot', 'spark'], cols = o.colors || [col.gold, col.gold3, '#ffffff', col.gold];
      var ang = o.angle == null ? 0 : o.angle, spr = o.spread == null ? 6.283 : o.spread, a, sp, k;
      for (var m = 0; m < n && P.length < CAP; m++) {
        a = o.angle == null ? rnd(0, 6.283) : ang + rnd(-spr / 2, spr / 2); sp = rnd(o.min || 120, o.max || 420); k = pick(kinds);
        P.push({ k: k, x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: o.g == null ? 420 : o.g, drag: o.drag || .2, s: k === 'dot' ? rnd(3, 6) : (k === 'spark' ? rnd(4, 9) : rnd(7, 12)), rot: rnd(0, 6.28), vr: rnd(-4, 4), age: 0, life: rnd(.9, 1.9) * (o.life || 1), a: .95, c: pick(cols), fl: rnd(3, 6) });
      }
    };
    api.trail = function (x, y) {
      if (P.length > CAP) return;
      P.push({ k: 'spark', x: x, y: y, vx: rnd(-18, 18), vy: rnd(-24, 4), g: 30, drag: .5, s: rnd(3, 5.5), rot: rnd(0, 6), vr: rnd(-2, 2), age: 0, life: rnd(.6, 1), a: .8, c: pick([col.gold, col.gold3]) });
    };
    api.colors = col;
    return api;
  })();

  function section(id, title) { var s = el('section', { class: 'sec', id: id, 'data-reveal': '' }); if (title) { s.appendChild(el('h2', { class: 'title' }, title)); s.appendChild(use('divider', 'orn', '0 0 240 24')); } return s; }

  /* cover text */
  var mono = C.reveal.monogram || '';
  each(document.querySelectorAll('.sealT'), function (t) { t.textContent = mono; if (mono.length > 3) t.setAttribute('font-size', mono.length > 5 ? '17' : '22'); });
  document.getElementById('cardNames').textContent = C.hero.names;
  document.getElementById('hint').textContent = C.reveal.hint || '';

  /* hero: split names into animated letters (Arabic/Urdu names are split by word so letters stay joined) */
  var hero = el('header', { class: 'hero', 'data-reveal': '' }), heroIn = el('div', { class: 'hero-in' });
  ['c1', 'c2', 'c3', 'c4'].forEach(function (c) { hero.appendChild(use('corner', 'corner ' + c, '0 0 120 120')); });
  var h1 = el('h1', { class: 'names', tabindex: '-1', 'aria-label': C.hero.names });
  (function split(text) {
    var rtl = /[֐-ࣿיִ-﻿]/.test(text), n = 0, words = text.split(' ');
    words.forEach(function (w, wi) {
      var ws = el('span', { class: 'w', 'aria-hidden': 'true' }), chars = rtl ? [w] : (w.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\s\S]/g) || []);
      chars.forEach(function (c) { var s = el('span', { class: 'ch' + (c === '&' ? ' amp' : '') }, c); s.style.setProperty('--i', n++); ws.appendChild(s); });
      h1.appendChild(ws);
      if (wi < words.length - 1) h1.appendChild(document.createTextNode(' '));
    });
  })(String(C.hero.names));
  heroIn.appendChild(el('p', { class: 'eyebrow' }, C.hero.eyebrow || ''));
  heroIn.appendChild(h1);
  heroIn.appendChild(el('p', { class: 'sub' }, C.hero.subtitle || ''));
  heroIn.appendChild(el('p', { class: 'date' }, C.hero.dateText || ''));
  hero.appendChild(heroIn);
  var cue = el('div', { class: 'cue', 'aria-hidden': 'true' }); cue.appendChild(el('span', null, 'Scroll')); cue.appendChild(el('i')); hero.appendChild(cue);
  app.appendChild(hero);

  if (on(C.blessing)) { var b = section('blessing'); b.appendChild(use('divider', 'orn', '0 0 240 24')); b.appendChild(el('p', { class: 'blessing' }, C.blessing.text)); app.appendChild(b); }

  var cdTimer = null;
  if (on(C.countdown)) {
    var cs = section('countdown', C.countdown.title), box = el('div', { class: 'cd', role: 'timer' }), L = C.countdown.labels || {}, finished = false;
    ['d', 'h', 'm', 's'].forEach(function (k) { var d = el('div'); var bb = el('b', null, '00'); bb.setAttribute('data-' + k, ''); d.appendChild(bb); d.appendChild(el('span', null, L[k] || k)); box.appendChild(d); });
    cs.appendChild(box); app.appendChild(cs);
    var target = new Date(C.countdown.targetISO).getTime();
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var setNum = function (sel, v) {
      var n = box.querySelector(sel); v = String(v);
      if (n.textContent === v) return;
      n.textContent = v;
      if (!reduce) { n.classList.remove('flip'); void n.offsetWidth; n.classList.add('flip'); }
    };
    var tick = function () {
      if (document.hidden || finished) return;
      var diff = Math.max(0, target - Date.now());
      if (diff === 0) { finished = true; clearInterval(cdTimer); cs.replaceChild(el('p', { class: 'done' }, C.countdown.doneText || ''), box); return; }
      var d = Math.floor(diff / 864e5); diff -= d * 864e5;
      var h = Math.floor(diff / 36e5); diff -= h * 36e5;
      var m = Math.floor(diff / 6e4); diff -= m * 6e4;
      var s = Math.floor(diff / 1e3);
      setNum('[data-d]', d); setNum('[data-h]', pad(h)); setNum('[data-m]', pad(m)); setNum('[data-s]', pad(s));
      if (s === 0 || !box.hasAttribute('aria-label')) box.setAttribute('aria-label', d + ' days, ' + h + ' hours, ' + m + ' minutes remaining');
    };
    tick();
    if (!finished) cdTimer = setInterval(tick, 1000);
  }

  if (on(C.timeline)) {
    var ts = section('schedule', C.timeline.title), ul = el('ul', { class: 'tl' });
    C.timeline.items.forEach(function (it, ix) { var li = el('li'); li.style.setProperty('--i', ix); li.appendChild(el('time', null, it.time)); li.appendChild(el('h3', null, it.title)); if (it.note) li.appendChild(el('p', null, it.note)); ul.appendChild(li); });
    ts.appendChild(ul); app.appendChild(ts);
  }

  if (on(C.venue)) {
    var vs = section('venue', C.venue.title), vf = el('div', { class: 'vframe' }); vs.classList.add('venue');
    vf.appendChild(use('pin', 'pin', '0 0 24 24'));
    vf.appendChild(el('p', { class: 'venue-name' }, C.venue.name)); vf.appendChild(el('p', null, C.venue.address));
    if (C.venue.note) vf.appendChild(el('p', null, C.venue.note));
    if (https(C.venue.mapUrl)) vf.appendChild(el('a', { class: 'btn', href: C.venue.mapUrl, target: '_blank', rel: 'noopener' }, 'Get Directions'));
    vs.appendChild(vf); app.appendChild(vs);
  }

  if (on(C.gallery) && C.gallery.items.length) {
    var gs = section('gallery', C.gallery.title), items = C.gallery.items, wrap = el('div', { class: 'gal-wrap' }), frame = el('div', { class: 'gal-frame', role: 'group', 'aria-roledescription': 'carousel', 'aria-label': C.gallery.title });
    var ph = el('div', { class: 'ph', 'aria-hidden': 'true' }); ph.appendChild(el('span', null, mono)); ph.appendChild(el('i')); frame.appendChild(ph);
    var layers = [el('img', { alt: '', decoding: 'async' }), el('img', { alt: '', decoding: 'async' })], cur = 0, idx = 0, busy = false, pauseUntil = 0, inView = !('IntersectionObserver' in window);
    layers.forEach(function (i) { frame.appendChild(i); });
    var prev = el('button', { type: 'button', 'aria-label': 'Previous photo' }, '‹'), next = el('button', { type: 'button', 'aria-label': 'Next photo' }, '›'), cap = el('p', { class: 'cap', 'aria-live': 'polite' });
    var ctl = el('div', { class: 'gal-ctl' }); ctl.appendChild(prev); ctl.appendChild(cap); ctl.appendChild(next);
    var dots = el('div', { class: 'dots', 'aria-hidden': 'true' });
    if (items.length > 1) items.forEach(function () { dots.appendChild(el('span')); });
    wrap.appendChild(frame); gs.appendChild(wrap); gs.appendChild(ctl); if (items.length > 1) gs.appendChild(dots); app.appendChild(gs);
    var show = function (n, first) {
      if (busy) return; busy = true;
      idx = (n + items.length) % items.length;
      var it = items[idx], nxt = layers[first ? 0 : 1 - cur], old = layers[cur];
      nxt.className = ''; nxt.alt = it.alt || ''; nxt.style.objectPosition = it.focus || '50% 50%';
      var done = function (ok) {
        void nxt.offsetWidth;
        var oldOn = !first && /\bon\b/.test(old.className);
        if (ok) {
          nxt.className = 'on';
          if (oldOn) { old.className = 'on out'; setTimeout(function () { if (old !== layers[cur]) old.className = ''; }, 720); }
          else if (!first) old.className = '';
        } else { nxt.className = 'bad'; if (!first) old.className = ''; }
        cur = layers.indexOf(nxt);
        cap.textContent = (it.caption || '') + (items.length > 1 ? '  ·  ' + (idx + 1) + ' / ' + items.length : '');
        each(dots.children, function (d, di) { d.className = di === idx ? 'on' : ''; });
        setTimeout(function () { busy = false; }, reduce ? 0 : (ok ? 720 : 200));
        if (items.length > 1) { var pre = new Image(); pre.src = items[(idx + 1) % items.length].src; }
      };
      var t = new Image();
      t.onload = function () { nxt.src = it.src; done(true); };
      t.onerror = function () { done(false); };
      t.src = it.src;
    };
    var manual = function (n) { pauseUntil = Date.now() + 12000; show(n); };
    prev.addEventListener('click', function () { manual(idx - 1); });
    next.addEventListener('click', function () { manual(idx + 1); });
    frame.tabIndex = 0;
    frame.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') manual(idx - 1); if (e.key === 'ArrowRight') manual(idx + 1); });
    var sx = null;
    frame.addEventListener('pointerdown', function (e) { sx = e.clientX; });
    frame.addEventListener('pointerup', function (e) { if (sx == null) return; var dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 40) manual(idx + (dx < 0 ? 1 : -1)); });
    show(0, true);
    if (!reduce && items.length > 1 && fxOn('autoplayGallery')) {
      if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { inView = en[0].isIntersecting; }).observe(gs);
      setInterval(function () { if (!document.hidden && inView && Date.now() > pauseUntil) show(idx + 1); }, 5200);
    }
  }

  if (on(C.rsvp)) {
    var R = C.rsvp, rs = section('rsvp', R.title), f = el('form', { novalidate: '' });
    if (R.deadlineText) rs.appendChild(el('p', null, 'Please reply ' + R.deadlineText));
    R.fields.forEach(function (fd) {
      if (fd.type === 'choice') {
        var fs = el('fieldset'); fs.appendChild(el('legend', null, fd.label));
        fd.options.forEach(function (o, i) { var lb = el('label', { class: 'opt' }); var r = el('input', { type: 'radio', name: fd.id, value: o }); if (fd.required && i === 0) r.required = true; lb.appendChild(r); lb.appendChild(el('span', null, o)); fs.appendChild(lb); });
        f.appendChild(fs);
      } else {
        var lb2 = el('label', { for: 'f-' + fd.id }, fd.label), inp = el('input', { id: 'f-' + fd.id, name: fd.id, type: fd.type === 'number' ? 'number' : 'text' });
        if (fd.type === 'number') { inp.min = '1'; inp.max = '20'; }
        if (fd.required) inp.required = true;
        lb2.appendChild(inp); f.appendChild(lb2);
      }
    });
    var go = el('button', { class: 'btn', type: 'submit' }, 'Send RSVP'), note = el('p', { class: 'note', 'aria-live': 'polite' });
    f.appendChild(go); f.appendChild(note);
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      var lines = [C.meta.title + ' - RSVP'];
      R.fields.forEach(function (fd) { var v = fd.type === 'choice' ? (f.querySelector('input[name="' + fd.id + '"]:checked') || {}).value : f.elements[fd.id].value; if (v) lines.push(fd.label + ': ' + v); });
      var msg = lines.join('\n'), url = R.method === 'mailto'
        ? 'mailto:' + R.target + '?subject=' + encodeURIComponent('RSVP') + '&body=' + encodeURIComponent(msg)
        : 'https://wa.me/' + String(R.target).replace(/\D/g, '') + '?text=' + encodeURIComponent(msg);
      var gr = go.getBoundingClientRect(), pc = FX.colors || {};
      FX.burst(gr.left + gr.width / 2, gr.top + gr.height / 2, { n: 70, kinds: ['petal', 'heart', 'spark', 'petal'], colors: [pc.p1 || '#f2bfca', pc.p2 || '#d98d9f', pc.gold || '#b8955a', pc.gold3 || '#f6e7bd'], angle: -1.5708, spread: 2.2, min: 260, max: 620, g: 520, drag: .35, life: 1.3 });
      var a = el('a', { href: url, target: '_blank', rel: 'noopener' }); document.body.appendChild(a); a.click(); a.remove();
      note.textContent = 'Opening your ' + (R.method === 'mailto' ? 'email' : 'WhatsApp') + ' app with your reply ready to send. Nothing is stored by this website.';
    });
    rs.appendChild(f); app.appendChild(rs);
  }

  var cl = section('closing', C.closing.title); cl.classList.add('closing');
  cl.appendChild(el('p', null, C.closing.text));
  var sig = el('p', { class: 'sig' }); sig.appendChild(el('span', null, C.closing.signature)); cl.appendChild(sig);
  cl.appendChild(use('heart', 'heart', '0 0 24 24'));
  app.appendChild(cl);

  /* stagger index for section children */
  each(app.querySelectorAll('.sec'), function (s) { each(s.children, function (c, i) { c.style.setProperty('--k', i); }); });

  /* closing celebration (once) */
  if (!reduce && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return; cio.disconnect();
      var r = cl.getBoundingClientRect(), pc = FX.colors || {};
      setTimeout(function () { FX.burst(window.innerWidth / 2, Math.min(window.innerHeight - 40, r.top + r.height * .75), { n: 46, kinds: ['petal', 'heart', 'spark'], colors: [pc.p1 || '#f2bfca', pc.p2 || '#d98d9f', pc.gold || '#b8955a'], angle: -1.5708, spread: 1.8, min: 200, max: 520, g: 380, drag: .35, life: 1.4 }); }, 700);
    }, { threshold: .6 });
    cio.observe(cl);
  }

  /* music (optional) */
  var audio = null, mbtn = null;
  if (on(C.music) && C.music.src) {
    audio = new Audio(); audio.loop = true; audio.preload = 'none'; audio.volume = .7; audio.src = C.music.src;
    var mlabel = C.music.label || 'Music';
    mbtn = el('button', { class: 'music', type: 'button', 'aria-pressed': 'false', 'aria-label': 'Play ' + mlabel });
    mbtn.appendChild(el('i')); mbtn.appendChild(el('i')); mbtn.appendChild(el('i'));
    document.body.appendChild(mbtn);
    var setM = function (p) { mbtn.setAttribute('aria-pressed', p ? 'true' : 'false'); mbtn.setAttribute('aria-label', (p ? 'Pause ' : 'Play ') + mlabel); };
    mbtn.addEventListener('click', function () {
      if (audio.paused) { var pr = audio.play(); if (pr && pr.then) pr.then(function () { setM(true); }, function () { setM(false); }); else setM(true); }
      else { audio.pause(); setM(false); }
    });
    audio.addEventListener('error', function () { mbtn.hidden = true; });
    audio.addEventListener('pause', function () { setM(false); });
  }
  function startMusic() {
    if (!audio) return;
    var pr = audio.play();
    if (pr && pr.then) pr.then(function () { mbtn.setAttribute('aria-pressed', 'true'); mbtn.setAttribute('aria-label', 'Pause ' + (C.music.label || 'Music')); }, function () {});
  }

  /* scroll reveals */
  function scrollReveals() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window) || reduce) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } }); }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  /* scroll progress bar + hero parallax */
  var progress = document.getElementById('progress'), ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = window.pageYOffset || 0, vh = window.innerHeight, max = document.documentElement.scrollHeight - vh;
      progress.style.setProperty('--p', max > 0 ? Math.min(1, y / max).toFixed(4) : 0);
      if (!reduce && y < vh * 1.3) { heroIn.style.setProperty('--hy', (y * .25).toFixed(1)); heroIn.style.setProperty('--ho', Math.max(0, 1 - y / (vh * .8)).toFixed(3)); }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* reveal state machine: sealed -> opening -> revealing -> open
     opening   = seal fades, flap rotates back, card slides out (CSS; ordered by its own delays)
     revealing = starts ONLY after both the flap and the card report their transform transition finished,
                 plus a short hold so the card can be seen; then the cover zooms/fades and the hero begins
     open      = cover removed from interaction, page content un-inerted, scrolling restored
     Fallback timers only run the NEXT stage if an event is missed; they never cut a stage short. */
  var cover = document.getElementById('cover'), trigger = cover.querySelector('[data-reveal-trigger]'), state = 'sealed', entered = false;
  var cardEl = cover.querySelector('.card'), flapEl = cover.querySelector('.flap');
  var doneFlap = false, doneCard = false, holdTimer = 0, fallbackOpen = 0, fallbackExit = 0;
  var HOLD = typeof C.reveal.holdMs === 'number' ? Math.max(0, C.reveal.holdMs) : 500;
  app.setAttribute('inert', '');   /* nothing behind the envelope can take keyboard focus */
  function enter() {
    if (entered) return; entered = true;
    document.body.classList.add('entered'); hero.classList.add('is-in'); FX.enter();
  }
  function finish() {
    if (state === 'open') return; state = 'open';
    clearTimeout(holdTimer); clearTimeout(fallbackOpen); clearTimeout(fallbackExit);
    cover.removeEventListener('transitionend', onEnd);
    cover.dataset.state = 'open'; cover.setAttribute('inert', ''); cover.hidden = true;
    app.removeAttribute('inert');
    document.body.classList.remove('locked'); enter(); scrollReveals(); h1.focus({ preventScroll: true });
  }
  function beginReveal() {
    if (state !== 'opening') return; state = 'revealing';
    clearTimeout(holdTimer); clearTimeout(fallbackOpen);
    cover.dataset.state = 'revealing';
    enter();
    fallbackExit = setTimeout(finish, 1800);   /* the cover fade is .9s; this only covers a missed transitionend */
  }
  function onEnd(e) {
    if (state === 'opening') {
      if (e.propertyName !== 'transform') return;
      if (e.target === flapEl) doneFlap = true;
      if (e.target === cardEl) doneCard = true;
      if (doneFlap && doneCard && !holdTimer) { clearTimeout(fallbackOpen); holdTimer = setTimeout(beginReveal, HOLD); }
    } else if (state === 'revealing' && e.target === cover && e.propertyName === 'opacity') finish();
  }
  function open() {
    if (state !== 'sealed') return;
    state = 'opening'; cover.dataset.state = 'opening';
    var r = trigger.getBoundingClientRect();
    FX.burst(r.left + r.width / 2, r.top + r.height / 2, { n: 80, min: 140, max: 480, g: 360, drag: .22, life: 1.1 });
    startMusic();
    if (reduce) { finish(); return; }
    cover.addEventListener('transitionend', onEnd);
    fallbackOpen = setTimeout(beginReveal, Math.max(3000, C.reveal.durationMs || 0));   /* flap+card finish by ~1.8s */
  }
  trigger.addEventListener('click', open);

  /* sparkle trail for mouse users */
  if (!reduce && fxOn('cursorTrail') && window.matchMedia('(pointer: fine)').matches) {
    var lx = 0, ly = 0;
    window.addEventListener('pointermove', function (e) {
      if (!entered || e.pointerType !== 'mouse') return;
      var dx = e.clientX - lx, dy = e.clientY - ly; if (dx * dx + dy * dy < 900) return;
      lx = e.clientX; ly = e.clientY; FX.trail(lx, ly);
    }, { passive: true });
  }
})();
