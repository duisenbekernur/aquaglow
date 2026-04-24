import {type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import type {TikTokCartLineInput} from '~/lib/tiktok-pixel';
import {TikTokLinesAddTracker} from '~/components/TikTokLinesAddTracker';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  className,
  tiktokLine,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
  className?: string;
  tiktokLine?: TikTokCartLineInput;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <TikTokLinesAddTracker fetcher={fetcher} line={tiktokLine}>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            className={className}
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
          >
            {children}
          </button>
        </TikTokLinesAddTracker>
      )}
    </CartForm>
  );
}
