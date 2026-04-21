const SITE_NAME = 'AquaGlow';

export type SeoProduct = {
  title: string;
  description?: string | null;
  handle: string;
  featuredImageUrl?: string | null;
  priceAmount?: string;
  currencyCode?: string;
  availability?: 'InStock' | 'OutOfStock';
};

export function siteTitle(page?: string) {
  return page ? `${page} | ${SITE_NAME}` : `${SITE_NAME} | Filtered Shower Head`;
}

export function homeMetaTags(args: {requestUrl: string; description: string}) {
  const url = new URL(args.requestUrl);
  const canonical = `${url.origin}/`;
  return [
    {title: siteTitle()},
    {name: 'description', content: args.description},
    {property: 'og:title', content: siteTitle()},
    {property: 'og:description', content: args.description},
    {property: 'og:type', content: 'website'},
    {property: 'og:url', content: canonical},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: siteTitle()},
    {name: 'twitter:description', content: args.description},
    {tagName: 'link', rel: 'canonical', href: canonical},
  ];
}

export function productMetaTags(args: {
  requestUrl: string;
  product: SeoProduct;
}) {
  const url = new URL(args.requestUrl);
  const path = `/products/${args.product.handle}`;
  const canonical = `${url.origin}${path}`;
  const title = args.product.title;
  const description =
    args.product.description?.slice(0, 160) ??
    'AquaGlow filtered shower head — softer hair, clearer skin, stronger pressure.';
  const tags = [
    {title: siteTitle(title)},
    {name: 'description', content: description},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:type', content: 'product'},
    {property: 'og:url', content: canonical},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
    {tagName: 'link', rel: 'canonical', href: canonical},
  ];
  if (args.product.featuredImageUrl) {
    tags.push(
      {property: 'og:image', content: args.product.featuredImageUrl},
      {name: 'twitter:image', content: args.product.featuredImageUrl},
    );
  }
  return tags;
}

export function productJsonLd(args: {requestUrl: string; product: SeoProduct}) {
  const url = new URL(args.requestUrl);
  const productUrl = `${url.origin}/products/${args.product.handle}`;
  const availability =
    args.product.availability === 'OutOfStock'
      ? 'https://schema.org/OutOfStock'
      : 'https://schema.org/InStock';
  const offers =
    args.product.priceAmount && args.product.currencyCode
      ? {
          '@type': 'Offer',
          url: productUrl,
          priceCurrency: args.product.currencyCode,
          price: args.product.priceAmount,
          availability,
        }
      : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: args.product.title,
    description: args.product.description ?? undefined,
    image: args.product.featuredImageUrl ?? undefined,
    offers,
    sku: args.product.handle,
  };
}
