const COOKIE = 'aqua_lang';

export type StoreLanguage = 'EN' | 'ES' | 'DE';

/** Storefront `LanguageCode` + UI copy — pricing stays USD via `country: US` in context. */
export function getStoreLanguageFromRequest(request: Request): StoreLanguage {
  const cookie = request.headers.get('Cookie');
  if (!cookie) return 'EN';
  const match = cookie.match(new RegExp(`(?:^|; )${COOKIE}=([^;]+)`));
  const raw = match?.[1]?.trim().toUpperCase();
  if (raw === 'ES' || raw === 'DE') return raw;
  return 'EN';
}

export function storeLanguageCookieHeader(lang: StoreLanguage): string {
  return `${COOKIE}=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function storeLanguageToHtmlLang(lang: StoreLanguage): string {
  switch (lang) {
    case 'ES':
      return 'es';
    case 'DE':
      return 'de';
    default:
      return 'en';
  }
}
