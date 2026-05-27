import React from 'react';

export default function About() {
  return (
    <div className="placeholder-page">
      <h1>About</h1>
      <p>
        howthishacks is an interactive cybersecurity education platform. Each
        technique gets its own playground: type a real payload, watch an
        animated step-by-step visualization of how the attack moves through a
        mock system, and read an explanation at each stage.
      </p>
      <p style={{ marginTop: 16 }}>
        Built for developers who want to understand attacks from the inside —
        not marketing decks, not vague diagrams. Real payloads, real query
        strings, real memory layouts.
      </p>
    </div>
  );
}
