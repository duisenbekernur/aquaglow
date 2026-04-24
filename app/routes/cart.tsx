import {
  useLoaderData,
  useRouteLoaderData,
  data,
  type HeadersFunction,
  Link,
} from 'react-router';
import type {Route} from './+types/cart';
import type {CartQueryDataReturn} from '@shopify/hydrogen';
import {CartForm} from '@shopify/hydrogen';
import {CartMain} from '~/components/CartMain';
import {uiT} from '~/lib/ui-i18n';
import type {RootLoader} from '~/root';
import {
  merchandiseIdsFromLinesInput,
  sendTikTokServerAddToCart,
} from '~/lib/tiktok-events-api.server';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Cart | AquaGlow'}];
};

export const headers: HeadersFunction = ({actionHeaders}) => actionHeaders;

export async function action({request, context}: Route.ActionArgs) {
  const {cart} = context;
  const waitUntil = (context as {waitUntil?: (p: Promise<unknown>) => void})
    .waitUntil;

  const formData = await request.formData();

  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result: CartQueryDataReturn;
  let linesAddMerchandiseIds: string[] | undefined;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      linesAddMerchandiseIds = merchandiseIdsFromLinesInput(inputs.lines);
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];

      // Combine discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesAdd: {
      const formGiftCardCode = inputs.giftCardCode;

      const giftCardCodes = (
        formGiftCardCode ? [formGiftCardCode] : []
      ) as string[];

      result = await cart.addGiftCardCodes(giftCardCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesRemove: {
      const appliedGiftCardIds = inputs.giftCardCodes as string[];
      result = await cart.removeGiftCardCodes(appliedGiftCardIds);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const {cart: cartResult, errors, warnings} = result;

  if (
    action === CartForm.ACTIONS.LinesAdd &&
    linesAddMerchandiseIds?.length &&
    cartResult &&
    !(Array.isArray(errors) && errors.length > 0)
  ) {
    sendTikTokServerAddToCart({
      env: context.env,
      request,
      cart: cartResult,
      addedMerchandiseIds: linesAddMerchandiseIds,
      waitUntil,
    });
  }

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    if (redirectTo === 'CHECKOUT' && cartResult?.checkoutUrl) {
      headers.set('Location', cartResult.checkoutUrl);
    } else {
      headers.set('Location', redirectTo);
    }
  }

  return data(
    {
      cart: cartResult,
      errors,
      warnings,
      analytics: {
        cartId,
      },
    },
    {status, headers},
  );
}

export async function loader({context}: Route.LoaderArgs) {
  const {cart} = context;
  return await cart.get();
}

export default function Cart() {
  const cart = useLoaderData<typeof loader>();
  const root = useRouteLoaderData<RootLoader>('root');
  const lang = root?.language ?? 'EN';

  return (
    <div className="cart-page">
      <div className="cart-page__inner">
        <header className="cart-page__header">
          <h1 className="cart-page__title">{uiT(lang, 'cartPageTitle')}</h1>
          <Link className="cart-page__back" to="/">
            {uiT(lang, 'cartContinueShopping')}
          </Link>
        </header>
        <CartMain layout="page" cart={cart} />
      </div>
    </div>
  );
}
