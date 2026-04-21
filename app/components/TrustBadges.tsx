const DEFAULTS = [
  {label: 'Secure checkout', detail: 'Encrypted checkout'},
  {label: 'Fast dispatch', detail: 'Tracked delivery'},
  {label: '30-day guarantee', detail: 'Risk-free trial'},
];

export function TrustBadges() {
  return (
    <ul className="trust-badges" aria-label="Purchase reassurance">
      {DEFAULTS.map((b) => (
        <li key={b.label} className="trust-badges__item">
          <strong>{b.label}</strong>
          <span className="muted">{b.detail}</span>
        </li>
      ))}
    </ul>
  );
}
