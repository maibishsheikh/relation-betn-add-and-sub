export default function FactFamilyTriangle({ whole, part1, part2, missing = null, size = 160 }) {
  const h = Math.round((size * 200) / 220);

  const nodeStyle = (slot) => ({
    fill:              missing === slot ? '#FEF9E7' : slot === 'whole' ? '#1A5EAB' : slot === 'part1' ? '#F5A623' : '#27AE60',
    stroke:            missing === slot ? '#F5A623' : slot === 'whole' ? '#0D3B6E' : slot === 'part1' ? '#C17B05' : '#1A7A40',
    strokeWidth:       3,
    strokeDasharray:   missing === slot ? '7,3' : '0',
  });

  const textStyle = (slot) => ({
    fill:       missing === slot ? '#85929E' : slot === 'part1' ? '#0D3B6E' : '#fff',
    fontSize:   slot === 'whole' ? 17 : 15,
    fontWeight: 'bold',
  });

  const label = (slot) => (missing === slot ? '?' : slot === 'whole' ? whole : slot === 'part1' ? part1 : part2);

  return (
    <svg viewBox="0 0 220 200" width={size} height={h} aria-label="Fact family triangle">
      {/* Edges */}
      <line x1="83"  y1="58"  x2="52"  y2="112" stroke="#AED6F1" strokeWidth="2.5" />
      <line x1="137" y1="58"  x2="168" y2="112" stroke="#AED6F1" strokeWidth="2.5" />
      <line x1="68"  y1="157" x2="152" y2="157" stroke="#AED6F1" strokeWidth="2.5" />

      {/* Minus signs */}
      <text x="52"  y="96"  fill="#85929E" fontSize="14" textAnchor="middle">−</text>
      <text x="168" y="96"  fill="#85929E" fontSize="14" textAnchor="middle">−</text>

      {/* Fact label */}
      <text x="110" y="190" fill="#1A5EAB" fontSize="11" textAnchor="middle">
        {part1}+{part2}={whole}
      </text>

      {/* Whole (top) */}
      <circle cx="110" cy="33" r="28" {...nodeStyle('whole')} />
      <text x="110" y="39" textAnchor="middle" {...textStyle('whole')}>{label('whole')}</text>

      {/* Part 1 (bottom-left) */}
      <circle cx="42" cy="133" r="27" {...nodeStyle('part1')} />
      <text x="42" y="139" textAnchor="middle" {...textStyle('part1')}>{label('part1')}</text>

      {/* Part 2 (bottom-right) */}
      <circle cx="178" cy="133" r="27" {...nodeStyle('part2')} />
      <text x="178" y="139" textAnchor="middle" {...textStyle('part2')}>{label('part2')}</text>
    </svg>
  );
}
