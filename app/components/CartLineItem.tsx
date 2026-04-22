import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout, LineItemChildrenMap} from '~/components/CartMain';
import {CartForm, Image, Money, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link, useRouteLoaderData} from 'react-router';
import {ProductPrice} from './ProductPrice';
import {useAside} from '~/components/Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {RootLoader} from '~/root';
import {uiT} from '~/lib/ui-i18n';

export type CartLine = OptimisticCartLine<CartApiQueryFragment>;

export function CartLineItem({
  layout,
  line,
  childrenMap,
}: {
  layout: CartLayout;
  line: CartLine;
  childrenMap: LineItemChildrenMap;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();
  const lineItemChildren = childrenMap[id];
  const childrenLabelId = `cart-line-children-${id}`;

  return (
    <li className="cart-line">
      <div className="cart-line-card">
        <div className="cart-line-inner">
          {image ? (
            <div className="cart-line__media">
              <Image
                alt={title}
                aspectRatio="1/1"
                data={image}
                height={120}
                loading="lazy"
                width={120}
              />
            </div>
          ) : (
            <div className="cart-line__media" aria-hidden />
          )}

          <div className="cart-line__body">
            <Link
              prefetch="intent"
              to={lineItemUrl}
              onClick={() => {
                if (layout === 'aside') {
                  close();
                }
              }}
            >
              <p className="cart-line__title">
                <strong>{product.title}</strong>
              </p>
            </Link>

            <div className="cart-line__pricing">
              <ProductPrice price={line?.cost?.totalAmount} />
            </div>

            <UnitEach line={line} />

            <ul className="cart-line__options">
              {selectedOptions.map((option) => (
                <li key={option.name}>
                  {option.name}: {option.value}
                </li>
              ))}
            </ul>

            <CartLineQuantity line={line} />
          </div>
        </div>

        {lineItemChildren ? (
          <div>
            <p id={childrenLabelId} className="sr-only">
              Bundled with {product.title}
            </p>
            <ul aria-labelledby={childrenLabelId} className="cart-line-children">
              {lineItemChildren.map((childLine) => (
                <CartLineItem
                  childrenMap={childrenMap}
                  key={childLine.id}
                  line={childLine}
                  layout={layout}
                />
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </li>
  );
}

function UnitEach({line}: {line: CartLine}) {
  const root = useRouteLoaderData<RootLoader>('root');
  const lang = root?.language ?? 'EN';
  const unit = line.cost?.amountPerQuantity;
  const qty = line.quantity ?? 0;
  if (qty <= 1 || !unit) return null;
  return (
    <p className="cart-line__unit muted">
      <Money data={unit} /> {uiT(lang, 'cartEach')}
    </p>
  );
}

function CartLineQuantity({line}: {line: CartLine}) {
  const root = useRouteLoaderData<RootLoader>('root');
  const lang = root?.language ?? 'EN';
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="cart-line-quantity">
      <span className="cart-line-quantity__label">{uiT(lang, 'quantity')}</span>
      <div className="cart-qty-pill">
        <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button
            aria-label="Decrease quantity"
            disabled={quantity <= 1 || !!isOptimistic}
            name="decrease-quantity"
            type="submit"
            value={prevQuantity}
          >
            −
          </button>
        </CartLineUpdateButton>
        <span className="cart-qty-pill__value" aria-live="polite">
          {quantity}
        </span>
        <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
          <button
            aria-label="Increase quantity"
            disabled={!!isOptimistic}
            name="increase-quantity"
            type="submit"
            value={nextQuantity}
          >
            +
          </button>
        </CartLineUpdateButton>
      </div>
      <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
    </div>
  );
}

function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  const root = useRouteLoaderData<RootLoader>('root');
  const lang = root?.language ?? 'EN';

  return (
    <CartForm
      fetcherKey={`remove-${lineIds.join('-')}`}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        className="cart-line-remove"
        disabled={disabled}
        type="submit"
      >
        {uiT(lang, 'cartRemoveLine')}
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const lineIds = lines.map((l) => l.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}
