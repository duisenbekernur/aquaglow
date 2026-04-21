import {useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {
  getSelectedProductOptions,
  useOptimisticVariant,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {DEFAULT_FEATURED_PRODUCT_HANDLE} from '~/constants/brand';
import {PRODUCT_QUERY} from '~/lib/product-storefront';
import {HeroSection} from '~/components/landing/HeroSection';
import {ProblemSection} from '~/components/landing/ProblemSection';
import {SolutionSection} from '~/components/landing/SolutionSection';
import {BenefitsGrid} from '~/components/landing/BenefitsGrid';
import {ComparisonTable} from '~/components/landing/ComparisonTable';
import {WhyItWorks} from '~/components/landing/WhyItWorks';
import {ReviewGrid} from '~/components/landing/ReviewGrid';
import {FAQAccordion} from '~/components/landing/FAQAccordion';
import {FinalCTA} from '~/components/landing/FinalCTA';
import {homeMetaTags, siteTitle} from '~/seo/document';

export const meta: Route.MetaFunction = ({data}) => {
  if (!data?.requestUrl) {
    return [{title: siteTitle()}];
  }
  return homeMetaTags({
    requestUrl: data.requestUrl,
    description:
      'Stop hair damage from hard water in days. AquaGlow filters chlorine, rust and minerals for softer hair and clearer skin — free shipping & 30-day guarantee.',
  });
};

export async function loader({context, request}: Route.LoaderArgs) {
  const handle =
    context.env.PUBLIC_FEATURED_PRODUCT_HANDLE?.trim() ||
    DEFAULT_FEATURED_PRODUCT_HANDLE;

  const {product} = await context.storefront.query(PRODUCT_QUERY, {
    variables: {
      handle,
      selectedOptions: getSelectedProductOptions(request),
    },
  });

  if (!product?.id) {
    return {
      product: null,
      handle,
      requestUrl: request.url,
    };
  }

  return {
    product,
    handle,
    requestUrl: request.url,
  };
}

export default function LandingPage() {
  const data = useLoaderData<typeof loader>();
  const product = data.product;

  const selectedVariant = useOptimisticVariant(
    product?.selectedOrFirstAvailableVariant,
    product ? getAdjacentAndFirstAvailableVariants(product) : [],
  );

  useSelectedOptionInUrlParam(selectedVariant?.selectedOptions);

  if (!product) {
    return (
      <div className="section">
        <div className="section__inner section__inner--narrow">
          <h1 className="section__title">Product not found</h1>
          <p className="muted">
            No product matched handle <code>{data.handle}</code>. Set{' '}
            <code>PUBLIC_FEATURED_PRODUCT_HANDLE</code> in your environment to
            your real Shopify handle, then restart the dev server.
          </p>
        </div>
      </div>
    );
  }

  const {handle} = data;
  const productPath = `/products/${product.handle ?? handle}`;

  return (
    <div className="landing">
      <HeroSection
        product={product}
        selectedVariant={selectedVariant}
        productPath={productPath}
      />
      <ProblemSection />
      <SolutionSection />
      <BenefitsGrid />
      <ComparisonTable />
      <WhyItWorks />
      <ReviewGrid />
      <FAQAccordion />
      <FinalCTA productPath={productPath} />
    </div>
  );
}
