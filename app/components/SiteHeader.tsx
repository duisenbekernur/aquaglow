import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {useOptimisticCart} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {BRAND_NAME} from '~/constants/brand';
import {CurrencySelector} from '~/components/CurrencySelector';

type Props = {
  cart: Promise<CartApiQueryFragment | null>;
  buyerCountry: string;
};

export function SiteHeader({cart, buyerCountry}: Props) {
  return (
    <header className="site-header">
      <NavLink to="/" className="site-header__brand" prefetch="intent" end>
        {BRAND_NAME}
      </NavLink>
      <div className="site-header__actions">
        <CurrencySelector currentCountry={buyerCountry} />
        <NavLink to="/cart" className="site-header__cart-link" prefetch="intent">
          <Suspense fallback={<span className="site-header__cart">Cart</span>}>
            <Await resolve={cart}>
              <CartLabel />
            </Await>
          </Suspense>
        </NavLink>
      </div>
    </header>
  );
}

function CartLabel() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  const count = cart?.totalQuantity ?? 0;
  return (
    <span className="site-header__cart" aria-live="polite">
      Cart{count > 0 ? ` (${count})` : ''}
    </span>
  );
}
