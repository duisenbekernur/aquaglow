import {useEffect} from 'react';

/**
 * Client-side hook for Meta when you prefer script injection over GTM.
 * TikTok loads from `AnalyticsScripts` when `PUBLIC_TIKTOK_PIXEL_ID` is set.
 * Reads Meta ID from `<meta name="x-meta-pixel-id" content="…">`.
 */
export function useMarketingPixels() {
  useEffect(() => {
    const metaId = document
      .querySelector('meta[name="x-meta-pixel-id"]')
      ?.getAttribute('content');
    const tiktokId = document
      .querySelector('meta[name="x-tiktok-pixel-id"]')
      ?.getAttribute('content');

    if (!metaId && !tiktokId) return;

    if (import.meta.env.DEV && (metaId || tiktokId)) {
      // eslint-disable-next-line no-console
      console.info('[analytics] pixel meta tags present', {metaId, tiktokId});
    }
  }, []);
}
