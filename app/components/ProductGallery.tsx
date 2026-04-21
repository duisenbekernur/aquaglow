import {useCallback, useEffect, useId, useRef, useState} from 'react';
import {useRouteLoaderData} from 'react-router';
import {Image} from '@shopify/hydrogen';
import type {ProductVariantFragment} from 'storefrontapi.generated';
import {IconChevronLeft, IconChevronRight, IconClose} from '~/components/icons';
import {uiT} from '~/lib/ui-i18n';
import type {RootLoader} from '~/root';

type ImageNode = NonNullable<ProductVariantFragment['image']>;

type Props = {
  productTitle: string;
  /** Primary image from selected variant */
  featured: ImageNode | null | undefined;
  /** Additional product images from Storefront `Product.images` */
  gallery: ReadonlyArray<ImageNode>;
};

export function ProductGallery({productTitle, featured, gallery}: Props) {
  const root = useRouteLoaderData<RootLoader>('root');
  const lang = root?.language ?? 'EN';

  const merged = [featured, ...gallery].filter(Boolean) as ImageNode[];
  const unique = merged.filter(
    (img, i, arr) => arr.findIndex((x) => x.id === img.id) === i,
  );

  const [activeId, setActiveId] = useState(unique[0]?.id ?? '');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lightboxTitleId = useId();

  const active = unique.find((img) => img.id === activeId) ?? unique[0];
  const lightboxImage = unique[lightboxIndex] ?? active;
  const canCarousel = unique.length > 1;

  const openLightbox = useCallback(
    (index: number) => {
      const i = Math.max(0, Math.min(index, unique.length - 1));
      setLightboxIndex(i);
      setLightboxOpen(true);
    },
    [unique.length],
  );

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (i + unique.length - 1) % unique.length);
  }, [unique.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i + 1) % unique.length);
  }, [unique.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
      }
      if (e.key === 'ArrowLeft' && canCarousel) {
        e.preventDefault();
        goPrev();
      }
      if (e.key === 'ArrowRight' && canCarousel) {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, canCarousel, closeLightbox, goPrev, goNext]);

  if (!active) {
    return (
      <div className="product-gallery product-gallery--empty" role="img" aria-label={productTitle} />
    );
  }

  const activeIndex = unique.findIndex((img) => img.id === active.id);

  return (
    <div className="product-gallery">
      <button
        type="button"
        className="product-gallery__main product-gallery__main--openable"
        onClick={() => openLightbox(activeIndex >= 0 ? activeIndex : 0)}
        aria-haspopup="dialog"
        aria-expanded={lightboxOpen}
        aria-label={uiT(lang, 'galleryOpen')}
      >
        <Image
          data={active}
          sizes="(min-width: 960px) 560px, 100vw"
          loading="eager"
          className="product-gallery__hero"
          alt={active.altText ?? productTitle}
        />
      </button>
      {canCarousel ? (
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

      {lightboxOpen && lightboxImage ? (
        <div
          className="product-gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby={lightboxTitleId}
        >
          <button
            type="button"
            className="product-gallery-lightbox__backdrop"
            tabIndex={-1}
            aria-label={uiT(lang, 'galleryClose')}
            onClick={closeLightbox}
          />
          <div className="product-gallery-lightbox__panel">
            <h2 id={lightboxTitleId} className="sr-only">
              {productTitle} — image {lightboxIndex + 1} of {unique.length}
            </h2>
            <button
              ref={closeBtnRef}
              type="button"
              className="product-gallery-lightbox__close"
              onClick={closeLightbox}
              aria-label={uiT(lang, 'galleryClose')}
            >
              <IconClose size={22} />
            </button>
            {canCarousel ? (
              <>
                <button
                  type="button"
                  className="product-gallery-lightbox__nav product-gallery-lightbox__nav--prev"
                  onClick={goPrev}
                  aria-label={uiT(lang, 'galleryPrev')}
                >
                  <IconChevronLeft size={32} />
                </button>
                <button
                  type="button"
                  className="product-gallery-lightbox__nav product-gallery-lightbox__nav--next"
                  onClick={goNext}
                  aria-label={uiT(lang, 'galleryNext')}
                >
                  <IconChevronRight size={32} />
                </button>
              </>
            ) : null}
            <div className="product-gallery-lightbox__stage">
              <Image
                data={lightboxImage}
                sizes="100vw"
                loading="eager"
                className="product-gallery-lightbox__img"
                alt={lightboxImage.altText ?? `${productTitle} ${lightboxIndex + 1}`}
              />
            </div>
            {canCarousel ? (
              <p className="product-gallery-lightbox__counter" aria-live="polite">
                {lightboxIndex + 1} / {unique.length}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
