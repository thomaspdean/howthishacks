import React from 'react';
import NetworkInfection from '../components/backgrounds/NetworkInfection';

const CATEGORIES = [
  {
    id: 'injection',
    label: 'Injection',
    color: { text: '#dc2626', bg: 'rgba(220,38,38,0.07)', border: 'rgba(220,38,38,0.2)' },
    items: [
      { id: 'sql-injection',      title: 'SQL Injection',            desc: 'Manipulate database queries by injecting malicious SQL through unsanitized user input.' },
      { id: 'xss',                title: 'Cross-Site Scripting',     desc: 'Inject JavaScript into pages viewed by other users, bypassing naive output encoding.' },
      { id: 'command-injection',  title: 'Command Injection',        desc: 'Execute arbitrary OS commands through inputs that are passed directly to a shell.' },
      { id: 'xxe',                title: 'XXE Injection',            desc: 'Exploit XML parsers to read local files or reach internal services via malicious entities.' },
    ],
  },
  {
    id: 'memory',
    label: 'Memory Corruption',
    color: { text: '#d97706', bg: 'rgba(217,119,6,0.07)', border: 'rgba(217,119,6,0.2)' },
    items: [
      { id: 'buffer-overflow',   title: 'Buffer Overflow',           desc: 'Write past a fixed-size buffer to overwrite adjacent memory and hijack control flow.' },
      { id: 'heap-spray',        title: 'Heap Spray',                desc: 'Flood heap memory with shellcode to improve the odds of landing a successful exploit.' },
      { id: 'use-after-free',    title: 'Use-After-Free',            desc: 'Access freed heap memory to corrupt program state and achieve code execution.' },
    ],
  },
  {
    id: 'cryptography',
    label: 'Cryptography',
    color: { text: '#7c3aed', bg: 'rgba(124,58,237,0.07)', border: 'rgba(124,58,237,0.2)' },
    items: [
      { id: 'hash-length-ext',   title: 'Hash Length Extension',     desc: 'Forge valid MACs without the secret key, exploiting Merkle–Damgård hash construction.' },
      { id: 'padding-oracle',    title: 'Padding Oracle',            desc: 'Decrypt ciphertext byte-by-byte through padding validation error responses.' },
      { id: 'timing-attack',     title: 'Timing Attack',             desc: 'Extract secret values by precisely measuring how long cryptographic operations take.' },
    ],
  },
  {
    id: 'network',
    label: 'Network',
    color: { text: '#1a56db', bg: 'rgba(26,86,219,0.07)', border: 'rgba(26,86,219,0.2)' },
    items: [
      { id: 'arp-spoofing',      title: 'ARP Spoofing',              desc: 'Poison ARP caches to silently intercept or modify traffic on a local network segment.' },
      { id: 'dns-poisoning',     title: 'DNS Cache Poisoning',       desc: 'Inject forged DNS responses to redirect victims to attacker-controlled servers.' },
      { id: 'tcp-hijack',        title: 'TCP Session Hijacking',     desc: 'Inject packets into an established TCP session via sequence number prediction.' },
    ],
  },
];

function CategoryChip({ label, color }) {
  return (
    <span
      className="viz-cat-chip"
      style={{ background: color.bg, borderColor: color.border, color: color.text }}
    >
      {label}
    </span>
  );
}

export default function HackVisualizations() {
  return (
    <>
      <NetworkInfection />
      <div className="viz-page">

      <div className="viz-page-header">
        <h1>Hack Visualizations</h1>
        <p className="viz-page-sub">
          Interactive, step-by-step visualizations of real attack techniques — type real payloads and watch what happens at the byte level.
        </p>
      </div>

      {CATEGORIES.map(cat => (
        <section key={cat.id} className="viz-category">

          <div className="blog-section-label">
            <span style={{ color: cat.color.text }}>{cat.label}</span>
          </div>

          <div className="blog-grid viz-grid">
            {cat.items.map(item => (
              <div key={item.id} className="blog-card">
                <div className="blog-card-top">
                  <CategoryChip label={cat.label} color={cat.color} />
                </div>
                <h3 className="blog-card-title">{item.title}</h3>
                <p className="blog-card-excerpt">{item.desc}</p>
                <div className="blog-card-footer">
                  <span className="blog-card-dates" />
                  <span className="blog-card-soon">Coming soon</span>
                </div>
              </div>
            ))}
          </div>

        </section>
      ))}

      </div>
    </>
  );
}
