import React from 'react';

export default function StarRating({ stars = 0, size = 'md' }) {
  const fontSize = size === 'sm' ? '0.9rem' : size === 'lg' ? '1.8rem' : '1.3rem';
  return (
    <div style={{ display: 'flex', gap: 2 }} aria-label={`${stars} out of 3 stars`}>
      {[1, 2, 3].map(i => (
        <span key={i} style={{ fontSize, opacity: i <= stars ? 1 : 0.2 }} aria-hidden="true">⭐</span>
      ))}
    </div>
  );
}
