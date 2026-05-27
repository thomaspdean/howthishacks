import React from 'react';
import { Link } from 'react-router-dom';

const TECHNIQUES = [
  {
    id: 'sql-injection',
    category: 'Injection',
    title: 'SQL Injection',
    description:
      'Manipulate a database query by injecting malicious SQL into user input fields. Watch how unsanitized input escapes the query context.',
    route: '/sql-injection',
    live: true,
  },
  {
    id: 'xss',
    category: 'Client-Side',
    title: 'Cross-Site Scripting (XSS)',
    description:
      'Inject JavaScript into a web page viewed by other users. See how malicious scripts slip past naive output encoding.',
    route: null,
    live: false,
  },
  {
    id: 'buffer-overflow',
    category: 'Memory',
    title: 'Buffer Overflow',
    description:
      'Write past the end of a fixed-size buffer to overwrite adjacent memory. Visualize stack frames, return addresses, and shellcode placement.',
    route: null,
    live: false,
  },
  {
    id: 'length-extension',
    category: 'Cryptography',
    title: 'Length Extension Attack',
    description:
      'Forge a valid MAC for a message you have never seen, without knowing the secret key — exploiting the internals of Merkle–Damgård hash functions.',
    route: null,
    live: false,
  },
];

function TechniqueRow({ technique }) {
  const content = (
    <>
      <div className="technique-row-body">
        <span className="technique-row-title">{technique.title}</span>
        <span className="technique-row-desc">{technique.description}</span>
      </div>
      <div className="technique-row-meta">
        <span className="technique-row-category">{technique.category}</span>
        <span className={`technique-row-status ${technique.live ? 'live' : 'soon'}`}>
          {technique.live ? '▶ Interactive' : 'Coming soon'}
        </span>
      </div>
    </>
  );

  if (technique.live && technique.route) {
    return (
      <Link to={technique.route} className="technique-row live">
        {content}
      </Link>
    );
  }

  return (
    <div className="technique-row">
      {content}
    </div>
  );
}

export default function HackVisualizations() {
  return (
    <div className="viz-page">
      <h1>Hack Visualizations</h1>
      <p className="page-subtitle">
        Interactive, step-by-step visualizations of real attack techniques. Type real payloads and watch what happens.
      </p>
      <div className="technique-list">
        {TECHNIQUES.map((t) => (
          <TechniqueRow key={t.id} technique={t} />
        ))}
      </div>
    </div>
  );
}
