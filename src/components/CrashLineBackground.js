import React, { useState, useEffect, useMemo } from 'react';

function buildPathD(w, h) {
  const steps = 80;
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const env = t * (1 - t) * 4;
    const noise = env * (
      Math.sin(t * 8.4  + 0.5) * h * 0.07  +
      Math.sin(t * 25.1 + 0.3) * h * 0.045 +
      Math.sin(t * 54.7 + 1.2) * h * 0.025 +
      Math.sin(t * 113.3 + 0.7) * h * 0.013 +
      Math.sin(t * 237.9 + 2.1) * h * 0.006
    );
    const x = t * w;
    const y = t * h + noise;
    pts.push(i === 0 ? `M${x.toFixed(1)},${y.toFixed(1)}` : `L${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(' ');
}

export default function CrashLineBackground() {
  const [dims, setDims] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  });

  useEffect(() => {
    const onResize = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { w, h } = dims;
  const pathD = useMemo(() => buildPathD(w, h), [w, h]);

  return (
    <svg
      className="blog-crash-svg"
      viewBox={`0 0 ${w} ${h}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="dotGlow" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Area fill below the crash line */}
      <path
        d={`${pathD} L${w},${h + 50} L0,${h + 50} Z`}
        fill="rgba(229,53,53,0.04)"
      />

      {/* The crash line */}
      <path
        id="crashLine"
        d={pathD}
        fill="none"
        stroke="rgba(229,53,53,0.2)"
        strokeWidth="1.5"
      />

      {/* Traveling dot */}
      <circle r="4" fill="#e53535" filter="url(#dotGlow)">
        <animateMotion dur="12s" repeatCount="indefinite" calcMode="paced">
          <mpath href="#crashLine" />
        </animateMotion>
      </circle>
    </svg>
  );
}
