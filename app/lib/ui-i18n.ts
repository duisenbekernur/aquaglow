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
  cartEmptyMessage: {
    EN: 'Your cart is empty — add the AquaGlow shower filter and enjoy softer water in days.',
    ES: 'Tu carrito está vacío: añade el filtro de ducha AquaGlow.',
    DE: 'Dein Warenkorb ist leer — leg AquaGlows Duschfilter hinzu.',
  },
  cartPageTitle: {
    EN: 'Shopping cart',
    ES: 'Carrito',
    DE: 'Warenkorb',
  },
  cartSubtotalLabel: {
    EN: 'Subtotal',
    ES: 'Subtotal',
    DE: 'Zwischensumme',
  },
  cartOrderSummary: {
    EN: 'Order summary',
    ES: 'Resumen del pedido',
    DE: 'Bestellübersicht',
  },
  cartSecureCheckout: {
    EN: 'Secure checkout',
    ES: 'Pago seguro',
    DE: 'Sicher zur Kasse',
  },
  cartCheckoutHint: {
    EN: 'SSL-encrypted checkout',
    ES: 'Pago cifrado SSL',
    DE: 'SSL-verschlüsselte Kasse',
  },
  cartContinueShopping: {
    EN: 'Continue shopping',
    ES: 'Seguir comprando',
    DE: 'Weiter einkaufen',
  },
  cartEach: {
    EN: 'ea.',
    ES: 'c/u',
    DE: 'Stk.',
  },
  cartRemoveLine: {
    EN: 'Remove',
    ES: 'Quitar',
    DE: 'Entfernen',
  },
} as const;

type Key = keyof typeof M;

export function uiT(lang: string | undefined, key: Key): string {
  const l: Lang =
    lang === 'ES' || lang === 'DE' ? (lang as Lang) : ('EN' as Lang);
  return M[key][l];
}
