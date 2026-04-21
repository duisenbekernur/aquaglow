import {Form, useLocation} from 'react-router';

type Props = {currentCountry: string};

export function CurrencySelector({currentCountry}: Props) {
  const location = useLocation();
  const redirectTo = `${location.pathname}${location.search}`;

  return (
    <Form method="post" action="/localization" className="currency-selector">
      <label className="sr-only" htmlFor="localization-country">
        Region
      </label>
      <select
        id="localization-country"
        name="country"
        className="currency-selector__select"
        defaultValue={currentCountry === 'ES' || currentCountry === 'DE' ? currentCountry : 'US'}
        onChange={(e) => {
          e.currentTarget.form?.requestSubmit();
        }}
      >
        <option value="US">USD · US</option>
        <option value="DE">EUR · DE</option>
        <option value="ES">EUR · ES</option>
      </select>
      <input type="hidden" name="redirectTo" value={redirectTo} />
    </Form>
  );
}
