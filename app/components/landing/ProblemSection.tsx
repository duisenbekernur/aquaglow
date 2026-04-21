import {PROBLEM_POINTS} from '~/constants/content';

export function ProblemSection() {
  return (
    <section className="section section--muted" aria-labelledby="problem-h">
      <div className="section__inner">
        <h2 id="problem-h" className="section__title">
          Hard water is rough on hair & skin
        </h2>
        <div className="card-grid card-grid--2">
          {PROBLEM_POINTS.map((p) => (
            <article key={p.title} className="card">
              <h3 className="card__title">{p.title}</h3>
              <p className="card__body muted">{p.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
