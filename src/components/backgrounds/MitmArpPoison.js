import React, { useEffect, useRef } from 'react';

const ORIG = 'aa:bb:cc:dd:ee:ff';
const FAKE = 'de:ad:be:ef:ca:fe';
const N    = ORIG.length; // 17

// Cycle: normal(1.5s) → poison(1.5s) → intercepting(2s) → restore(1.5s) → normal(0.5s) = 7s
const CYCLE       = 7000;
const POISON_IN   = 1500;
const POISON_DONE = 3000;
const RESTORE_IN  = 5000;
const RESTORE_OUT = 6500;

export default function MitmArpPoison() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let raf, start = null;

    canvas.width  = canvas.offsetWidth  || window.innerWidth  / 2;
    canvas.height = canvas.offsetHeight || window.innerHeight / 2;
    const W = canvas.width, H = canvas.height;

    const TW   = W * 0.72;
    const TX   = (W - TW) / 2;
    const TY   = H * 0.22;
    const RH   = 26;
    const HEAD = 22;

    const col1 = TX + 10;
    const col2 = TX + TW * 0.42;
    const col3 = TX + TW * 0.78;

    const draw = (ts) => {
      if (!start) start = ts;
      const t = (ts - start) % CYCLE;
      ctx.clearRect(0, 0, W, H);

      // Compute displayed MAC and state
      let mac = ORIG, poisoned = false;
      if      (t < POISON_IN)   { mac = ORIG; }
      else if (t < POISON_DONE) {
        const p = (t - POISON_IN) / (POISON_DONE - POISON_IN);
        const k = Math.floor(p * N);
        mac = FAKE.slice(0, k) + ORIG.slice(k);
        poisoned = k > 0;
      }
      else if (t < RESTORE_IN)  { mac = FAKE; poisoned = true; }
      else if (t < RESTORE_OUT) {
        const p = (t - RESTORE_IN) / (RESTORE_OUT - RESTORE_IN);
        const k = Math.floor(p * N);
        mac = ORIG.slice(0, k) + FAKE.slice(k);
        poisoned = k < N;
      }
      else { mac = ORIG; }

      // Title
      ctx.fillStyle = 'rgba(140,138,130,0.45)';
      ctx.font = '8px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('ARP CACHE', TX, TY - 8);

      // Table outline
      ctx.strokeStyle = 'rgba(150,148,140,0.18)';
      ctx.lineWidth = 1;
      ctx.strokeRect(TX, TY, TW, HEAD + RH * 2);

      // Header fill
      ctx.fillStyle = 'rgba(120,118,110,0.1)';
      ctx.fillRect(TX, TY, TW, HEAD);

      // Column dividers
      ctx.strokeStyle = 'rgba(150,148,140,0.12)';
      [[col2, 'v'], [col3, 'v']].forEach(([x]) => {
        ctx.beginPath(); ctx.moveTo(x - 4, TY); ctx.lineTo(x - 4, TY + HEAD + RH * 2); ctx.stroke();
      });

      // Header text
      ctx.fillStyle = 'rgba(120,118,110,0.5)';
      ctx.font = '8px monospace';
      ctx.fillText('IP ADDRESS',  col1,  TY + 14);
      ctx.fillText('MAC ADDRESS', col2,  TY + 14);
      ctx.fillText('IFACE',       col3,  TY + 14);

      // Row separator
      ctx.strokeStyle = 'rgba(150,148,140,0.1)';
      ctx.beginPath();
      ctx.moveTo(TX, TY + HEAD + RH); ctx.lineTo(TX + TW, TY + HEAD + RH); ctx.stroke();

      // Row 1 – GATEWAY (gets poisoned)
      const r1y = TY + HEAD;
      if (poisoned) {
        ctx.fillStyle = 'rgba(229,53,53,0.07)';
        ctx.fillRect(TX + 1, r1y + 1, TW - 2, RH - 2);
      }
      ctx.font = '9px monospace';
      ctx.fillStyle = 'rgba(160,158,150,0.7)';
      ctx.fillText('192.168.1.1', col1, r1y + 16);
      ctx.fillStyle = poisoned ? 'rgba(229,53,53,0.82)' : 'rgba(160,158,150,0.7)';
      ctx.fillText(mac, col2, r1y + 16);
      ctx.fillStyle = 'rgba(120,118,110,0.5)';
      ctx.fillText('eth0', col3, r1y + 16);

      // Row 2 – VICTIM (stays clean)
      const r2y = TY + HEAD + RH;
      ctx.font = '9px monospace';
      ctx.fillStyle = 'rgba(160,158,150,0.7)';
      ctx.fillText('192.168.1.50', col1, r2y + 16);
      ctx.fillText('11:22:33:44:55:66', col2, r2y + 16);
      ctx.fillStyle = 'rgba(120,118,110,0.5)';
      ctx.fillText('eth0', col3, r2y + 16);

      // Packet being rerouted during poisoned phase
      if (t >= POISON_DONE && t < RESTORE_IN) {
        const atkY  = TY + HEAD * 2 + RH * 2 + 28;
        const gwY   = r1y + 13; // gateway row center
        const phaseDur = RESTORE_IN - POISON_DONE;
        const pt  = ((t - POISON_DONE) % 1200) / 1200;

        // Attacker node
        ctx.beginPath();
        ctx.arc(W / 2, atkY, 11, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(229,53,53,0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = 'rgba(229,53,53,0.08)';
        ctx.fill();
        ctx.fillStyle = 'rgba(229,53,53,0.72)';
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('ATTACKER', W / 2, atkY + 22);

        // Arrow line from gateway entry down to attacker
        ctx.strokeStyle = 'rgba(229,53,53,0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(col2 + 40, gwY);
        ctx.lineTo(W / 2, atkY - 11);
        ctx.stroke();
        ctx.setLineDash([]);

        // Travelling packet dot
        const dotX = col2 + 40 + (W / 2 - (col2 + 40)) * pt;
        const dotY = gwY + (atkY - 11 - gwY) * pt;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229,53,53,${(1 - pt * 0.6) * 0.85})`;
        ctx.fill();
      }

      // Status label
      const statusY = TY + HEAD + RH * 2 + 14;
      ctx.textAlign = 'left';
      ctx.font = '8px monospace';
      if (poisoned) {
        ctx.fillStyle = 'rgba(229,53,53,0.75)';
        ctx.fillText('● CACHE POISONED', TX, statusY);
      } else {
        ctx.fillStyle = 'rgba(120,118,110,0.38)';
        ctx.fillText('● STATUS: SECURE', TX, statusY);
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} className="viz-bg-canvas" />;
}
