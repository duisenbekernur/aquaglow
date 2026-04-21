import {REVIEW_SUMMARY, REVIEWS} from '~/constants/content';

export function ReviewGrid() {
  return (
    <section className="section section--muted" aria-labelledby="reviews-h">
      <div className="section__inner">
        <h2 id="reviews-h" className="section__title">
          Loved across Germany & Spain
        </h2>
        <p className="review-summary">
          <span className="review-summary__score">{REVIEW_SUMMARY.rating}</span>
          <span aria-hidden="true"> / 5 </span>
          <span className="muted">
            average rating from {REVIEW_SUMMARY.countLabel}
          </span>
        </p>
        <div className="review-grid">
          {REVIEWS.map((r) => (
            <figure key={r.name + r.location} className="review-card">
              <div className="review-card__stars" aria-label={`${r.stars} out of 5 stars`}>
                {'★'.repeat(r.stars)}
                {'☆'.repeat(5 - r.stars)}
              </div>
              <blockquote className="review-card__quote">“{r.quote}”</blockquote>
              <figcaption className="review-card__meta">
                <strong>{r.name}</strong>
                <span className="muted"> · {r.location}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
