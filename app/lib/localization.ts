const COOKIE = 'localization_country';

/** Buyer country for Storefront `@inContext` — drives currency/presentation where markets allow. */
export function getBuyerCountryFromRequest(request: Request): string {
  const cookie = request.headers.get('Cookie');
  if (!cookie) return 'US';
  const match = cookie.match(new RegExp(`(?:^|; )${COOKIE}=([^;]+)`));
  const raw = match?.[1]?.trim();
  if (raw === 'DE' || raw === 'ES') return raw;
  return 'US';
}

export function localizationCookieHeader(country: 'US' | 'DE' | 'ES'): string {
  return `${COOKIE}=${country}; Path=/; Max-Age=31536000; SameSite=Lax`;
}
