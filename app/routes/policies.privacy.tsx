import type {Route} from './+types/policies.privacy';
import {PRIVACY_POLICY_HTML} from '~/constants/policies';
import {siteTitle} from '~/seo/document';

export const meta: Route.MetaFunction = () => [
  {title: siteTitle('Privacy Policy')},
  {
    name: 'description',
    content: 'How AquaGlow collects, uses, and protects your personal data.',
  },
];

export default function PrivacyPolicy() {
  return (
    <article className="policy-page">
      <div className="policy-page__inner">
        <h1>Privacy Policy</h1>
        <div
          className="rte"
          dangerouslySetInnerHTML={{__html: PRIVACY_POLICY_HTML}}
        />
      </div>
    </article>
  );
}
