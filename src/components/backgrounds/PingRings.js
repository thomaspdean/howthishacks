import React, { useEffect, useRef } from 'react';

// Normalized (0–1) positions of the 5 source nodes
const SOURCES = [
  { nx: 0.18, ny: 0.22 },
  { nx: 0.72, ny: 0.15 },
  { nx: 0.44, ny: 0.52 },
  { nx: 0.12, ny: 0.78 },
  { nx: 0.82, ny: 0.72 },
];

export default function PingRings() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let raf;

    canvas.width  = canvas.offsetWidth  || window.innerWidth  / 2;
    canvas.height = canvas.offsetHeight || window.innerHeight / 2;
    const W = canvas.width, H = canvas.height;

    const rings = []; // { x, y, r, maxR }
    let lastPing = 0;

    const draw = (t) => {
      ctx.clearRect(0, 0, W, H);

      // Emit a new ring from a random source every ~900ms
      if (t - lastPing > 900) {
        const src = SOURCES[Math.floor(Math.random() * SOURCES.length)];
        rings.push({ x: src.nx * W, y: src.ny * H, r: 0, maxR: 55 + Math.random() * 45 });
        lastPing = t;
      }

      // Draw source dots
      for (const s of SOURCES) {
        ctx.beginPath();
        ctx.arc(s.nx * W, s.ny * H, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(229,53,53,0.4)';
        ctx.fill();
      }

      // Update + draw rings
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        ring.r += 0.65;
        const alpha = (1 - ring.r / ring.maxR) * 0.28;
        if (alpha <= 0) { rings.splice(i, 1); continue; }

        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(229,53,53,${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} className="viz-bg-canvas" />;
}
