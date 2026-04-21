import {SOLUTION_POINTS} from '~/constants/content';

export function SolutionSection() {
  return (
    <section className="section" aria-labelledby="solution-h">
      <div className="section__inner">
        <h2 id="solution-h" className="section__title">
          AquaGlow filters what your skin & hair feel first
        </h2>
        <div className="card-grid card-grid--2">
          {SOLUTION_POINTS.map((p) => (
            <article key={p.title} className="card card--border">
              <h3 className="card__title">{p.title}</h3>
              <p className="card__body muted">{p.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
