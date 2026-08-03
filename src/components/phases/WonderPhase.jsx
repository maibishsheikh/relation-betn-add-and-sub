import { useState, useEffect, useCallback } from 'react';
import './WonderPhase.css';
import Mascot from '../shared/Mascot.jsx';
import { narrate } from '../../utils/audio.js';
import { wonderNarration } from '../../utils/narration.js';

const WONDER_QUESTIONS = [
  {
    question: "Alex has 83 stickers and gives some to Emma. He has 48 left. How many did he give away?",
    subtext: "What if knowing an addition fact could instantly solve this subtraction?",
    emoji: "🏷️",
    bgEmojis: ["🏷️", "➖", "🔢", "✨"],
  },
  {
    question: "If 35 + 48 = 83, can you instantly find what 83 − 35 equals — without counting?",
    subtext: "Addition and subtraction are secret partners — they share the same three numbers!",
    emoji: "🔗",
    bgEmojis: ["➕", "➖", "🔗", "💡"],
  },
  {
    question: "Sam scores 63 points in a game. He loses some points. He now has 27. How many did he lose?",
    subtext: "There's a triangle trick that unlocks the answer instantly!",
    emoji: "🎮",
    bgEmojis: ["🎮", "🔢", "🔺", "✨"],
  },
  {
    question: "How can knowing 27 + 36 = 63 help you solve 63 − 27 without working it out again?",
    subtext: "Fact families are like magic — one triangle gives you four number sentences!",
    emoji: "🔺",
    bgEmojis: ["🔺", "➕", "➖", "🎯"],
  },
];

export default function WonderPhase({ onComplete, audioEnabled }) {
  const [wonderIdx] = useState(() => Math.floor(Math.random() * WONDER_QUESTIONS.length));
  const wonder = WONDER_QUESTIONS[wonderIdx];
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const p = Array.from({ length: 16 }, (_, i) => ({
      id: i,
      emoji: wonder.bgEmojis[i % wonder.bgEmojis.length],
      x: (i * 6.2) % 90 + 5,
      y: (i * 5.8) % 80 + 10,
      delay: i * 0.5,
      size: 1 + (i % 3) * 0.4,
    }));
    setParticles(p);
  }, [wonder]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (audioEnabled) narrate(wonderNarration(wonderIdx));
    }, 600);
    return () => clearTimeout(t);
  }, [audioEnabled, wonderIdx]);

  const handleDiscover = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <div className="wonder-wrap">
      {/* Floating background particles */}
      <div className="wonder-particles" aria-hidden="true">
        {particles.map(p => (
          <span key={p.id} className="wonder-particle" style={{
            left: `${p.x}%`, top: `${p.y}%`,
            animationDelay: `${p.delay}s`,
            fontSize: `${p.size}rem`,
          }}>{p.emoji}</span>
        ))}
      </div>

      <div className="wonder-content anim-slide-up">
        <div className="wonder-card glass-card">
          <div className="wonder-stadium-icon" aria-hidden="true">{wonder.emoji}</div>
          <h1 className="wonder-title headline">The Subtraction Mystery!</h1>

          <div className="wonder-question-card">
            <p className="wonder-q">{wonder.question}</p>
            <p className="wonder-subtext">{wonder.subtext}</p>
          </div>

          {/* Mascot */}
          <div className="wonder-mascot-row">
            <Mascot mood="thinking" message="Hmm... I wonder... 🤔" size="sm" />
          </div>

          <button className="btn-primary wonder-cta" onClick={handleDiscover} id="discover-btn">
            ✨ Let's Discover! ✨
          </button>
        </div>
      </div>
    </div>
  );
}
