import {WHY_IT_WORKS} from '~/constants/content';

export function WhyItWorks() {
  return (
    <section className="section section--split" aria-labelledby="why-h">
      <div className="section__inner section__inner--split">
        <div>
          <h2 id="why-h" className="section__title">
            {WHY_IT_WORKS.title}
          </h2>
          {WHY_IT_WORKS.paragraphs.map((p) => (
            <p key={p} className="section__prose muted">
              {p}
            </p>
          ))}
        </div>
        <div className="why-visual" aria-hidden="true">
          <div className="why-visual__ring" />
          <div className="why-visual__core">H₂O</div>
        </div>
      </div>
    </section>
  );
}
