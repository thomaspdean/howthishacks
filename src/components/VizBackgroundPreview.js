import React from 'react';
import MitmPathReroute  from './backgrounds/MitmPathReroute';
import MitmArpPoison    from './backgrounds/MitmArpPoison';
import MitmPacketSplit  from './backgrounds/MitmPacketSplit';
import MitmTlsStrip     from './backgrounds/MitmTlsStrip';

const QUADRANTS = [
  { label: '01 — Path Reroute',  Bg: MitmPathReroute  },
  { label: '02 — ARP Poison',    Bg: MitmArpPoison    },
  { label: '03 — Packet Split',  Bg: MitmPacketSplit  },
  { label: '04 — TLS Strip',     Bg: MitmTlsStrip     },
];

export default function VizBackgroundPreview() {
  return (
    <div className="viz-bg-preview">
      {QUADRANTS.map(({ label, Bg }, i) => (
        <div key={i} className="viz-bg-quadrant">
          <Bg />
          <span className="viz-bg-label">{label}</span>
        </div>
      ))}
    </div>
  );
}
