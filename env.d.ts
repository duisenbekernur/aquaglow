/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />
/// <reference types="@shopify/hydrogen/react-router-types" />

import type {HydrogenEnv} from '@shopify/hydrogen';

declare global {
  interface Env extends HydrogenEnv {
    /** Default Shopify product handle for the one-product funnel */
    PUBLIC_FEATURED_PRODUCT_HANDLE?: string;
    PUBLIC_GA4_MEASUREMENT_ID?: string;
    PUBLIC_META_PIXEL_ID?: string;
    PUBLIC_TIKTOK_PIXEL_ID?: string;
    /** TikTok Events API access token (server-only; Events Manager → Pixel → Events API) */
    TIKTOK_ACCESS_TOKEN?: string;
    /** Paste test code from Events Manager → Test events (e.g. TEST03768); omit in production */
    TIKTOK_TEST_EVENT_CODE?: string;
  }
}

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';
