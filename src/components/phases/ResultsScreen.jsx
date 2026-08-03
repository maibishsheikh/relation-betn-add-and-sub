import { useEffect } from 'react';
import './ResultsScreen.css';
import StarRating from '../gamification/StarRating.jsx';
import { BADGES } from '../../data/badges.js';
import { WORLDS } from '../../data/worlds.js';
import { calcStars } from '../../utils/gamification.js';
import { narrate } from '../../utils/audio.js';
import { resultsFinalNarration } from '../../utils/narration.js';

export default function ResultsScreen({ state, dispatch, audioEnabled }) {
  useEffect(() => {
    if (audioEnabled) narrate(resultsFinalNarration());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const total        = state.ws.reduce((t, w) => t + (w ?? 0), 0);
  const worldsDone   = state.ws.filter(w => w !== null).length;
  const pct          = Math.round((total / 100) * 100);
  const earnedBadges = BADGES.filter(b => state.badges.includes(b.id));

  const GRADE_ICON  = pct >= 90 ? '🥇' : pct >= 70 ? '🥈' : pct >= 50 ? '🥉' : '🏅';
  const GRADE_MSG   = pct >= 90 ? "Outstanding! You are a Subtraction Superstar!"
                    : pct >= 70 ? 'Great job! You really understand inverse operations!'
                    : pct >= 50 ? 'Well done! Keep practising to improve your score!'
                    :             'Good effort! Review the story and try again soon!';

  return (
    <div className="res-screen anim-slide-up">
      {/* Confetti dots */}
      {['🎊','🌟','✨','🎉','⭐','💫'].map((c,i) => (
        <div key={i} className="res-confetti" style={{ left: `${10 + i*15}%`, animationDelay: `${i*0.15}s` }}>{c}</div>
      ))}

      {/* Hero */}
      <div className="res-hero">
        <div className="res-trophy">🏆</div>
        <h1 className="res-title">Journey Complete!</h1>
        <p className="res-sub">You've mastered Subtraction within 100! 🎉</p>
        <div className="res-grade-pill">
          {GRADE_ICON} {GRADE_MSG}
        </div>
      </div>

      {/* Big XP */}
      <div className="res-xp-circle anim-bounce-in">
        <div className="res-xp-val">{state.xp}</div>
        <div className="res-xp-lbl">XP Earned</div>
      </div>

      {/* Stats grid */}
      <div className="res-stats-grid">
        {[
          [state.stars,         '⭐ Stars'],
          [worldsDone,          '🌍 Worlds'],
          [state.maxStr,        '🔥 Best Streak'],
          [`${total}/100`,      '✅ Correct'],
          [`${pct}%`,           '🎯 Accuracy'],
          [earnedBadges.length, '🏅 Badges'],
        ].map(([v, l]) => (
          <div key={l} className="res-stat">
            <div className="res-stat-val">{v}</div>
            <div className="res-stat-lbl">{l}</div>
          </div>
        ))}
      </div>

      {/* World scores */}
      <div className="res-worlds-card">
        <div className="res-card-title">🌍 World Scores</div>
        <div className="res-worlds-grid">
          {WORLDS.map((w, i) => {
            const score = state.ws[i];
            const st    = score !== null ? calcStars(score) : 0;
            return (
              <div key={i} className={`res-world-item ${score !== null ? 'done' : 'pending'}`}>
                <span className="res-w-emoji">{w.emoji}</span>
                <span className="res-w-name">{w.name}</span>
                {score !== null ? (
                  <>
                    <span className="res-w-score">{score}/10</span>
                    <StarRating stars={st} size="sm" />
                  </>
                ) : (
                  <span className="res-w-skip">—</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Earned badges */}
      {earnedBadges.length > 0 && (
        <div className="res-badges-card">
          <div className="res-card-title">🏅 Badges Earned ({earnedBadges.length}/{BADGES.length})</div>
          <div className="res-badges-grid">
            {earnedBadges.map(b => (
              <div key={b.id} className="res-badge">
                <span className="res-badge-icon">🏅</span>
                <span className="res-badge-name">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key takeaway */}
      <div className="res-takeaway">
        <div className="res-ta-icon">💡</div>
        <div className="res-ta-title">Key Takeaway</div>
        <p className="res-ta-body">
          Addition and subtraction are <strong>inverse operations</strong> — they undo each other!
          Knowing <strong>27 + 36 = 63</strong> instantly gives you <strong>63 − 27 = 36</strong> and <strong>63 − 36 = 27</strong>!
        </p>
      </div>

      {/* Action */}
      <button className="btn-primary btn-lg res-restart-btn" onClick={() => dispatch({ t: 'RESTART' })}>
        🔄 Start a New Journey
      </button>
    </div>
  );
}
