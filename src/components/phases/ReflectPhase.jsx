import { useState, useEffect } from 'react';
import './ReflectPhase.css';
import Mascot from '../shared/Mascot.jsx';
import { narrate } from '../../utils/audio.js';
import { reflectIntroNarration } from '../../utils/narration.js';

const REFLECT_QS = [
  {
    q: 'What is the relationship between addition and subtraction?',
    opts: [
      'They undo each other — they are inverse operations ✓',
      'They are the same operation',
      'They are completely unrelated',
    ],
  },
  {
    q: 'How does knowing 48 + 35 = 83 help with subtraction?',
    opts: [
      'I instantly know 83−48=35 and 83−35=48 ✓',
      "It doesn't help at all",
      'I still need to count separately',
    ],
  },
  {
    q: 'What does a fact family triangle show?',
    opts: [
      'All 4 related addition and subtraction facts ✓',
      'Only addition facts',
      'How to count on a number line',
    ],
  },
  {
    q: 'How confident are you with subtraction within 100?',
    opts: [
      'Very confident! ⭐ I can use inverse relationships',
      'Getting more confident 📈',
      'Still practising — I\'ll keep going! 💪',
    ],
  },
];

export default function ReflectPhase({ state, onDone, audioEnabled }) {
  useEffect(() => {
    if (audioEnabled) narrate(reflectIntroNarration());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [answers, setAnswers] = useState({});
  const allAnswered = REFLECT_QS.every((_, i) => answers[i] !== undefined);

  return (
    <div className="reflect-wrap">
      <div className="glass-card reflect-card anim-slide-up">
        <div className="reflect-badge">Phase 5 · Reflect ✨</div>

        <h2 className="reflect-title subheadline">🌟 Reflect on Your Learning</h2>
        <p className="reflect-subtitle">
          Think carefully about what you've discovered today!
        </p>

        <Mascot mood="curious" message="What inverse subtraction secrets did you discover?" size="sm" />

        {/* Journey stats */}
        <div className="reflect-stats">
          <div className="reflect-stat-item">
            <div className="reflect-stat-value">⭐ {state.stars}</div>
            <div className="reflect-stat-label">Stars</div>
          </div>
          <div className="reflect-stat-item">
            <div className="reflect-stat-value">⚡ {state.xp}</div>
            <div className="reflect-stat-label">XP</div>
          </div>
          <div className="reflect-stat-item">
            <div className="reflect-stat-value">🔥 {state.maxStr}</div>
            <div className="reflect-stat-label">Best Streak</div>
          </div>
        </div>

        {/* Reflection questions */}
        {REFLECT_QS.map((rq, i) => (
          <div key={i} className="reflect-question">
            <h3 className="reflect-question-title">
              {i + 1}. {rq.q}
            </h3>
            <div className="reflect-options">
              {rq.opts.map((opt) => (
                <div
                  key={opt}
                  className={`reflect-option ${answers[i] === opt ? 'selected' : ''}`}
                  onClick={() => setAnswers((a) => ({ ...a, [i]: opt }))}
                  role="radio"
                  aria-checked={answers[i] === opt}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setAnswers((a) => ({ ...a, [i]: opt }))}
                >
                  <div className="reflect-radio" />
                  <span>{opt}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button 
          className="btn-green btn-lg btn-full reflect-complete-btn" 
          disabled={!allAnswered} 
          onClick={onDone}
        >
          Complete My Journey! 🌟
        </button>
        
        {!allAnswered && (
          <p className="reflect-hint">
            Answer all {REFLECT_QS.length} questions to continue
          </p>
        )}
      </div>
    </div>
  );
}
