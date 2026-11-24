/* Original procedural neural-field renderer. No DOM or lifecycle ownership. */
(() => {
  'use strict';

  const noop = () => {};
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const TAU = Math.PI * 2;
  const PALETTES = {
    blue: { light: '218,249,255', primary: '100,221,255', secondary: '49,145,238', dim: '28,101,170' },
    amber: { light: '255,242,193', primary: '255,191,83', secondary: '244,128,42', dim: '155,78,26' }
  };

  function create(canvas) {
    let ctx;
    try { ctx = canvas && canvas.getContext('2d', { alpha: true }); } catch (_) {}
    if (!ctx) return { setMode: noop, setPalette: noop, setPointer: noop, setActive: noop, setPaused: noop, pulse: noop, resize: noop, destroy: noop };

    let width = 1, height = 1, dpr = 1;
    let mode = 'touch', palette = PALETTES.blue;
    let active = false, paused = false, destroyed = false, frame = 0;
    let clock = 0, lastFrame = 0, pulseAge = -1;
    let pointerX = 0, pointerY = 0, aimX = 0, aimY = 0;
    let seed = 719043;
    const random = () => {
      seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const vertices = [];
    const segments = [];
    const particles = [];
    const highways = [];
    const add = (x, y, z) => { vertices.push(x, y, z); return vertices.length / 3 - 1; };
    const rgba = (color, opacity) => `rgba(${color},${opacity})`;

    // Two folded lobes: the paths deliberately avoid latitude/longitude grids.
    for (const side of [-1, 1]) {
      for (let fold = 0; fold < 36; fold++) {
        const phase = random() * TAU;
        const drift = random() * TAU;
        const frequency = 3.1 + random() * 2.8;
        const start = random() * TAU;
        const length = 3.7 + random() * 3.5;
        let previous = -1;
        const path = [];
        for (let j = 0; j < 82; j++) {
          const t = start + j / 81 * length;
          const latitude = .93 * Math.sin(t * .57 + drift) + .12 * Math.sin(t * frequency + phase);
          const longitude = t + .18 * Math.sin(t * 3 + phase);
          const ridge = 1 + .055 * Math.sin(t * 11 + phase);
          const x = side * .34 + .66 * Math.cos(latitude) * Math.cos(longitude) * ridge;
          const y = .77 * Math.sin(latitude) + .035 * Math.sin(t * 7 + phase);
          const z = .57 * Math.cos(latitude) * Math.sin(longitude) * ridge;
          const point = add(x, y, z);
          if (previous >= 0) segments.push(previous, point, fold % 4 === 0 ? 1 : 0);
          if (j % 4 === 0) particles.push(point, .48 + random() * .7);
          path.push(point);
          previous = point;
        }
        if (fold % 7 === 0) highways.push(path);
      }
    }

    const bezier = (a, b, c, d, t) => {
      const u = 1 - t;
      return a.map((value, axis) => u * u * u * value + 3 * u * u * t * b[axis] + 3 * u * t * t * c[axis] + t * t * t * d[axis]);
    };
    // Branching interior bundles provide a luminous structure beneath the folds.
    for (const side of [-1, 1]) {
      for (let branch = 0; branch < 20; branch++) {
        const angle = random() * TAU;
        const target = [side * (.30 + random() * .58), .12 + random() * .53, Math.sin(angle) * .45];
        const origin = [side * .10, -.57 + random() * .10, -.06 + random() * .12];
        const bendA = [side * (.15 + random() * .26), -.22, Math.cos(angle) * .40];
        const bendB = [target[0] * .88, .32 + random() * .17, target[2] * 1.2];
        const path = [];
        let previous = -1;
        for (let j = 0; j < 40; j++) {
          const point = add(...bezier(origin, bendA, bendB, target, j / 39));
          if (previous >= 0) segments.push(previous, point, branch % 3 === 0 ? 1 : 0);
          previous = point;
          path.push(point);
          if (j % 6 === 0) particles.push(point, .55 + random() * .55);
        }
        if (branch % 5 === 0) highways.push(path);
        for (let twig = 0; twig < 2; twig++) {
          const from = bezier(origin, bendA, bendB, target, .40 + twig * .20);
          const tip = [target[0] + (random() - .5) * .28, target[1] - random() * .5, target[2] + (random() - .5) * .38];
          const control = [(from[0] + tip[0]) / 2, from[1] + .24, from[2] - .14];
          let old = -1;
          for (let j = 0; j < 19; j++) {
            const t = j / 18, u = 1 - t;
            const point = add(...from.map((v, i) => u * u * v + 2 * u * t * control[i] + t * t * tip[i]));
            if (old >= 0) segments.push(old, point, 0);
            old = point;
          }
          particles.push(old, .7);
        }
      }
    }

    // Sparse volume nodes, with a denser centre and no frame-to-frame randomness.
    for (let j = 0; j < 600; j++) {
      const u = random() * 2 - 1;
      const angle = random() * TAU;
      const radius = Math.cbrt(random());
      const ring = Math.sqrt(1 - u * u);
      particles.push(add(radius * ring * Math.cos(angle) * .96, radius * u * .74, radius * ring * Math.sin(angle) * .58), .35 + random() * .55);
    }
    const geometry = new Float32Array(vertices);
    const screen = new Float32Array(vertices.length);
    const vertexCount = geometry.length / 3;
    const glints = Array.from({ length: 14 }, () => ({ x: random(), y: random(), phase: random() * TAU, size: .5 + random() * .7 }));

    function glow(x, y, radius, color, opacity) {
      if (radius <= 0) return;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, rgba(color, opacity));
      gradient.addColorStop(.22, rgba(color, opacity * .4));
      gradient.addColorStop(1, rgba(color, 0));
      ctx.fillStyle = gradient;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }

    function drawPulse(cx, cy, scale) {
      if (pulseAge < 0) return;
      const t = clamp(pulseAge / 1.8, 0, 1);
      const radius = scale * (.04 + .54 * (1 - Math.pow(1 - t, 2)));
      ctx.strokeStyle = rgba(palette.primary, (1 - t) * .36);
      ctx.lineWidth = .75;
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius, radius * .70, -.10, 0, TAU);
      ctx.stroke();
    }

    function drawTouch() {
      const cx = width * .50, cy = height * .50;
      const size = Math.min(width, height);
      glow(cx, cy, size * .040, palette.primary, .20);
      glow(cx, cy, size * .010, palette.light, .48);
      ctx.fillStyle = rgba(palette.light, .58);
      ctx.beginPath();
      ctx.arc(cx, cy, .85, 0, TAU);
      ctx.fill();
      glints.forEach((dot, i) => {
        const x = width * (.17 + dot.x * .66) + Math.sin(clock * .18 + dot.phase) * 2;
        const y = height * (.20 + dot.y * .59) + Math.cos(clock * .13 + dot.phase) * 2;
        const opacity = .10 + .14 * (.5 + .5 * Math.sin(clock * .35 + dot.phase));
        ctx.fillStyle = rgba(i % 3 ? palette.primary : palette.light, opacity);
        ctx.beginPath(); ctx.arc(x, y, dot.size, 0, TAU); ctx.fill();
      });
      drawPulse(cx, cy, size);
    }

    function drawCore() {
      const cx = width * .50, cy = height * .48;
      const scale = Math.min(width * .337, height * .424);
      const yaw = -.24 + clock * .045 + pointerX * .18;
      const pitch = -.12 + Math.sin(clock * .11) * .035 + pointerY * .10;
      const roll = -.075 + Math.sin(clock * .07) * .025;
      const sy = Math.sin(yaw), cyaw = Math.cos(yaw);
      const sx = Math.sin(pitch), cxang = Math.cos(pitch);
      const sz = Math.sin(roll), cz = Math.cos(roll);
      for (let j = 0; j < vertexCount; j++) {
        const i = j * 3;
        const x = geometry[i], y = geometry[i + 1], z = geometry[i + 2];
        const a = x * cyaw + z * sy;
        const b = z * cyaw - x * sy;
        const c = y * cxang - b * sx;
        const depth = y * sx + b * cxang;
        const perspective = 4.6 / (4.6 - depth);
        screen[i] = cx + (a * cz - c * sz) * scale * perspective;
        screen[i + 1] = cy - (a * sz + c * cz) * scale * perspective;
        screen[i + 2] = depth;
      }

      glow(cx, cy, scale * .95, palette.secondary, .10);
      glow(cx - scale * .24, cy + scale * .08, scale * .42, palette.primary, .14);
      glow(cx + scale * .27, cy - scale * .06, scale * .36, palette.primary, .11);

      // Fine interrupted projection ellipses remain secondary to the organic core.
      ctx.lineWidth = .65;
      ctx.strokeStyle = rgba(palette.secondary, .14);
      ctx.beginPath();
      ctx.ellipse(cx, cy + scale * .77, scale * 1.12, scale * .19, -.035, .08, Math.PI * .92);
      ctx.ellipse(cx, cy + scale * .77, scale * 1.12, scale * .19, -.035, Math.PI * 1.10, Math.PI * 1.94);
      ctx.stroke();
      ctx.strokeStyle = rgba(palette.primary, .10);
      ctx.beginPath();
      ctx.ellipse(cx, cy + scale * .82, scale * .81, scale * .12, -.035, 0, TAU);
      ctx.stroke();

      // Eight batched strokes keep the dense filaments inexpensive to paint.
      for (let layer = 0; layer < 4; layer++) {
        for (let accent = 0; accent < 2; accent++) {
          ctx.beginPath();
          for (let i = 0; i < segments.length; i += 3) {
            if (segments[i + 2] !== accent) continue;
            const a = segments[i] * 3, b = segments[i + 1] * 3;
            const depth = (screen[a + 2] + screen[b + 2]) * .5;
            if (clamp(Math.floor((depth + .9) / 1.8 * 4), 0, 3) !== layer) continue;
            ctx.moveTo(screen[a], screen[a + 1]);
            ctx.lineTo(screen[b], screen[b + 1]);
          }
          ctx.strokeStyle = rgba(accent ? palette.light : palette.primary, (accent ? .18 : .12) + layer * (accent ? .10 : .07));
          ctx.lineWidth = accent ? .78 : .55;
          ctx.stroke();
        }
      }
      for (let layer = 0; layer < 4; layer++) {
        ctx.beginPath();
        for (let i = 0; i < particles.length; i += 2) {
          const j = particles[i] * 3;
          if (clamp(Math.floor((screen[j + 2] + .9) / 1.8 * 4), 0, 3) !== layer) continue;
          const r = particles[i + 1] * (.62 + layer * .15);
          ctx.moveTo(screen[j] + r, screen[j + 1]);
          ctx.arc(screen[j], screen[j + 1], r, 0, TAU);
        }
        ctx.fillStyle = rgba(layer > 1 ? palette.light : palette.primary, .20 + layer * .15);
        ctx.fill();
      }

      // Slow impulses travel existing bundles, rather than flashing new particles.
      highways.forEach((path, i) => {
        const cursor = ((clock * .030 + i * .137) % 1) * (path.length - 1);
        const index = Math.floor(cursor), fraction = cursor - index;
        const a = path[index] * 3, b = path[Math.min(index + 1, path.length - 1)] * 3;
        const x = screen[a] + (screen[b] - screen[a]) * fraction;
        const y = screen[a + 1] + (screen[b + 1] - screen[a + 1]) * fraction;
        ctx.fillStyle = rgba(palette.light, .48);
        ctx.beginPath(); ctx.arc(x, y, 1.05, 0, TAU); ctx.fill();
      });
      drawPulse(cx, cy, scale * 1.6);
    }

    function draw() {
      if (destroyed || width < 2 || height < 2) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';
      if (mode === 'core') drawCore(); else drawTouch();
      ctx.globalCompositeOperation = 'source-over';
    }
    function tick(now) {
      frame = 0;
      if (destroyed || !active || paused) return;
      if (!lastFrame || now - lastFrame >= 1000 / 30 - .5) {
        const elapsed = lastFrame ? Math.min((now - lastFrame) / 1000, .10) : 0;
        lastFrame = now;
        clock += elapsed;
        const follow = 1 - Math.exp(-elapsed * 5);
        pointerX += (aimX - pointerX) * follow;
        pointerY += (aimY - pointerY) * follow;
        if (pulseAge >= 0) { pulseAge += elapsed; if (pulseAge > 1.8) pulseAge = -1; }
        draw();
      }
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      if (destroyed) return;
      if (!active || paused) {
        if (frame) cancelAnimationFrame(frame);
        frame = 0; lastFrame = 0;
        draw();
      } else if (!frame) {
        lastFrame = 0;
        draw();
        frame = requestAnimationFrame(tick);
      }
    }
    function resize() {
      if (destroyed) return;
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width || canvas.clientWidth || 1);
      height = Math.max(1, bounds.height || canvas.clientHeight || 1);
      dpr = Math.min(1.5, Math.max(1, window.devicePixelRatio || 1));
      const pixelWidth = Math.round(width * dpr), pixelHeight = Math.round(height * dpr);
      if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
      if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
      draw();
    }

    resize();
    return {
      setMode(value) { if (destroyed) return; mode = value === 'core' ? 'core' : 'touch'; draw(); },
      setPalette(value) { if (destroyed) return; palette = PALETTES[value] || PALETTES.blue; draw(); },
      setPointer(x, y) {
        if (destroyed) return;
        aimX = Number.isFinite(x) ? clamp(x, -1, 1) : 0;
        aimY = Number.isFinite(y) ? clamp(y, -1, 1) : 0;
        if (!active || paused) { pointerX = aimX; pointerY = aimY; draw(); }
      },
      setActive(value) { if (destroyed) return; active = Boolean(value); sync(); },
      setPaused(value) { if (destroyed) return; paused = Boolean(value); if (paused) pulseAge = -1; sync(); },
      pulse() { if (destroyed || paused || !active) return; pulseAge = 0; draw(); },
      resize,
      destroy() {
        if (destroyed) return;
        if (frame) cancelAnimationFrame(frame);
        frame = 0; destroyed = true;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }

  window.PFHologram = Object.assign(window.PFHologram || {}, { create });
})();
