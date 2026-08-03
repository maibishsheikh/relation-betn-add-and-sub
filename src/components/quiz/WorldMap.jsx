import React from 'react';
import './WorldMap.css';
import StarRating from '../gamification/StarRating.jsx';
import { WORLDS }    from '../../data/worlds.js';
import { calcStars } from '../../utils/gamification.js';

export default function WorldMap({ state, dispatch }) {
  const { ws, cw, xp, stars } = state;
  const totalCorrect = ws.reduce((t, w) => t + (w ?? 0), 0);

  return (
    <div className="world-map-wrap">
      <div className="world-map-card glass-card anim-slide-up">
        {/* Header */}
        <div className="world-map-header">
          <h2 className="world-map-title subheadline">🗺️ Subtraction World Map</h2>
          <p className="body-text" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Score 5 or more out of 10 to unlock the next world!
          </p>

          <div className="world-stats-row">
            <div className="world-stat-pill">
              <span>⭐</span> <span>{stars} Stars</span>
            </div>
            <div className="world-stat-pill">
              <span>⚡</span> <span>{xp} XP</span>
            </div>
            <div className="world-stat-pill">
              <span>✅</span> <span>{totalCorrect}/100 Correct</span>
            </div>
          </div>
        </div>

        {/* World Grid */}
        <div className="kingdom-map">
          {WORLDS.map((w, i) => {
            const score    = ws[i];
            const st       = score !== null ? calcStars(score) : 0;
            const unlocked = i === 0 || (ws[i - 1] !== null && ws[i - 1] >= 5);
            const complete = score !== null;
            const isActive = i === cw && !complete;

            return (
              <div
                key={i}
                className={`district-card ${isActive ? 'active' : ''} ${complete ? 'done' : ''} ${!unlocked ? 'locked' : ''}`}
                onClick={() => unlocked && dispatch({ t: 'ENTER_WORLD', v: i })}
                role={unlocked ? 'button' : undefined}
                tabIndex={unlocked ? 0 : undefined}
                onKeyDown={e => e.key === 'Enter' && unlocked && dispatch({ t: 'ENTER_WORLD', v: i })}
              >
                <span className="district-icon">{w.emoji}</span>
                <div className="district-info">
                  <span className="district-num">World {i + 1}</span>
                  <span className="district-name">{w.name}</span>
                  <span className="district-diff">{w.range}</span>
                </div>
                <div className="district-status">
                  {complete ? (
                    <>
                      <StarRating stars={st} size="sm" />
                      <span className="district-score">{score}/10</span>
                    </>
                  ) : isActive ? (
                    <span className="district-badge active-badge">▶ Current</span>
                  ) : unlocked ? (
                    <span className="district-badge active-badge">▶ Ready</span>
                  ) : (
                    <span className="district-badge locked-badge">🔒 Locked</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
