import React from 'react';

// Drop images into src/assets/outages/ — they appear automatically on next save/restart.
const imageContext = require.context('../assets/outages', false, /\.(jpg|jpeg|png|webp)$/i);
const IMAGES = imageContext.keys().map(key => imageContext(key));

// Alternating directions, slightly varied speeds, staggered start offsets
const COLUMNS = [
  { direction: 'up',   duration: 110, offsetPct: 0  },
  { direction: 'down', duration: 130, offsetPct: 35 },
  { direction: 'up',   duration: 122, offsetPct: 65 },
  { direction: 'down', duration: 108, offsetPct: 15 },
  { direction: 'up',   duration: 118, offsetPct: 50 },
];

const MIN_PER_HALF = 16;

function buildTrack(images) {
  if (images.length === 0) {
    const placeholders = Array(MIN_PER_HALF).fill(null);
    return [...placeholders, ...placeholders];
  }
  const times = Math.max(1, Math.ceil(MIN_PER_HALF / images.length));
  const tiled = Array(times).fill(images).flat();
  return [...tiled, ...tiled];
}

export default function ScrollingBackground() {
  const track = buildTrack(IMAGES);

  return (
    <div className="scroll-bg">
      {COLUMNS.map((col, colIdx) => {
        const delay = -((col.offsetPct / 100) * col.duration);
        const anim = `${col.direction === 'up' ? 'scroll-up' : 'scroll-down'} ${col.duration}s linear ${delay}s infinite`;
        return (
          <div key={colIdx} className="scroll-col">
            <div className="scroll-track" style={{ animation: anim }}>
              {track.map((src, i) =>
                src
                  ? <img key={i} src={src} alt="" className="scroll-headline-img" />
                  : <div key={i} className="scroll-placeholder-strip" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
