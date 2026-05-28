import React, { useEffect, useRef } from 'react';

const NODES = [
  { id: 'ENTRY',    nx: 0.04, ny: 0.50 },
  { id: 'FW-01',   nx: 0.18, ny: 0.50 },
  { id: 'DC-01',   nx: 0.35, ny: 0.28 },
  { id: 'WEB-01',  nx: 0.35, ny: 0.72 },
  { id: 'DB-01',   nx: 0.53, ny: 0.14 },
  { id: 'FS-01',   nx: 0.53, ny: 0.46 },
  { id: 'MAIL-01', nx: 0.53, ny: 0.82 },
  { id: 'WS-01',   nx: 0.70, ny: 0.09 },
  { id: 'WS-02',   nx: 0.70, ny: 0.34 },
  { id: 'WS-03',   nx: 0.70, ny: 0.63 },
  { id: 'WS-04',   nx: 0.70, ny: 0.88 },
  { id: 'BACKUP',  nx: 0.86, ny: 0.23 },
  { id: 'ADMIN',   nx: 0.86, ny: 0.55 },
];

// [ source, target, ms_when_target_is_reached ]
const SPREAD = [
  ['ENTRY',  'FW-01',    800],
  ['FW-01',  'DC-01',   1600],
  ['FW-01',  'WEB-01',  1750],
  ['DC-01',  'DB-01',   2500],
  ['DC-01',  'FS-01',   2650],
  ['DC-01',  'WS-01',   2750],
  ['DC-01',  'WS-02',   2900],
  ['WEB-01', 'MAIL-01', 2800],
  ['WEB-01', 'WS-03',   2950],
  ['WEB-01', 'WS-04',   3100],
  ['FS-01',  'BACKUP',  3600],
  ['FS-01',  'ADMIN',   3750],
];

// Build infection-time map
const INFECT_AT = { 'ENTRY': 400 }; // 400ms rest before attack starts
SPREAD.forEach(([, to, t]) => { INFECT_AT[to] = t + 400; });

const LAST = Math.max(...Object.values(INFECT_AT)); // ~4150ms

export default function NetworkInfection() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let raf, start = null;
    let W, H, placed, byId;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;
      placed = NODES.map(n => ({ ...n, x: n.nx * W, y: n.ny * H }));
      byId   = Object.fromEntries(placed.map(n => [n.id, n]));
    };

    resize();
    window.addEventListener('resize', resize);

    const infAlpha = (id, t) => {
      const at = INFECT_AT[id] ?? 9999;
      if (t < at) return 0;
      return Math.min(1, (t - at) / 350);
    };

    const draw = (ts) => {
      if (!start) start = ts;
      const t = ts - start;
      ctx.clearRect(0, 0, W, H);

      // ── Edges ──────────────────────────────────────────
      for (const [from, to, toTime] of SPREAD) {
        const a = byId[from], b = byId[to];
        const fromShifted = (INFECT_AT[from] ?? 0);
        const toShifted   = toTime + 400;
        const edgeA = infAlpha(to, t);

        // Base line
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = edgeA > 0
          ? `rgba(229,53,53,${edgeA * 0.3})`
          : 'rgba(150,148,140,0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Traveling infection pulse
        if (t >= fromShifted && t < toShifted) {
          const p  = (t - fromShifted) / (toShifted - fromShifted);
          const px = a.x + (b.x - a.x) * p;
          const py = a.y + (b.y - a.y) * p;

          // Glow halo
          ctx.beginPath();
          ctx.arc(px, py, 7, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(229,53,53,0.12)';
          ctx.fill();
          // Core dot
          ctx.beginPath();
          ctx.arc(px, py, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(229,53,53,0.88)';
          ctx.fill();
        }
      }

      // ── Nodes ──────────────────────────────────────────
      for (const n of placed) {
        const a = infAlpha(n.id, t);
        const isEntry = n.id === 'ENTRY';

        // Soft glow ring for infected nodes
        if (a > 0) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 14, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(229,53,53,${a * 0.07})`;
          ctx.fill();
        }

        // Node fill
        ctx.beginPath();
        ctx.arc(n.x, n.y, isEntry ? 8 : 7, 0, Math.PI * 2);
        ctx.fillStyle = a > 0
          ? `rgba(229,53,53,${a * 0.55})`
          : (isEntry ? 'rgba(229,53,53,0.15)' : 'rgba(150,148,140,0.16)');
        ctx.fill();

        // Node border
        ctx.strokeStyle = a > 0
          ? `rgba(229,53,53,${a * 0.7})`
          : (isEntry ? 'rgba(229,53,53,0.35)' : 'rgba(150,148,140,0.28)');
        ctx.lineWidth = isEntry ? 1.5 : 1;
        ctx.stroke();

        // Label
        ctx.fillStyle = a > 0
          ? `rgba(229,53,53,${a * 0.62})`
          : (isEntry ? 'rgba(229,53,53,0.4)' : 'rgba(140,138,130,0.36)');
        ctx.font = '7px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(n.id, n.x, n.y + 17);
      }

      // Stop once all nodes have fully transitioned to red
      if (t < LAST + 400) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={ref} className="viz-network-bg" />;
}
