import React, { useEffect, useRef } from 'react';

// Cycle: clean(1.5s) → fork in(0.5s) → split(2.5s) → fork out(0.5s) → clean(1s) = 6s
const CYCLE      = 6000;
const FORK_IN    = 1500;
const FORK_FULL  = 2000;
const FORK_OUT   = 4500;
const FORK_GONE  = 5000;
const PACKET_DUR = 1600; // ms to cross full width

export default function MitmPacketSplit() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let raf, start = null;

    canvas.width  = canvas.offsetWidth  || window.innerWidth  / 2;
    canvas.height = canvas.offsetHeight || window.innerHeight / 2;
    const W = canvas.width, H = canvas.height;

    const SY   = H * 0.44;   // stream y
    const FX   = W * 0.50;   // fork x
    const AX   = W * 0.50;   // attacker x
    const AY   = H * 0.72;   // attacker y

    const draw = (ts) => {
      if (!start) start = ts;
      const t = (ts - start) % CYCLE;
      ctx.clearRect(0, 0, W, H);

      // Fork alpha: 0 = hidden, 1 = visible
      let forkA = 0;
      if      (t < FORK_IN)   forkA = 0;
      else if (t < FORK_FULL) forkA = (t - FORK_IN) / (FORK_FULL - FORK_IN);
      else if (t < FORK_OUT)  forkA = 1;
      else if (t < FORK_GONE) forkA = 1 - (t - FORK_OUT) / (FORK_GONE - FORK_OUT);
      else                    forkA = 0;

      const forking = forkA > 0;

      // Stream line
      ctx.strokeStyle = 'rgba(150,148,140,0.28)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(0, SY); ctx.lineTo(W, SY); ctx.stroke();

      // Fork branch to attacker
      if (forking) {
        ctx.strokeStyle = `rgba(229,53,53,${forkA * 0.4})`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(FX, SY); ctx.lineTo(AX, AY); ctx.stroke();
        ctx.setLineDash([]);

        // Attacker node
        ctx.beginPath();
        ctx.arc(AX, AY, 14, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(229,53,53,${forkA * 0.65})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = `rgba(229,53,53,${forkA * 0.08})`;
        ctx.fill();
        ctx.fillStyle = `rgba(229,53,53,${forkA * 0.75})`;
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('ATTACKER', AX, AY + 24);
      }

      // Client / Server labels
      ctx.fillStyle = 'rgba(140,138,130,0.48)';
      ctx.font = '8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('CLIENT', W * 0.07, SY + 18);
      ctx.fillText('SERVER', W * 0.93, SY + 18);

      // 4 evenly-spaced packets
      for (let i = 0; i < 4; i++) {
        const progress = (((ts - start) / PACKET_DUR) + i / 4) % 1;
        const px = progress * W;
        const pastFork = px > FX;
        const isRed = forking && pastFork;

        ctx.beginPath();
        ctx.arc(px, SY, 3, 0, Math.PI * 2);
        ctx.fillStyle = isRed ? 'rgba(229,53,53,0.55)' : 'rgba(185,183,175,0.7)';
        ctx.fill();

        // Copy traveling to attacker when crossing fork
        if (forking && Math.abs(progress - 0.5) < 0.06) {
          const copyP = Math.max(0, (progress - 0.44) / 0.06);
          if (copyP > 0 && copyP < 1) {
            const cpx = FX + (AX - FX) * copyP;
            const cpy = SY + (AY - SY) * copyP;
            ctx.beginPath();
            ctx.arc(cpx, cpy, 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(229,53,53,${(1 - copyP * 0.5) * forkA * 0.85})`;
            ctx.fill();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} className="viz-bg-canvas" />;
}
