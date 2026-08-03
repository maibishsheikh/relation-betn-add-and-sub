import { useState, useEffect, useCallback } from 'react';
import './StoryPhase.css';
import Mascot from '../shared/Mascot.jsx';
import { STORY_SLIDES } from '../../data/storyPanels.js';
import { narrate, stopNarration } from '../../utils/audio.js';
import { storyNarration } from '../../utils/narration.js';

export default function StoryPhase({ onComplete, audioEnabled }) {
  const [slide, setSlide] = useState(0);

  const s = STORY_SLIDES[slide];
  const isLast = slide === STORY_SLIDES.length - 1;

  useEffect(() => {
    if (audioEnabled) {
      stopNarration();
      narrate(storyNarration(slide));
    }
    return () => stopNarration();
  }, [slide, audioEnabled]);

  const goNext = useCallback(() => {
    if (isLast) {
      onComplete();
    } else {
      setSlide(i => i + 1);
    }
  }, [isLast, onComplete]);

  const goPrev = useCallback(() => {
    if (slide === 0) return;
    setSlide(i => i - 1);
  }, [slide]);

  return (
    <div className="story-wrap">
      <div className="story-card glass-card anim-slide-up" key={slide}>
        {/* Header */}
        <div className="story-header">
          <span className="story-phase-label">📖 Fact Family Mystery</span>
          <div className="story-dots">
            {STORY_SLIDES.map((_, i) => (
              <span key={i} className={`story-dot ${i === slide ? 'active' : ''} ${i < slide ? 'done' : ''}`} />
            ))}
          </div>
          <span className="story-counter">{slide + 1} / {STORY_SLIDES.length}</span>
        </div>

        {/* Content: image + text */}
        <div className="story-body">
          <div className="story-image-col">
            <div className="story-image-box">
              <img
                src={s.image}
                alt={s.title}
                className="story-image"
                onError={e => {
                  e.target.style.display = 'none';
                  e.target.parentElement.style.background = 'rgba(99,102,241,0.15)';
                  e.target.parentElement.innerHTML =
                    `<div style="font-size:4rem;display:flex;align-items:center;justify-content:center;height:100%">🏫</div>`;
                }}
              />
            </div>
          </div>
          
          <div className="story-text-col">
            <h2 className="story-panel-title subheadline">{s.title}</h2>
            <p className="story-panel-text body-text">{s.text}</p>
            {s.highlight && (
              <div className="story-highlight-box">
                ✨ {s.highlight} ✨
              </div>
            )}
            <div className="story-mascot-row">
              <Mascot mood={isLast ? 'celebrating' : 'happy'} message={s.mascotText} size="sm" />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="story-nav">
          <button
            className="btn-outline"
            onClick={goPrev}
            disabled={slide === 0}
            aria-label="Previous panel"
          >
            ← Previous
          </button>
          <button
            className={isLast ? 'btn-green' : 'btn-primary'}
            onClick={goNext}
            aria-label="Next panel"
          >
            {isLast ? "🚀 Let's Explore!" : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}
