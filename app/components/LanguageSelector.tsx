import {Form, useLocation} from 'react-router';
import type {StoreLanguage} from '~/lib/localization';
import {IconChevronDown} from '~/components/icons';

const OPTIONS: {value: StoreLanguage; label: string}[] = [
  {value: 'EN', label: 'English'},
  {value: 'ES', label: 'Español'},
  {value: 'DE', label: 'Deutsch'},
];

type Props = {current: StoreLanguage};

export function LanguageSelector({current}: Props) {
  const location = useLocation();
  const redirectTo = `${location.pathname}${location.search}`;

  return (
    <Form method="post" action="/localization" className="lang-selector">
      <label className="sr-only" htmlFor="store-language">
        Language
      </label>
      <div className="lang-selector__wrap">
        <select
          id="store-language"
          name="language"
          className="lang-selector__select"
          defaultValue={current}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
        >
          {OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <IconChevronDown className="lang-selector__chevron" size={16} />
      </div>
      <input type="hidden" name="redirectTo" value={redirectTo} />
    </Form>
  );
}
