import {useOptimisticCart} from '@shopify/hydrogen';
import {Link, useRouteLoaderData} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem, type CartLine} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import type {RootLoader} from '~/root';
import {uiT} from '~/lib/ui-i18n';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export type LineItemChildrenMap = {[parentId: string]: CartLine[]};
/** Returns a map of all line items and their children. */
function getLineItemChildrenMap(lines: CartLine[]): LineItemChildrenMap {
  const children: LineItemChildrenMap = {};
  for (const line of lines) {
    if ('parentRelationship' in line && line.parentRelationship?.parent) {
      const parentId = line.parentRelationship.parent.id;
      if (!children[parentId]) children[parentId] = [];
      children[parentId].push(line);
    }
    if ('lineComponents' in line) {
      const nested = getLineItemChildrenMap(line.lineComponents);
      for (const [parentId, childIds] of Object.entries(nested)) {
        if (!children[parentId]) children[parentId] = [];
        children[parentId].push(...childIds);
      }
    }
  }
  return children;
}

/**
 * Cart line items + summary. Used on `/cart` and in the cart drawer.
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);

  const sectionClass = [
    'cart-main',
    `cart-main--${layout}`,
    withDiscount ? 'with-discount' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section
      className={sectionClass}
      aria-label={layout === 'page' ? 'Cart page' : 'Cart drawer'}
    >
      <CartEmpty hidden={linesCount} />
      <div className={`cart-shell cart-shell--${layout}`}>
        <div className="cart-shell__lines">
          <p id="cart-lines" className="sr-only">
            Line items
          </p>
          <ul aria-labelledby="cart-lines">
            {(cart?.lines?.nodes ?? []).map((line) => {
              if (
                'parentRelationship' in line &&
                line.parentRelationship?.parent
              ) {
                return null;
              }
              return (
                <CartLineItem
                  key={line.id}
                  line={line}
                  layout={layout}
                  childrenMap={childrenMap}
                />
              );
            })}
          </ul>
        </div>
        {cartHasItems ? (
          <div
            className={
              layout === 'aside'
                ? 'cart-shell__summary cart-shell__summary--aside'
                : 'cart-shell__summary'
            }
          >
            <CartSummary cart={cart} layout={layout} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function CartEmpty({hidden = false}: {hidden: boolean}) {
  const {close} = useAside();
  const root = useRouteLoaderData<RootLoader>('root');
  const lang = root?.language ?? 'EN';

  return (
    <div hidden={hidden} className="cart-empty-funnel">
      <p>{uiT(lang, 'cartEmptyMessage')}</p>
      <Link to="/" onClick={close} prefetch="viewport">
        {uiT(lang, 'cartContinueShopping')}
      </Link>
    </div>
  );
}
