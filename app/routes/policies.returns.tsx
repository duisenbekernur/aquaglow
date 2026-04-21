import type {Route} from './+types/policies.returns';
import {RETURNS_POLICY_HTML} from '~/constants/policies';
import {siteTitle} from '~/seo/document';

export const meta: Route.MetaFunction = () => [
  {title: siteTitle('Return Policy')},
  {
    name: 'description',
    content: 'AquaGlow 30-day satisfaction guarantee and return instructions.',
  },
];

export default function ReturnsPolicy() {
  return (
    <article className="policy-page">
      <div className="policy-page__inner">
        <h1>Return Policy</h1>
        <div
          className="rte"
          dangerouslySetInnerHTML={{__html: RETURNS_POLICY_HTML}}
        />
      </div>
    </article>
  );
}
