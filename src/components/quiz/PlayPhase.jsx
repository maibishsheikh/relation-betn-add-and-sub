import React from 'react';
import './PlayPhase.css';
import WorldMap           from './WorldMap.jsx';
import QuestionCard       from './QuestionCard.jsx';
import WorldCompleteModal from './WorldCompleteModal.jsx';
import StreakCounter      from '../gamification/StreakCounter.jsx';
import { WORLDS }         from '../../data/worlds.js';

export default function PlayPhase({ state, dispatch, onDone, audioEnabled }) {
  const allComplete = state.ws.every(w => w !== null);

  if (allComplete && state.showMap) {
    const totalCorrect = state.ws.reduce((t, w) => t + (w ?? 0), 0);
    return (
      <div className="play-done-wrap">
        <div className="play-done-card glass-card anim-bounce-in">
          <div className="play-done-icon">🏆</div>
          <h2 className="play-done-title headline">Practice Phase Complete!</h2>
          
          <div className="play-done-stats">
            <div className="stat-pill"><span>✅</span><span>{totalCorrect}/100 Correct</span></div>
            <div className="stat-pill"><span>⭐</span><span>{state.xp} XP</span></div>
            <div className="stat-pill"><span>🔥</span><span>Best Streak: {state.maxStr}</span></div>
          </div>

          <button className="btn-primary play-done-cta" onClick={onDone}>
            🌟 Go to Reflect Phase
          </button>
        </div>
      </div>
    );
  }

  if (state.worldResult && state.showMap) {
    return (
      <>
        <WorldMap state={state} dispatch={dispatch} />
        <WorldCompleteModal
          result={state.worldResult}
          worldIdx={state.cw}
          onContinue={() => dispatch({ t: 'SHOW_MAP' })}
        />
      </>
    );
  }

  if (state.showMap) {
    return <WorldMap state={state} dispatch={dispatch} />;
  }

  const currentWorld = WORLDS[state.cw];

  return (
    <div className="play-wrap anim-slide-up">
      {/* Topic Badge floating above card */}
      <div className="play-topic-badge">
        <div className="play-topic-title">
          <span>{currentWorld?.emoji || '🍎'}</span> World {state.cw + 1}: {currentWorld?.name}
        </div>
        <button 
          onClick={() => dispatch({ t: 'PHASE', v: 'reflect' })}
          className="btn-outline btn-sm"
          style={{ minWidth: 0, padding: '3px 10px', fontSize: '0.75rem', borderColor: 'var(--gold)', color: 'var(--gold)' }}
        >
          📓 Reflect
        </button>
      </div>

      {/* Stats HUD row (XP & Streak) */}
      <div className="play-hud-row">
        <div className="hud-pill">
          <span className="hud-pill-icon">⭐</span> {state.xp} XP
        </div>
        <StreakCounter streak={state.str} />
      </div>

      {/* Question Card */}
      <QuestionCard state={state} dispatch={dispatch} audioEnabled={audioEnabled} />
    </div>
  );
}
