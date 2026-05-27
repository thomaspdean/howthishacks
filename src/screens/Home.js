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

function TechniqueCard({ technique }) {
  const inner = (
    <>
      <span className="card-category">{technique.category}</span>
      <h2 className="card-title">{technique.title}</h2>
      <p className="card-description">{technique.description}</p>
      <span className={`card-badge ${technique.live ? 'live' : 'coming-soon'}`}>
        {technique.live ? '▶ Interactive' : 'Coming Soon'}
      </span>
    </>
  );

  if (technique.live && technique.route) {
    return (
      <Link to={technique.route} className="technique-card">
        {inner}
      </Link>
    );
  }

  return (
    <div className="technique-card disabled">
      {inner}
    </div>
  );
}

export default function Home() {
  return (
    <div className="home">
      <div className="home-hero">
        <h1>
          how<span>this</span>hacks
        </h1>
        <p>See how cyberattacks actually work — interactive, step-by-step visualizations of real techniques.</p>
      </div>

      <p className="section-heading">{'// techniques'}</p>
      <div className="technique-grid">
        {TECHNIQUES.map((t) => (
          <TechniqueCard key={t.id} technique={t} />
        ))}
      </div>
    </div>
  );
}
