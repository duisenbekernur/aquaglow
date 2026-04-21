import {useEffect} from 'react';

/**
 * Client-side hook for Meta / TikTok pixels when you prefer script injection
 * over tag managers. Reads IDs from `<meta name="x-*-pixel-id" content="…">`
 * rendered in `root.tsx` via `AnalyticsScripts`.
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

    // Intentionally left minimal: add your official snippets here or load GTM.
    if (import.meta.env.DEV && (metaId || tiktokId)) {
      // eslint-disable-next-line no-console
      console.info('[analytics] pixel meta tags present', {metaId, tiktokId});
    }
  }, []);
}
