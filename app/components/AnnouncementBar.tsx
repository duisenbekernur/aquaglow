import {ANNOUNCEMENT_TEXT} from '~/constants/brand';

export function AnnouncementBar() {
  return (
    <div className="announcement-bar" role="region" aria-label="Promotion">
      <p className="announcement-bar__text">{ANNOUNCEMENT_TEXT}</p>
    </div>
  );
}
