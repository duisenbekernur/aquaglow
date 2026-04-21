import {redirect} from 'react-router';
import type {Route} from './+types/localization';
import {localizationCookieHeader} from '~/lib/localization';

/**
 * POST-only route: sets `localization_country` cookie (US | DE | ES) and redirects back.
 */
export async function action({request}: Route.ActionArgs) {
  if (request.method !== 'POST') {
    throw new Response('Method not allowed', {status: 405});
  }

  const formData = await request.formData();
  const country = String(formData.get('country') ?? 'US');
  const redirectTo = String(formData.get('redirectTo') ?? '/');

  const safe =
    country === 'DE' || country === 'ES' || country === 'US' ? country : 'US';

  const headers = new Headers();
  headers.append('Set-Cookie', localizationCookieHeader(safe));

  return redirect(redirectTo || '/', {headers});
}

export default function Localization() {
  return null;
}
