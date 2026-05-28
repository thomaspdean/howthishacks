import React from 'react';
import PhaseIllustration from './PhaseIllustration';

const PHASES = [
  {
    tactic: 'Credential Access',
    tacticSlug: 'credential-access',
    techniques: [{ id: 'T1078', name: 'Valid Accounts' }],
    when: 'Pre-attack — date unknown',
    body: "A Colonial Pipeline employee's VPN credentials appear on a dark web marketplace, stolen in a prior, unrelated breach. The account is dormant but still active. No one at Colonial knows it has been compromised. DarkSide acquires the credential.",
    detail: "Compromised credentials are the single most common initial access vector in ransomware incidents. Unlike an exploit, valid credentials generate no alert and require no vulnerability in the target environment — they look identical to a legitimate login.",
    nodeStates: { attacker: 'active' },
    edgeStates: {},
  },
  {
    tactic: 'Initial Access',
    tacticSlug: 'initial-access',
    techniques: [
      { id: 'T1078', name: 'Valid Accounts' },
      { id: 'T1133', name: 'External Remote Services' },
    ],
    when: 'April 29, 2021',
    body: "DarkSide logs into Colonial's VPN using the stolen credential. No second factor is requested. The session is indistinguishable from a legitimate employee connection — no alert fires, no anomaly is flagged. They are now inside the corporate network.",
    detail: "T1133 covers internet-facing remote access services: VPN, RDP, Citrix, SSH. When combined with valid credentials, entry is completely silent. There is no exploit signature, no payload to detect, and no anomalous behavior — just a login that looks real.",
    nodeStates: { attacker: 'active', vpn: 'compromised' },
    edgeStates: { 'att-vpn': 'attack' },
  },
  {
    tactic: 'Discovery',
    tacticSlug: 'discovery',
    techniques: [
      { id: 'T1083', name: 'File & Directory Discovery' },
      { id: 'T1046', name: 'Network Service Scanning' },
      { id: 'T1135', name: 'Network Share Discovery' },
    ],
    when: 'April 29 – May 5, 2021',
    body: "Rather than acting immediately, DarkSide spends nearly two weeks inside Colonial's network — mapping systems, identifying high-value data, understanding architecture, and locating backup infrastructure. Colonial has no awareness of the intrusion.",
    detail: "Average attacker dwell time in ransomware incidents is 21 days. Extended discovery serves a strategic purpose: identifying what data is worth stealing for double extortion, locating and disabling backup systems before encryption, and understanding the network well enough to maximize blast radius.",
    nodeStates: { attacker: 'active', vpn: 'compromised', corporate: 'compromised' },
    edgeStates: { 'att-vpn': 'attack', 'vpn-corp': 'attack' },
  },
  {
    tactic: 'Exfiltration',
    tacticSlug: 'exfiltration',
    techniques: [
      { id: 'T1048', name: 'Exfiltration Over Alternative Protocol' },
      { id: 'T1074', name: 'Data Staged' },
    ],
    when: 'May 6, 2021',
    body: "Before deploying a single byte of ransomware, DarkSide exfiltrates over 100GB of sensitive business data to attacker-controlled infrastructure. The strategy is deliberate: even if Colonial fully restores from backups, the threat to publish the stolen data remains — a second, independent extortion lever.",
    detail: "\"Exfiltrate first, encrypt second\" became standard RaaS (Ransomware-as-a-Service) playbook starting around 2020. Data staging (T1074) typically involves aggregating targeted files into compressed archives before a single exfiltration window, which minimizes dwell time on the wire and reduces detection opportunity.",
    nodeStates: { attacker: 'active', vpn: 'compromised', corporate: 'compromised', files: 'exfil' },
    edgeStates: { 'vpn-corp': 'attack', 'corp-files': 'exfil' },
    showExfil: true,
  },
  {
    tactic: 'Impact',
    tacticSlug: 'impact',
    techniques: [
      { id: 'T1486', name: 'Data Encrypted for Impact' },
      { id: 'T1490', name: 'Inhibit System Recovery' },
    ],
    when: 'May 6–7, 2021',
    body: "DarkSide deploys their ransomware payload across Colonial's IT environment — billing, invoicing, and back-office systems are encrypted. A ransom note is left. The OT network that physically controls the pipeline runs on a separate network segment and is not directly touched by the ransomware.",
    detail: "T1490 (Inhibit System Recovery) typically precedes encryption: attackers delete Volume Shadow Copies, remove backup catalogs, and disable recovery agents so the victim cannot restore without paying. The ransomware never crossed the IT/OT boundary — a fact Colonial could not confirm at the time.",
    nodeStates: { vpn: 'compromised', corporate: 'compromised', files: 'compromised', billing: 'compromised' },
    edgeStates: { 'vpn-corp': 'attack', 'corp-billing': 'attack', 'corp-files': 'attack' },
  },
  {
    tactic: 'Operational Impact',
    tacticSlug: 'defender',
    techniques: [{ id: 'T1590', name: 'Gather Victim Network Info' }],
    techniqueNote: 'Attacker succeeded here — Colonial lacked visibility to confirm OT was not compromised',
    when: 'May 7–12, 2021',
    body: "An employee discovers encrypted systems and a ransom note at 5:26 AM on May 7. The FBI is notified. The critical unknown: has the ransomware crossed into OT? Without confidence in their network segmentation, Colonial makes the call to shut down the physical pipeline as a precaution. 45% of the East Coast's fuel supply halts for six days across 17 states.",
    detail: "The ransomware never reached the OT network. The national emergency that followed was not caused by the ransomware itself — it was caused by Colonial's inability to verify that fact. Inadequate IT/OT visibility forced a decision under pure uncertainty.",
    nodeStates: { corporate: 'compromised', billing: 'compromised', ot: 'offline' },
    edgeStates: { 'corp-billing': 'attack' },
  },
  {
    tactic: 'Ransom & Recovery',
    tacticSlug: 'recovery',
    techniques: [{ id: 'T1657', name: 'Financial Theft' }],
    when: 'May 12 – June 7, 2021',
    body: "Colonial pays 75 Bitcoin (~$4.4M) and receives a decryption key. The pipeline restarts May 12. On June 7, the FBI traces the ransom payment to a cryptocurrency wallet hosted on US infrastructure and seizes 63.7 BTC (~$2.3M). DarkSide goes dark shortly after, under reported pressure from Russian authorities.",
    detail: "DarkSide's operational security failure: hosting ransom wallet infrastructure on US-based servers gave the FBI jurisdiction to seize it via a court order. The vast majority of ransomware payments are unrecoverable — this was an exception made possible by a specific opsec mistake.",
    nodeStates: {},
    edgeStates: {},
    recovered: true,
  },
];


export default function AttackWalkthrough() {
  return (
    <article className="incident-article">

      <header className="incident-article-header">
        <div className="post-eyebrow">Incident Analysis · DarkSide · May 2021</div>
        <h1>Colonial Pipeline Ransomware Attack</h1>
        <p className="incident-article-lead">
          A single stolen VPN password with no MFA gave attackers undetected access to one of America's most critical infrastructure networks. Step through each phase, mapped to MITRE ATT&CK.
        </p>
        <div className="incident-facts">
          <div className="incident-fact">
            <span className="incident-fact-label">Attacker</span>
            <span className="incident-fact-value">DarkSide (RaaS)</span>
          </div>
          <div className="incident-fact">
            <span className="incident-fact-label">Industry</span>
            <span className="incident-fact-value">Energy / Critical Infrastructure</span>
          </div>
          <div className="incident-fact">
            <span className="incident-fact-label">Duration</span>
            <span className="incident-fact-value">Apr 29 – Jun 7, 2021</span>
          </div>
          <div className="incident-fact">
            <span className="incident-fact-label">Impact</span>
            <span className="incident-fact-value">5,500 mi pipeline, 6 days offline</span>
          </div>
          <div className="incident-fact">
            <span className="incident-fact-label">Ransom paid</span>
            <span className="incident-fact-value">$4.4M (75 BTC)</span>
          </div>
          <div className="incident-fact">
            <span className="incident-fact-label">Root cause</span>
            <span className="incident-fact-value">No MFA on VPN</span>
          </div>
        </div>
      </header>

      {PHASES.map((phase, i) => (
        <section key={i} className={`incident-phase incident-phase--${phase.tacticSlug}`}>
          <div className="incident-phase-text">
            <div className="incident-phase-header">
              <span className="incident-phase-tactic-label">Tactic</span>
              <h2 className={`incident-phase-tactic atk-tactic-name--${phase.tacticSlug}`}>
                {phase.tactic}
              </h2>
              <div className="incident-phase-chips">
                {phase.techniques.map(t => (
                  <span key={t.id} className={`incident-chip incident-chip--${phase.tacticSlug}`}>
                    <span className="incident-chip-id">{t.id}</span>
                    <span className="incident-chip-name">{t.name}</span>
                  </span>
                ))}
              </div>
              <span className="incident-phase-when">{phase.when}</span>
            </div>
            <p className="incident-phase-body">{phase.body}</p>
            {phase.techniqueNote && (
              <p className="incident-phase-technique-note">{phase.techniqueNote}</p>
            )}
            {phase.detail && (
              <blockquote className="incident-phase-detail">{phase.detail}</blockquote>
            )}
          </div>
          <PhaseIllustration tacticSlug={phase.tacticSlug} />
        </section>
      ))}

    </article>
  );
}
