import {Link} from 'react-router';
import {FINAL_CTA} from '~/constants/content';

type Props = {productPath: string};

export function FinalCTA({productPath}: Props) {
  return (
    <section className="section final-cta" aria-labelledby="final-cta-h">
      <div className="section__inner section__inner--narrow final-cta__inner">
        <h2 id="final-cta-h" className="final-cta__title">
          {FINAL_CTA.headline}
        </h2>
        <p className="final-cta__sub muted">{FINAL_CTA.subheadline}</p>
        <Link className="btn btn--primary btn--large" to={productPath}>
          {FINAL_CTA.cta}
        </Link>
      </div>
    </section>
  );
}
