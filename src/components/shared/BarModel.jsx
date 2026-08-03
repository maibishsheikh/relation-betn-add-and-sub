export default function BarModel({ whole, part1, part2, missing = null }) {
  const tw  = 280;
  const p1w = whole > 0 ? Math.max(20, Math.min(260, Math.round((part1 / whole) * tw))) : 140;
  const p2w = tw - p1w;

  const boxFill   = (slot) => (missing === slot ? '#FEF9E7' : slot === 'part1' ? '#1A5EAB' : '#F5A623');
  const boxStroke = (slot) => (missing === slot ? '#F5A623' : slot === 'part1' ? '#0D3B6E' : '#C17B05');
  const textFill  = (slot) => (missing === slot ? '#85929E' : slot === 'part1' ? '#fff'    : '#0D3B6E');
  const label     = (slot) => (missing === slot ? '?'       : slot === 'part1' ? part1      : part2);

  return (
    <svg viewBox="0 0 320 82" width="100%" style={{ maxWidth: 320 }} aria-label="Bar model">
      {/* Whole label */}
      <text x="160" y="16" textAnchor="middle" fill="#0D3B6E" fontSize="14" fontWeight="bold">
        {missing === 'whole' ? '?' : whole}
      </text>

      {/* Part 1 bar */}
      <rect
        x="20" y="22" width={p1w} height="38"
        fill={boxFill('part1')} stroke={boxStroke('part1')}
        strokeWidth="2" rx="4"
        strokeDasharray={missing === 'part1' ? '6,3' : '0'}
      />
      <text x={20 + p1w / 2} y="45" textAnchor="middle" fill={textFill('part1')} fontSize="14" fontWeight="bold">
        {label('part1')}
      </text>

      {/* Part 2 bar */}
      <rect
        x={20 + p1w} y="22" width={p2w} height="38"
        fill={boxFill('part2')} stroke={boxStroke('part2')}
        strokeWidth="2" rx="4"
        strokeDasharray={missing === 'part2' ? '6,3' : '0'}
      />
      <text x={20 + p1w + p2w / 2} y="45" textAnchor="middle" fill={textFill('part2')} fontSize="14" fontWeight="bold">
        {label('part2')}
      </text>
    </svg>
  );
}
