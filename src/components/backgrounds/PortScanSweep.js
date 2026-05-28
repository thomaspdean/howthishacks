import React, { useEffect, useRef } from 'react';

const CELL = 7; // cell size + gap

export default function PortScanSweep() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let raf;

    canvas.width  = canvas.offsetWidth  || window.innerWidth  / 2;
    canvas.height = canvas.offsetHeight || window.innerHeight / 2;
    const W = canvas.width, H = canvas.height;

    let scanX = 0;
    const portState = {}; // col -> { color, fade }

    const assignPort = (col) => {
      if (portState[col]) return;
      const r = Math.random();
      portState[col] = {
        color: r < 0.006 ? 'red' : r < 0.04 ? 'amber' : r < 0.2 ? 'dim' : 'dark',
        fade: 1,
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      const cols = Math.ceil(W / CELL);
      const rows = Math.ceil(H / CELL);

      for (let c = 0; c < cols; c++) {
        const px = c * CELL;
        for (let r = 0; r < rows; r++) {
          const py = r * CELL;
          const dist = px - scanX;

          if (dist >= -CELL && dist <= 0) {
            assignPort(c);
            const ps = portState[c];
            if (ps.color === 'red')        ctx.fillStyle = `rgba(229,53,53,${ps.fade * 0.65})`;
            else if (ps.color === 'amber') ctx.fillStyle = `rgba(217,119,6,${ps.fade * 0.5})`;
            else if (ps.color === 'dim')   ctx.fillStyle = `rgba(160,155,145,${ps.fade * 0.28})`;
            else                           ctx.fillStyle = 'rgba(150,148,140,0.06)';
          } else if (dist < -CELL && portState[c]) {
            const ps = portState[c];
            if (ps.color === 'red')        ctx.fillStyle = `rgba(229,53,53,${ps.fade * 0.45})`;
            else if (ps.color === 'amber') ctx.fillStyle = `rgba(217,119,6,${ps.fade * 0.3})`;
            else if (ps.color === 'dim')   ctx.fillStyle = `rgba(160,155,145,${ps.fade * 0.12})`;
            else { ctx.fillRect(px, py, CELL - 1, CELL - 1); continue; }
            ps.fade = Math.max(0, ps.fade - 0.004);
          } else {
            ctx.fillStyle = 'rgba(150,148,140,0.05)';
          }

          ctx.fillRect(px, py, CELL - 1, CELL - 1);
        }
      }

      // Scan line glow
      ctx.fillStyle = 'rgba(229,53,53,0.1)';
      ctx.fillRect(scanX - 2, 0, 3, H);

      scanX += 1.2;
      if (scanX > W + 20) {
        scanX = -20;
        Object.keys(portState).forEach(k => delete portState[k]);
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} className="viz-bg-canvas" />;
}
