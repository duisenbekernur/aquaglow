import {useState} from 'react';
import {Link, useNavigate, useRouteLoaderData} from 'react-router';
import {type MappedProductOptions, CartForm, Money} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';
import type {RootLoader} from '~/root';
import {uiT} from '~/lib/ui-i18n';
import {variantIsOfferedForSale} from '~/lib/use-product-selected-variant';
import {IconBagCheckout, IconCart} from '~/components/icons';

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  const [quantity, setQuantity] = useState(1);
  const root = useRouteLoaderData<RootLoader>('root');
  const lang = root?.language ?? 'EN';

  const sellable = selectedVariant
    ? variantIsOfferedForSale(selectedVariant)
    : false;

  const lines =
    selectedVariant && sellable
      ? [
          {
            merchandiseId: selectedVariant.id,
            quantity,
            selectedVariant,
          },
        ]
      : [];

  const canPurchase = Boolean(selectedVariant?.id && sellable);

  return (
    <div className="product-form" id="purchase">
      {productOptions.map((option) => {
        if (option.optionValues.length === 1) return null;

        return (
          <div className="product-options" key={option.name}>
            <p className="product-options__label">{option.name}</p>
            <div className="product-options-grid">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                  variant,
                } = value;

                const price = variant?.price;
                const compare = variant?.compareAtPrice;
                const showCompare =
                  price &&
                  compare &&
                  Number(compare.amount) > Number(price.amount);
                const meta = (
                  <div className="product-options-item__meta">
                    {price ? (
                      <span className="product-options-item__price">
                        <Money data={price} />
                      </span>
                    ) : null}
                    {showCompare ? (
                      <span className="product-options-item__compare">
                        <Money data={compare} />
                      </span>
                    ) : null}
                    {exists && available ? (
                      <span className="product-options-item__stock muted">
                        {uiT(lang, 'variantStock')}
                      </span>
                    ) : null}
                  </div>
                );

                if (isDifferentProduct) {
                  return (
                    <Link
                      className={`product-options-item${selected ? ' product-options-item--selected' : ''}`}
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      aria-disabled={!exists}
                      data-available={available}
                    >
                      <div className="product-options-item__main">
                        <ProductOptionSwatch swatch={swatch} name={name} />
                        <span className="product-options-item__name">{name}</span>
                      </div>
                      {meta}
                    </Link>
                  );
                }

                return (
                  <button
                    type="button"
                    className={`product-options-item${selected ? ' product-options-item--selected' : ''}${exists && !selected ? ' product-options-item--link' : ''}`}
                    key={option.name + name}
                    disabled={!exists}
                    data-available={available}
                    onClick={() => {
                      if (!selected) {
                        void navigate(`?${variantUriQuery}`, {
                          replace: true,
                          preventScrollReset: true,
                        });
                      }
                    }}
                  >
                    <div className="product-options-item__main">
                      <ProductOptionSwatch swatch={swatch} name={name} />
                      <span className="product-options-item__name">{name}</span>
                    </div>
                    {meta}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="product-form__qty">
        <label htmlFor="product-qty">{uiT(lang, 'quantity')}</label>
        <div className="product-form__qty-controls">
          <button
            type="button"
            className="qty-btn"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <span className="qty-value" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            className="qty-btn"
            aria-label="Increase quantity"
            disabled={quantity >= 10}
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
          >
            +
          </button>
        </div>
      </div>

      <div className="product-form__actions">
        <AddToCartButton
          className="btn btn--primary btn--with-icon"
          disabled={!canPurchase}
          onClick={() => {
            open('cart');
          }}
          lines={lines}
        >
          <IconCart size={20} />
          <span>
            {!sellable ? uiT(lang, 'unavailable') : uiT(lang, 'addToCart')}
          </span>
        </AddToCartButton>

        <CartForm
          route="/cart"
          action={CartForm.ACTIONS.LinesAdd}
          inputs={{lines}}
        >
          {(fetcher) => (
            <>
              <input type="hidden" name="redirectTo" value="CHECKOUT" />
              <button
                type="submit"
                className="btn btn--secondary btn--with-icon"
                disabled={!canPurchase || fetcher.state !== 'idle'}
              >
                <IconBagCheckout size={20} />
                <span>{uiT(lang, 'buyNow')}</span>
              </button>
            </>
          )}
        </CartForm>
      </div>
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return <span className="product-options-item__name">{name}</span>;

  return (
    <span
      aria-hidden
      className="product-option-label-swatch"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt="" />}
    </span>
  );
}
