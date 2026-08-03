import { useState, useEffect } from 'react';
import './QuestionCard.css';
import FactFamilyTriangle from '../shared/FactFamilyTriangle.jsx';
import BarModel           from '../shared/BarModel.jsx';
import FeedbackOverlay    from '../shared/FeedbackOverlay.jsx';
import { WORLDS }         from '../../data/worlds.js';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function QuestionCard({ state, dispatch }) {
  const { qs, cq, cw, wcorr, fb, hl, att } = state;
  const [shake, setShake] = useState(false);
  const q = qs[cq];
  const qInWorld = cq - cw * 10 + 1;

  useEffect(() => setShake(false), [cq]);

  if (!q) return null;

  const handleAnswer = (v) => {
    if (fb) return;
    const ok = String(v) === String(q.ans);
    if (ok) {
      dispatch({ t: 'CORRECT', exp: q.exp });
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      dispatch({ t: 'WRONG' });
    }
  };

  const isLong   = q.opts?.some(o => String(o).length > 10);
  const isTwoCol = q.opts?.length === 2 || q.type === 'true_false_bond';

  return (
    <div className="question-card-wrap">
      {/* World header */}
      <div className="glass-card question-world-header">
        <div className="question-world-top">
          <div>
            <div className="question-world-title">
              {WORLDS[cw]?.emoji} World {cw + 1}: {WORLDS[cw]?.name}
            </div>
            <div className="question-world-meta">
              Question {qInWorld}/10 · {wcorr} ✅
            </div>
          </div>
          <button
            className="btn btn-outline question-map-btn"
            onClick={() => dispatch({ t: 'SHOW_MAP' })}
          >
            🗺️ Map
          </button>
        </div>
        <div className="question-progress-track">
          <div
            className="question-progress-fill"
            style={{ width: `${((qInWorld - 1) / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className={`glass-card question-main-card ${shake ? 'anim-shake' : ''}`}>
        {/* Visual — triangle */}
        {q.visual === 'triangle' && (
          <div className="question-visual-box">
            <FactFamilyTriangle
              whole={q.whole} part1={q.part1} part2={q.part2}
              missing={q.missing} size={140}
            />
          </div>
        )}

        {/* Visual — bar model */}
        {q.visual === 'barModel' && (
          <div className="question-visual-box">
            <BarModel whole={q.whole} part1={q.part1} part2={q.part2} missing={q.missing} />
          </div>
        )}

        {/* Question text */}
        <h3 className="question-text">
          {q.qt}
        </h3>

        {/* Hint box */}
        {hl > 0 && (
          <div className="hint-box">
            💡 <strong>Hint {hl}:</strong> {hl === 1 ? q.h1 : q.h2}
          </div>
        )}

        {/* Options grid */}
        <div className={`options-grid${isTwoCol ? ' grid-2' : isLong ? ' grid-1' : ''}`}>
          {q.opts?.map((opt, i) => (
            <button
              key={i}
              className="option-btn"
              disabled={!!fb}
              onClick={() => !fb && handleAnswer(opt)}
            >
              <span className="option-badge">
                {LETTERS[i]}
              </span>
              <span className="option-label">
                {opt}
              </span>
            </button>
          ))}
        </div>

        {/* Hint button */}
        {!fb && hl < 2 && (
          <button
            className="btn btn-outline btn-sm"
            style={{ width: '100%', marginTop: 4 }}
            onClick={() => dispatch({ t: 'HINT' })}
          >
            💡 Get a Hint ({2 - hl} left)
          </button>
        )}

        {/* Reveal after 2 wrong */}
        {!fb && att >= 2 && (
          <div className="hint-box" style={{ marginTop: 8 }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>
              📘 Answer: <span style={{ color: 'var(--gold)', fontSize: '1.1rem' }}>{q.ans}</span>
            </div>
            <div style={{ fontSize: '0.88rem', opacity: 0.9, marginBottom: 8 }}>{q.exp}</div>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => dispatch({ t: 'CORRECT', exp: q.exp })}
            >
              Got it — Continue →
            </button>
          </div>
        )}
      </div>

      {/* Feedback Overlay */}
      {fb && (
        <FeedbackOverlay
          isCorrect={fb.ok}
          explanation={fb.ok ? fb.exp : q.exp}
          correctAnswer={q.ans}
          xpGained={fb.xpG}
          bonus={fb.bonus}
          onContinue={() => dispatch({ t: 'NEXT' })}
        />
      )}
    </div>
  );
}
