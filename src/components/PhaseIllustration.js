import React from 'react';

function WindowBar({ title }) {
  return (
    <div className="illus-bar">
      <div className="illus-dots">
        <span className="illus-dot" />
        <span className="illus-dot" />
        <span className="illus-dot" />
      </div>
      <span className="illus-bar-title">{title}</span>
    </div>
  );
}

function Row({ label, value, valueClass }) {
  return (
    <div className="illus-row">
      <span className="illus-key">{label}</span>
      <span className={`illus-val ${valueClass || ''}`}>{value}</span>
    </div>
  );
}

function Divider() {
  return <div className="illus-divider" />;
}

function SectionLabel({ children }) {
  return <div className="illus-label">{children}</div>;
}

/* ── 1. Credential Access ── */
function CredentialAccess() {
  return (
    <div className="illus-window">
      <WindowBar title="darkweb_market_v2.onion" />
      <SectionLabel>Credential Listing #4892</SectionLabel>
      <Row label="Target"    value="Colonial Pipeline Co." />
      <Row label="Service"   value="VPN Gateway" />
      <Row label="Host"      value="vpn.colonialgas.com" />
      <Row label="Username"  value="j.smith@colonialgas.com" valueClass="illus-val--bright" />
      <Row label="Password"  value="Summer2019!" valueClass="illus-val--red" />
      <Row label="MFA"       value="NOT CONFIGURED" valueClass="illus-val--dim" />
      <Divider />
      <Row label="Source"    value="Prior unrelated breach" />
      <Row label="Status"    value="ACTIVE" valueClass="illus-val--amber" />
      <div className="illus-action-row">
        <span className="illus-note">Verified working · No detection risk</span>
        <span className="illus-tag illus-tag--green">$8.00</span>
      </div>
    </div>
  );
}

/* ── 2. Initial Access ── */
function InitialAccess() {
  return (
    <div className="illus-window">
      <WindowBar title="vpn.colonialgas.com — auth log" />
      <SectionLabel>Authentication Event · Apr 29 2021 20:09 UTC</SectionLabel>

      <div className="illus-auth-step">
        <div className="illus-auth-indicator illus-auth-indicator--pass" />
        <div className="illus-auth-info">
          <span className="illus-auth-field">Username</span>
          <span className="illus-val--bright">j.smith@colonialgas.com</span>
        </div>
        <span className="illus-auth-result illus-auth-result--pass">✓</span>
      </div>

      <div className="illus-auth-step">
        <div className="illus-auth-indicator illus-auth-indicator--pass" />
        <div className="illus-auth-info">
          <span className="illus-auth-field">Password</span>
          <span className="illus-val--bright">••••••••••••</span>
        </div>
        <span className="illus-auth-result illus-auth-result--pass">✓</span>
      </div>

      <div className="illus-auth-step illus-auth-step--absent">
        <div className="illus-auth-indicator" />
        <div className="illus-auth-info">
          <span className="illus-auth-field illus-val--dim">MFA Token</span>
          <span className="illus-val--dim">— not configured</span>
        </div>
        <span className="illus-auth-result illus-auth-result--absent">—</span>
      </div>

      <Divider />
      <div className="illus-status-box illus-status-box--green">
        SESSION ESTABLISHED
      </div>
      <div className="illus-meta-row">
        <span>IP: 176.111.174.xx</span>
        <span>Geo: Eastern Europe</span>
        <span className="illus-val--dim">Alerts: 0</span>
      </div>
    </div>
  );
}

/* ── 3. Discovery ── */
function Discovery() {
  const hosts = [
    { name: 'COLONIAL-DC01',     role: 'Domain Controller',  status: 'mapped' },
    { name: 'COLONIAL-SAP01',    role: 'Billing / ERP',      status: 'mapped' },
    { name: 'COLONIAL-FS01',     role: 'File Server',        status: 'mapped' },
    { name: 'COLONIAL-BK01',     role: 'Backup (no offsite)',status: 'flagged' },
    { name: 'COLONIAL-SCADA',    role: 'OT Gateway',         status: 'partial' },
  ];
  return (
    <div className="illus-window">
      <WindowBar title="recon — network enumeration" />
      <div className="illus-stat-row">
        <div>
          <span className="illus-bignum">47</span>
          <span className="illus-bignumlabel">hosts found</span>
        </div>
        <div className="illus-elapsed">14 days inside · 0 alerts</div>
      </div>
      <Divider />
      <SectionLabel>Key Targets</SectionLabel>
      <table className="illus-table">
        <tbody>
          {hosts.map(h => (
            <tr key={h.name}>
              <td className="illus-td illus-val--bright">{h.name}</td>
              <td className="illus-td illus-val">{h.role}</td>
              <td className="illus-td illus-td--right">
                <span className={`illus-tag illus-tag--${h.status}`}>
                  {h.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── 4. Exfiltration ── */
function Exfiltration() {
  const dirs = [
    '/billing/invoices_2019-2021/',
    '/contracts/vendor_agreements/',
    '/hr/employee_records/',
    '/ops/maintenance_logs/',
  ];
  return (
    <div className="illus-window">
      <WindowBar title="exfil — transfer log" />
      <div className="illus-stat-row">
        <div>
          <span className="illus-bignum illus-bignum--red">100 GB</span>
          <span className="illus-bignumlabel">transferred</span>
        </div>
        <div className="illus-elapsed">→ attacker C2</div>
      </div>
      <div className="illus-progress-track">
        <div className="illus-progress-fill" style={{ width: '100%' }} />
      </div>
      <Divider />
      <SectionLabel>Staged Directories</SectionLabel>
      {dirs.map(d => (
        <div key={d} className="illus-file-row">
          <span className="illus-file-icon">▸</span>
          <span className="illus-val">{d}</span>
        </div>
      ))}
      <div className="illus-file-row">
        <span className="illus-file-icon illus-val--dim">+</span>
        <span className="illus-val--dim">40 additional directories</span>
      </div>
      <Divider />
      <div className="illus-note">Ransomware deployment: T+0h from completion</div>
    </div>
  );
}

/* ── 5. Impact ── */
function Impact() {
  const files = ['billing.mdb', 'payroll.xlsx', 'contracts/', 'invoices/'];
  return (
    <div className="illus-window">
      <WindowBar title="colonial-fs01 — file system" />
      <div className="illus-split-header">
        <span className="illus-label" style={{ margin: 0 }}>Before</span>
        <span className="illus-label illus-label--red" style={{ margin: 0 }}>After</span>
      </div>
      <div className="illus-split-body">
        <div className="illus-split-col">
          {files.map(f => <div key={f} className="illus-file-row"><span className="illus-val">{f}</span></div>)}
          <div className="illus-file-row"><span className="illus-val">backups/</span></div>
        </div>
        <div className="illus-split-col illus-split-col--right">
          {files.map(f => <div key={f} className="illus-file-row"><span className="illus-val--red">{f}.hive</span></div>)}
          <div className="illus-file-row"><span className="illus-val--dim">— deleted</span></div>
        </div>
      </div>
      <Divider />
      <div className="illus-ransom-note">
        <div className="illus-ransom-title">DECRYPT_INSTRUCTIONS.TXT</div>
        <div className="illus-ransom-body">
          Your network has been encrypted by DarkSide.<br />
          Contact us within 5 days via our secure portal.
        </div>
      </div>
    </div>
  );
}

/* ── 6. Operational Impact ── */
function OperationalImpact() {
  return (
    <div className="illus-window">
      <WindowBar title="colonial pipeline — system status" />
      <div className="illus-status-header">
        <span className="illus-status-dot illus-status-dot--offline" />
        <span className="illus-status-name">PIPELINE OFFLINE</span>
      </div>
      <Divider />
      <div className="illus-pipeline-route">
        <div className="illus-route-node">
          <span className="illus-route-label">Houston, TX</span>
          <span className="illus-route-marker" />
        </div>
        <div className="illus-route-line" />
        <div className="illus-route-badge">OFFLINE</div>
        <div className="illus-route-line" />
        <div className="illus-route-node illus-route-node--right">
          <span className="illus-route-marker" />
          <span className="illus-route-label">Linden, NJ</span>
        </div>
      </div>
      <Divider />
      <Row label="Length"          value="5,500 miles" valueClass="illus-val--bright" />
      <Row label="Offline duration" value="6 days" valueClass="illus-val--red" />
      <Row label="States affected"  value="17" valueClass="illus-val--bright" />
      <Row label="E. Coast fuel"    value="45% halted" valueClass="illus-val--red" />
      <Divider />
      <div className="illus-note">OT never compromised — shutdown was precautionary</div>
    </div>
  );
}

/* ── 7. Recovery ── */
function Recovery() {
  return (
    <div className="illus-window">
      <WindowBar title="ransom transaction + seizure" />
      <SectionLabel>Paid — May 12, 2021</SectionLabel>
      <div className="illus-tx-row">
        <span className="illus-bignum illus-bignum--amber">75 BTC</span>
        <span className="illus-tx-usd">≈ $4,400,000</span>
      </div>
      <div className="illus-tx-hash">bc1q7e…dk8a9f → DarkSide wallet</div>
      <Divider />
      <SectionLabel>FBI Seizure — June 7, 2021</SectionLabel>
      <div className="illus-status-box illus-status-box--green">
        <div className="illus-seized-amount">63.7 BTC recovered</div>
        <div className="illus-seized-detail">≈ $2,300,000 · D.C. District Court</div>
      </div>
      <Divider />
      <Row label="Recovered" value="52% of ransom" valueClass="illus-val--green" />
      <div className="illus-note">Opsec fail: US-hosted wallet gave FBI jurisdiction</div>
    </div>
  );
}

const ILLUSTRATIONS = {
  'credential-access': CredentialAccess,
  'initial-access':    InitialAccess,
  'discovery':         Discovery,
  'exfiltration':      Exfiltration,
  'impact':            Impact,
  'defender':          OperationalImpact,
  'recovery':          Recovery,
};

export default function PhaseIllustration({ tacticSlug }) {
  const Illus = ILLUSTRATIONS[tacticSlug];
  if (!Illus) return null;
  return (
    <aside className="incident-phase-diagram">
      <Illus />
    </aside>
  );
}
