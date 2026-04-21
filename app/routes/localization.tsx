import {redirect} from 'react-router';
import type {Route} from './+types/localization';
import {
  storeLanguageCookieHeader,
  type StoreLanguage,
} from '~/lib/localization';

/**
 * POST: sets `aqua_lang` (EN | ES | DE) and redirects back. Storefront stays USD (US).
 */
export async function action({request}: Route.ActionArgs) {
  if (request.method !== 'POST') {
    throw new Response('Method not allowed', {status: 405});
  }

  const formData = await request.formData();
  const lang = String(formData.get('language') ?? 'EN').toUpperCase();
  const redirectTo = String(formData.get('redirectTo') ?? '/');

  const safe: StoreLanguage =
    lang === 'ES' || lang === 'DE' ? lang : 'EN';

  const headers = new Headers();
  headers.append('Set-Cookie', storeLanguageCookieHeader(safe));

  return redirect(redirectTo || '/', {headers});
}

export default function Localization() {
  return null;
}
