export default function NumberPad({ value, onChange, onSubmit, max = 100 }) {
  const append = (d) => {
    const n = parseInt((value || '') + d, 10);
    if (!isNaN(n) && n <= max) onChange(String(n));
  };
  const clear = () => onChange('');
  const del   = () => onChange(value.slice(0, -1));

  return (
    <div className="npd-wrap">
      {/* Display */}
      <div className="npd-display">
        <span className={`npd-value ${value ? '' : 'placeholder'}`}>
          {value || '?'}
        </span>
      </div>

      {/* Keys */}
      <div className="npd-grid">
        {[1,2,3,4,5,6,7,8,9].map(d => (
          <button key={d} className="npd-key" onClick={() => append(String(d))}>
            {d}
          </button>
        ))}
        <button className="npd-key npd-clear" onClick={clear}>C</button>
        <button className="npd-key" onClick={() => append('0')}>0</button>
        <button className="npd-key npd-del" onClick={del}>⌫</button>
      </div>

      {/* Submit */}
      <button
        className="npd-submit"
        onClick={onSubmit}
        disabled={!value}
      >
        ✓ Check Answer
      </button>
    </div>
  );
}
