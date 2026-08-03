import React from 'react';
import './WorldCompleteModal.css';
import StarRating from '../gamification/StarRating.jsx';
import { WORLDS } from '../../data/worlds.js';
import { BADGES } from '../../data/badges.js';
import { starLabel } from '../../utils/gamification.js';

export default function WorldCompleteModal({ result, worldIdx, onContinue }) {
  const w = WORLDS[worldIdx];
  const badgeLabels = result.newBadges?.map((id) => BADGES.find((b) => b.id === id)?.label || id) ?? [];

  return (
    <div className="wc-overlay" role="dialog" aria-modal="true" aria-label="World complete">
      <div className="wc-card anim-bounce-in">
        <div className="wc-icon">{w?.emoji || '🏆'}</div>
        <div className="wc-subtitle">
          World {worldIdx + 1} Complete!
        </div>
        <h2 className="wc-title">{w?.name}</h2>

        <div className="wc-stars">
          <StarRating stars={result.stars} size="lg" />
        </div>
        <div className="star-score">{result.score}/10</div>

        <p className="wc-star-label">
          {starLabel(result.stars)}
        </p>

        {badgeLabels.length > 0 && (
          <div className="wc-badges">
            {badgeLabels.map((lbl) => (
              <div key={lbl} className="wc-badge">🏅 {lbl}</div>
            ))}
          </div>
        )}

        {result.score < 5 && (
          <div className="wc-retry-box">
            ⚠️ Score 5+ to unlock the next world. You can replay!
          </div>
        )}

        <button className="btn-primary wc-btn" onClick={onContinue}>
          {result.score >= 5 ? 'Continue → 🗺️' : 'Try Again 🔄'}
        </button>
      </div>
    </div>
  );
}
