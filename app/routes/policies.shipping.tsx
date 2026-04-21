import type {Route} from './+types/policies.shipping';
import {SHIPPING_POLICY_HTML} from '~/constants/policies';
import {siteTitle} from '~/seo/document';

export const meta: Route.MetaFunction = () => [
  {title: siteTitle('Shipping Policy')},
  {
    name: 'description',
    content: 'AquaGlow shipping regions, processing times, and tracking.',
  },
];

export default function ShippingPolicy() {
  return (
    <article className="policy-page">
      <div className="policy-page__inner">
        <h1>Shipping Policy</h1>
        <div
          className="rte"
          dangerouslySetInnerHTML={{__html: SHIPPING_POLICY_HTML}}
        />
      </div>
    </article>
  );
}
