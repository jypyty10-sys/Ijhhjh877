import { useEffect, useState } from 'react';
import { useContent } from '../lib/content';
import { useLang } from '../lib/i18n';
import { useActiveSection, useScrollState } from '../lib/hooks';
import { useLead } from '../lib/lead';
import { Icon } from './Icon';

export const SECTIONS = [
  { id: 'overview', key: 'overview', fa: 'معرفی', en: 'Overview' },
  { id: 'features', key: 'features', fa: 'ویژگی‌ها', en: 'Features' },
  { id: 'specs', key: 'specs', fa: 'مشخصات', en: 'Specs' },
  { id: 'applications', key: 'applications', fa: 'کاربردها', en: 'Applications' },
  { id: 'gallery', key: 'gallery', fa: 'گالری', en: 'Gallery' },
  { id: 'faq', key: 'faq', fa: 'سؤالات', en: 'FAQ' },
  { id: 'contact', key: 'contact', fa: 'تماس', en: 'Contact' },
];

export function Nav() {
  const { lang, setLang, t } = useLang();
  const { content } = useContent();
  const { open } = useLead();
  const { scrolled, progress } = useScrollState(20);
  const active = useActiveSection(SECTIONS.map((s) => s.id));
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [lang]);

  return (
    <>
      <header className={`nav-shell ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container">
          <nav className="nav" aria-label={lang === 'fa' ? 'ناوبری اصلی' : 'Main navigation'}>
            <a className="brand" href="#overview" aria-label="Flashforge AD5X">
              <span className="brand__mark">A5</span>
              <span className="brand__text">
                <span className="brand__name">FLASHFORGE</span>
                <span className="brand__model">AD5X</span>
              </span>
            </a>

            <ul className="nav__links">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    className={`nav__link ${active === section.id ? 'is-active' : ''}`}
                    href={`#${section.id}`}
                    aria-current={active === section.id ? 'true' : undefined}
                  >
                    {lang === 'fa' ? section.fa : section.en}
                  </a>
                </li>
              ))}
            </ul>

            <div className="nav__actions">
              <div className="lang" role="group" aria-label={lang === 'fa' ? 'انتخاب زبان' : 'Language'}>
                <button
                  type="button"
                  className="lang__btn"
                  aria-pressed={lang === 'fa'}
                  onClick={() => setLang('fa')}
                  lang="fa"
                >
                  FA
                </button>
                <button
                  type="button"
                  className="lang__btn"
                  aria-pressed={lang === 'en'}
                  onClick={() => setLang('en')}
                  lang="en"
                >
                  EN
                </button>
              </div>
              <button type="button" className="btn btn--primary" onClick={() => open('buy')}>
                {t(content.nav.cta)}
              </button>
              <button
                type="button"
                className="burger"
                aria-expanded={menuOpen}
                aria-controls="mobile-drawer"
                aria-label={menuOpen ? 'بستن منو' : 'باز کردن منو'}
                onClick={() => setMenuOpen((v) => !v)}
              >
                <Icon name={menuOpen ? 'close' : 'menu'} size={20} />
              </button>
            </div>
          </nav>
        </div>
        <div
          className="nav__progress"
          style={{ transform: `scaleX(${progress})` }}
          aria-hidden="true"
        />
      </header>

      <div
        id="mobile-drawer"
        className={`drawer ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
        {...({ inert: menuOpen ? undefined : '' } as Record<string, unknown>)}
      >
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            className={`drawer__link ${active === section.id ? 'is-active' : ''}`}
            href={`#${section.id}`}
            onClick={() => setMenuOpen(false)}
          >
            {lang === 'fa' ? section.fa : section.en}
            <Icon name="arrow" size={16} data-flip />
          </a>
        ))}
        <div className="drawer__footer">
          <button
            type="button"
            className="btn btn--primary btn--block"
            onClick={() => {
              setMenuOpen(false);
              open('buy');
            }}
          >
            {t(content.nav.cta)}
          </button>
        </div>
      </div>
    </>
  );
}
