import {useLoaderData} from 'react-router';
import type {Route} from './+types/products.$handle';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
  Money,
} from '@shopify/hydrogen';
import {ProductForm} from '~/components/ProductForm';
import {ProductGallery} from '~/components/ProductGallery';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {PRODUCT_QUERY} from '~/lib/product-storefront';
import {TrustBadges} from '~/components/TrustBadges';
import {ReviewGrid} from '~/components/landing/ReviewGrid';
import {FAQAccordion} from '~/components/landing/FAQAccordion';
import {productJsonLd, productMetaTags, siteTitle} from '~/seo/document';
import {StickyMobilePurchase} from '~/components/StickyMobilePurchase';

export const meta: Route.MetaFunction = ({data}) => {
  if (!data?.product || !data.requestUrl) {
    return [{title: siteTitle('Product')}];
  }
  const v = data.product.selectedOrFirstAvailableVariant;
  return [
    ...productMetaTags({
      requestUrl: data.requestUrl,
      product: {
        title: data.product.seo?.title ?? data.product.title,
        description: data.product.seo?.description ?? data.product.description,
        handle: data.product.handle,
        featuredImageUrl: v?.image?.url ?? null,
        priceAmount: v?.price?.amount,
        currencyCode: v?.price?.currencyCode,
        availability: v?.availableForSale ? 'InStock' : 'OutOfStock',
      },
    }),
  ];
};

export async function loader({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {
        handle,
        selectedOptions: getSelectedProductOptions(request),
      },
    }),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {product, requestUrl: request.url};
}

export default function Product() {
  const {product, requestUrl} = useLoaderData<typeof loader>();

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant?.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const galleryNodes = (product.images?.nodes ?? []).map((img) => ({
    ...img,
    __typename: 'Image' as const,
  }));

  const jsonLd = productJsonLd({
    requestUrl,
    product: {
      title: product.title,
      description: product.description,
      handle: product.handle,
      featuredImageUrl: selectedVariant?.image?.url ?? null,
      priceAmount: selectedVariant?.price?.amount,
      currencyCode: selectedVariant?.price?.currencyCode,
      availability: selectedVariant?.availableForSale
        ? 'InStock'
        : 'OutOfStock',
    },
  });

  return (
    <div className="product-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />
      <section className="product-page__grid" aria-labelledby="product-title">
        <ProductGallery
          productTitle={product.title}
          featured={selectedVariant?.image}
          gallery={galleryNodes}
        />
        <div className="product-page__detail">
          <h1 id="product-title" className="product-page__title">
            {product.title}
          </h1>
          <div className="product-page__price-row">
            {selectedVariant?.price ? (
              <span className="product-page__price">
                <Money data={selectedVariant.price} />
              </span>
            ) : null}
            {selectedVariant?.compareAtPrice &&
            selectedVariant?.price &&
            Number(selectedVariant.compareAtPrice.amount) >
              Number(selectedVariant.price.amount) ? (
              <span className="product-page__compare">
                <Money data={selectedVariant.compareAtPrice} />
              </span>
            ) : null}
          </div>
          <TrustBadges />
          <ProductForm
            productOptions={productOptions}
            selectedVariant={selectedVariant}
          />
          {product.descriptionHtml ? (
            <div
              className="product-page__description rte"
              dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
            />
          ) : null}
        </div>
      </section>

      <div className="product-page__below">
        <ReviewGrid />
        <FAQAccordion />
      </div>

      <StickyMobilePurchase
        title={product.title}
        price={selectedVariant?.price}
        compareAtPrice={selectedVariant?.compareAtPrice}
        available={selectedVariant?.availableForSale ?? false}
      />

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}
