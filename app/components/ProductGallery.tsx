import {useState} from 'react';
import {Image} from '@shopify/hydrogen';
import type {ProductVariantFragment} from 'storefrontapi.generated';

type ImageNode = NonNullable<ProductVariantFragment['image']>;

type Props = {
  productTitle: string;
  /** Primary image from selected variant */
  featured: ImageNode | null | undefined;
  /** Additional product images from Storefront `Product.images` */
  gallery: ReadonlyArray<ImageNode>;
};

export function ProductGallery({productTitle, featured, gallery}: Props) {
  const merged = [featured, ...gallery].filter(Boolean) as ImageNode[];
  const unique = merged.filter(
    (img, i, arr) => arr.findIndex((x) => x.id === img.id) === i,
  );

  const [activeId, setActiveId] = useState(unique[0]?.id ?? '');

  const active = unique.find((img) => img.id === activeId) ?? unique[0];

  if (!active) {
    return (
      <div className="product-gallery product-gallery--empty" role="img" aria-label={productTitle} />
    );
  }

  return (
    <div className="product-gallery">
      <div className="product-gallery__main">
        <Image
          data={active}
          sizes="(min-width: 960px) 560px, 100vw"
          loading="eager"
          className="product-gallery__hero"
          alt={active.altText ?? productTitle}
        />
      </div>
      {unique.length > 1 ? (
        <ul className="product-gallery__thumbs" aria-label="Product images">
          {unique.map((img, index) => (
            <li key={img.id}>
              <button
                type="button"
                className={`product-gallery__thumb${img.id === active.id ? ' product-gallery__thumb--active' : ''}`}
                onClick={() => {
                  if (img.id) setActiveId(img.id);
                }}
                aria-current={img.id === active.id}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  data={img}
                  width={96}
                  height={96}
                  loading={index > 2 ? 'lazy' : undefined}
                  alt={img.altText ?? `${productTitle} thumbnail ${index + 1}`}
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
