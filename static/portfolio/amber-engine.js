/* An original amber mechanical constellation, drawn from perspective 3D geometry. */
(() => {
  'use strict';
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const unit = v => { const n = Math.hypot(...v) || 1; return v.map(x => x / n); };
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

  function create(canvas) {
    const noop = () => {};
    const empty = { resize: noop, setActive: noop, setPaused: noop, rotate: noop, zoom: noop, reset: noop, destroy: noop };
    let ctx;
    try { ctx = canvas && canvas.getContext('2d', { alpha: true }); } catch (_) {}
    if (!ctx) return empty;

    let active = false, paused = false, destroyed = false, raf = 0, last = 0;
    let width = 1, height = 1, dpr = 1;
    let yaw = -.24, pitch = .16, aimYaw = yaw, aimPitch = pitch;
    let magnification = 1, aimMagnification = 1, idle = 0;
    let seed = 981731;
    const rand = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
    const points = [], lines = [], particles = [], tiles = [];
    const add = v => { points.push(...v); return points.length / 3 - 1; };
    const connect = (a, b, style = 0) => { lines.push(a, b, style); };
    const basis = normal => {
      const n = unit(normal);
      const u = unit(cross(n, Math.abs(n[1]) < .85 ? [0, 1, 0] : [1, 0, 0]));
      return [u, cross(n, u), n];
    };
    const onRing = (axes, radius, angle, offset = 0) => axes[0].map((_, i) => radius * (axes[0][i] * Math.cos(angle) + axes[1][i] * Math.sin(angle)) + axes[2][i] * offset);

    function arc(axes, radius, start, end, offset, style, rail = false) {
      const count = Math.max(4, Math.ceil((end - start) * radius * 48));
      let previous = -1, previousOuter = -1;
      for (let j = 0; j <= count; j++) {
        const t = start + (end - start) * j / count;
        const p = add(onRing(axes, radius, t, offset));
        if (previous >= 0) connect(previous, p, style);
        previous = p;
        if (j % 5 === 0 && rand() > .3) particles.push(p, .48 + rand() * .55, style);
        if (rail) {
          const outer = add(onRing(axes, radius + .012, t, offset));
          if (previousOuter >= 0) connect(previousOuter, outer, Math.max(0, style - 1));
          if (j % 7 === 0) connect(p, outer, 1);
          previousOuter = outer;
        }
      }
    }

    // Independent tilted engineering planes, each containing discontinuous annuli.
    // Shared axes within small families make the object constructed, not a globe grid.
    const planes = [
      [0.12, .18, 1], [1, .10, .24], [.23, 1, .16], [.66, -.40, .72],
      [-.52, .61, .55], [.20, .74, -.64], [.84, .44, -.24], [-.42, .12, .91]
    ];
    planes.forEach((normal, family) => {
      const axes = basis(normal);
      const radii = family < 3 ? [.40, .59, .79, .98] : [.57, .84, 1.015];
      radii.forEach((radius, band) => {
        const offset = family < 3 ? 0 : (rand() - .5) * .16;
        const ringStyle = family === 3 && band === 2 ? 2 : family < 3 ? 1 : 0;
        const start = rand() * TAU;
        let cursor = start;
        while (cursor < start + TAU - .15) {
          const length = .20 + rand() * .78;
          const end = Math.min(cursor + length, start + TAU - .13);
          arc(axes, radius, cursor, end, offset, ringStyle, band % 2 === 0);
          cursor = end + .06 + rand() * .23;
        }
        // Instrument ticks lie in the same 3D planes as their ring segments.
        for (let j = 0; j < 54; j++) {
          if (rand() < .25) continue;
          const t = start + j / 54 * TAU;
          const a = add(onRing(axes, radius - .006, t, offset));
          const b = add(onRing(axes, radius + .012 + rand() * .024, t, offset));
          connect(a, b, j % 7 === 0 ? 2 : 0);
        }
      });
    });

    // Offset circular sections suggest several nested spherical shells.
    for (let j = 0; j < 20; j++) {
      const axes = basis([rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1]);
      const shell = .68 + rand() * .34;
      const offset = (rand() - .5) * shell * 1.2;
      const radius = Math.sqrt(shell * shell - offset * offset);
      const start = rand() * TAU;
      arc(axes, radius, start, start + .8 + rand() * 2.5, offset, j % 4 === 0 ? 1 : 0, false);
    }

    // Short rectilinear circuit traces are embedded on the shells, not screen space.
    for (let j = 0; j < 430; j++) {
      const theta = rand() * TAU;
      const y = rand() * 2 - 1;
      const ring = Math.sqrt(1 - y * y);
      const normal = [Math.cos(theta) * ring, y, Math.sin(theta) * ring];
      const axes = basis(normal);
      const shell = [.56, .75, .93, 1.025][j % 4];
      let point = normal.map(v => v * shell);
      let previous = add(point);
      const length = 2 + Math.floor(rand() * 4);
      for (let step = 0; step < length; step++) {
        const tangent = axes[step % 2];
        const sign = rand() > .30 ? 1 : -1;
        const size = .015 + rand() * .070;
        point = unit(point.map((v, i) => v + tangent[i] * size * sign)).map(v => v * shell);
        const next = add(point);
        connect(previous, next, j % 8 === 0 ? 2 : j % 3 === 0 ? 1 : 0);
        previous = next;
      }
      particles.push(previous, .55 + rand() * .55, j % 3);
    }

    // Radial stems finish in small rectangular terminals tangent to the outer shell.
    for (let j = 0; j < 165; j++) {
      const theta = rand() * TAU, y = rand() * 2 - 1;
      const ring = Math.sqrt(1 - y * y);
      const normal = [Math.cos(theta) * ring, y, Math.sin(theta) * ring];
      const axes = basis(normal);
      const end = .96 + rand() * .14;
      const start = .62 + rand() * .27;
      const a = add(normal.map(v => v * start)), b = add(normal.map(v => v * end));
      connect(a, b, j % 5 === 0 ? 2 : 0);
      const w = .010 + rand() * .030, h = .005 + rand() * .016;
      const ids = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(sign => add(normal.map((v, i) => v * end + axes[0][i] * w * sign[0] + axes[1][i] * h * sign[1])));
      for (let k = 0; k < 4; k++) connect(ids[k], ids[(k + 1) % 4], j % 4 === 0 ? 2 : 1);
      if (j % 5 === 0) tiles.push(...ids);
      particles.push(b, .75 + rand() * .75, 2);
    }

    // A compact nested reactor assembly, offset from perfect symmetry.
    for (let j = 0; j < 12; j++) {
      const axes = basis(j < 7 ? [.13, .10, 1] : [rand() - .5, rand() - .5, rand()]);
      const radius = .058 + j * .014;
      const start = rand() * TAU;
      arc(axes, radius, start, start + 4.0 + rand() * 1.8, (j - 6) * .004, 2, j % 2 === 0);
    }
    for (let j = 0; j < 1400; j++) {
      const theta = rand() * TAU, y = rand() * 2 - 1;
      const ring = Math.sqrt(1 - y * y);
      const radius = .28 + Math.pow(rand(), .32) * .75;
      particles.push(add([radius * ring * Math.cos(theta), radius * y, radius * ring * Math.sin(theta)]), .35 + rand() * .7, j % 8 === 0 ? 2 : 0);
    }

    const geometry = new Float32Array(points);
    const projected = new Float32Array(points.length);
    const glowCanvas = document.createElement('canvas');
    const glowContext = glowCanvas.getContext('2d', { alpha: true });
    const color = (r, g, b, a) => `rgba(${r},${g},${b},${a})`;
    const strokes = [];
    for (let depth = 0; depth < 5; depth++) {
      strokes[depth] = [
        color(225, 121 + depth * 9, 22, .09 + depth * .061),
        color(255, 160 + depth * 10, 39 + depth * 9, .15 + depth * .085),
        color(255, 205 + depth * 8, 108 + depth * 17, .24 + depth * .11)
      ];
    }

    function radial(x, y, radius, stops) {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      stops.forEach(stop => gradient.addColorStop(...stop));
      ctx.fillStyle = gradient;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }
    function draw() {
      if (destroyed || width < 2 || height < 2) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const mobile = width <= 900;
      const cx = width * (mobile ? .50 : .72), cy = height * (mobile ? .50 : .48);
      const radius = Math.min(width * (mobile ? .46 : .25), height * (mobile ? .42 : .43)) * magnification;
      const actualYaw = yaw + idle;
      const sy = Math.sin(actualYaw), cosy = Math.cos(actualYaw);
      const sx = Math.sin(pitch), cosx = Math.cos(pitch);
      const roll = -.08, sz = Math.sin(roll), cosz = Math.cos(roll);
      for (let i = 0; i < geometry.length; i += 3) {
        const x = geometry[i], y = geometry[i + 1], z = geometry[i + 2];
        const horizontal = x * cosy + z * sy;
        const backward = z * cosy - x * sy;
        const vertical = y * cosx - backward * sx;
        const depth = y * sx + backward * cosx;
        const perspective = 4.7 / (4.7 - depth);
        projected[i] = cx + (horizontal * cosz - vertical * sz) * radius * perspective;
        projected[i + 1] = cy - (horizontal * sz + vertical * cosz) * radius * perspective;
        projected[i + 2] = depth;
      }

      ctx.globalCompositeOperation = 'lighter';
      radial(cx, cy, radius * .87, [[0, 'rgba(255,136,16,.14)'], [.25, 'rgba(205,90,6,.055)'], [1, 'rgba(130,49,0,0)']]);
      radial(cx, cy, radius * .25, [[0, 'rgba(255,224,137,.48)'], [.15, 'rgba(255,173,46,.25)'], [.55, 'rgba(245,125,16,.075)'], [1, 'rgba(236,97,0,0)']]);

      for (let depth = 0; depth < 5; depth++) {
        for (let style = 0; style < 3; style++) {
          ctx.beginPath();
          for (let i = 0; i < lines.length; i += 3) {
            if (lines[i + 2] !== style) continue;
            const a = lines[i] * 3, b = lines[i + 1] * 3;
            const z = (projected[a + 2] + projected[b + 2]) * .5;
            if (clamp(Math.floor((z + 1.15) / 2.3 * 5), 0, 4) !== depth) continue;
            ctx.moveTo(projected[a], projected[a + 1]);
            ctx.lineTo(projected[b], projected[b + 1]);
          }
          ctx.strokeStyle = strokes[depth][style];
          ctx.lineWidth = style === 2 ? .92 : style === 1 ? .70 : .48;
          ctx.stroke();
        }
      }
      for (let depth = 0; depth < 5; depth++) {
        ctx.beginPath();
        for (let i = 0; i < particles.length; i += 3) {
          const index = particles[i] * 3;
          if (clamp(Math.floor((projected[index + 2] + 1.15) / 2.3 * 5), 0, 4) !== depth) continue;
          const r = particles[i + 1] * (.58 + depth * .10);
          ctx.moveTo(projected[index] + r, projected[index + 1]);
          ctx.arc(projected[index], projected[index + 1], r, 0, TAU);
        }
        ctx.fillStyle = color(255, 169 + depth * 18, 41 + depth * 33, .15 + depth * .13);
        ctx.fill();
      }
      ctx.beginPath();
      for (let i = 0; i < tiles.length; i += 4) {
        if (projected[tiles[i] * 3 + 2] < -.35) continue;
        const a = tiles[i] * 3;
        ctx.moveTo(projected[a], projected[a + 1]);
        for (let k = 1; k < 4; k++) { const p = tiles[i + k] * 3; ctx.lineTo(projected[p], projected[p + 1]); }
        ctx.closePath();
      }
      ctx.fillStyle = 'rgba(255,189,65,.24)';
      ctx.fill();

      radial(cx, cy, radius * .078, [[0, 'rgba(255,252,226,.94)'], [.12, 'rgba(255,233,168,.65)'], [.38, 'rgba(255,177,50,.20)'], [1, 'rgba(255,135,12,0)']]);
      // The bloom is a small, cropped buffer. Fine lines remain sharp underneath.
      if (glowContext) {
        const box = radius * 2.48;
        const left = cx - box / 2, top = cy - box / 2;
        const bufferSize = clamp(Math.ceil(box * .40), 96, 384);
        if (glowCanvas.width !== bufferSize) glowCanvas.width = glowCanvas.height = bufferSize;
        glowContext.clearRect(0, 0, bufferSize, bufferSize);
        glowContext.filter = 'blur(1.3px)';
        glowContext.drawImage(canvas, left * dpr, top * dpr, box * dpr, box * dpr, 0, 0, bufferSize, bufferSize);
        glowContext.filter = 'none';
        ctx.globalAlpha = .72;
        ctx.drawImage(glowCanvas, left, top, box, box);
        ctx.globalAlpha = 1;
      }
      ctx.globalCompositeOperation = 'source-over';
    }

    function tick(now) {
      raf = 0;
      if (destroyed || !active || paused) return;
      if (!last || now - last >= 1000 / 30 - .5) {
        const dt = last ? Math.min((now - last) / 1000, .10) : 0;
        last = now;
        idle += dt * .030;
        const ease = 1 - Math.exp(-dt * 13);
        yaw += (aimYaw - yaw) * ease;
        pitch += (aimPitch - pitch) * ease;
        magnification += (aimMagnification - magnification) * ease;
        draw();
      }
      raf = requestAnimationFrame(tick);
    }
    function sync() {
      if (destroyed) return;
      if (!active || paused) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0; last = 0;
        yaw = aimYaw; pitch = aimPitch; magnification = aimMagnification;
        draw();
      } else if (!raf) {
        last = 0;
        draw();
        raf = requestAnimationFrame(tick);
      }
    }
    function manual() {
      if (!active || paused) {
        yaw = aimYaw; pitch = aimPitch; magnification = aimMagnification;
        draw();
      }
    }
    function resize() {
      if (destroyed) return;
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width || canvas.clientWidth || 1);
      height = Math.max(1, bounds.height || canvas.clientHeight || 1);
      dpr = Math.min(1.5, Math.max(1, window.devicePixelRatio || 1));
      const w = Math.round(width * dpr), h = Math.round(height * dpr);
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
      draw();
    }
    resize();
    return {
      resize,
      setActive(value) { if (destroyed) return; active = Boolean(value); sync(); },
      setPaused(value) { if (destroyed) return; paused = Boolean(value); sync(); },
      rotate(dx, dy) {
        if (destroyed) return;
        if (Number.isFinite(dx)) aimYaw += clamp(dx, -Math.PI, Math.PI);
        if (Number.isFinite(dy)) aimPitch += clamp(dy, -Math.PI, Math.PI);
        manual();
      },
      zoom(delta) {
        if (destroyed || !Number.isFinite(delta)) return;
        aimMagnification = clamp(aimMagnification + delta, .8, 1.25);
        manual();
      },
      reset() {
        if (destroyed) return;
        aimYaw = -.24; aimPitch = .16; aimMagnification = 1; idle = 0;
        manual();
      },
      destroy() {
        if (destroyed) return;
        if (raf) cancelAnimationFrame(raf);
        destroyed = true; raf = 0;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        glowCanvas.width = glowCanvas.height = 1;
      }
    };
  }
  window.PFAmber = Object.assign(window.PFAmber || {}, { create });
})();
