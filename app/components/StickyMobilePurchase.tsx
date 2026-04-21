import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {useRouteLoaderData} from 'react-router';
import {IconBagCheckout} from '~/components/icons';
import type {RootLoader} from '~/root';
import {uiT} from '~/lib/ui-i18n';

type Props = {
  title: string;
  price?: Pick<MoneyV2, 'amount' | 'currencyCode'> | null;
  compareAtPrice?: Pick<MoneyV2, 'amount' | 'currencyCode'> | null;
  available: boolean;
};

/**
 * Fixed bottom bar on small screens — scrolls user to the purchase panel.
 */
export function StickyMobilePurchase({
  title,
  price,
  compareAtPrice,
  available,
}: Props) {
  const root = useRouteLoaderData<RootLoader>('root');
  const lang = root?.language ?? 'EN';

  return (
    <div className="sticky-purchase" role="region" aria-label="Quick purchase">
      <div className="sticky-purchase__inner">
        <div className="sticky-purchase__copy">
          <span className="sticky-purchase__title">{title}</span>
          <span className="sticky-purchase__prices">
            {price ? <Money data={price} /> : null}
            {compareAtPrice &&
            price &&
            Number(compareAtPrice.amount) > Number(price.amount) ? (
              <span className="sticky-purchase__compare">
                <Money data={compareAtPrice} />
              </span>
            ) : null}
          </span>
        </div>
        <a
          href="#purchase"
          className="btn btn--primary sticky-purchase__cta btn--with-icon"
          aria-disabled={!available}
        >
          <IconBagCheckout size={20} />
          <span>
            {available ? uiT(lang, 'stickyShop') : uiT(lang, 'unavailable')}
          </span>
        </a>
      </div>
    </div>
  );
}
