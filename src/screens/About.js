import React from 'react';

export default function About() {
  return (
    <div className="content-page">
      <h1>About</h1>
      <p>
        howthishacks is an interactive cybersecurity education platform and sandbox.
        Visualize each technique in multiple fashions, and explore how attackers can
        use these exploits to manipulate vulnerable sites to their will.
      </p>

      <h2 className="content-section-heading">The Vision</h2>
      <p>
        After researching multiple sites which illustrate hacking techniques in practice,
        I realized majority of them either:<br />
        A. Feel cluttered with long readings instead of straight visualizations and sandboxes<br />
        B. Require an account to move through a learning based platform
      </p>
      <p style={{ marginTop: 16 }}>
        My goal with this site is to provide no clutter visualizations and sandboxes for 50+ techniques.
        Over summer 2026 my goal is to make daily updates to this website, published on the blog page (for those interested)
      </p>

      <h2 className="content-section-heading">About the Author</h2>
      <p>
        I'm Thomas Dean, a rising senior CS student at Georgia Tech.
        I'm a software developer interested in security engineering, computing systems &amp; networking,
        emerging technology, and cool challenges. Always looking to connect with people working on interesting security
        and computing problems, feel free to reach out to me on my{' '}
        <a href="https://linkedin.com/in/thomaspdean" target="_blank" rel="noreferrer">LinkedIn</a> :)
      </p>
    </div>
  );
}
