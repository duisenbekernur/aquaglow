type Props = {items: string[]};

export function TrustStrip({items}: Props) {
  return (
    <ul className="trust-strip" aria-label="Trust highlights">
      {items.map((item) => (
        <li key={item} className="trust-strip__item">
          {item}
        </li>
      ))}
    </ul>
  );
}
