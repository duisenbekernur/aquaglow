import type {StoreLanguage} from '~/lib/localization';

type Lang = StoreLanguage;

const M = {
  addToCart: {
    EN: 'Add to cart',
    ES: 'Añadir al carrito',
    DE: 'In den Warenkorb',
  },
  buyNow: {
    EN: 'Buy now',
    ES: 'Comprar ya',
    DE: 'Jetzt kaufen',
  },
  unavailable: {
    EN: 'Sold out',
    ES: 'Agotado',
    DE: 'Ausverkauft',
  },
  quantity: {
    EN: 'Quantity',
    ES: 'Cantidad',
    DE: 'Menge',
  },
  yourCart: {
    EN: 'Your cart',
    ES: 'Tu carrito',
    DE: 'Dein Warenkorb',
  },
  usdOnly: {
    EN: 'USD',
    ES: 'USD',
    DE: 'USD',
  },
  variantStock: {
    EN: 'In stock',
    ES: 'En stock',
    DE: 'Lager',
  },
  variantSelect: {
    EN: 'Select',
    ES: 'Elegir',
    DE: 'Wählen',
  },
  allVariants: {
    EN: 'All options & inventory',
    ES: 'Todas las opciones e inventario',
    DE: 'Alle Optionen & Bestand',
  },
  loadingCart: {
    EN: 'Loading cart…',
    ES: 'Cargando carrito…',
    DE: 'Warenkorb wird geladen…',
  },
  stickyShop: {
    EN: 'Shop',
    ES: 'Comprar',
    DE: 'Shop',
  },
  galleryOpen: {
    EN: 'Open enlarged product photo',
    ES: 'Abrir foto del producto ampliada',
    DE: 'Vergrößertes Produktfoto öffnen',
  },
  galleryClose: {
    EN: 'Close gallery',
    ES: 'Cerrar galería',
    DE: 'Galerie schließen',
  },
  galleryPrev: {
    EN: 'Previous image',
    ES: 'Imagen anterior',
    DE: 'Vorheriges Bild',
  },
  galleryNext: {
    EN: 'Next image',
    ES: 'Imagen siguiente',
    DE: 'Nächstes Bild',
  },
} as const;

type Key = keyof typeof M;

export function uiT(lang: string | undefined, key: Key): string {
  const l: Lang =
    lang === 'ES' || lang === 'DE' ? (lang as Lang) : ('EN' as Lang);
  return M[key][l];
}
