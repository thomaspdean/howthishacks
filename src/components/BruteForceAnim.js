import React, { useState, useEffect } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!$%&';
const TARGET = ['P', '4', 'S', 'S', 'W', '0', 'R', 'D'];
const SCRAMBLE_MS = 480;
const SETTLE_MS = 140;
const LOCK_DELAY_MS = 300;
const HOLD_MS = 1800;
const RESET_MS = 400;

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

function LockIcon({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="34"
      height="34"
      className={`bf-lock ${open ? 'bf-lock--open' : ''}`}
      aria-hidden="true"
    >
      {open ? (
        <>
          <rect x="4" y="11" width="16" height="12" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="17" r="1.5" fill="currentColor" />
          <path d="M8 11V8a4 4 0 0 1 8 0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : (
        <path
          d="M17 11V7a5 5 0 0 0-10 0v4H5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1h-2zm-5 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3-6H9V7a3 3 0 0 1 6 0v4z"
          fill="currentColor"
        />
      )}
    </svg>
  );
}

export default function BruteForceAnim() {
  const [slots, setSlots] = useState(() => TARGET.map(() => ({ char: randomChar(), state: 'scrambling' })));
  const [status, setStatus] = useState('cracking');

  useEffect(() => {
    let alive = true;
    let scrambleInterval = null;

    function startScramble() {
      scrambleInterval = setInterval(() => {
        if (!alive) return;
        setSlots(prev => prev.map(s =>
          s.state === 'scrambling' ? { char: randomChar(), state: 'scrambling' } : s
        ));
      }, 55);
    }

    function stopScramble() {
      if (scrambleInterval) {
        clearInterval(scrambleInterval);
        scrambleInterval = null;
      }
    }

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function run() {
      while (alive) {
        setSlots(TARGET.map(() => ({ char: randomChar(), state: 'scrambling' })));
        setStatus('cracking');
        startScramble();

        await sleep(RESET_MS);
        if (!alive) break;

        for (let i = 0; i < TARGET.length; i++) {
          if (!alive) break;
          await sleep(SCRAMBLE_MS);
          if (!alive) break;
          setSlots(prev => prev.map((s, idx) =>
            idx === i ? { char: TARGET[i], state: 'cracked' } : s
          ));
          await sleep(SETTLE_MS);
        }

        stopScramble();
        if (!alive) break;

        await sleep(LOCK_DELAY_MS);
        if (!alive) break;
        setStatus('granted');
        await sleep(HOLD_MS);
      }
    }

    run();

    return () => {
      alive = false;
      stopScramble();
    };
  }, []);

  return (
    <div className="bf-anim">
      <div className={`bf-status-label bf-status-label--${status}`}>
        {status === 'granted' ? '[ ACCESS GRANTED ]' : '[ CRACKING... ]'}
      </div>
      <div className="bf-row">
        <div className="bf-slots">
          {slots.map((s, i) => (
            <span key={i} className={`bf-slot bf-slot--${s.state}`}>{s.char}</span>
          ))}
        </div>
        <LockIcon open={status === 'granted'} />
      </div>
    </div>
  );
}
