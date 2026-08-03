import { useState, useEffect, useRef } from 'react';
import FactFamilyTriangle from '../shared/FactFamilyTriangle.jsx';
import { shuffle } from '../../data/questionBank.js';

// PRD Station B — Pictorial CPA stage
// Interaction: select the correct number tile to fill the dashed-circle slot
// Wrong answer: brief red flash (1.2 s) then auto-resets → user retries
// Correct answer: triangle animates, reveals all 4 facts

const PROBLEMS = [
  { whole: 63, part1: 27, part2: 36, m: 'part2' },
  { whole: 82, part1: 47, part2: 35, m: 'part2' },
  { whole: 54, part1: 26, part2: 28, m: 'part1' },
  { whole: 71, part1: 38, part2: 33, m: 'whole' },
  { whole: 75, part1: 38, part2: 37, m: 'part2' },
];

function answer(p) {
  return p.m === 'whole' ? p.whole : p.m === 'part1' ? p.part1 : p.part2;
}

function qLabel(p) {
  if (p.m === 'whole') return `${p.part1} + ${p.part2} = ?`;
  if (p.m === 'part1') return `? + ${p.part2} = ${p.whole}`;
  return `${p.part1} + ? = ${p.whole}`;
}

function makeOpts(correct) {
  const s = new Set([correct]);
  for (const off of [1,-1,2,-2,5,-5,10,-10,3,-3]) {
    if (s.size >= 4) break;
    const v = correct + off;
    if (v > 0 && v <= 100 && v !== correct) s.add(v);
  }
  return shuffle([...s]).slice(0, 4);
}

export default function FactFamilyStation({ onComplete }) {
  const [ci,      setCi]      = useState(0);
  const [opts,    setOpts]    = useState(() => makeOpts(answer(PROBLEMS[0])));
  const [flash,   setFlash]   = useState(null);   // null | 'ok' | 'no'
  const [correct, setCorrect] = useState(false);
  const timerRef = useRef(null);

  const prob = PROBLEMS[ci];
  const ans  = answer(prob);

  useEffect(() => {
    setOpts(makeOpts(answer(PROBLEMS[ci])));
    setFlash(null);
    setCorrect(false);
    clearTimeout(timerRef.current);
  }, [ci]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const pick = (v) => {
    if (flash !== null || correct) return;
    if (v === ans) {
      setFlash('ok');
      setCorrect(true);
    } else {
      setFlash('no');
      timerRef.current = setTimeout(() => setFlash(null), 1200);
    }
  };

  const next = () => {
    if (ci < PROBLEMS.length - 1) setCi(c => c + 1);
    else onComplete();
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header">
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: '#fff', margin: 0 }}>
          🔺 Station B — Fact Family Triangle
        </h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Problem {ci + 1} / {PROBLEMS.length}
        </span>
      </div>

      <p style={{ color: 'var(--text-secondary)', margin: '6px 0 16px', fontSize: '0.95rem' }}>
        Find the <strong style={{ color: 'var(--gold)' }}>missing number</strong> in the triangle!
      </p>

      {/* Question text */}
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem,3.5vw,1.7rem)',
        fontWeight: 800, color: '#fff', background: 'rgba(255,255,255,0.06)',
        borderRadius: 12, padding: '12px 16px', marginBottom: 18,
      }}>
        {qLabel(prob)}
      </div>

      {/* Triangle — missing slot shown until correct */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, animation: correct ? 'triangleLock 0.4s ease' : 'none' }}>
        <FactFamilyTriangle
          whole={prob.whole} part1={prob.part1} part2={prob.part2}
          missing={correct ? null : prob.m}
          size={160}
        />
      </div>

      {/* Wrong flash banner */}
      {flash === 'no' && (
        <div style={{
          background: 'rgba(239,83,80,0.15)', border: '1.5px solid rgba(239,83,80,0.4)',
          borderRadius: 12, padding: '10px 16px', marginBottom: 12,
          color: '#fca5a5', fontFamily: 'var(--font-display)', fontSize: '0.95rem',
          animation: 'shake 0.4s ease',
        }}>
          ❌ Not quite — look at the triangle and try again!
        </div>
      )}

      {/* Options — always rendered, disabled only during flash */}
      {!correct && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2,1fr)',
          gap: 12, maxWidth: 320, margin: '0 auto 16px',
        }}>
          {opts.map(opt => {
            const isHighlight = flash === 'no' && opt === ans; // show correct hint
            const isWrong     = flash === 'no' && opt !== ans;
            return (
              <button
                key={opt}
                className="btn btn-outline"
                disabled={flash !== null}
                onClick={() => pick(opt)}
                style={{
                  fontSize: '1.5rem', fontWeight: 800, padding: '16px 8px',
                  borderColor: isHighlight ? 'var(--green)' : isWrong ? 'var(--coral)' : undefined,
                  background:  isHighlight ? 'rgba(52,211,153,0.15)' : isWrong ? 'rgba(239,83,80,0.1)' : undefined,
                  transition: 'all 0.15s',
                  minHeight: 60,
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {/* Correct result */}
      {correct && (
        <div style={{ animation: 'bounceIn 0.4s ease' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '1.2rem',
            color: 'var(--gold)', marginBottom: 10
          }}>
            🎉 {ans} is correct!
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
            {[
              `${prob.part1}+${prob.part2}=${prob.whole}`,
              `${prob.part2}+${prob.part1}=${prob.whole}`,
              `${prob.whole}−${prob.part1}=${prob.part2}`,
              `${prob.whole}−${prob.part2}=${prob.part1}`,
            ].map(f => (
              <span key={f} style={{
                background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)',
                borderRadius: 8, padding: '4px 10px', fontSize: '0.85rem',
                fontFamily: 'var(--font-display)', fontWeight: 700, color: '#c4b5fd',
              }}>{f}</span>
            ))}
          </div>
          <button
            className={`btn ${ci < PROBLEMS.length - 1 ? 'btn-outline' : 'btn-primary'}`}
            onClick={next}
          >
            {ci < PROBLEMS.length - 1 ? 'Next Problem →' : '🎉 Complete Station B!'}
          </button>
          <div style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Problem {ci + 1} / {PROBLEMS.length}
          </div>
        </div>
      )}
    </div>
  );
}
