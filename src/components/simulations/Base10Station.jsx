import { useState } from 'react';
import FactFamilyTriangle from '../shared/FactFamilyTriangle.jsx';

// PRD Station A — Concrete CPA stage
// Interaction: click a block to move it to the "Taken Away" basket
//   • Ten-rod  → removes 10 from remaining
//   • One-cube → removes 1  from remaining
// A block is disabled if clicking it would overshoot the target (part1)
// Complete condition: removed === part1 exactly

const PROBLEMS = [
  { whole: 34, part1: 13, part2: 21 },   // within 50, easy
  { whole: 47, part1: 23, part2: 24 },   // within 50, medium
  { whole: 45, part1: 21, part2: 24 },   // within 50, medium
];

function buildBlocks(n) {
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  const blocks = [];
  for (let i = 0; i < tens; i++) blocks.push({ id: `t${i}`, value: 10, type: 'ten' });
  for (let i = 0; i < ones; i++) blocks.push({ id: `o${i}`, value: 1,  type: 'one' });
  return blocks;
}

export default function Base10Station({ onComplete }) {
  const [pi,      setPi]      = useState(0);
  const [basket,  setBasket]  = useState(new Set()); // ids in the basket

  const prob    = PROBLEMS[pi];
  const blocks  = buildBlocks(prob.whole);
  const removed = blocks.filter(b => basket.has(b.id)).reduce((s, b) => s + b.value, 0);
  const remaining = prob.whole - removed;
  const done    = removed === prob.part1;
  const overshot = removed > prob.part1;

  const moveToBasket = (b) => {
    if (basket.has(b.id)) return;
    if (removed + b.value > prob.part1) return; // would overshoot
    setBasket(prev => new Set([...prev, b.id]));
  };

  const returnBlock = (b) => {
    setBasket(prev => { const s = new Set(prev); s.delete(b.id); return s; });
  };

  const resetProblem = () => setBasket(new Set());

  const nextProblem = () => {
    if (pi < PROBLEMS.length - 1) { setPi(p => p + 1); setBasket(new Set()); }
    else onComplete();
  };

  const inHand  = blocks.filter(b => basket.has(b.id));
  const onShelf = blocks.filter(b => !basket.has(b.id));

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      <div className="station-header">
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: '#fff', margin: 0 }}>
          🧱 Station A — Take-Away Blocks
        </h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Problem {pi + 1} / {PROBLEMS.length}
        </span>
      </div>

      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', margin: '6px 0 16px', fontSize: '0.95rem' }}>
        Click blocks to move them to the basket. Remove exactly{' '}
        <strong style={{ color: 'var(--coral)' }}>{prob.part1}</strong> from{' '}
        <strong style={{ color: 'var(--gold)' }}>{prob.whole}</strong>.
      </p>

      {/* Live equation */}
      <div style={{
        textAlign: 'center', fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800,
        padding: '10px 16px', background: 'rgba(255,255,255,0.05)',
        borderRadius: 12, marginBottom: 12,
        border: overshot ? '2px solid var(--coral)' : '1px solid rgba(255,255,255,0.1)',
      }}>
        <span style={{ color: 'var(--purple-light,#c4b5fd)' }}>{prob.whole}</span>
        <span style={{ color: 'var(--text-muted)', margin: '0 8px' }}>−</span>
        <span style={{ color: 'var(--coral)' }}>{removed}</span>
        <span style={{ color: 'var(--text-muted)', margin: '0 8px' }}>=</span>
        <span style={{ color: done ? 'var(--green)' : 'var(--gold)' }}>{remaining}</span>
      </div>

      {/* TWO zones: Shelf (left) and Basket (right) */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* ── SHELF ── */}
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{
            fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8
          }}>
            Starting Blocks ({prob.whole})
          </div>
          <div style={{
            minHeight: 80, background: 'rgba(0,0,0,0.15)',
            borderRadius: 12, padding: 12,
            display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'flex-end',
          }}>
            {onShelf.map(b => {
              const wouldOvershoot = removed + b.value > prob.part1;
              return (
                <div
                  key={b.id}
                  onClick={() => !wouldOvershoot && moveToBasket(b)}
                  title={wouldOvershoot ? `Adding ${b.value} would exceed ${prob.part1}` : `Click to remove ${b.value}`}
                  style={{
                    cursor: wouldOvershoot ? 'not-allowed' : 'pointer',
                    opacity: wouldOvershoot ? 0.35 : 1,
                    transition: 'all 0.15s',
                    transform: wouldOvershoot ? 'scale(1)' : 'scale(1)',
                    filter: wouldOvershoot ? 'grayscale(0.6)' : 'none',
                  }}
                  onMouseEnter={e => { if (!wouldOvershoot) e.currentTarget.style.transform = 'scale(1.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  {b.type === 'ten' ? <TenRod /> : <OneCube />}
                </div>
              );
            })}
            {onShelf.length === 0 && (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '8px 4px' }}>
                All blocks moved!
              </div>
            )}
          </div>
        </div>

        {/* Arrow */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.6rem', paddingTop: 32, color: 'var(--coral)',
          flexShrink: 0,
        }}>→</div>

        {/* ── BASKET ── */}
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{
            fontSize: '0.75rem', fontWeight: 700,
            color: overshot ? 'var(--coral)' : done ? 'var(--green)' : 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8
          }}>
            {overshot ? '⚠ Too many! Click blocks to return them'
              : done ? `✅ Taken Away (${removed})`
              : `Basket — taken away (${removed} of ${prob.part1})`}
          </div>
          <div style={{
            minHeight: 80, background: overshot
              ? 'rgba(239,83,80,0.08)' : done
              ? 'rgba(52,211,153,0.08)' : 'rgba(0,0,0,0.1)',
            border: `2px dashed ${overshot ? 'var(--coral)' : done ? 'var(--green)' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: 12, padding: 12,
            display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'flex-end',
            transition: 'all 0.2s',
          }}>
            {inHand.map(b => (
              <div
                key={b.id}
                onClick={() => returnBlock(b)}
                title={`Click to put back`}
                style={{ cursor: 'pointer', opacity: 0.55, transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '0.55'; }}
              >
                {b.type === 'ten' ? <TenRod crossed /> : <OneCube crossed />}
              </div>
            ))}
            {inHand.length === 0 && (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', padding: '8px 4px' }}>
                🧺 empty — click blocks to add them
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fact family triangle — shows live */}
      {removed > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '18px 0 6px', animation: 'slideUp 0.3s ease' }}>
          <FactFamilyTriangle
            whole={prob.whole}
            part1={prob.part1}
            part2={prob.part2}
            missing={done ? null : 'part2'}
            size={130}
          />
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
        <button
          className="btn btn-outline btn-sm"
          onClick={resetProblem}
          disabled={basket.size === 0}
        >↩ Reset</button>

        {done && (
          <button className="btn btn-primary" onClick={nextProblem} style={{ animation: 'bounceIn 0.4s' }}>
            {pi < PROBLEMS.length - 1 ? '✅ Next Problem →' : '🎉 Complete Station A!'}
          </button>
        )}
      </div>

      {/* Success fact family display */}
      {done && (
        <div style={{
          marginTop: 14, background: 'rgba(52,211,153,0.08)',
          border: '1.5px solid rgba(52,211,153,0.3)', borderRadius: 14,
          padding: '12px 16px', textAlign: 'center', animation: 'slideUp 0.35s ease',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--green)', marginBottom: 8 }}>
            🎉 {prob.whole} − {prob.part1} = {prob.part2}
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              `${prob.part1}+${prob.part2}=${prob.whole}`,
              `${prob.part2}+${prob.part1}=${prob.whole}`,
              `${prob.whole}−${prob.part1}=${prob.part2}`,
              `${prob.whole}−${prob.part2}=${prob.part1}`,
            ].map(f => (
              <span key={f} style={{
                background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)',
                borderRadius: 8, padding: '4px 10px', fontSize: '0.85rem',
                fontFamily: 'var(--font-display)', fontWeight: 700, color: '#c4b5fd'
              }}>{f}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Visual sub-components ── */
function TenRod({ crossed }) {
  return (
    <div style={{
      width: 28, height: 100, position: 'relative',
      background: crossed ? '#555' : 'linear-gradient(180deg,#f59e0b 0%,#d97706 100%)',
      border: `2px solid ${crossed ? '#666' : '#fbbf24'}`,
      borderRadius: 4, display: 'flex', flexDirection: 'column',
      gap: 2, padding: 3, flexShrink: 0,
    }}>
      {Array(10).fill(0).map((_, i) => (
        <div key={i} style={{
          flex: 1, background: crossed ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.4)',
          borderRadius: 1
        }} />
      ))}
      <div style={{
        position: 'absolute', bottom: -18, left: '50%', transform: 'translateX(-50%)',
        fontSize: '0.65rem', fontWeight: 800, color: crossed ? 'var(--text-muted)' : 'var(--gold)',
        fontFamily: 'var(--font-display)', whiteSpace: 'nowrap',
      }}>= 10</div>
    </div>
  );
}

function OneCube({ crossed }) {
  return (
    <div style={{
      width: 28, height: 28, flexShrink: 0,
      background: crossed ? '#555' : 'linear-gradient(135deg,#38bdf8 0%,#0284c7 100%)',
      border: `2px solid ${crossed ? '#666' : '#7dd3fc'}`,
      borderRadius: 4,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: 14, height: 14, borderRadius: '50%',
        background: crossed ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.45)',
      }} />
    </div>
  );
}
