import { useState, useCallback, useEffect, useRef } from 'react';
import './SimulatePhase.css';
import Base10Station     from './Base10Station.jsx';
import FactFamilyStation from './FactFamilyStation.jsx';
import InverterStation   from './InverterStation.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { simulateNarration } from '../../utils/narration.js';

const STATIONS = [
  { id: 0, label: 'A', icon: '🧱', name: 'Take-Away Blocks', desc: 'Concrete — drag tens & ones' },
  { id: 1, label: 'B', icon: '🔺', name: 'Fact Triangle',    desc: 'Pictorial — find missing number' },
  { id: 2, label: 'C', icon: '🔄', name: 'Number Inverter',  desc: 'Abstract — use addition to solve subtraction' },
];

export default function SimulatePhase({ state, dispatch, onDone, audioEnabled }) {
  const [station, setStation] = useState(0);
  const [stationsComplete, setStationsComplete] = useState([false, false, false]);
  const prevStation = useRef(-1);

  useEffect(() => {
    if (prevStation.current !== station) {
      prevStation.current = station;
      if (audioEnabled) {
        stopNarration();
        narrate(simulateNarration(station));
      }
    }
  }, [station, audioEnabled]);

  useEffect(() => {
    return () => stopNarration();
  }, []);

  const handleStationComplete = useCallback((stIdx) => {
    stopNarration();
    setStationsComplete(prev => {
      const next = [...prev];
      next[stIdx] = true;
      return next;
    });
    if (stIdx < 2) {
      setTimeout(() => setStation(stIdx + 1), 500);
    }
  }, []);

  const goToPrev = () => {
    stopNarration();
    setStation(s => Math.max(0, s - 1));
  };
  const goToNext = () => {
    stopNarration();
    setStation(s => Math.min(2, s + 1));
  };

  const s = station;

  return (
    <div className="sim-wrap">
      <div className="sim-card glass-card">
        {/* Tabs */}
        <div className="sim-tabs" role="tablist">
          {STATIONS.map(st => {
            const isDone = stationsComplete[st.id];
            const isCurrent = s === st.id;
            const isLocked = st.id > s && !stationsComplete[st.id - 1];

            return (
              <button
                key={st.id}
                role="tab"
                aria-selected={isCurrent}
                className={`sim-tab ${isCurrent ? 'active' : ''} ${isDone ? 'done' : ''}`}
                onClick={() => {
                  if (isLocked) return;
                  stopNarration();
                  setStation(st.id);
                }}
                aria-label={`Station ${st.label}: ${st.name}`}
                disabled={isLocked}
              >
                <span className="tab-icon">{isDone ? '✅' : st.icon}</span>
                <span className="tab-name">{st.name}</span>
              </button>
            );
          })}
        </div>

        {/* Station content area */}
        <div className="sim-station-area" role="tabpanel" key={s}>
          {s === 0 && <Base10Station     onComplete={() => handleStationComplete(0)} />}
          {s === 1 && <FactFamilyStation onComplete={() => handleStationComplete(1)} />}
          {s === 2 && <InverterStation   onComplete={() => handleStationComplete(2)} />}
        </div>

        {/* Footer nav */}
        <div className="sim-footer">
          <button className="btn-outline" onClick={goToPrev} disabled={s === 0}>
            ← Previous Station
          </button>
          
          <div className="sim-progress-dots">
            {STATIONS.map(st => (
              <span
                key={st.id}
                className={`sim-dot ${s === st.id ? 'active' : ''} ${stationsComplete[st.id] ? 'done' : ''}`}
              />
            ))}
          </div>

          {s < 2 ? (
            <button className="btn-outline" onClick={goToNext} disabled={!stationsComplete[s] && s !== station}>
              Next Station →
            </button>
          ) : (
            <button className="btn-primary" onClick={() => { stopNarration(); onDone(); }}>
              Start Practicing! 🎮
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
