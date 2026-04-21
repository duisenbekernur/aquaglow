import {BENEFIT_BLOCKS} from '~/constants/content';

const ICONS: Record<string, string> = {
  filtration: '◇',
  pressure: '◎',
  hair: '✦',
  install: '⌂',
};

export function BenefitsGrid() {
  return (
    <section className="section section--muted" aria-labelledby="benefits-h">
      <div className="section__inner">
        <h2 id="benefits-h" className="section__title">
          Why customers choose AquaGlow
        </h2>
        <div className="benefits-grid">
          {BENEFIT_BLOCKS.map((b) => (
            <article key={b.id} className="benefits-grid__item">
              <span className="benefits-grid__icon" aria-hidden="true">
                {ICONS[b.id] ?? '·'}
              </span>
              <h3 className="benefits-grid__title">{b.title}</h3>
              <p className="muted">{b.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
