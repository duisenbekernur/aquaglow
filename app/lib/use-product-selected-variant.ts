import {useMemo} from 'react';
import {useLocation, useNavigation} from 'react-router';
import type {ProductFragment} from 'storefrontapi.generated';

/** Same keys as `load-product-by-request.ts` — ignore in URL when resolving variant. */
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

function paramValue(params: URLSearchParams, optionName: string): string | null {
  const want = optionName.toLowerCase();
  for (const [key, value] of params) {
    if (key.toLowerCase() === want) return value;
  }
  return null;
}

/**
 * Picks the variant whose `selectedOptions` all match the current URL search.
 * Case-insensitive **param names** (Shopify vs. browser quirks). Values are compared as returned by the URL.
 */
type VariantNode = ProductFragment['variants']['nodes'][number];

export function findVariantFromSearchString(
  variants: readonly VariantNode[] | null | undefined,
  search: string,
): ProductFragment['selectedOrFirstAvailableVariant'] | undefined {
  const params = new URLSearchParams(search);
  const relevantKeys = [...params.keys()].filter(
    (k) => !NON_OPTION_QUERY_KEYS.has(k.toLowerCase()),
  );
  if (relevantKeys.length === 0) return undefined;

  return variants?.find((v) => {
    const opts = v?.selectedOptions;
    if (!opts?.length) return false;
    return opts.every((opt) => {
      const fromUrl = paramValue(params, opt.name);
      return fromUrl === opt.value;
    });
  });
}

export type SelectedVariant = ProductFragment['selectedOrFirstAvailableVariant'];

/**
 * Resolves selected variant from URL during client navigation so UI matches
 * `?Option=value` before the loader finishes (Hydrogen `useOptimisticVariant`
 * can miss a match when param casing or timing differs).
 */
export function useProductSelectedVariant(
  product: ProductFragment | null | undefined,
): SelectedVariant | undefined {
  const navigation = useNavigation();
  const location = useLocation();
  const search =
    navigation.state === 'loading'
      ? navigation.location.search
      : location.search;

  return useMemo(() => {
    if (!product) return undefined;
    const fromUrl = findVariantFromSearchString(
      product.variants?.nodes,
      search,
    );
    return (
      fromUrl ??
      product.selectedOrFirstAvailableVariant ??
      undefined
    );
  }, [product, search]);
}

/** PDP / table: treat as purchasable when Shopify marks available or quantity is positive. */
export function variantIsOfferedForSale(variant: {
  availableForSale?: boolean | null;
  quantityAvailable?: number | null;
}): boolean {
  if (variant.availableForSale) return true;
  const q = variant.quantityAvailable;
  return q != null && q > 0;
}
