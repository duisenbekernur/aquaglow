import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {ProductFragment} from 'storefrontapi.generated';
import {HERO_COPY} from '~/constants/content';
import {TrustStrip} from '~/components/TrustStrip';

type Props = {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
  productPath: string;
};

export function HeroSection({product, selectedVariant, productPath}: Props) {
  const image = selectedVariant?.image;
  const available = selectedVariant?.availableForSale ?? false;

  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero__grid">
        <div className="hero__copy">
          <p className="eyebrow">AquaGlow · filtered shower head</p>
          <h1 id="hero-heading" className="hero__title">
            {HERO_COPY.headline}
          </h1>
          <p className="hero__sub">{HERO_COPY.subheadline}</p>
          <ul className="hero__bullets">
            {HERO_COPY.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <div className="hero__price-row">
            {selectedVariant?.price ? (
              <span className="hero__price">
                <Money data={selectedVariant.price} />
              </span>
            ) : null}
            {selectedVariant?.compareAtPrice &&
            Number(selectedVariant.compareAtPrice.amount) >
              Number(selectedVariant.price.amount) ? (
              <span className="hero__compare">
                <Money data={selectedVariant.compareAtPrice} />
              </span>
            ) : null}
          </div>
          <div className="hero__ctas">
            <Link className="btn btn--primary btn--large" to={productPath}>
              {HERO_COPY.cta}
            </Link>
          </div>
          <TrustStrip items={[...HERO_COPY.trustStrip]} />
        </div>
        <div className="hero__media">
          {image ? (
            <Image
              data={image}
              sizes="(min-width: 960px) 520px, 100vw"
              loading="eager"
              className="hero__image"
              alt={image.altText ?? product.title}
            />
          ) : null}
        </div>
      </div>
      {!available ? (
        <p className="hero__note muted" role="status">
          This variant is currently unavailable — open the product page to pick
          another option.
        </p>
      ) : null}
    </section>
  );
}
