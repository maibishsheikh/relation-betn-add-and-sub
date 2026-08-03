import { useRef, useCallback } from 'react';

// Sound effects map → public/assets/audio/
const SFX = {
  correct:       '/assets/audio/correct.mp3',
  wrong:         '/assets/audio/wrong.mp3',
  badge:         '/assets/audio/badge.mp3',
  worldComplete: '/assets/audio/world_complete.mp3',
  phaseComplete: '/assets/audio/phase_complete.mp3',
  click:         '/assets/audio/click.mp3',
};

export function useAudio() {
  const cache = useRef({});

  const play = useCallback((key) => {
    try {
      const src = SFX[key];
      if (!src) return;
      if (!cache.current[key]) {
        const audio = new Audio(src);
        audio.preload = 'auto';
        cache.current[key] = audio;
      }
      const a = cache.current[key];
      a.currentTime = 0;
      a.play().catch(() => {
        // Browser may block autoplay before user gesture — silently ignore
      });
    } catch (_) {
      // Audio unavailable — silently skip
    }
  }, []);

  return { play };
}
