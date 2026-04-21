# AquaGlow — Shopify Hydrogen headless storefront

Production-oriented **one-product** funnel for **AquaGlow Filter Shower Head**, built on the official **Shopify Hydrogen** stack (React Router 7 + Storefront API + Oxygen-ready build). Inventory, variants, carts, and checkout stay on **Shopify**; this app is a **headless** storefront (no Online Store 2.0 theme rendering).

## Stack

| Layer | Choice |
| --- | --- |
| Framework | [Hydrogen](https://shopify.dev/docs/api/hydrogen) `2026.4.x` on **React Router 7** |
| API | **Storefront API** (`@inContext` for country/currency presentation) |
| Styling | Global CSS in `app/styles/app.css` (mobile-first, minimal dependencies) |
| Types | TypeScript + `storefrontapi.generated.d.ts` from `npm run codegen` |
| Tooling | ESLint 9, Prettier (`@shopify/prettier-config`), Shopify CLI |

## Project layout (high level)

```text
app/
  components/          # UI building blocks (header, gallery, form, landing sections…)
  components/landing/  # Landing-only sections
  constants/           # Brand, copy, policies HTML, nav, contact email
  hooks/               # e.g. `useMarketingPixels` (Meta/TikTok wiring starter)
  lib/                 # Session, cart fragments, localization cookie, product GraphQL
  routes/              # React Router file routes (`_index`, `products.$handle`, `cart`, policies…)
  seo/                 # Meta / JSON-LD helpers
  styles/              # `reset.css`, `app.css`
public/
server.ts              # Oxygen / MiniOxygen worker entry
react-router.config.ts # RR config + Hydrogen preset
vite.config.ts
```

## Prerequisites

- **Node.js** `^22 || ^24` (see `package.json` `engines`)
- A Shopify store with the **Headless** or **Hydrogen** channel and a **Storefront API** token  
- A product whose **handle** matches `PUBLIC_FEATURED_PRODUCT_HANDLE` (or change the constant in `app/constants/brand.ts`)

## Environment variables

Copy `.env.example` → `.env` and fill values from the Shopify admin (or `shopify hydrogen env pull` after linking).

| Variable | Purpose |
| --- | --- |
| `SESSION_SECRET` | Cookie signing secret (long random string) |
| `PUBLIC_STORE_DOMAIN` | `your-store.myshopify.com` |
| `PUBLIC_STOREFRONT_API_TOKEN` | Storefront API **public** token |
| `PUBLIC_STOREFRONT_ID` | Storefront ID from the channel |
| `PUBLIC_CHECKOUT_DOMAIN` | Usually your `.myshopify.com` checkout host |
| `PUBLIC_FEATURED_PRODUCT_HANDLE` | Shopify product handle for the funnel |
| `PUBLIC_GA4_MEASUREMENT_ID` | Optional GA4 |
| `PUBLIC_META_PIXEL_ID` / `PUBLIC_TIKTOK_PIXEL_ID` | Optional; exposed as `<meta>` hooks + `useMarketingPixels` |

## Shopify setup (Headless + Storefront API)

1. **Install a custom storefront channel**  
   In Shopify Admin: **Sales channels** → **Headless** or **Hydrogen** → follow the install flow.  
   Docs: [Custom storefronts](https://shopify.dev/docs/custom-storefronts) and [Hydrogen / Headless](https://shopify.dev/docs/custom-storefronts/hydrogen).

2. **Create a Storefront API access token**  
   In the channel settings, create a **Storefront API** token. Use the **public** token in `PUBLIC_STOREFRONT_API_TOKEN` (never commit private admin tokens).

3. **Required Storefront API access scopes**  
   Enable at minimum: **unauthenticated read** for products, variants, cart, checkout, and shop content you use (e.g. policies if you later load them from the API). For this template, product + cart + checkout are the critical scopes.

4. **Find the product handle**  
   Admin → **Products** → open the product → **Search engine listing** / URL handle (e.g. `aquaglow-filter-shower-head`). Set `PUBLIC_FEATURED_PRODUCT_HANDLE` to that value.

5. **How checkout works (headless)**  
   The app uses Hydrogen’s **cart** APIs. `CartForm` posts to `/cart`; the cart response includes `checkoutUrl`. **Buy now** sends `redirectTo=CHECKOUT` so the cart action redirects straight to Shopify Checkout.

6. **Connect this repo to your store**  
   - Put env vars in `.env` as above, **or**  
   - Run `npx shopify hydrogen link` then `npx shopify hydrogen env pull` (when using Shopify CLI in an interactive session).

7. **Custom domain (later)**  
   Point DNS to **Oxygen** (if you deploy with Hydrogen hosting) or your CDN / reverse proxy in front of the worker. Keep checkout on Shopify’s hosted checkout domain.

## Local development

```bash
npm install
npm run dev
```

Open the URL printed by the CLI (often `http://localhost:3000`).

- **GraphQL types**: `npm run codegen` (runs as part of `dev`/`build` via `--codegen` flags too).
- **Lint / format**: `npm run lint` and Prettier via your editor.

## Build & deploy

```bash
npm run build
npm run preview   # local production preview
```

Deploy with **Shopify Oxygen** (`shopify hydrogen deploy`) or any host that can run the Hydrogen worker bundle—see [Hydrogen deployment](https://shopify.dev/docs/custom-storefronts/hydrogen/deploy).

## Customization quick reference

| What to change | Where |
| --- | --- |
| Featured product handle (env override) | `PUBLIC_FEATURED_PRODUCT_HANDLE` or `app/constants/brand.ts` → `DEFAULT_FEATURED_PRODUCT_HANDLE` |
| Brand name / announcement | `app/constants/brand.ts` |
| Landing copy, reviews, FAQ, comparison | `app/constants/content.ts` |
| Static policy HTML | `app/constants/policies.ts` |
| Support email | `app/constants/contact.ts` |
| Footer links | `app/constants/navigation.ts` |
| Product GraphQL (images, variants, SEO) | `app/lib/product-storefront.ts` then `npm run codegen` |
| Visual design tokens / layout | `app/styles/app.css` |
| Analytics placeholders | `app/components/AnalyticsScripts.tsx`, `app/hooks/useMarketingPixels.ts`, root loader in `app/root.tsx` |

## Routes shipped

| Path | Description |
| --- | --- |
| `/` | One-product **landing** (loads featured product from Shopify) |
| `/products/:handle` | PDP with gallery, variants, quantity, add to cart, buy now, JSON-LD |
| `/cart` | Line items, update/remove, checkout link |
| `/policies/shipping`, `/policies/returns`, `/policies/privacy` | Static policy pages (edit HTML in constants) |
| `/contact` | Mailto-based contact |
| `POST /localization` | Sets `localization_country` cookie (`US` / `DE` / `ES`) for `@inContext` |

## Notes

- **“Sold out” / unavailable**: The primary CTA reflects **only the selected variant** (`availableForSale`). Unavailable combinations are disabled in the option UI.
- **Reviews on the page** are **editorial** marketing copy in `app/constants/content.ts`, not Shopify Product Reviews API data—wire a reviews provider later if needed.
- **Hydrogen route check**: `npx shopify hydrogen check routes` may warn about removed demo routes (account, collections, etc.); that is expected for this trimmed funnel.

## License

MIT (same as Hydrogen skeleton template).
