import React, { useEffect } from 'react';
import './IntroScreen.css';
import Mascot from '../shared/Mascot.jsx';
import { narrate } from '../../utils/audio.js';
import { welcomeNarration } from '../../utils/narration.js';

const JOURNEY = [
  { key: 'wonder',   icon: '🔍', label: 'Wonder',   desc: 'A subtraction mystery!' },
  { key: 'story',    icon: '📖', label: 'Story',    desc: 'See it in action' },
  { key: 'simulate', icon: '🧪', label: 'Simulate', desc: 'Explore the models' },
  { key: 'play',     icon: '🎮', label: 'Practice', desc: 'Gamified challenges' },
  { key: 'reflect',  icon: '📓', label: 'Reflect',  desc: 'What did you learn?' },
];

export default function IntroScreen({ onStart, audioEnabled }) {
  useEffect(() => {
    if (audioEnabled) narrate(welcomeNarration());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="intro-wrap">
      {/* Top Badge */}
      <div className="intro-top-badge">
        ✨ Grade 2 Maths · Subtraction Within 100
      </div>

      {/* Main Title */}
      <h1 className="intro-title">
        <span className="text-orange">Subtraction</span> <span className="text-white">Within 100</span>
      </h1>
      <h2 className="intro-subtitle">Lesson 3.3 · Relationship between + and −</h2>

      {/* Mascot Row */}
      <div className="intro-mascot-row">
        <Mascot mood="idle" message="Let's crack the fact families! 🔍" size="md" />
      </div>

      {/* Description */}
      <p className="intro-desc">
        Learn to use <span className="text-yellow">addition facts</span> to solve subtraction problems, build fact family triangles, and conquer challenges within 100!
      </p>

      {/* Journey Card */}
      <div className="journey-card">
        <div className="journey-card-title">YOUR LEARNING JOURNEY</div>
        
        <div className="journey-steps-container">
          <div className="journey-row">
            {JOURNEY.map((j, i) => (
              <React.Fragment key={j.key}>
                <div className="journey-step-item">
                  <span className="journey-icon-circle">{j.icon}</span>
                  <div className="journey-text-col">
                    <span className="journey-item-title">{j.label}</span>
                    <span className="journey-item-desc">{j.desc}</span>
                  </div>
                </div>
                {i < JOURNEY.length - 1 && <span className="journey-arrow">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="intro-ctas">
        <button className="btn-primary btn-lg" onClick={onStart} id="start-journey-btn">
          🚀 Begin Your Journey!
        </button>
      </div>

      {/* Bottom Cards */}
      <div className="intro-bottom-cards">
        <div className="bottom-card">
          <div className="bottom-card-icon" style={{ color: '#ff6b6b' }}>🎯</div>
          <div>100 Challenges</div>
        </div>
        <div className="bottom-card">
          <div className="bottom-card-icon" style={{ color: '#feca57' }}>🔺</div>
          <div>Fact Families</div>
        </div>
        <div className="bottom-card">
          <div className="bottom-card-icon" style={{ color: '#4caf50' }}>✨</div>
          <div>Badges & XP</div>
        </div>
      </div>
    </div>
  );
}
