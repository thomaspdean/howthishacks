import React, { useEffect, useRef } from 'react';

const LANES = 12;
const PER_LANE = 9;

export default function PacketFlow() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let raf;

    canvas.width  = canvas.offsetWidth  || window.innerWidth  / 2;
    canvas.height = canvas.offsetHeight || window.innerHeight / 2;
    const W = canvas.width, H = canvas.height;

    const particles = Array.from({ length: LANES * PER_LANE }, (_, i) => ({
      lane:  Math.floor(i / PER_LANE),
      x:     Math.random() * W,
      speed: 1.0 + Math.random() * 1.6,
      bad:   false,
      alpha: 1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      for (const p of particles) {
        const y = ((p.lane + 0.5) / LANES) * H;
        p.x += p.speed;

        if (p.x > W + 8) {
          p.x   = -8;
          p.bad = Math.random() < 0.05;
          p.alpha = 1;
        }

        if (p.bad) {
          p.alpha -= 0.018;
          if (p.alpha <= 0) { p.bad = false; p.alpha = 1; }
          ctx.beginPath();
          ctx.arc(p.x, y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(229,53,53,${p.alpha * 0.75})`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, y, 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(140,138,130,0.2)';
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} className="viz-bg-canvas" />;
}
