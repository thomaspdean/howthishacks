import React from 'react';
import { Link } from 'react-router-dom';
import { BrandMark } from '../components/Navbar';
import ScrollingBackground from '../components/ScrollingBackground';
import BruteForceAnim from '../components/BruteForceAnim';

export default function Home() {
  return (
    <div className="landing-wrapper">
      <ScrollingBackground />
      <div className="landing-overlay" />
      <div className="landing">
      <div className="landing-hero">
        <h1><BrandMark /></h1>
        <p>See how cyberattacks actually work.</p>
      </div>

      <div className="landing-split">
        <Link to="/visualizations" className="landing-col-link">
          <p className="landing-col-label">Visualizations</p>
          <h2 className="landing-col-title">Hack Visualizations</h2>
          <BruteForceAnim />
          <p className="landing-col-desc">
            Interactive sandboxes for real attack techniques — SQL injection, XSS,
            buffer overflows, and more. Type a payload, watch it execute step by step.
          </p>
          <span className="landing-col-cta">Explore techniques →</span>
        </Link>

        <Link to="/blog" className="landing-col-link">
          <p className="landing-col-label">Daily</p>
          <h2 className="landing-col-title">Incident Breakdown Blog</h2>
          <p className="landing-col-desc">
            One notable cybersecurity incident broken down every day — what happened,
            how the attack worked, and what could have stopped it.
          </p>
          <span className="landing-col-cta">Read breakdowns →</span>
        </Link>
      </div>
      </div>
    </div>
  );
}
