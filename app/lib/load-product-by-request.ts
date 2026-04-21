import {getSelectedProductOptions} from '@shopify/hydrogen';
import {PRODUCT_QUERY} from '~/lib/product-storefront';
import type {ProductFragment} from 'storefrontapi.generated';

/**
 * Keys that appear on Shopify Online Store / marketing URLs but are not
 * product option names. Passing them as SelectedOptionInput breaks
 * selectedOrFirstAvailableVariant (e.g. ?variant=123&currency=USD).
 */
const NON_OPTION_QUERY_KEYS = new Set(
  [
    'variant',
    'currency',
    'country',
    'locale',
    'section_id',
    'recipient',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'gclid',
    'fbclid',
    'msclkid',
    'twclid',
    'ref',
  ].map((k) => k.toLowerCase()),
);

export function getProductSelectedOptionsFromRequest(request: Request) {
  return getSelectedProductOptions(request).filter(
    (o) => !NON_OPTION_QUERY_KEYS.has(o.name.toLowerCase()),
  );
}

function legacyShopifyVariantId(request: Request): string | null {
  const raw = new URL(request.url).searchParams.get('variant');
  if (!raw || !/^\d+$/.test(raw.trim())) return null;
  return raw.trim();
}

/**
 * Loads product with correct variant when the URL uses legacy ?variant=123
 * (Shopify theme links). Hydrogen's getSelectedProductOptions maps every
 * search param to "options", which is invalid for the Storefront API.
 */
export async function loadProductByHandle(
  storefront: {
    query: (
      document: typeof PRODUCT_QUERY,
      opts: {
        variables: {
          handle: string;
          selectedOptions: Array<{name: string; value: string}>;
        };
      },
    ) => Promise<{product?: ProductFragment | null}>;
  },
  handle: string,
  request: Request,
): Promise<{product: ProductFragment | null}> {
  const legacyId = legacyShopifyVariantId(request);
  const selectedOptions = legacyId
    ? []
    : getProductSelectedOptionsFromRequest(request);

  const {product: first} = await storefront.query(PRODUCT_QUERY, {
    variables: {handle, selectedOptions},
  });

  if (!first?.id) {
    return {product: null};
  }

  if (!legacyId) {
    return {product: first};
  }

  const gid = `gid://shopify/ProductVariant/${legacyId}`;
  if (first.selectedOrFirstAvailableVariant?.id === gid) {
    return {product: first};
  }

  const match = first.variants?.nodes?.find(
    (node) => node.id === gid || node.id.endsWith(legacyId),
  );
  if (!match?.selectedOptions?.length) {
    return {product: first};
  }

  const {product: resolved} = await storefront.query(PRODUCT_QUERY, {
    variables: {
      handle,
      selectedOptions: match.selectedOptions.map((o) => ({
        name: o.name,
        value: o.value,
      })),
    },
  });

  return {product: resolved?.id ? resolved : first};
}
