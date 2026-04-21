import {useState} from 'react';
import {Link, useNavigate} from 'react-router';
import {type MappedProductOptions, CartForm} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';

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

  const lines =
    selectedVariant && selectedVariant.availableForSale
      ? [
          {
            merchandiseId: selectedVariant.id,
            quantity,
            selectedVariant,
          },
        ]
      : [];

  const canPurchase = Boolean(
    selectedVariant?.availableForSale && selectedVariant?.id,
  );

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
                } = value;

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
                      <ProductOptionSwatch swatch={swatch} name={name} />
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
                    <ProductOptionSwatch swatch={swatch} name={name} />
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="product-form__qty">
        <label htmlFor="product-qty">Quantity</label>
        <select
          id="product-qty"
          name="quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        >
          {Array.from({length: 10}, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <div className="product-form__actions">
        <AddToCartButton
          disabled={!canPurchase}
          onClick={() => {
            open('cart');
          }}
          lines={lines}
        >
          {selectedVariant?.availableForSale === false
            ? 'Unavailable'
            : 'Add to cart'}
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
                className="btn btn--secondary"
                disabled={!canPurchase || fetcher.state !== 'idle'}
              >
                Buy now
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

  if (!image && !color) return name;

  return (
    <span
      aria-label={name}
      className="product-option-label-swatch"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt="" />}
    </span>
  );
}
