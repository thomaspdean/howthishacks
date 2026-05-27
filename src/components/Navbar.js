import React from 'react';
import { NavLink } from 'react-router-dom';

export function BrandMark() {
  return (
    <>
      <span className="brand-how">how</span>
      <span className="brand-this">this</span>
      <span className="brand-ha">ha</span>
      <span className="brand-cks">cks</span>
    </>
  );
}

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <BrandMark />
        </NavLink>
        <ul className="navbar-links">
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/visualizations">Hack Visualizations</NavLink></li>
          <li><NavLink to="/blog">Incident Breakdown Blog</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
        </ul>
      </div>
    </nav>
  );
}
