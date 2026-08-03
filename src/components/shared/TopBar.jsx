import React from 'react';
import './TopBar.css';

const PHASES = [
  { key: 'wonder',   num: '01', icon: '🔍', label: 'Wonder'   },
  { key: 'story',    num: '02', icon: '📖', label: 'Story'    },
  { key: 'simulate', num: '03', icon: '🧪', label: 'Simulate' },
  { key: 'play',     num: '04', icon: '🎮', label: 'Practice' },
  { key: 'reflect',  num: '05', icon: '📓', label: 'Reflect'  },
];

export default function TopBar({ state, dispatch, audioEnabled, onToggleAudio }) {
  if (!state || state.phase === 'intro' || state.phase === 'results') return null;

  const currentPhase = state.phase;
  const phaseComplete = state.pc || {};

  const handleSelectPhase = (pKey) => {
    if (dispatch) {
      dispatch({ t: 'PHASE', v: pKey });
    }
  };

  return (
    <nav className="progress-bar-nav" role="navigation" aria-label="Learning journey phases">
      <div className="progress-bar-pill">
        {PHASES.map((p, i) => {
          const isActive    = p.key === currentPhase;
          const isCompleted = phaseComplete[p.key];
          
          return (
            <React.Fragment key={p.key}>
              <div 
                className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => handleSelectPhase(p.key)}
                style={{ cursor: 'pointer' }}
                role="button"
                tabIndex={0}
                aria-label={`Go to ${p.label} phase`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectPhase(p.key);
                  }
                }}
              >
                <span className={`step-circle ${isCompleted ? 'circle-done' : isActive ? 'circle-active' : 'circle-idle'}`}>
                  {isCompleted ? '✓' : p.num}
                </span>
                <span className="step-label">
                  <span className="step-label-icon">{p.icon}</span> {p.label}
                </span>
              </div>
              {i < PHASES.length - 1 && <span className="step-divider">—</span>}
            </React.Fragment>
          );
        })}
      </div>

      {onToggleAudio && (
        <button 
          className="audio-btn" 
          onClick={onToggleAudio} 
          aria-label={audioEnabled ? 'Mute audio' : 'Unmute audio'}
          title={audioEnabled ? 'Mute audio' : 'Unmute audio'}
        >
          {audioEnabled ? '🔊' : '🔇'}
        </button>
      )}
    </nav>
  );
}
