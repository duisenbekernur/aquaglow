export type TikTokCartLineInput = {
  contentId: string;
  contentName: string;
  quantity: number;
  value: number;
  currency: string;
};

declare global {
  interface Window {
    ttq?: {
      track: (event: string, params?: Record<string, unknown>) => void;
    };
  }
}

export function trackTikTokAddToCart(line: TikTokCartLineInput) {
  if (typeof window === 'undefined' || !window.ttq?.track) return;

  const price = line.quantity > 0 ? line.value / line.quantity : line.value;

  window.ttq.track('AddToCart', {
    contents: [
      {
        content_id: line.contentId,
        content_type: 'product',
        content_name: line.contentName,
        quantity: line.quantity,
        price,
      },
    ],
    value: line.value,
    currency: line.currency,
  });
}

export function shopifyGidToResourceId(gid: string): string {
  const tail = gid.split('/').pop();
  return tail && tail.length > 0 ? tail : gid;
}
