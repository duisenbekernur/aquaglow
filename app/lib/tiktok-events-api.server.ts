import type {HydrogenEnv} from '@shopify/hydrogen';
import {shopifyGidToResourceId} from '~/lib/tiktok-pixel';

/** Env fields used for TikTok `pixel/track` (extends Hydrogen env). */
type TikTokEventsEnv = HydrogenEnv & {
  TIKTOK_ACCESS_TOKEN?: string;
  TIKTOK_TEST_EVENT_CODE?: string;
  PUBLIC_TIKTOK_PIXEL_ID?: string;
};

const TIKTOK_PIXEL_TRACK_URL =
  'https://business-api.tiktok.com/open_api/v1.3/pixel/track/';

type VariantMerchandise = {
  id: string;
  title: string;
  price: {amount: string; currencyCode: string};
  product: {title: string; id: string};
};

type CartLineNode = {
  quantity: number;
  merchandise?: VariantMerchandise;
};

type CartLike = {
  lines?: {nodes?: CartLineNode[]};
};

export function merchandiseIdsFromLinesInput(lines: unknown): string[] {
  if (!Array.isArray(lines)) return [];
  return lines
    .map((line) => {
      if (!line || typeof line !== 'object') return '';
      const id = (line as {merchandiseId?: string}).merchandiseId;
      return typeof id === 'string' && id.length > 0 ? id : '';
    })
    .filter(Boolean);
}

export function getClientIpFromRequest(request: Request): string | undefined {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  return (
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('true-client-ip') ??
    request.headers.get('x-real-ip') ??
    undefined
  );
}

/**
 * TikTok Events API (server): POST /open_api/v1.3/pixel/track/
 * @see https://business-api.tiktok.com/portal/docs?id=1771100799076354
 *
 * Requires `TIKTOK_ACCESS_TOKEN` (Events Manager → Pixel → Settings → Events API).
 * Optional `TIKTOK_TEST_EVENT_CODE` (e.g. TEST03768) for Test events tab.
 */
export function sendTikTokServerAddToCart(args: {
  env: TikTokEventsEnv;
  request: Request;
  cart: CartLike;
  addedMerchandiseIds: string[];
  waitUntil?: (p: Promise<unknown>) => void;
}): void {
  const accessToken = args.env.TIKTOK_ACCESS_TOKEN;
  const pixelCode = args.env.PUBLIC_TIKTOK_PIXEL_ID;
  if (!accessToken || !pixelCode || args.addedMerchandiseIds.length === 0) {
    return;
  }

  const added = new Set(args.addedMerchandiseIds);
  const nodes = args.cart.lines?.nodes ?? [];
  const matched = nodes.filter(
    (line) => line.merchandise?.id && added.has(line.merchandise.id),
  );

  const contents = matched.map((line) => {
    const m = line.merchandise!;
    const qty = line.quantity;
    const price = Number(m.price.amount);
    return {
      content_id: shopifyGidToResourceId(m.id),
      content_type: 'product' as const,
      content_name: m.product.title,
      quantity: qty,
      price,
    };
  });

  let value = 0;
  let currency = 'USD';
  for (const line of matched) {
    const m = line.merchandise!;
    value += Number(m.price.amount) * line.quantity;
    currency = m.price.currencyCode;
  }

  const payload: Record<string, unknown> = {
    pixel_code: pixelCode,
    event: 'AddToCart',
    event_id: `srv_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
    timestamp: new Date().toISOString(),
    context: {
      ip: getClientIpFromRequest(args.request),
      user_agent: args.request.headers.get('user-agent') ?? undefined,
      page: {
        url:
          args.request.headers.get('referer')?.slice(0, 2000) ??
          args.request.url.slice(0, 2000),
      },
    },
  };

  const testCode = args.env.TIKTOK_TEST_EVENT_CODE?.trim();
  if (testCode) {
    payload.test_event_code = testCode;
  }

  if (contents.length > 0) {
    payload.properties = {
      contents,
      value,
      currency,
    };
  }

  const run = async () => {
    try {
      const res = await fetch(TIKTOK_PIXEL_TRACK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Token': accessToken,
        },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as {code?: number; message?: string};
      if (json.code !== 0 && json.code !== 20001) {
        console.error(
          '[tiktok-events-api] pixel/track',
          json.code,
          json.message ?? res.status,
        );
      }
    } catch (e) {
      console.error('[tiktok-events-api] pixel/track request failed', e);
    }
  };

  const promise = run();
  if (typeof args.waitUntil === 'function') {
    args.waitUntil(promise);
  } else {
    void promise;
  }
}
