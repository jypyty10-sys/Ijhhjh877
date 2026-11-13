import { useLang } from '../lib/i18n';
import { useScrollState } from '../lib/hooks';
import { Icon } from './Icon';

export function ToTop() {
  const { lang } = useLang();
  const { scrolled } = useScrollState(700);

  return (
    <button
      type="button"
      className={`to-top ${scrolled ? 'is-visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={lang === 'fa' ? 'بازگشت به بالای صفحه' : 'Back to top'}
      tabIndex={scrolled ? 0 : -1}
    >
      <Icon name="arrow" size={18} />
    </button>
  );
}
