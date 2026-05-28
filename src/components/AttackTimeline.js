import React from 'react';

const CATEGORY_LABELS = {
  'initial-access': 'Initial Access',
  'exfiltration':   'Exfiltration',
  'execution':      'Execution',
  'discovery':      'Discovery',
  'impact':         'Impact',
  'ransom':         'Ransom',
  'recovery':       'Recovery',
};

export default function AttackTimeline({ events }) {
  return (
    <div className="attack-timeline">
      {events.map((event, i) => (
        <div key={i} className="tl-event">
          <div className="tl-date">{event.date}</div>
          <div className="tl-spine">
            <div className={`tl-dot tl-dot--${event.category}`} />
            {i < events.length - 1 && <div className="tl-line" />}
          </div>
          <div className="tl-content">
            <div className="tl-header">
              <span className="tl-label">{event.label}</span>
              <span className={`tl-badge tl-badge--${event.category}`}>
                {CATEGORY_LABELS[event.category] ?? event.category}
              </span>
            </div>
            <p className="tl-desc">{event.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
