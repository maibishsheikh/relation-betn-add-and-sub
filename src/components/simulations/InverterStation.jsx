import { useState, useEffect, useRef } from 'react';
import FactFamilyTriangle from '../shared/FactFamilyTriangle.jsx';

const PROBLEMS = [
  { whole: 63, part1: 27, part2: 36, blank: 'part2' },
  { whole: 82, part1: 47, part2: 35, blank: 'part2' },
  { whole: 65, part1: 38, part2: 27, blank: 'part1' },
  { whole: 91, part1: 54, part2: 37, blank: 'part2' },
  { whole: 72, part1: 45, part2: 27, blank: 'whole' },
];

function getAnswer(p) {
  return p.blank === 'whole' ? p.whole : p.blank === 'part1' ? p.part1 : p.part2;
}

function subSentence(p, typed) {
  const box = typed || '?';
  if (p.blank === 'whole')  return `___ − ${p.part1} = ${p.part2}`.replace('___', box);
  if (p.blank === 'part1')  return `${p.whole} − ___ = ${p.part2}`.replace('___', box);
  return `${p.whole} − ${p.part1} = ___`.replace('___', box);
}

/* Reusable numpad key — overrides the global .btn min-width */
function Key({ label, onClick, disabled, color }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 0, width: '100%', height: 52,
        borderRadius: 10,
        border: `1.5px solid ${color || 'rgba(255,255,255,0.15)'}`,
        background: color ? `${color}18` : 'rgba(255,255,255,0.06)',
        color: color || '#fff',
        fontFamily: 'var(--font-display)',
        fontSize: '1.2rem', fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'background 0.12s, transform 0.08s',
      }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = 'scale(0.93)'; }}
      onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {label}
    </button>
  );
}

export default function InverterStation({ onComplete }) {
  const [ci,       setCi]      = useState(0);
  const [typed,    setTyped]   = useState('');
  const [showHint, setShowHint] = useState(false);
  const [flash,    setFlash]   = useState(null);
  const timerRef = useRef(null);

  const prob   = PROBLEMS[ci];
  const answer = getAnswer(prob);

  useEffect(() => {
    setTyped(''); setShowHint(false); setFlash(null);
    clearTimeout(timerRef.current);
  }, [ci]);
  useEffect(() => () => clearTimeout(timerRef.current), []);

  // ── Keyboard input ──────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const digit = /^[0-9]$/.test(e.key) ? parseInt(e.key, 10) : null;
      if (digit !== null)          { e.preventDefault(); pressDigit(digit); }
      else if (e.key === 'Backspace') { e.preventDefault(); pressDelete(); }
      else if (e.key === 'Escape' || e.key === 'Delete') { e.preventDefault(); pressClear(); }
      else if (e.key === 'Enter' && flash === 'ok') { e.preventDefault(); next(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [typed, flash, ci]);   // re-bind whenever these change
  // ────────────────────────────────────────────────────────────────


  const pressDigit = (d) => {
    if (flash === 'ok') return;
    const next = typed + String(d);
    if (parseInt(next, 10) > 100) return;
    setTyped(next);
    const parsed = parseInt(next, 10);
    if (parsed === answer) {
      clearTimeout(timerRef.current);
      setFlash('ok');
    } else if (next.length >= String(answer).length) {
      setFlash('no');
      timerRef.current = setTimeout(() => { setTyped(''); setFlash(null); }, 1000);
    }
  };

  const pressClear  = () => { if (flash === 'no') return; setTyped(''); setFlash(null); };
  const pressDelete = () => { if (flash !== null) return; setTyped(v => v.slice(0, -1)); };

  const next = () => {
    if (ci < PROBLEMS.length - 1) setCi(c => c + 1);
    else onComplete();
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#fff', margin: 0 }}>
          🔄 Station C — Number Inverter
        </h2>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Problem {ci + 1} / {PROBLEMS.length}</span>
      </div>

      <p style={{ color: 'var(--text-secondary)', margin: '0 0 12px', fontSize: '0.9rem', textAlign: 'center' }}>
        Use the <strong style={{ color: 'var(--green)' }}>addition fact</strong> to fill in the subtraction blank!
      </p>

      {/* Two sentences */}
      <div style={{
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12, padding: '12px 16px', marginBottom: 12,
      }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>
          ✅ You know:
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem,3vw,1.5rem)', fontWeight: 800, color: 'var(--green)', marginBottom: 8 }}>
          {prob.part1} + {prob.part2} = {prob.whole}
        </div>
        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', padding: '2px 0' }}>⬇ use this to find ⬇</div>
        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.5, margin: '3px 0' }}>
          🔎 Find:
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem,3vw,1.5rem)', fontWeight: 800,
          color: flash === 'ok' ? 'var(--green)' : flash === 'no' ? 'var(--coral)' : '#c4b5fd',
          transition: 'color 0.2s',
        }}>
          {subSentence(prob, typed)}
        </div>
      </div>

      {/* Wrong flash */}
      {flash === 'no' && (
        <div style={{
          background: 'rgba(239,83,80,0.12)', border: '1.5px solid rgba(239,83,80,0.4)',
          borderRadius: 10, padding: '8px 12px', marginBottom: 10,
          color: '#fca5a5', fontFamily: 'var(--font-display)', fontSize: '0.85rem',
          animation: 'shake 0.4s ease', textAlign: 'center',
        }}>❌ Not quite — input cleared, try again!</div>
      )}

      {/* Number pad — centred block */}
      {flash !== 'ok' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          {/* Display */}
          <div style={{
            width: 140, height: 50,
            background: 'rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.15)',
            borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: '#fff',
          }}>
            {typed || <span style={{ opacity: 0.3 }}>?</span>}
          </div>

          {/* 3×4 key grid — fixed 220px, centred via flex parent */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 68px)', gap: 8 }}>
            {[1,2,3,4,5,6,7,8,9].map(n => (
              <Key key={n} label={n} disabled={flash !== null} onClick={() => pressDigit(n)} />
            ))}
            <Key label="C"  onClick={pressClear}              color="rgba(239,83,80,0.8)" />
            <Key label="0"  disabled={flash !== null} onClick={() => pressDigit(0)} />
            <Key label="⌫"  disabled={flash !== null} onClick={pressDelete} color="rgba(245,158,11,0.8)" />
          </div>

          {/* Hint toggle */}
          <button
            onClick={() => setShowHint(h => !h)}
            style={{
              minWidth: 0, padding: '6px 18px', borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)',
              fontFamily: 'var(--font-display)', fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            {showHint ? '🙈 Hide Hint' : '💡 Hint'}
          </button>

          {showHint && (
            <div style={{ animation: 'slideUp 0.3s ease' }}>
              <FactFamilyTriangle
                whole={prob.whole} part1={prob.part1} part2={prob.part2}
                missing={prob.blank} size={120}
              />
            </div>
          )}
        </div>
      )}

      {/* Correct */}
      {flash === 'ok' && (
        <div style={{ textAlign: 'center', animation: 'bounceIn 0.4s ease' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--gold)', marginBottom: 10 }}>
            🎉 {subSentence(prob, String(answer))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            <FactFamilyTriangle whole={prob.whole} part1={prob.part1} part2={prob.part2} size={120} />
          </div>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
            {[
              `${prob.part1}+${prob.part2}=${prob.whole}`,
              `${prob.whole}−${prob.part1}=${prob.part2}`,
              `${prob.whole}−${prob.part2}=${prob.part1}`,
            ].map(f => (
              <span key={f} style={{
                background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)',
                borderRadius: 8, padding: '3px 10px', fontSize: '0.82rem',
                fontFamily: 'var(--font-display)', fontWeight: 700, color: '#c4b5fd',
              }}>{f}</span>
            ))}
          </div>
          <button
            className={`btn ${ci < PROBLEMS.length - 1 ? 'btn-outline' : 'btn-primary'}`}
            style={{ minWidth: 0 }}
            onClick={next}
          >
            {ci < PROBLEMS.length - 1 ? 'Next →' : '🎉 Complete!'}
          </button>
        </div>
      )}
    </div>
  );
}
