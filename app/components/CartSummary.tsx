import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {Money, type OptimisticCart} from '@shopify/hydrogen';
import {useId} from 'react';
import {useRouteLoaderData} from 'react-router';
import type {RootLoader} from '~/root';
import {uiT} from '~/lib/ui-i18n';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout: layoutProp}: CartSummaryProps) {
  const root = useRouteLoaderData<RootLoader>('root');
  const lang = root?.language ?? 'EN';
  const summaryId = useId();

  return (
    <div
      aria-labelledby={summaryId}
      className={`cart-summary-card${layoutProp === 'aside' ? ' cart-summary-card--aside' : ''}`}
    >
      <h4 id={summaryId}>{uiT(lang, 'cartOrderSummary')}</h4>
      <dl role="presentation" className="cart-subtotal">
        <dt>{uiT(lang, 'cartSubtotalLabel')}</dt>
        <dd>
          {cart?.cost?.subtotalAmount?.amount ? (
            <Money data={cart?.cost?.subtotalAmount} />
          ) : (
            '—'
          )}
        </dd>
      </dl>
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  const root = useRouteLoaderData<RootLoader>('root');
  const lang = root?.language ?? 'EN';

  if (!checkoutUrl) return null;

  return (
    <div className="cart-checkout-block">
      <a
        className="btn btn--primary cart-checkout-block__btn"
        href={checkoutUrl}
        rel="noreferrer"
        target="_self"
      >
        {uiT(lang, 'cartSecureCheckout')}
      </a>
      <p className="cart-checkout-block__hint muted">
        {uiT(lang, 'cartCheckoutHint')}
      </p>
    </div>
  );
}
