import {Link} from 'react-router';
import {BRAND_NAME} from '~/constants/brand';
import {FOOTER_LINKS} from '~/constants/navigation';

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__brand">
          © {year} {BRAND_NAME}
        </p>
        <nav className="site-footer__nav" aria-label="Footer">
          {FOOTER_LINKS.map((item) => (
            <Link key={item.to} to={item.to} prefetch="intent">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
