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
  }
}

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';
