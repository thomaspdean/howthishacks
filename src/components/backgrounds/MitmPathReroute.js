import React, { useEffect, useRef } from 'react';

// Cycle: clean(2s) → morph(0.8s) → intercept(2.4s) → morph(0.8s) → clean(1s) = 7s
const CYCLE     = 7000;
const MORPH1_IN  = 2000;
const INTCPT_IN  = 2800;
const MORPH2_IN  = 5200;
const MORPH2_OUT = 6000;

export default function MitmPathReroute() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let raf, start = null;

    canvas.width  = canvas.offsetWidth  || window.innerWidth  / 2;
    canvas.height = canvas.offsetHeight || window.innerHeight / 2;
    const W = canvas.width, H = canvas.height;

    const C = { x: W * 0.14, y: H * 0.58 };  // Client
    const S = { x: W * 0.86, y: H * 0.58 };  // Server
    const A = { x: W * 0.50, y: H * 0.20 };  // Attacker

    const node = (x, y, label, active) => {
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      if (active) { ctx.fillStyle = 'rgba(229,53,53,0.09)'; ctx.fill(); }
      ctx.strokeStyle = active ? 'rgba(229,53,53,0.7)' : 'rgba(150,148,140,0.45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle  = active ? 'rgba(229,53,53,0.8)' : 'rgba(150,148,140,0.6)';
      ctx.font = '8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, y + 24);
    };

    const bezPt = (t, x0, y0, cpx, cpy, x1, y1) => {
      const u = 1 - t;
      return {
        x: u*u*x0 + 2*u*t*cpx + t*t*x1,
        y: u*u*y0 + 2*u*t*cpy + t*t*y1,
      };
    };

    const draw = (ts) => {
      if (!start) start = ts;
      const t = (ts - start) % CYCLE;
      ctx.clearRect(0, 0, W, H);

      // bend: 0 = straight, 1 = through attacker
      let bend = 0;
      if      (t < MORPH1_IN)  bend = 0;
      else if (t < INTCPT_IN)  bend = (t - MORPH1_IN) / (INTCPT_IN - MORPH1_IN);
      else if (t < MORPH2_IN)  bend = 1;
      else if (t < MORPH2_OUT) bend = 1 - (t - MORPH2_IN) / (MORPH2_OUT - MORPH2_IN);
      else                     bend = 0;

      const intercepting = t >= INTCPT_IN && t < MORPH2_IN;
      const midX = (C.x + S.x) / 2;
      const cpY  = C.y + (A.y - C.y) * bend;

      // Path
      ctx.beginPath();
      ctx.moveTo(C.x, C.y);
      ctx.quadraticCurveTo(midX, cpY, S.x, S.y);
      ctx.strokeStyle = intercepting ? 'rgba(229,53,53,0.4)' : 'rgba(150,148,140,0.3)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      node(C.x, C.y, 'CLIENT',   false);
      node(S.x, S.y, 'SERVER',   false);
      node(A.x, A.y, 'ATTACKER', bend > 0.4);

      // Packet
      const morphing = (t >= MORPH1_IN && t < INTCPT_IN) || (t >= MORPH2_IN && t < MORPH2_OUT);
      if (!morphing) {
        let pt;
        if      (t < MORPH1_IN)  pt = t / MORPH1_IN;
        else if (t < MORPH2_IN)  pt = (t - INTCPT_IN) / (MORPH2_IN - INTCPT_IN);
        else                     pt = (t - MORPH2_OUT) / (CYCLE - MORPH2_OUT);

        const pos = bezPt(pt, C.x, C.y, midX, cpY, S.x, S.y);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = intercepting ? 'rgba(229,53,53,0.9)' : 'rgba(200,198,190,0.85)';
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} className="viz-bg-canvas" />;
}
