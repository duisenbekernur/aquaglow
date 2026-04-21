import {Link, useLocation, useRouteLoaderData} from 'react-router';
import {Money} from '@shopify/hydrogen';
import type {ProductFragment} from 'storefrontapi.generated';
import {getVariantUrl} from '~/lib/variants';
import type {RootLoader} from '~/root';
import {uiT} from '~/lib/ui-i18n';

type Props = {
  product: ProductFragment;
  selectedVariantId?: string | null;
};

/**
 * Full variant list: title, USD price, compare-at, Shopify `quantityAvailable`, deep-link.
 */
export function VariantBreakdown({product, selectedVariantId}: Props) {
  const location = useLocation();
  const root = useRouteLoaderData<RootLoader>('root');
  const lang = root?.language ?? 'EN';
  const nodes = product.variants?.nodes ?? [];

  if (nodes.length === 0) return null;

  return (
    <section className="variant-breakdown" aria-labelledby="variant-breakdown-h">
      <h2 id="variant-breakdown-h" className="variant-breakdown__title">
        {uiT(lang, 'allVariants')}
      </h2>
      <div className="variant-breakdown__table-wrap">
        <table className="variant-breakdown__table">
          <thead>
            <tr>
              <th scope="col">Option</th>
              <th scope="col">Price</th>
              <th scope="col">Compare at</th>
              <th scope="col">{uiT(lang, 'variantStock')}</th>
              <th scope="col"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((variant) => {
              const to = getVariantUrl({
                handle: product.handle,
                pathname: location.pathname,
                searchParams: new URLSearchParams(),
                selectedOptions: variant.selectedOptions ?? [],
              });
              const selected =
                (selectedVariantId ?? product.selectedOrFirstAvailableVariant?.id) ===
                variant.id;
              const qty =
                variant.quantityAvailable == null
                  ? '—'
                  : String(variant.quantityAvailable);
              return (
                <tr
                  key={variant.id}
                  className={selected ? 'variant-breakdown__row--active' : undefined}
                >
                  <td>{variant.title}</td>
                  <td>
                    {variant.price ? <Money data={variant.price} /> : '—'}
                  </td>
                  <td>
                    {variant.compareAtPrice &&
                    variant.price &&
                    Number(variant.compareAtPrice.amount) >
                      Number(variant.price.amount) ? (
                      <span className="variant-breakdown__compare">
                        <Money data={variant.compareAtPrice} />
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>{qty}</td>
                  <td>
                    {variant.availableForSale ? (
                      <Link className="btn btn--ghost btn--small" to={to} replace>
                        {uiT(lang, 'variantSelect')}
                      </Link>
                    ) : (
                      <span className="muted">{uiT(lang, 'unavailable')}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
