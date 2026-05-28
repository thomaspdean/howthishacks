import React, { useEffect, useRef } from 'react';

// Cycle: encrypted(2s) → strip(0.8s) → plain(2.2s) → restore(0.8s) → encrypted(1.2s) = 7s
const CYCLE      = 7000;
const STRIP_IN   = 2000;
const STRIP_DONE = 2800;
const REST_IN    = 5000;
const REST_DONE  = 5800;

const lock = (ctx, cx, cy, openRatio, alpha) => {
  const col = openRatio > 0.5
    ? `rgba(229,53,53,${alpha * (0.4 + openRatio * 0.4)})`
    : `rgba(160,158,150,${alpha * 0.6})`;
  ctx.strokeStyle = col;
  ctx.fillStyle   = col;
  ctx.lineWidth   = 1.5;

  // Body
  const bw = 13, bh = 9;
  ctx.strokeRect(cx - bw / 2, cy + 1, bw, bh);

  // Shackle — lifts open as openRatio increases
  const lift = openRatio * 6;
  ctx.beginPath();
  ctx.arc(cx, cy + 1 - lift, 5, Math.PI, 0);
  ctx.stroke();

  // Keyhole dot
  ctx.beginPath();
  ctx.arc(cx, cy + 6, 1.5, 0, Math.PI * 2);
  ctx.fill();
};

export default function MitmTlsStrip() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let raf, start = null;

    canvas.width  = canvas.offsetWidth  || window.innerWidth  / 2;
    canvas.height = canvas.offsetHeight || window.innerHeight / 2;
    const W = canvas.width, H = canvas.height;

    const CY   = H * 0.50;   // center y of tunnel
    const GAP  = H * 0.10;   // half-gap between tunnel walls
    const LX1  = W * 0.10;   // left lock x
    const LX2  = W * 0.90;   // right lock x
    const T1   = LX1 + 22;   // tunnel start x
    const T2   = LX2 - 22;   // tunnel end x

    const draw = (ts) => {
      if (!start) start = ts;
      const t = (ts - start) % CYCLE;
      ctx.clearRect(0, 0, W, H);

      // tunnelA: 1 = solid walls, 0 = fully stripped
      let tunnelA = 1, openR = 0;
      if      (t < STRIP_IN)   { tunnelA = 1;                              openR = 0; }
      else if (t < STRIP_DONE) { const p = (t - STRIP_IN) / (STRIP_DONE - STRIP_IN);
                                  tunnelA = 1 - p; openR = p; }
      else if (t < REST_IN)    { tunnelA = 0;                              openR = 1; }
      else if (t < REST_DONE)  { const p = (t - REST_IN) / (REST_DONE - REST_IN);
                                  tunnelA = p;     openR = 1 - p; }
      else                     { tunnelA = 1;                              openR = 0; }

      const isStripped = tunnelA < 0.5;

      // Tunnel walls
      if (tunnelA > 0) {
        ctx.strokeStyle = `rgba(150,148,140,${tunnelA * 0.32})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(T1, CY - GAP); ctx.lineTo(T2, CY - GAP); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(T1, CY + GAP); ctx.lineTo(T2, CY + GAP); ctx.stroke();
        // Tunnel end caps
        ctx.beginPath(); ctx.moveTo(T1, CY - GAP); ctx.lineTo(T1, CY + GAP); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(T2, CY - GAP); ctx.lineTo(T2, CY + GAP); ctx.stroke();
        // TLS label inside tunnel
        ctx.fillStyle = `rgba(150,148,140,${tunnelA * 0.4})`;
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('TLS / HTTPS', W / 2, CY - GAP - 7);
      }

      // Locks
      lock(ctx, LX1, CY - 5, openR, 1);
      lock(ctx, LX2, CY - 5, openR, 1);

      // Attacker node appears when stripped
      if (isStripped) {
        const atkA = Math.min(1, (1 - tunnelA) * 2.5);
        ctx.beginPath();
        ctx.arc(W / 2, CY - GAP - 22, 12, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(229,53,53,${atkA * 0.6})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = `rgba(229,53,53,${atkA * 0.08})`;
        ctx.fill();
        // Tap lines from attacker down to stream
        ctx.strokeStyle = `rgba(229,53,53,${atkA * 0.22})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(W / 2, CY - GAP - 10);
        ctx.lineTo(W / 2, CY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = `rgba(229,53,53,${atkA * 0.75})`;
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('ATTACKER', W / 2, CY - GAP - 38);
      }

      // Client / Server labels
      ctx.fillStyle = 'rgba(140,138,130,0.48)';
      ctx.font = '8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('CLIENT', LX1, H * 0.82);
      ctx.fillText('SERVER', LX2, H * 0.82);

      // Travelling packet
      const packetHidden = (t >= STRIP_IN && t < STRIP_DONE) || (t >= REST_IN && t < REST_DONE);
      if (!packetHidden) {
        let pt;
        if      (t < STRIP_IN)  pt = t / STRIP_IN;
        else if (t < REST_IN)   pt = (t - STRIP_DONE) / (REST_IN - STRIP_DONE);
        else                    pt = (t - REST_DONE) / (CYCLE - REST_DONE);

        const px = T1 + (T2 - T1) * pt;

        if (isStripped) {
          // Plain packet — square, red, with label
          ctx.fillStyle = 'rgba(229,53,53,0.8)';
          ctx.fillRect(px - 4, CY - 4, 8, 8);
          ctx.fillStyle = 'rgba(229,53,53,0.55)';
          ctx.font = '7px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('PLAIN', px, CY + 17);
        } else {
          // Encrypted packet — circle, grey
          ctx.beginPath();
          ctx.arc(px, CY, 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(200,198,190,0.8)';
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} className="viz-bg-canvas" />;
}
