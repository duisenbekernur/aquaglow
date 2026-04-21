import type {Route} from './+types/contact';
import {SUPPORT_EMAIL} from '~/constants/contact';
import {siteTitle} from '~/seo/document';

export const meta: Route.MetaFunction = () => [
  {title: siteTitle('Contact')},
  {
    name: 'description',
    content: 'Contact AquaGlow support for orders, returns, and product questions.',
  },
];

export default function ContactPage() {
  return (
    <article className="policy-page">
      <div className="policy-page__inner">
        <h1>Contact</h1>
        <p className="muted">
          For order updates, returns, or product questions, email our team. We
          typically reply within one business day.
        </p>
        <p>
          <a className="link" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>
        </p>
        <p className="muted small">
          Replace this address in <code>app/constants/contact.ts</code> with
          your production inbox.
        </p>
      </div>
    </article>
  );
}
