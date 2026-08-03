import React from 'react';
import './FeedbackOverlay.css';

export default function FeedbackOverlay({ isCorrect, explanation, onContinue, xpGained, bonus, correctAnswer }) {
  return (
    <div className="feedback-backdrop" role="dialog" aria-modal="true" onClick={onContinue}>
      <div 
        className={`feedback-card anim-bounce-in ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="feedback-icon" aria-hidden="true">
          {isCorrect ? '🎉' : '🤔'}
        </div>
        <h2 className="feedback-title">
          {isCorrect ? 'Brilliant! 🎉' : 'Good try!'}
        </h2>
        
        {isCorrect && xpGained && (
          <div className="feedback-xp">
            +{xpGained} XP{bonus ? ' 🔥 Streak!' : ''}
          </div>
        )}

        {!isCorrect && correctAnswer !== undefined && (
          <div style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 700 }}>
            The answer is <span style={{ color: 'var(--gold)', fontSize: '1.15rem' }}>{correctAnswer}</span>
          </div>
        )}

        {explanation && (
          <p className="feedback-explain">{explanation}</p>
        )}

        <button className="btn btn-primary feedback-btn" onClick={onContinue}>
          Continue →
        </button>
      </div>
    </div>
  );
}
