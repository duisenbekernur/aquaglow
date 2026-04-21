import {Await} from 'react-router';
import {Suspense} from 'react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {AnnouncementBar} from '~/components/AnnouncementBar';
import {SiteHeader} from '~/components/SiteHeader';
import {SiteFooter} from '~/components/SiteFooter';
import {CartMain} from '~/components/CartMain';

type Props = {
  cart: Promise<CartApiQueryFragment | null>;
  buyerCountry: string;
  children?: React.ReactNode;
};

/**
 * One-product funnel shell: announcement, minimal header, optional cart drawer, footer.
 */
export function FunnelLayout({cart, buyerCountry, children = null}: Props) {
  return (
    <Aside.Provider>
      <CartAside cart={cart} />
      <AnnouncementBar />
      <SiteHeader cart={cart} buyerCountry={buyerCountry} />
      <main className="funnel-main">{children}</main>
      <SiteFooter />
    </Aside.Provider>
  );
}

function CartAside({cart}: {cart: Props['cart']}) {
  return (
    <Aside type="cart" heading="Your cart">
      <Suspense fallback={<p className="muted">Loading cart…</p>}>
        <Await resolve={cart}>
          {(resolved) => <CartMain cart={resolved} layout="aside" />}
        </Await>
      </Suspense>
    </Aside>
  );
}
