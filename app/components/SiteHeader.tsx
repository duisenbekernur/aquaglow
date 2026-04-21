import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {useOptimisticCart} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {BRAND_NAME} from '~/constants/brand';
import {LanguageSelector} from '~/components/LanguageSelector';
import {IconCart} from '~/components/icons';
import type {StoreLanguage} from '~/lib/localization';
import {uiT} from '~/lib/ui-i18n';

type Props = {
  cart: Promise<CartApiQueryFragment | null>;
  language: StoreLanguage;
};

export function SiteHeader({cart, language}: Props) {
  return (
    <header className="site-header">
      <NavLink to="/" className="site-header__brand" prefetch="intent" end>
        {BRAND_NAME}
      </NavLink>
      <div className="site-header__actions">
        <span className="site-header__currency-pill" title="All prices in USD">
          {uiT(language, 'usdOnly')}
        </span>
        <LanguageSelector current={language} />
        <NavLink
          to="/cart"
          className="site-header__cart-link"
          prefetch="intent"
          aria-label={uiT(language, 'yourCart')}
        >
          <Suspense
            fallback={
              <span className="site-header__cart-icon-wrap">
                <IconCart />
              </span>
            }
          >
            <Await resolve={cart}>
              <CartIconWithBadge />
            </Await>
          </Suspense>
        </NavLink>
      </div>
    </header>
  );
}

function CartIconWithBadge() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  const count = cart?.totalQuantity ?? 0;
  return (
    <span className="site-header__cart-icon-wrap">
      <IconCart />
      {count > 0 ? (
        <span className="site-header__cart-badge" aria-label={`${count} items`}>
          {count > 99 ? '99+' : count}
        </span>
      ) : null}
    </span>
  );
}
