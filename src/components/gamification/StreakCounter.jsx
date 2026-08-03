import React from 'react';

export default function StreakCounter({ streak = 0 }) {
  if (streak === 0) return null;
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 4,
        background: streak >= 5 ? 'rgba(255,112,0,0.2)' : 'rgba(255,255,255,0.08)',
        border: `1px solid ${streak >= 5 ? 'rgba(255,112,0,0.5)' : 'rgba(255,255,255,0.12)'}`,
        borderRadius: '999px', padding: '4px 10px',
        animation: streak >= 5 ? 'pulseGlow 1.5s ease infinite' : 'none',
      }}
      aria-label={`Streak: ${streak}`}
    >
      <span style={{ fontSize: 'clamp(1rem,1.3vw,1.3rem)' }} aria-hidden="true">🔥</span>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(0.85rem,1vw,1rem)', color: streak >= 5 ? '#FF7000' : 'var(--text-primary)' }}>
        {streak}
      </span>
    </div>
  );
}
