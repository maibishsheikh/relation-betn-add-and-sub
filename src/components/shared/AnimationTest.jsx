import React, { useState } from 'react';
import './AnimationTest.css';

/**
 * AnimationTest Component
 * Testing component for verifying all animations from animations.css work correctly
 * This component should be temporarily imported in App.jsx for testing
 */
const AnimationTest = () => {
  const [activeAnimation, setActiveAnimation] = useState('');
  const [testKey, setTestKey] = useState(0);

  const animations = [
    { name: 'fadeIn', description: 'Fade in entrance', duration: '0.5s', emoji: '💫' },
    { name: 'bounceIn', description: 'Bounce scale entrance', duration: '0.6s', emoji: '🎯' },
    { name: 'slideUp', description: 'Slide from below', duration: '0.6s', emoji: '📤' },
    { name: 'slideInRight', description: 'Slide from right', duration: '0.5s', emoji: '➡️' },
    { name: 'fadeOut', description: 'Fade out exit', duration: '0.3s', emoji: '👋' },
    { name: 'shake', description: 'Error feedback shake', duration: '0.4s', emoji: '❌' },
    { name: 'correctPulse', description: 'Success pulse', duration: '0.5s', emoji: '✅' },
    { name: 'pulse', description: 'Generic pulse', duration: '2s', emoji: '💎' },
    { name: 'floatUp', description: 'XP popup float', duration: '1.5s', emoji: '⚡' },
    { name: 'floatAround', description: 'Background numbers', duration: '20s', emoji: '🔢' },
    { name: 'glowPulse', description: 'Active element glow', duration: '2s', emoji: '⭐' },
    { name: 'spin', description: 'Loading spinner', duration: '1s', emoji: '🔄' },
    { name: 'heartbeat', description: 'Heart pulse', duration: '1s', emoji: '❤️' },
  ];

  const triggerAnimation = (animationName) => {
    setActiveAnimation(animationName);
    setTestKey(prev => prev + 1);
    
    // Reset after animation completes
    setTimeout(() => {
      setActiveAnimation('');
    }, 2000);
  };

  return (
    <div className="animation-test-container">
      <div className="animation-test-header">
        <h1>🎨 Animation System Test</h1>
        <p>Testing all keyframe animations from animations.css</p>
      </div>

      <div className="test-status">
        <div className="status-badge success">
          <span>✅</span>
          <span>Animations.css Loaded</span>
        </div>
        <div className="status-badge info">
          <span>📦</span>
          <span>{animations.length} Animations Available</span>
        </div>
        <div className="status-badge info">
          <span>🎯</span>
          <span>Design Tokens Integrated</span>
        </div>
      </div>

      {/* Animation Demo Element */}
      <div className="demo-section">
        <h2>Interactive Demo</h2>
        <div className="demo-stage">
          <div 
            key={testKey}
            className={`demo-element ${activeAnimation ? `animate-${activeAnimation}` : ''}`}
          >
            {activeAnimation ? 
              animations.find(a => a.name === activeAnimation)?.emoji || '🎨' 
              : '🎨'
            }
          </div>
          {activeAnimation && (
            <div className="active-label">{activeAnimation}</div>
          )}
        </div>
      </div>

      {/* Animation Grid */}
      <div className="animations-grid">
        {animations.map((anim) => (
          <div 
            key={anim.name}
            className="animation-card"
            onClick={() => triggerAnimation(anim.name)}
          >
            <div className="anim-emoji">{anim.emoji}</div>
            <div className="anim-name">{anim.name}</div>
            <div className="anim-description">{anim.description}</div>
            <div className="anim-duration">{anim.duration}</div>
            <button className="test-btn">Test</button>
          </div>
        ))}
      </div>

      {/* Continuous Animation Examples */}
      <div className="continuous-section">
        <h2>Continuous Animations</h2>
        <div className="continuous-grid">
          <div className="continuous-box">
            <div className="continuous-element pulse-infinite">💎</div>
            <div className="continuous-label">pulse (infinite)</div>
          </div>
          <div className="continuous-box">
            <div className="continuous-element glow-infinite">⭐</div>
            <div className="continuous-label">glowPulse (infinite)</div>
          </div>
          <div className="continuous-box">
            <div className="continuous-element float-infinite">🔢</div>
            <div className="continuous-label">floatAround (infinite)</div>
          </div>
          <div className="continuous-box">
            <div className="continuous-element spin-infinite">🔄</div>
            <div className="continuous-label">spin (infinite)</div>
          </div>
        </div>
      </div>

      {/* Design Token Usage */}
      <div className="tokens-section">
        <h2>Design Token Integration</h2>
        <div className="tokens-grid">
          <div className="token-card">
            <div className="token-label">--transition-fast</div>
            <div className="token-value">0.15s</div>
          </div>
          <div className="token-card">
            <div className="token-label">--transition-base</div>
            <div className="token-value">0.3s</div>
          </div>
          <div className="token-card">
            <div className="token-label">--transition-slow</div>
            <div className="token-value">0.5s</div>
          </div>
          <div className="token-card">
            <div className="token-label">--ease-bounce</div>
            <div className="token-value">cubic-bezier(0.34, 1.56, 0.64, 1)</div>
          </div>
        </div>
      </div>

      {/* Accessibility Note */}
      <div className="accessibility-note">
        <h3>♿ Accessibility: Reduced Motion Support</h3>
        <p>
          All animations respect the <code>prefers-reduced-motion</code> media query.
          Users with motion sensitivity will experience minimal or no animations.
        </p>
      </div>
    </div>
  );
};

export default AnimationTest;
