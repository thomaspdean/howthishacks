import React from 'react';
import { Link } from 'react-router-dom';
import CrashLineBackground from '../components/CrashLineBackground';

const TYPE_COLORS = {
  'ransomware':   { bg: 'rgba(220,38,38,0.07)',  border: 'rgba(220,38,38,0.2)',  text: '#dc2626',  accent: '#dc2626' },
  'supply-chain': { bg: 'rgba(124,58,237,0.07)', border: 'rgba(124,58,237,0.2)', text: '#7c3aed',  accent: '#7c3aed' },
  'vulnerability':{ bg: 'rgba(217,119,6,0.07)',  border: 'rgba(217,119,6,0.2)',  text: '#d97706',  accent: '#d97706' },
  'destructive':  { bg: 'rgba(194,65,12,0.07)',  border: 'rgba(194,65,12,0.2)',  text: '#c2410c',  accent: '#c2410c' },
  'nation-state': { bg: 'rgba(26,86,219,0.07)',  border: 'rgba(26,86,219,0.2)',  text: '#1a56db',  accent: '#1a56db' },
};

const TODAY = {
  slug: 'colonial-pipeline',
  title: 'Colonial Pipeline Ransomware Attack',
  attacker: 'DarkSide',
  type: 'Ransomware',
  typeSlug: 'ransomware',
  attackDates: 'Apr 29 – Jun 7, 2021',
  posted: 'May 28, 2026',
  excerpt: 'A single stolen VPN credential with no MFA gave attackers 21 days of undetected access — shutting down 45% of the East Coast\'s fuel supply and triggering a presidential emergency.',
  route: '/blog/colonial-pipeline',
};

const PREVIOUS = [
  {
    slug: 'solarwinds',
    title: 'SolarWinds Supply Chain Attack',
    attacker: 'APT29 / Cozy Bear',
    type: 'Supply Chain',
    typeSlug: 'supply-chain',
    attackDates: 'Mar – Dec 2020',
    excerpt: 'A poisoned software update gave Russian intelligence nine months of undetected access inside US federal agencies and Fortune 500 companies.',
  },
  {
    slug: 'wannacry',
    title: 'WannaCry Ransomware',
    attacker: 'Lazarus Group (DPRK)',
    type: 'Ransomware',
    typeSlug: 'ransomware',
    attackDates: 'May 12–15, 2017',
    excerpt: 'An NSA-developed exploit leaked by Shadow Brokers crashed 200,000 systems across 150 countries in under 72 hours.',
  },
  {
    slug: 'notpetya',
    title: 'NotPetya',
    attacker: 'Sandworm (GRU)',
    type: 'Destructive Malware',
    typeSlug: 'destructive',
    attackDates: 'Jun 27, 2017',
    excerpt: 'Designed to destroy — not extort — NotPetya erased global shipping giant Maersk and caused $10 billion in collateral damage.',
  },
  {
    slug: 'log4shell',
    title: 'Log4Shell (CVE-2021-44228)',
    attacker: 'Multiple threat actors',
    type: 'Vulnerability',
    typeSlug: 'vulnerability',
    attackDates: 'Dec 9–17, 2021',
    excerpt: 'A single malicious string sent to a ubiquitous Java logging library triggered remote code execution — exploited within hours of public disclosure.',
  },
  {
    slug: 'stuxnet',
    title: 'Stuxnet',
    attacker: 'NSA / Unit 8200',
    type: 'Nation-State / ICS',
    typeSlug: 'nation-state',
    attackDates: '2007 – 2010',
    excerpt: 'The first cyberweapon to cause physical destruction silently sabotaged Iranian nuclear centrifuges for three years undetected.',
  },
  {
    slug: 'target-breach',
    title: 'Target POS Breach',
    attacker: 'Ukrainian cybercriminals',
    type: 'Supply Chain',
    typeSlug: 'supply-chain',
    attackDates: 'Nov 27 – Dec 15, 2013',
    excerpt: 'Entry through an HVAC vendor, pivot to the payment network, 40 million cards stolen over the Black Friday window.',
  },
];

function TypeBadge({ type, typeSlug }) {
  const c = TYPE_COLORS[typeSlug] || TYPE_COLORS['ransomware'];
  return (
    <span className="blog-type-badge" style={{ background: c.bg, borderColor: c.border, color: c.text }}>
      {type}
    </span>
  );
}

function SectionLabel({ children, featured }) {
  return (
    <div className={`blog-section-label${featured ? ' blog-section-label--featured' : ''}`}>
      {children}
    </div>
  );
}

export default function Blog() {
  const today = TODAY;

  return (
    <>
      <CrashLineBackground />

      <div className="blog-page">

        <div className="blog-page-header">
          <h1>Incident Breakdowns</h1>
          <p className="blog-page-sub">
            Real cyberattacks mapped to MITRE ATT&CK — step through the techniques, decisions, and failures behind history's most significant incidents.
          </p>
        </div>

        {/* Today's read */}
        <SectionLabel featured>Today's Read</SectionLabel>

        <Link
          to={today.route}
          className="blog-today-card"
        >
          <div className="blog-today-top">
            <TypeBadge type={today.type} typeSlug={today.typeSlug} />
            <span className="blog-today-attacker">{today.attacker}</span>
          </div>
          <h2 className="blog-today-title">{today.title}</h2>
          <p className="blog-today-excerpt">{today.excerpt}</p>
          <div className="blog-today-footer">
            <div className="blog-today-meta">
              <span className="blog-meta-item">
                <span className="blog-meta-label">Attack</span>
                {today.attackDates}
              </span>
              <span className="blog-meta-sep">·</span>
              <span className="blog-meta-item">
                <span className="blog-meta-label">Posted</span>
                {today.posted}
              </span>
            </div>
            <span className="blog-today-cta">Read Analysis →</span>
          </div>
        </Link>

        {/* Archive */}
        <SectionLabel>Previous Analyses</SectionLabel>

        <div className="blog-grid">
          {PREVIOUS.map(post => {
            return (
              <div
                key={post.slug}
                className="blog-card"
              >
                <div className="blog-card-top">
                  <TypeBadge type={post.type} typeSlug={post.typeSlug} />
                </div>
                <h3 className="blog-card-title">{post.title}</h3>
                <p className="blog-card-attacker">{post.attacker}</p>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <div className="blog-card-footer">
                  <span className="blog-card-dates">{post.attackDates}</span>
                  <span className="blog-card-soon">Coming soon</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </>
  );
}
