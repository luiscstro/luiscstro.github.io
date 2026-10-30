/* Portfólio Luis Castro: comportamento da página.
   Tudo aqui é aprimoramento: sem JavaScript, o conteúdo continua completo e legível. */
(() => {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const motion = hasGSAP && !reduced;
  const DATA = window.PORTFOLIO_DATA || { pncp: [] };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
  }

  /* ---------- Azulejos desenhados em canvas, espelhados nos quatro quadrantes ---------- */
  const SHADES = ['#2C4BDB', '#2541C2', '#3554E6'];
  const WAYS = {
    day: (s) => ({ ground: '#F4F6FB', ink: s, acc: '#F4F6FB', glaze: true }),
    sun: (s) => ({ ground: '#F4F6FB', ink: s, acc: '#F6B93B', glaze: true }),
    inv: (s) => ({ ground: s, ink: '#F4F6FB', acc: s, glaze: true }),
    night: () => ({ ground: '#0E1434', ink: 'rgba(157,178,255,0.16)', acc: '#0E1434', glaze: false }),
  };
  const P = Math.PI;
  const quarterDisc = (c, x, y, r, a0, a1) => { c.beginPath(); c.moveTo(x, y); c.arc(x, y, r, a0, a1); c.closePath(); c.fill(); };
  const MOTIFS = [
    (c, h, ink, acc) => { // flor
      c.fillStyle = ink;
      c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(h * 0.34, h * 0.26, h * 0.7, 0); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(h * 0.26, h * 0.34, 0, h * 0.7); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(h * 0.24, h * 0.24); c.quadraticCurveTo(h * 0.62, h * 0.3, h * 0.66, h * 0.66); c.quadraticCurveTo(h * 0.3, h * 0.62, h * 0.24, h * 0.24); c.fill();
      quarterDisc(c, h, h, h * 0.38, P, P * 1.5);
      c.fillStyle = acc; quarterDisc(c, h, h, h * 0.18, P, P * 1.5);
      quarterDisc(c, 0, 0, h * 0.13, 0, P / 2);
    },
    (c, h, ink, acc) => { // estrela
      c.fillStyle = ink;
      const R = h * 0.68, r = h * 0.27;
      c.beginPath(); c.moveTo(0, 0);
      for (let k = 0; k <= 4; k++) { const a = (k * P) / 8; const rad = k % 2 === 0 ? R : r; c.lineTo(Math.cos(a) * rad, Math.sin(a) * rad); }
      c.closePath(); c.fill();
      c.strokeStyle = ink; c.lineWidth = h * 0.07;
      c.beginPath(); c.arc(h, h, h * 0.46, P, P * 1.5); c.stroke();
      quarterDisc(c, h, h, h * 0.22, P, P * 1.5);
      c.fillStyle = acc; quarterDisc(c, 0, 0, h * 0.11, 0, P / 2);
    },
    (c, h, ink) => { // laços
      c.strokeStyle = ink; c.lineWidth = h * 0.09;
      c.beginPath(); c.arc(h, h, h * 0.98, P, P * 1.5); c.stroke();
      c.beginPath(); c.arc(0, 0, h * 0.5, 0, P / 2); c.stroke();
      c.beginPath(); c.arc(h, 0, h * 0.3, P / 2, P); c.stroke();
      c.beginPath(); c.arc(0, h, h * 0.3, P * 1.5, P * 2); c.stroke();
      c.fillStyle = ink; c.beginPath(); c.moveTo(0, 0); c.lineTo(h * 0.2, 0); c.lineTo(0, h * 0.2); c.closePath(); c.fill();
    },
    (c, h, ink) => { // losango
      c.strokeStyle = ink; c.lineWidth = h * 0.06;
      c.beginPath(); c.moveTo(0, h * 0.92); c.lineTo(h * 0.92, 0); c.stroke();
      c.beginPath(); c.moveTo(0, h * 0.62); c.lineTo(h * 0.62, 0); c.stroke();
      c.fillStyle = ink;
      c.beginPath(); c.moveTo(0, 0); c.lineTo(h * 0.34, 0); c.lineTo(0, h * 0.34); c.closePath(); c.fill();
      quarterDisc(c, h, h, h * 0.24, P, P * 1.5);
      quarterDisc(c, h, 0, h * 0.14, P / 2, P);
      quarterDisc(c, 0, h, h * 0.14, P * 1.5, P * 2);
    },
    (c, h, ink) => { // folhas
      c.fillStyle = ink;
      const leaf = (a) => { c.save(); c.rotate(a); c.beginPath(); c.moveTo(h * 0.2, 0); c.quadraticCurveTo(h * 0.52, h * 0.17, h * 0.88, 0); c.quadraticCurveTo(h * 0.52, -h * 0.17, h * 0.2, 0); c.fill(); c.restore(); };
      leaf(P / 4); leaf(0); leaf(P / 2);
      c.strokeStyle = ink; c.lineWidth = h * 0.05; c.beginPath(); c.arc(0, 0, h * 0.13, 0, P / 2); c.stroke();
      c.beginPath(); c.moveTo(h, h * 0.66); c.lineTo(h * 0.66, h); c.lineTo(h, h); c.closePath(); c.fill();
    },
    (c, h, ink, acc) => { // pontas de diamante
      c.fillStyle = ink;
      c.beginPath(); c.moveTo(h, 0); c.lineTo(h, h); c.lineTo(0, h); c.closePath(); c.fill();
      c.fillStyle = acc; quarterDisc(c, h, h, h * 0.5, P, P * 1.5);
      c.fillStyle = ink; quarterDisc(c, h, h, h * 0.22, P, P * 1.5);
      c.beginPath(); c.moveTo(0, 0); c.lineTo(h * 0.3, 0); c.lineTo(0, h * 0.3); c.closePath(); c.fill();
    },
  ];
  const QUADS = [[1, 1], [-1, 1], [1, -1], [-1, -1]];

  function paintTile(c, s, motif, way) {
    const h = s / 2;
    c.fillStyle = way.ground; c.fillRect(0, 0, s, s);
    c.save(); c.translate(h, h);
    for (const [sx, sy] of QUADS) {
      c.save(); c.scale(sx, sy); c.beginPath(); c.rect(0, 0, h, h); c.clip();
      MOTIFS[motif](c, h, way.ink, way.acc);
      c.restore();
    }
    c.restore();
    if (way.glaze) {
      const g = c.createLinearGradient(0, 0, s, s);
      g.addColorStop(0, 'rgba(255,255,255,0.22)'); g.addColorStop(0.42, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,40,0.12)');
      c.fillStyle = g; c.fillRect(0, 0, s, s);
    }
  }

  const spriteCache = new Map();
  function sprite(motif, wayName, shade, px) {
    const key = `${motif}|${wayName}|${shade}|${px}`;
    let cv = spriteCache.get(key);
    if (cv) return cv;
    cv = document.createElement('canvas');
    cv.width = cv.height = px;
    paintTile(cv.getContext('2d'), px, motif, WAYS[wayName](SHADES[shade]));
    spriteCache.set(key, cv);
    return cv;
  }
  const tileURL = (motif, wayName, shade = 0, px = 64) => `url(${sprite(motif, wayName, shade, px).toDataURL('image/png')})`;

  function borderURL(px = 112) {
    const cv = document.createElement('canvas'); cv.width = cv.height = px;
    const c = cv.getContext('2d'); const s = px;
    c.fillStyle = SHADES[0]; c.fillRect(0, 0, s, s);
    c.strokeStyle = '#F4F6FB'; c.lineWidth = s * 0.07;
    c.beginPath(); c.arc(s / 2, 0, s * 0.4, 0, P); c.stroke();
    c.beginPath(); c.arc(0, s, s * 0.4, P, P * 2); c.stroke();
    c.beginPath(); c.arc(s, s, s * 0.4, P, P * 2); c.stroke();
    c.fillStyle = '#F4F6FB';
    c.beginPath(); c.arc(s / 2, s * 0.8, s * 0.08, 0, P * 2); c.fill();
    c.beginPath(); c.arc(0, s * 0.2, s * 0.08, 0, P * 2); c.fill();
    c.beginPath(); c.arc(s, s * 0.2, s * 0.08, 0, P * 2); c.fill();
    c.fillRect(0, s * 0.02, s, s * 0.04); c.fillRect(0, s * 0.94, s, s * 0.04);
    return `url(${cv.toDataURL('image/png')})`;
  }

  (function setTileVars() {
    const st = document.documentElement.style;
    try {
      st.setProperty('--tile-mini', tileURL(0, 'inv', 0, 40));
      st.setProperty('--tile-brand', tileURL(1, 'inv', 0, 72));
      st.setProperty('--tile-photo', tileURL(3, 'day', 0, 112));
      st.setProperty('--tile-border', borderURL(112));
    } catch (e) { /* sem canvas: o CSS usa as cores de reserva */ }
  })();

  /* ---------- Fachada interativa (início e contato) ---------- */
  function createFacade(canvas, host, opts) {
    if (!canvas || !host || !canvas.getContext) return null;
    const ctx = canvas.getContext('2d');
    const o = Object.assign({ sizes: [56, 72, 88], light: 3.2, wander: true, interactive: true, center: [0.74, 0.46] }, opts);
    let W = 0, H = 0, dpr = 1, S = 0, px = 0, tiles = [];
    let running = false, visible = false, raf = 0, lastT = 0;
    const ptr = { x: 0, y: 0, t: -1e9, inside: false };
    const waves = [];
    const rand = (n) => Math.floor(Math.random() * n);

    function layout() {
      const r = host.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      S = W < 640 ? o.sizes[0] : W < 1100 ? o.sizes[1] : o.sizes[2];
      px = Math.round(S * dpr);
      const cols = Math.ceil(W / S) + 1, rows = Math.ceil(H / S) + 1;
      const ox = (W - cols * S) / 2, oy = (H - rows * S) / 2;
      tiles = [];
      for (let rr = 0; rr < rows; rr++) {
        for (let cc = 0; cc < cols; cc++) {
          tiles.push({ x: ox + cc * S + S / 2, y: oy + rr * S + S / 2, m: rand(MOTIFS.length), sh: rand(3), glow: 0, flipping: false, t0: 0, swapped: false, next: 0, last: -1e9 });
        }
      }
      draw(performance.now(), 16);
    }
    function startFlip(k, t) {
      k.flipping = true; k.t0 = t; k.swapped = false; k.last = t;
      k.next = (k.m + 1 + rand(MOTIFS.length - 1)) % MOTIFS.length;
    }
    function draw(t, dt) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#060918'; ctx.fillRect(0, 0, W, H);
      const live = o.interactive && ptr.inside && t - ptr.t < 2600;
      let lx, ly, strength;
      if (live) { lx = ptr.x; ly = ptr.y; strength = 1; }
      else if (o.wander && running) { lx = W * (0.66 + 0.22 * Math.sin(t * 0.00021)); ly = H * (0.5 + 0.3 * Math.sin(t * 0.00029 + 1.3)); strength = 0.85; }
      else { lx = W * o.center[0]; ly = H * o.center[1]; strength = 0.85; }
      const R = S * o.light, half = (S - 1.5) / 2, size = S - 1.5, k60 = dt / 16.7;
      for (const k of tiles) {
        const d = Math.hypot(k.x - lx, k.y - ly);
        let target = Math.max(0, 1 - d / R); target = target * target * strength;
        for (const w of waves) {
          const front = (t - w.t0) * 0.75;
          if (!k.flipping && t - k.last > 450 && Math.abs(Math.hypot(k.x - w.x, k.y - w.y) - front) < S * 0.55) { startFlip(k, t); k.glow = Math.max(k.glow, 0.7); }
        }
        k.glow += (target - k.glow) * (target > k.glow ? 0.2 : 0.035) * k60;
        if (running && k.glow > 0.6 && !k.flipping && t - k.last > 2400 && Math.random() < 0.06 * k60) startFlip(k, t);
        let sx = 1;
        if (k.flipping) {
          const e = Math.min(1, (t - k.t0) / 620);
          sx = Math.max(0.02, Math.abs(Math.cos(e * P)));
          if (e >= 0.5 && !k.swapped) { k.m = k.next; k.sh = rand(3); k.swapped = true; }
          if (e >= 1) { k.flipping = false; sx = 1; }
        }
        ctx.save(); ctx.translate(k.x, k.y); if (sx !== 1) ctx.scale(sx, 1);
        ctx.drawImage(sprite(k.m, 'night', 0, px), -half, -half, size, size);
        const gl = k.glow;
        if (gl > 0.02) {
          ctx.globalAlpha = Math.min(1, gl * 1.4);
          ctx.drawImage(sprite(k.m, 'inv', k.sh, px), -half, -half, size, size);
          if (gl > 0.5) {
            ctx.globalAlpha = Math.min(1, (gl - 0.5) * 2.2);
            ctx.drawImage(sprite(k.m, k.m % 3 === 0 ? 'sun' : 'day', k.sh, px), -half, -half, size, size);
          }
          ctx.globalAlpha = 1;
        }
        ctx.restore();
      }
      const halo = ctx.createRadialGradient(lx, ly, 0, lx, ly, R * 1.3);
      halo.addColorStop(0, 'rgba(130,160,255,0.14)'); halo.addColorStop(1, 'rgba(130,160,255,0)');
      ctx.fillStyle = halo; ctx.fillRect(lx - R * 1.3, ly - R * 1.3, R * 2.6, R * 2.6);
      for (let i = waves.length - 1; i >= 0; i--) if (t - waves[i].t0 > 2600) waves.splice(i, 1);
      if (running && Math.random() < 0.05 * k60) { const k = tiles[rand(tiles.length)]; if (k && !k.flipping && k.glow > 0.15) startFlip(k, t); }
    }
    function loop(t) {
      const dt = lastT ? Math.min(50, t - lastT) : 16; lastT = t;
      draw(t, dt);
      if (running) raf = requestAnimationFrame(loop);
    }
    function start() { if (running || reduced) return; running = true; lastT = 0; raf = requestAnimationFrame(loop); }
    function stop() { running = false; cancelAnimationFrame(raf); }

    if (o.interactive) {
      const setPtr = (e) => { const r = canvas.getBoundingClientRect(); ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; ptr.t = performance.now(); ptr.inside = true; };
      host.addEventListener('pointermove', setPtr, { passive: true });
      host.addEventListener('pointerleave', () => { ptr.inside = false; });
      host.addEventListener('pointerdown', (e) => {
        if (e.target.closest('a, button, input, label')) return;
        setPtr(e);
        waves.push({ x: ptr.x, y: ptr.y, t0: performance.now() });
        if (waves.length > 4) waves.shift();
        if (reduced) { for (const k of tiles) if (Math.hypot(k.x - ptr.x, k.y - ptr.y) < S * 2.2) k.m = (k.m + 1) % MOTIFS.length; draw(performance.now(), 16); }
      });
    }
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !document.hidden) start(); else stop(); });
    io.observe(host);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else if (visible) start(); });
    let rt = 0, lastW = 0, lastH = 0;
    const ro = new ResizeObserver(([en]) => { const { width, height } = en.contentRect; if (Math.abs(width - lastW) < 2 && Math.abs(height - lastH) < 2) return; lastW = width; lastH = height; clearTimeout(rt); rt = setTimeout(layout, 120); });
    ro.observe(host);
    layout();
    return { layout };
  }

  const heroFacade = createFacade($('#hero-canvas'), $('#inicio'), {});
  createFacade($('#contact-canvas'), $('#contato'), { light: 2.8, center: [0.82, 0.55], sizes: [52, 64, 76] });

  /* ---------- Rolagem suave ---------- */
  let lenis = null;
  if (!reduced && typeof window.Lenis === 'function') {
    lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true });
    if (hasGSAP) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  const lockScroll = () => { if (lenis) lenis.stop(); };
  const unlockScroll = () => { if (lenis) lenis.start(); };
  function scrollToY(y, immediate) {
    if (lenis) lenis.scrollTo(y, { duration: immediate ? 0 : 1.4, immediate: !!immediate, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else window.scrollTo({ top: y, behavior: reduced || immediate ? 'auto' : 'smooth' });
  }

  /* ---------- Topo: some ao descer, volta ao subir e troca de cor conforme a faixa ---------- */
  const topbar = $('#topbar');
  const bandSections = $$('main > section[data-band]');
  let lastY = window.scrollY, menuOpen = false, workPanelBand = null;
  function bandAt(y) {
    for (const s of bandSections) { const r = s.getBoundingClientRect(); if (r.top <= y && r.bottom > y) return s; }
    return null;
  }
  function updateChrome() {
    const y = window.scrollY;
    const sec = bandAt(40);
    let band = sec ? sec.dataset.band : 'dark';
    if (sec && sec.id === 'projetos' && workPanelBand) band = workPanelBand;
    topbar.dataset.on = band;
    const delta = y - lastY;
    if (!menuOpen) {
      if (y > 160 && delta > 6) topbar.classList.add('is-hidden');
      else if (delta < -6 || y < 160) topbar.classList.remove('is-hidden');
    }
    lastY = y;
  }
  let chromeQueued = false;
  const queueChrome = () => { if (!chromeQueued) { chromeQueued = true; requestAnimationFrame(() => { chromeQueued = false; updateChrome(); }); } };
  window.addEventListener('scroll', queueChrome, { passive: true });
  window.addEventListener('resize', queueChrome);
  updateChrome();
  topbar.addEventListener('focusin', () => topbar.classList.remove('is-hidden'));

  /* ---------- Início: o nome entra letra por letra ---------- */
  const chars = [];
  $$('.hero-line').forEach((line) => {
    const text = line.textContent;
    line.textContent = '';
    text.split(' ').forEach((word, wi, arr) => {
      const w = document.createElement('span');
      w.style.display = 'inline-block';
      w.style.whiteSpace = 'nowrap';
      for (const ch of word) { const s = document.createElement('span'); s.className = 'ch'; s.textContent = ch; w.appendChild(s); chars.push(s); }
      line.appendChild(w);
      if (wi < arr.length - 1) line.appendChild(document.createTextNode(' '));
    });
  });
  if (motion && chars.length) {
    gsap.fromTo(chars, { yPercent: 40, opacity: 0.2, '--wg': 260, '--sf': 100 }, { yPercent: 0, opacity: 1, '--wg': 820, '--sf': 0, duration: 1.3, ease: 'expo.out', stagger: 0.04, delay: 0.1 });
    gsap.from('.hero-intro, .hero-lede, .hero-roles li, .hero-cta', { y: 24, opacity: 0.2, duration: 1, ease: 'expo.out', stagger: 0.07, delay: 0.35 });
    const heroST = { trigger: '#inicio', start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('.hero-line:first-child', { xPercent: -5, ease: 'none', scrollTrigger: heroST });
    gsap.to('.hero-line:last-child', { xPercent: 7, ease: 'none', scrollTrigger: heroST });
    gsap.to('.hero-inner', { yPercent: -10, opacity: 0.25, ease: 'none', scrollTrigger: heroST });
    gsap.to('#hero-canvas', { yPercent: 16, scale: 1.06, ease: 'none', scrollTrigger: heroST });
  }

  // As letras do nome ficam mais finas e macias perto do mouse; no toque, uma onda atravessa o nome
  if (motion && chars.length) {
    const hero = $('#inicio');
    const state = chars.map(() => ({ wg: 820, sf: 0, x: 0, y: 0 }));
    let px = -9999, py = -9999, active = false, rafId = 0, ready = false, sy0 = 0;
    setTimeout(() => { ready = true; }, 1600);
    const measure = () => {
      sy0 = window.scrollY;
      chars.forEach((c, i) => { const r = c.getBoundingClientRect(); state[i].x = r.left + r.width / 2; state[i].y = r.top + r.height / 2; });
    };
    const tick = () => {
      let moving = false;
      const dy = window.scrollY - sy0;
      chars.forEach((c, i) => {
        const s = state[i];
        const f = active ? Math.max(0, 1 - Math.hypot(px - s.x, py - (s.y - dy)) / 260) : 0;
        const twg = 820 - 560 * f, tsf = 100 * f;
        s.wg += (twg - s.wg) * 0.14; s.sf += (tsf - s.sf) * 0.14;
        if (Math.abs(twg - s.wg) > 1 || Math.abs(tsf - s.sf) > 0.5) moving = true;
        c.style.setProperty('--wg', s.wg.toFixed(0));
        c.style.setProperty('--sf', s.sf.toFixed(0));
      });
      rafId = moving || active ? requestAnimationFrame(tick) : 0;
    };
    hero.addEventListener('pointermove', (e) => {
      if (!ready || e.pointerType !== 'mouse') return;
      if (!active) measure();
      active = true; px = e.clientX; py = e.clientY;
      if (!rafId) rafId = requestAnimationFrame(tick);
    }, { passive: true });
    hero.addEventListener('pointerleave', () => { active = false; if (!rafId) rafId = requestAnimationFrame(tick); });
    window.addEventListener('resize', () => { active = false; });
    $('#hero-name').addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' || !ready) return;
      gsap.to(chars, { keyframes: [{ '--wg': 260, '--sf': 100, duration: 0.35, ease: 'power2.out' }, { '--wg': 820, '--sf': 0, duration: 0.7, ease: 'power2.inOut' }], stagger: 0.05, overwrite: true });
    });
  }

  /* ---------- Sobre: a frase acende conforme a rolagem ---------- */
  const statement = $('#about-statement');
  if (statement && motion) {
    const words = statement.textContent.trim().split(/\s+/);
    statement.textContent = '';
    words.forEach((w, i) => {
      const s = document.createElement('span'); s.className = 'w'; s.textContent = w;
      statement.appendChild(s);
      if (i < words.length - 1) statement.appendChild(document.createTextNode(' '));
    });
    gsap.fromTo($$('.w', statement), { opacity: 0.2 }, { opacity: 1, ease: 'none', stagger: 0.08, scrollTrigger: { trigger: statement, start: 'top 80%', end: 'bottom 45%', scrub: 0.6 } });
  }
  const frame = $('#photo-frame');
  if (frame && motion) {
    gsap.fromTo(frame.parentElement, { y: 40 }, { y: -30, ease: 'none', scrollTrigger: { trigger: '#sobre', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo(frame, { rotate: -2 }, { rotate: 1.5, ease: 'none', scrollTrigger: { trigger: '#sobre', start: 'top bottom', end: 'bottom top', scrub: true } });
  }
  if (motion) {
    $$('.cercadura').forEach((el) => gsap.fromTo(el, { backgroundPosition: '0px 0px' }, { backgroundPosition: '-336px 0px', ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));
    $$('.section-title, .section-lede, .work-title, .contact-title').forEach((el) => gsap.fromTo(el, { y: 56, opacity: 0.35 }, { y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 96%', end: 'top 62%', scrub: 0.5 } }));
    $$('.lab-card').forEach((card) => gsap.fromTo(card, { y: 60 }, { y: 0, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 65%', scrub: 0.6 } }));
  }

  /* ---------- Projetos: trilha horizontal em telas largas ---------- */
  const work = $('#projetos'), track = $('#work-track');
  const panels = track ? $$('.panel', track) : [];
  let workST = null;

  $$('.panel').forEach((panel) => {
    const tabs = $$('.screen-tabs [role="tab"]', panel);
    const screens = $$('[data-screens] .screen', panel);
    if (!tabs.length) return;
    panel._screen = 0;
    panel._setScreen = (i, fromScroll) => {
      if (panel._screen === i) return;
      if (fromScroll && panel._held && performance.now() - panel._held < 3500) return;
      panel._screen = i;
      screens.forEach((s, j) => s.classList.toggle('is-active', j === i));
      tabs.forEach((t, j) => t.setAttribute('aria-selected', String(j === i)));
    };
    tabs.forEach((t, i) => t.addEventListener('click', () => { panel._held = performance.now(); panel._setScreen(i); }));
    if (!motion) return;
    let timer = 0;
    ScrollTrigger.create({
      trigger: panel, start: 'top 70%', end: 'bottom 30%',
      onToggle: (self) => {
        clearInterval(timer);
        if (self.isActive && !work.classList.contains('is-horizontal')) timer = setInterval(() => panel._setScreen((panel._screen + 1) % screens.length, true), 3200);
      },
    });
  });

  // Clicar na imagem do projeto abre os detalhes
  $$('.panel').forEach((panel) => {
    const caseBtn = $('[data-case]', panel), stage = $('.panel-stage', panel);
    if (!caseBtn || !stage) return;
    stage.style.cursor = 'pointer';
    stage.addEventListener('click', (e) => { if (e.target.closest('[role="tab"]')) return; openCase(caseBtn.dataset.case, stage); });
  });

  if (motion && work && track) {
    const mm = gsap.matchMedia();
    // A trilha horizontal só liga em telas de altura normal; numa janela gigante (visualizador que rola por fora) os projetos ficam empilhados
    mm.add('(min-width: 1100px) and (min-height: 620px) and (max-height: 1600px)', () => {
      work.classList.add('is-horizontal');
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const bar = $('#work-progress-bar');
      const tween = gsap.to(track, { x: () => -dist(), ease: 'none' });
      workST = ScrollTrigger.create({
        trigger: work, pin: '#work-pin', start: 'top top', end: () => '+=' + dist(), scrub: 0.7,
        animation: tween, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: (self) => {
          if (bar) bar.style.transform = `scaleX(${self.progress})`;
          const x = self.progress * dist() + window.innerWidth * 0.5;
          const p = panels.find((pn) => pn.offsetLeft <= x && pn.offsetLeft + pn.offsetWidth > x) || panels[0];
          workPanelBand = p.classList.contains('theme-gastos') ? 'light' : 'dark';
          queueChrome();
        },
        onLeave: () => { workPanelBand = null; queueChrome(); },
        onLeaveBack: () => { workPanelBand = null; queueChrome(); },
      });
      $$('[data-depth]', track).forEach((el) => {
        const depth = +el.dataset.depth;
        gsap.fromTo(el, { x: () => window.innerWidth * depth }, { x: () => -window.innerWidth * depth, ease: 'none', scrollTrigger: { trigger: el.closest('.panel'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true, invalidateOnRefresh: true } });
      });
      $$('.panel:not(.panel-intro) .panel-text', track).forEach((el) => {
        gsap.fromTo(el.children, { x: 90, opacity: 0.3 }, { x: 0, opacity: 1, ease: 'none', stagger: 0.04, scrollTrigger: { trigger: el.closest('.panel'), containerAnimation: tween, start: 'left 92%', end: 'left 35%', scrub: true } });
      });
      panels.forEach((panel) => {
        if (!panel._setScreen) return;
        const n = $$('[data-screens] .screen', panel).length;
        ScrollTrigger.create({ trigger: panel, containerAnimation: tween, start: 'left 60%', end: 'right 40%', onUpdate: (self) => panel._setScreen(Math.min(n - 1, Math.floor(self.progress * n)), true) });
      });
      return () => { work.classList.remove('is-horizontal'); workST = null; workPanelBand = null; gsap.set(track, { clearProps: 'transform' }); };
    });
    mm.add('(max-width: 1099px), (max-height: 619px), (min-height: 1601px)', () => {
      $$('.panel-stage', track).forEach((el) => gsap.fromTo(el, { y: 70 }, { y: -20, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } }));
    });
  }

  function scrollToPanel(panel) {
    if (workST && work.classList.contains('is-horizontal')) {
      const total = Math.max(1, track.scrollWidth - window.innerWidth);
      scrollToY(workST.start + clamp(panel.offsetLeft / total, 0, 1) * (workST.end - workST.start));
    } else {
      scrollToY(panel.getBoundingClientRect().top + window.scrollY - 20);
    }
  }

  /* ---------- Sites: a página de cada site rola dentro da moldura ---------- */
  // Com mouse, acompanha a rolagem da página. No toque, ou quando a página não rola por dentro,
  // o site rola sozinho enquanto está na tela, sem depender de como o link foi aberto.
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const pageScrolls = () => document.documentElement.scrollHeight > window.innerHeight + 2;
  const shown = (el) => el.getClientRects().length > 0;
  const facadeSetups = [];
  $$('.facade').forEach((facade) => {
    const link = $('.facade-info .link-arrow', facade), stage = $('.facade-stage', facade);
    if (link && stage) { stage.style.cursor = 'pointer'; stage.addEventListener('click', (e) => { if (!e.target.closest('a')) link.click(); }); }
    const shots = $$('.facade-shot', facade);
    // As fatias da moldura visível carregam antes de o site chegar na tela, para ela nunca aparecer vazia
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        if (!entries.some((en) => en.isIntersecting)) return;
        shots.filter(shown).forEach((s) => $$('img', s).forEach((img) => { img.loading = 'eager'; }));
        io.disconnect();
      }, { rootMargin: '150% 0px' });
      io.observe(facade);
    }
    if (!hasGSAP || reduced) return;
    shots.forEach((shot) => {
      const view = shot.parentElement;
      // A altura vem das dimensões da imagem, então funciona mesmo antes de as fatias carregarem
      const dist = () => Math.max(0, view.clientWidth * (+shot.dataset.h / +shot.dataset.w) - view.clientHeight);
      const isCel = !!shot.closest('.facade-cel');
      let mode = '', linked = null, auto = null, visible = false, lastD = -1;
      const clear = () => {
        if (linked) { if (linked.scrollTrigger) linked.scrollTrigger.kill(); linked.kill(); linked = null; }
        if (auto) { auto.kill(); auto = null; }
        gsap.set(shot, { y: 0 });
      };
      // Escolhe o modo de novo sempre que a janela muda: acompanhar a rolagem ou rolar sozinho
      const setup = () => {
        if (!isCel && finePointer && pageScrolls()) {
          if (mode === 'linked') return;
          clear(); mode = 'linked';
          linked = gsap.fromTo(shot, { y: 0 }, { y: () => -dist(), ease: 'none', scrollTrigger: { trigger: facade, start: 'top 75%', end: 'bottom 35%', scrub: 0.8, invalidateOnRefresh: true } });
          return;
        }
        const d = dist();
        // No celular, a barra do navegador esconde e volta ao rolar a página e isso dispara um resize.
        // Se a moldura continua do mesmo tamanho, o site segue de onde estava em vez de recomeçar do topo.
        if (mode === 'auto' && auto && shown(shot) && Math.abs(d - lastD) < 2) return;
        clear(); mode = 'auto'; lastD = d;
        if (!d || !shown(shot)) return;
        auto = gsap.timeline({ repeat: -1, paused: true, delay: 0.6 })
          .to(shot, { y: -d, duration: Math.max(8, d / 120), ease: 'sine.inOut' })
          .to(shot, { y: 0, duration: Math.max(2.5, d / 600), ease: 'power2.inOut' }, '+=1.5')
          .to({}, { duration: 1.2 });
        if (visible) auto.play();
      };
      setup();
      new IntersectionObserver(([en]) => {
        visible = en.isIntersecting;
        if (mode === 'auto' && !auto) setup();
        if (auto) { if (visible) auto.play(); else auto.pause(); }
      }, { threshold: 0.2 }).observe(view);
      facadeSetups.push(setup);
    });
    const phone = $('.phone-corner', facade);
    if (phone && finePointer && pageScrolls()) gsap.fromTo(phone, { y: 90 }, { y: -50, ease: 'none', scrollTrigger: { trigger: facade, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* ---------- Robô de licitações ---------- */
  (function initBot() {
    const log = $('#chat-log'), form = $('#chat-form'), input = $('#chat-input'), first = $('#chat-first'), suggest = $('#chat-suggest');
    if (!log || !form) return;
    const brl = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
    const when = (s) => { if (!s) return ''; const [d, t] = s.split('T'); const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}${t ? ' às ' + t.slice(0, 5) : ''}`; };
    // Os textos oficiais às vezes trazem travessões e hifens; aqui viram vírgulas e espaços
    const clean = (s) => String(s || '').replace(/\s*[—–]\s*/g, ', ').replace(/\s+-\s+/g, ', ').replace(/(\p{L})-(?=\p{L})/gu, '$1 ').replace(/·/g, ',');
    const search = (term) => { const t = norm(term).trim(); return t ? DATA.pncp.filter((p) => norm(p.objeto).includes(t) || norm(p.cidade).includes(t) || norm(p.uf) === t) : []; };
    // Tira o nome da plataforma no começo do texto oficial e só põe em minúsculas o que veio todo em maiúsculas, para não apagar nomes próprios e siglas
    const SIGLAS = /(^|[^\p{L}])(rp|epp|mei|epi|tic|ubs|upa|caps|samu|cnpj|pncp|srp|ltda|suv)(?![\p{L}])/gu;
    const tidy = (s, cidade) => {
      let t = clean(s).replace(/^\s*\[[^\]]*\]\s*[,:;]?\s*/, '').trim();
      const letters = t.replace(/[^\p{L}]/gu, '');
      if (letters && t.replace(/[^\p{Lu}]/gu, '').length / letters.length > 0.6) {
        t = t.toLowerCase().replace(SIGLAS, (m, a, b) => a + b.toUpperCase());
        const nome = String(cidade || '').trim();
        if (nome) t = t.split(nome.toLowerCase()).join(nome);
      }
      return t.charAt(0).toUpperCase() + t.slice(1);
    };
    // Corta no fim de uma palavra inteira, nunca no meio dela
    const shorten = (s, n = 140) => {
      if (s.length <= n) return s;
      const cut = s.slice(0, n), i = cut.lastIndexOf(' ');
      let out = cut.slice(0, i > 60 ? i : n);
      const open = out.lastIndexOf('(');
      if (open > 60 && open > out.lastIndexOf(')')) out = out.slice(0, open);
      return out.replace(/[\s,;:]+$/, '').replace(/(\s+(?:de|da|do|das|dos|e|em|para|por|com|a|o|as|os|no|na|nos|nas|ao|que|ou))+$/i, '').replace(/[\s,;:]+$/, '') + '…';
    };
    const isOpen = (p) => !p.encerra || new Date(p.encerra).getTime() >= Date.now();
    function reply(term) {
      const found = search(term);
      const el = document.createElement('div');
      el.className = 'msg msg-bot';
      if (!found.length) {
        el.innerHTML = `Não encontrei licitações sobre “${esc(term)}” no momento. Tente <b>limpeza</b>, <b>merenda</b>, <b>software</b> ou <b>uniforme</b>.`;
        return el;
      }
      // As que ainda estão abertas vêm primeiro, da que encerra antes para a que encerra depois; as encerradas ficam por último
      const byEnd = (a, b) => String(a.encerra).localeCompare(String(b.encerra));
      const ordered = found.filter(isOpen).sort(byEnd).concat(found.filter((p) => !isOpen(p)).sort((a, b) => byEnd(b, a)));
      const shown = ordered.slice(0, 3);
      const intro = found.length > 3
        ? `Encontrei <b>${found.length}</b> licitações sobre “${esc(term)}”. ${shown.every(isOpen) ? 'Estas são as três que encerram primeiro:' : 'Estas são três delas:'}`
        : `Encontrei <b>${found.length}</b> ${found.length === 1 ? 'licitação' : 'licitações'} sobre “${esc(term)}”:`;
      el.innerHTML = intro + shown.map((p) => {
        const obj = shorten(tidy(p.objeto, clean(p.cidade)));
        const link = /^https:\/\/pncp\.gov\.br\//.test(p.link || '') ? `<a href="${esc(p.link)}" target="_blank" rel="noopener">Ver o edital</a>` : '';
        return `<div class="lic"><span class="lic-where">${esc(clean(p.cidade))}/${esc(p.uf || '')}</span><span class="lic-obj">${esc(obj)}</span><span class="lic-meta">Valor estimado de ${brl(p.valor)}</span><span class="lic-meta">${isOpen(p) ? 'Encerra' : 'Encerrou'} em ${esc(when(p.encerra))}</span>${link}</div>`;
      }).join('');
      return el;
    }
    if (first) first.replaceWith(reply('limpeza'));
    log.scrollTop = 0;
    let busy = false;
    function send(text) {
      text = text.trim().slice(0, 60);
      if (!text || busy) return;
      busy = true;
      const me = document.createElement('p'); me.className = 'msg msg-me'; me.textContent = text; log.appendChild(me);
      const typing = document.createElement('div'); typing.className = 'msg msg-bot'; typing.innerHTML = '<span class="typing" aria-label="digitando"><i></i><i></i><i></i></span>';
      log.appendChild(typing); log.scrollTop = log.scrollHeight;
      const term = text.replace(/^\s*buscar\s*/i, '');
      setTimeout(() => {
        typing.remove();
        if (!term) { const m = document.createElement('p'); m.className = 'msg msg-bot'; m.innerHTML = 'Escreva <b>buscar</b> e um assunto. Por exemplo: buscar merenda.'; log.appendChild(m); }
        else log.appendChild(reply(term));
        log.scrollTop = log.scrollHeight; busy = false;
      }, reduced ? 50 : 650);
    }
    form.addEventListener('submit', (e) => { e.preventDefault(); send(input.value); input.value = ''; });
    suggest.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) send(b.textContent); });
  })();

  /* ---------- Conversor de vídeos ---------- */
  (function initConverter() {
    const run = $('#conv-run'), fast = $('#conv-fast'), log = $('#conv-log'), items = $$('#conv-files li');
    if (!run) return;
    const say = (s) => { log.textContent = s; };
    const animateBar = (li, from, to, ms) => new Promise((res) => {
      const bar = $('.f-bar i', li), t0 = performance.now();
      const step = (t) => {
        const p = clamp((t - t0) / ms, 0, 1);
        bar.style.transform = `scaleX(${from + (to - from) * (1 - Math.pow(1 - p, 2))})`;
        if (p < 1) requestAnimationFrame(step); else res();
      };
      requestAnimationFrame(step);
    });
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    let running = false;
    run.addEventListener('click', async () => {
      if (running) return;
      running = true; run.disabled = true; run.textContent = 'Convertendo…';
      const quick = fast.checked, speed = reduced ? 0.15 : 1;
      items.forEach((li) => { li.classList.remove('is-done', 'is-encode'); $('.f-bar i', li).style.transform = 'scaleX(0)'; $('.f-state', li).textContent = 'na fila'; });
      say('Convertendo quatro vídeos…');
      for (const li of items) {
        const name = $('.f-name', li).textContent, size = +li.dataset.size, incompatible = li.dataset.mode === 'encode';
        const state = $('.f-state', li);
        if (quick && !incompatible) {
          state.textContent = 'convertendo';
          await animateBar(li, 0, 1, size * 420 * speed);
          say(`${name} ficou pronto em segundos, sem perder qualidade.`);
        } else {
          if (quick) {
            state.textContent = 'convertendo';
            await animateBar(li, 0, 0.28, 420 * speed);
            say(`${name} não pôde ser convertido direto, então o programa está refazendo o vídeo. Isso demora um pouco mais.`);
          } else {
            say(`Refazendo ${name}…`);
          }
          li.classList.add('is-encode'); state.textContent = 'refazendo';
          await animateBar(li, 0, 1, size * (quick ? 2100 : 1700) * speed);
        }
        li.classList.add('is-done'); state.textContent = 'pronto';
        await wait(160 * speed);
      }
      say('Pronto! Os quatro vídeos estão em MP4, na pasta “convertidos”.');
      run.disabled = false; run.textContent = 'Converter de novo'; running = false;
    });
  })();

  /* ---------- Arte do Bike Ilha Club ---------- */
  (function drawBike() {
    const cv = $('#bike-canvas'); if (!cv) return;
    const paint = () => {
      const r = cv.getBoundingClientRect(); if (!r.width) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
      const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
      const W = r.width, H = r.height, S = Math.max(44, W / 8);
      c.fillStyle = SHADES[0]; c.fillRect(0, 0, W, H);
      for (let y = 0, row = 0; y < H; y += S, row++) for (let x = 0, col = 0; x < W; x += S, col++) { c.globalAlpha = 0.22; c.drawImage(sprite((row + col) % 2 ? 2 : 0, 'inv', 0, 128), x, y, S - 1, S - 1); }
      c.globalAlpha = 1;
      const cx = W / 2, cy = H * 0.56, u = Math.min(W, H) * 0.12;
      c.strokeStyle = '#F4F6FB'; c.lineWidth = u * 0.22; c.lineCap = 'round'; c.lineJoin = 'round';
      c.beginPath(); c.arc(cx - u * 1.7, cy + u * 0.6, u * 1.05, 0, P * 2); c.stroke();
      c.beginPath(); c.arc(cx + u * 1.7, cy + u * 0.6, u * 1.05, 0, P * 2); c.stroke();
      c.beginPath(); c.moveTo(cx - u * 1.7, cy + u * 0.6); c.lineTo(cx - u * 0.5, cy - u * 0.8); c.lineTo(cx + u * 1.1, cy - u * 0.8); c.lineTo(cx + u * 1.7, cy + u * 0.6); c.moveTo(cx - u * 0.5, cy - u * 0.8); c.lineTo(cx + 0.1 * u, cy + u * 0.6); c.lineTo(cx + u * 1.1, cy - u * 0.8); c.moveTo(cx - u * 0.75, cy - u * 1.2); c.lineTo(cx - u * 0.2, cy - u * 1.2); c.moveTo(cx + u * 1.1, cy - u * 0.8); c.lineTo(cx + u * 0.95, cy - u * 1.45); c.lineTo(cx + u * 1.4, cy - u * 1.55); c.stroke();
      c.fillStyle = '#F6B93B'; c.beginPath(); c.arc(cx + u * 2.9, cy - u * 2.2, u * 0.42, P, 0); c.lineTo(cx + u * 2.9, cy - u * 1.35); c.closePath(); c.fill();
      c.fillStyle = SHADES[0]; c.beginPath(); c.arc(cx + u * 2.9, cy - u * 2.2, u * 0.16, 0, P * 2); c.fill();
    };
    paint();
    let t = 0; window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(paint, 200); });
  })();

  /* ---------- Detalhes dos projetos e imagens ampliadas ---------- */
  let lastTrigger = null;
  const hydrate = (root) => $$('img[data-src]', root).forEach((img) => { img.src = img.dataset.src; img.removeAttribute('data-src'); img.decoding = 'async'; });
  const setHash = (h) => { try { history.replaceState(null, '', h || (location.pathname + location.search)); } catch (e) { /* sem histórico */ } };

  function openCase(id, trigger) {
    const dlg = document.getElementById(`case-${id}`);
    if (!dlg || dlg.open) return;
    lastTrigger = trigger || document.activeElement;
    hydrate(dlg);
    lockScroll();
    dlg.showModal();
    $('.case-scroll', dlg).scrollTop = 0;
    setHash(`#detalhes-${id}`);
    if (motion && trigger && trigger.getBoundingClientRect) {
      const r = trigger.getBoundingClientRect();
      const from = `inset(${Math.max(0, r.top)}px ${Math.max(0, window.innerWidth - r.right)}px ${Math.max(0, window.innerHeight - r.bottom)}px ${Math.max(0, r.left)}px round 22px)`;
      gsap.fromTo(dlg, { clipPath: from }, { clipPath: 'inset(0px 0px 0px 0px round 0px)', duration: 0.85, ease: 'expo.inOut' });
      gsap.fromTo($$('.case-head > *, .case-hero, .case-phones, .case-grid > section, .case-gallery', dlg), { y: 40, opacity: 0.2 }, { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.05, delay: 0.38 });
    }
  }
  function closeCase(dlg) {
    if (!dlg.open) return;
    const done = () => { dlg.close(); if (hasGSAP) gsap.set(dlg, { clearProps: 'clipPath,opacity' }); };
    if (motion) gsap.to(dlg, { opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: done });
    else dlg.close();
  }
  $$('dialog.case').forEach((dlg) => {
    dlg.addEventListener('cancel', (e) => { e.preventDefault(); closeCase(dlg); });
    dlg.addEventListener('close', () => {
      unlockScroll(); setHash('');
      if (lastTrigger && document.contains(lastTrigger)) { try { lastTrigger.focus({ preventScroll: true }); } catch (e) { /* ok */ } }
    });
    $$('[data-close]', dlg).forEach((b) => b.addEventListener('click', () => closeCase(dlg)));
  });
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-case]');
    if (!b) return;
    e.preventDefault();
    const panel = b.closest('.panel');
    openCase(b.dataset.case, panel ? $('.panel-stage', panel) || b : b);
  });

  const lightbox = $('#lightbox'), lightImg = $('#lightbox-img');
  document.addEventListener('click', (e) => {
    const g = e.target.closest('.g-item');
    if (!g || !lightbox) return;
    lightImg.src = g.dataset.full;
    lightImg.alt = ($('img', g) || {}).alt || '';
    lightbox.showModal();
    if (motion) gsap.fromTo(lightImg, { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'expo.out' });
  });
  if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox || e.target === lightImg || e.target.closest('[data-close]')) lightbox.close(); });

  /* ---------- Menu do celular com cortina de azulejos ---------- */
  (function initMenu() {
    const menu = $('#menu'), btn = $('#menu-open'), cv = $('#menu-canvas');
    if (!menu || !btn) return;
    const ctx = cv.getContext('2d');
    const links = $$('.menu-nav a', menu);
    const label = $('.menu-btn-label', btn);
    let anim = 0, W = 0, H = 0, S = 64, dpr = 1, px = 0;
    const tiles = [];
    function setup() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth; H = window.innerHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      S = W < 640 ? 56 : 76; px = Math.round(S * dpr);
      tiles.length = 0;
      for (let y = 0, r = 0; y < H + S; y += S, r++) for (let x = 0, c = 0; x < W + S; x += S, c++) tiles.push({ x: x + S / 2, y: y + S / 2, m: (r * 3 + c * 5) % MOTIFS.length });
    }
    function paint(p) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = Math.pow(p, 3); ctx.fillStyle = '#060918'; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1;
      const r = btn.getBoundingClientRect(), ox = r.left + r.width / 2, oy = r.top + r.height / 2;
      const maxD = Math.hypot(W, H);
      for (const k of tiles) {
        const local = clamp((p - (Math.hypot(k.x - ox, k.y - oy) / maxD) * 0.55) / 0.45, 0, 1);
        if (local <= 0) continue;
        const e = 1 - Math.pow(1 - local, 3);
        ctx.save(); ctx.translate(k.x, k.y); ctx.rotate((1 - e) * P * 0.5); ctx.scale(e, e);
        ctx.drawImage(sprite(k.m, 'night', 0, px), -(S - 1.5) / 2, -(S - 1.5) / 2, S - 1.5, S - 1.5);
        ctx.restore();
      }
    }
    function run(from, to, ms, done) {
      cancelAnimationFrame(anim);
      const t0 = performance.now();
      const step = (t) => { const k = clamp((t - t0) / ms, 0, 1); paint(from + (to - from) * k); if (k < 1) anim = requestAnimationFrame(step); else if (done) done(); };
      anim = requestAnimationFrame(step);
    }
    function open() {
      if (menuOpen) return;
      menuOpen = true; setup();
      menu.hidden = false; btn.setAttribute('aria-expanded', 'true'); label.textContent = 'Fechar';
      topbar.classList.remove('is-hidden'); lockScroll();
      if (!motion) { paint(1); links[0].focus(); return; }
      gsap.set(links, { y: 50, opacity: 0 });
      run(0, 1, 700, () => { gsap.to(links, { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out', stagger: 0.05 }); links[0].focus({ preventScroll: true }); });
    }
    function close(after) {
      if (!menuOpen) return;
      const finish = () => { menu.hidden = true; menuOpen = false; unlockScroll(); btn.setAttribute('aria-expanded', 'false'); label.textContent = 'Menu'; if (after) after(); };
      if (!motion) { finish(); return; }
      gsap.to(links, { y: -24, opacity: 0, duration: 0.25, ease: 'power2.in', stagger: 0.02 });
      run(1, 0, 450, finish);
    }
    btn.addEventListener('click', () => (menuOpen ? close(() => btn.focus()) : open()));
    menu.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close(() => btn.focus()); }
      if (e.key === 'Tab') { const f = [btn, ...links]; const i = f.indexOf(document.activeElement); e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus(); }
    });
    btn.addEventListener('keydown', (e) => { if (menuOpen && e.key === 'Tab') { e.preventDefault(); (e.shiftKey ? links[links.length - 1] : links[0]).focus(); } });
    window.addEventListener('resize', () => { if (menuOpen) { setup(); paint(1); } });
    window.__closeMenu = close;
  })();

  /* ---------- Links internos com rolagem suave ---------- */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const target = id && document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const go = () => {
      if (target.classList.contains('panel')) scrollToPanel(target);
      else scrollToY(id === 'inicio' ? 0 : target.getBoundingClientRect().top + window.scrollY);
      if (target.matches('section')) { target.setAttribute('tabindex', '-1'); setTimeout(() => target.focus({ preventScroll: true }), reduced ? 0 : 900); }
    };
    if (menuOpen && window.__closeMenu) window.__closeMenu(go); else go();
  });

  /* ---------- Copiar email ---------- */
  const toastEl = $('#toast');
  let toastT = 0;
  const toast = (msg) => { toastEl.textContent = msg; toastEl.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('is-on'), 2600); };
  $$('[data-copy]').forEach((b) => b.addEventListener('click', () => {
    const text = b.dataset.copy;
    const fallback = () => {
      const target = b.parentElement.querySelector('.c-select');
      if (target) { const range = document.createRange(); range.selectNodeContents(target); const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range); }
      toast('Email selecionado. Use Ctrl+C para copiar.');
    };
    try {
      navigator.clipboard.writeText(text).then(() => { toast('Email copiado'); b.textContent = 'Copiado'; setTimeout(() => { b.textContent = 'Copiar'; }, 2000); }, fallback);
    } catch (err) { fallback(); }
  }));

  /* ---------- Visualizador que rola por fora ---------- */
  // Se a página não consegue rolar por dentro, as animações ligadas à rolagem nunca andariam.
  // Nesse caso elas terminam na hora (o início volta ao estado inicial) e os sites passam a rolar sozinhos.
  let settled = false;
  function settleIfOuterScroll() {
    if (settled || !hasGSAP || pageScrolls()) return;
    settled = true;
    ScrollTrigger.getAll().forEach((st) => {
      const anim = st.animation;
      const targets = anim ? anim.targets() : [];
      st.kill();
      if (anim) anim.kill();
      // Sem estilos de animação, cada elemento volta ao visual normal: visível e no lugar
      if (targets.length) gsap.set(targets, { clearProps: 'transform,opacity,backgroundPosition' });
    });
  }
  const recheckLayout = () => { settleIfOuterScroll(); facadeSetups.forEach((fn) => fn()); };
  let relayoutT = 0;
  window.addEventListener('resize', () => { clearTimeout(relayoutT); relayoutT = setTimeout(recheckLayout, 250); });

  /* ---------- Ajustes finais: fontes e links diretos ---------- */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (hasGSAP) ScrollTrigger.refresh(); if (heroFacade) heroFacade.layout(); recheckLayout(); });
  window.addEventListener('load', () => {
    if (hasGSAP) ScrollTrigger.refresh();
    recheckLayout();
    const m = /^#detalhes-(licittracker|versailles|gymlegends|gastos)$/.exec(location.hash);
    if (m) openCase(m[1]);
    else if (location.hash.length > 1) {
      const t = document.getElementById(location.hash.slice(1));
      if (t) setTimeout(() => (t.classList.contains('panel') ? scrollToPanel(t) : scrollToY(t.getBoundingClientRect().top + window.scrollY, true)), 50);
    }
  });
})();
