import React, { useEffect, useRef } from 'react';

const LINE_H  = 15;
const CHAR_W  = 22; // width of "ff " in monospace

function randHex() {
  return Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
}

export default function HexStream() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let raf;

    canvas.width  = canvas.offsetWidth  || window.innerWidth  / 2;
    canvas.height = canvas.offsetHeight || window.innerHeight / 2;
    const W = canvas.width, H = canvas.height;

    ctx.font = `${LINE_H - 4}px monospace`;

    const numCols = Math.ceil(W / CHAR_W);
    const numRows = Math.ceil(H / LINE_H) + 4;

    const cols = Array.from({ length: numCols }, (_, i) => ({
      x:     i * CHAR_W,
      chars: Array.from({ length: numRows }, randHex),
      yOff:  Math.random() * numRows * LINE_H,
      speed: 0.28 + Math.random() * 0.32,
      hl:    null,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.font = `${LINE_H - 4}px monospace`;

      // Occasionally trigger a highlight on a random column
      if (Math.random() < 0.004) {
        const col = cols[Math.floor(Math.random() * cols.length)];
        if (!col.hl) {
          col.hl = {
            start: Math.floor(Math.random() * (numRows - 10)),
            len:   4 + Math.floor(Math.random() * 8),
            alpha: 1,
          };
        }
      }

      for (const col of cols) {
        col.yOff = (col.yOff + col.speed) % (numRows * LINE_H);
        if (col.hl) {
          col.hl.alpha -= 0.01;
          if (col.hl.alpha <= 0) col.hl = null;
        }

        for (let r = 0; r < numRows; r++) {
          let y = r * LINE_H - col.yOff;
          if (y < -LINE_H) y += numRows * LINE_H;
          if (y > H + LINE_H) continue;

          const isHl = col.hl && r >= col.hl.start && r < col.hl.start + col.hl.len;
          ctx.fillStyle = isHl
            ? `rgba(229,53,53,${col.hl.alpha * 0.7})`
            : 'rgba(120,118,110,0.16)';
          ctx.fillText(col.chars[r], col.x, y);
        }
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} className="viz-bg-canvas" />;
}
