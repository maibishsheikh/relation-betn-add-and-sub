import React from 'react';
import './Mascot.css';

export default function Mascot({ mood = 'idle', message, size = 'md' }) {
  const emoji = {
    idle:        '🤖',
    happy:       '🤖',
    thinking:    '🤖',
    celebrating: '🤖',
    curious:     '🤖',
  }[mood] || '🤖';

  return (
    <div className={`mascot-wrap mascot-${size}`}>
      <div className={`mascot-avatar mascot-${mood}`}>
        <span role="img" aria-label="mascot robot">{emoji}</span>
      </div>
      {message && (
        <div className="mascot-bubble anim-bounce-in">
          <p className="mascot-msg">{message}</p>
        </div>
      )}
    </div>
  );
}
