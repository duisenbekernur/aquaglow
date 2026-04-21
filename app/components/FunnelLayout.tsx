import {Await} from 'react-router';
import {Suspense} from 'react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {StoreLanguage} from '~/lib/localization';
import {uiT} from '~/lib/ui-i18n';
import {Aside} from '~/components/Aside';
import {AnnouncementBar} from '~/components/AnnouncementBar';
import {SiteHeader} from '~/components/SiteHeader';
import {SiteFooter} from '~/components/SiteFooter';
import {CartMain} from '~/components/CartMain';

type Props = {
  cart: Promise<CartApiQueryFragment | null>;
  language: StoreLanguage;
  children?: React.ReactNode;
};

/**
 * One-product funnel shell: announcement, minimal header, optional cart drawer, footer.
 */
export function FunnelLayout({cart, language, children = null}: Props) {
  return (
    <Aside.Provider>
      <CartAside cart={cart} language={language} />
      <AnnouncementBar />
      <SiteHeader cart={cart} language={language} />
      <main className="funnel-main">{children}</main>
      <SiteFooter />
    </Aside.Provider>
  );
}

function CartAside({
  cart,
  language,
}: {
  cart: Props['cart'];
  language: StoreLanguage;
}) {
  return (
    <Aside type="cart" heading={uiT(language, 'yourCart')}>
      <Suspense fallback={<p className="muted">{uiT(language, 'loadingCart')}</p>}>
        <Await resolve={cart}>
          {(resolved) => <CartMain cart={resolved} layout="aside" />}
        </Await>
      </Suspense>
    </Aside>
  );
}
