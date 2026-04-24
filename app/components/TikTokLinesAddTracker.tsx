import {useEffect, useRef} from 'react';
import type {FetcherWithComponents} from 'react-router';
import {
  type TikTokCartLineInput,
  trackTikTokAddToCart,
} from '~/lib/tiktok-pixel';

type CartActionData = {
  errors?: readonly unknown[] | null;
};

/**
 * After a successful `CartForm` LinesAdd submission, fires TikTok AddToCart.
 */
export function TikTokLinesAddTracker({
  fetcher,
  line,
  children,
}: {
  fetcher: FetcherWithComponents<unknown>;
  line: TikTokCartLineInput | undefined;
  children: React.ReactNode;
}) {
  const sawBusy = useRef(false);

  useEffect(() => {
    if (fetcher.state !== 'idle') {
      sawBusy.current = true;
      return;
    }

    if (!sawBusy.current || !line || fetcher.data === undefined) {
      return;
    }

    sawBusy.current = false;

    const {errors} = fetcher.data as CartActionData;
    if (Array.isArray(errors) && errors.length > 0) {
      return;
    }

    trackTikTokAddToCart(line);
  }, [fetcher.state, fetcher.data, line]);

  return <>{children}</>;
}
