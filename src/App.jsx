import { useReducer, useEffect, useRef, useState, useCallback } from 'react';
import './App.css';

import { reducer, mkFresh }    from './store/reducer.js';
import { BADGES }              from './data/badges.js';
import { useAudio }            from './hooks/useAudio.js';
import { narrate, stopNarration } from './utils/audio.js';
import { badgeNarration, correctNarration, wrongNarration } from './utils/narration.js';

import FloatingNumbers from './components/shared/FloatingNumbers.jsx';
import TopBar          from './components/shared/TopBar.jsx';
import BadgeToast      from './components/shared/BadgeToast.jsx';

import IntroScreen   from './components/phases/IntroScreen.jsx';
import WonderPhase   from './components/phases/WonderPhase.jsx';
import StoryPhase    from './components/phases/StoryPhase.jsx';
import SimulatePhase from './components/simulations/SimulatePhase.jsx';
import PlayPhase     from './components/quiz/PlayPhase.jsx';
import ReflectPhase  from './components/phases/ReflectPhase.jsx';
import ResultsScreen from './components/phases/ResultsScreen.jsx';

export default function App() {
  const [state, dispatch] = useReducer(reducer, null, mkFresh);
  const [toastBadges, setToastBadges] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { play } = useAudio();
  const narrationSeed = useRef(0);

  // Stop any playing narration when audio is toggled off
  useEffect(() => { if (!soundEnabled) stopNarration(); }, [soundEnabled]);

  const playSfx = useCallback((key) => {
    if (soundEnabled) play(key);
  }, [play, soundEnabled]);

  const goHome = useCallback(() => {
    dispatch({ t: 'PHASE', v: 'intro' });
    playSfx('click');
  }, [playSfx]);

  /* ── Badge toasts ── */
  useEffect(() => {
    if (state.newBadges?.length > 0) {
      const names = state.newBadges.map(
        (id) => BADGES.find((b) => b.id === id)?.label || id
      );
      setToastBadges(names);
      playSfx('badge');
      if (soundEnabled) narrate(badgeNarration(state.newBadges[0]));
      dispatch({ t: 'CLEAR_BADGES' });
    }
  }, [state.newBadges, playSfx, soundEnabled]);

  /* ── Audio on feedback ── */
  useEffect(() => {
    if (state.fb) {
      playSfx(state.fb.ok ? 'correct' : 'wrong');
      if (soundEnabled) {
        const seed = narrationSeed.current++;
        narrate(state.fb.ok ? correctNarration(seed) : wrongNarration(seed));
      }
    }
  }, [state.fb, playSfx, soundEnabled]);

  /* ── Helper: advance phase ── */
  const advance = useCallback((from, to) => {
    dispatch({ t: 'PHASE_DONE', v: from });
    dispatch({ t: 'PHASE',      v: to   });
    playSfx('phaseComplete');
  }, [playSfx]);

  const showNav = state.phase !== 'intro' && state.phase !== 'results';

  /* ── Phase renderer ── */
  const renderPhase = () => {
    switch (state.phase) {
      case 'intro':
        return (
          <IntroScreen
            onStart={() => dispatch({ t: 'PHASE', v: 'wonder' })}
            audioEnabled={soundEnabled}
            onToggleAudio={() => {
              setSoundEnabled((e) => !e);
              play('click');
            }}
          />
        );

      case 'wonder':
        return <WonderPhase onComplete={() => advance('wonder', 'story')} audioEnabled={soundEnabled} />;

      case 'story':
        return <StoryPhase onComplete={() => advance('story', 'simulate')} audioEnabled={soundEnabled} />;

      case 'simulate':
        return (
          <SimulatePhase
            state={state}
            dispatch={dispatch}
            onDone={() => advance('simulate', 'play')}
            audioEnabled={soundEnabled}
          />
        );

      case 'play':
        return (
          <PlayPhase
            state={state}
            dispatch={dispatch}
            onDone={() => advance('play', 'reflect')}
            audioEnabled={soundEnabled}
          />
        );

      case 'reflect':
        return (
          <ReflectPhase
            state={state}
            onDone={() => advance('reflect', 'results')}
            audioEnabled={soundEnabled}
          />
        );

      case 'results':
        return <ResultsScreen state={state} dispatch={dispatch} audioEnabled={soundEnabled} />;

      default:
        return null;
    }
  };

  return (
    <div className="app-shell">
      {showNav && (
        <header className="app-header">
          <button className="home-btn" onClick={goHome} aria-label="Home" title="Go Home">
            🏠 Home
          </button>
          
          <div className="header-progress">
            <TopBar
              state={state}
              dispatch={dispatch}
              audioEnabled={soundEnabled}
              onToggleAudio={() => {
                setSoundEnabled((e) => !e);
                play('click');
              }}
            />
          </div>
        </header>
      )}

      <main className="phase-content">
        {renderPhase()}
      </main>

      <BadgeToast badges={toastBadges} onDone={() => setToastBadges([])} audioEnabled={soundEnabled} />
    </div>
  );
}
