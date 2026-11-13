import { useContent } from '../lib/content';
import { useLang } from '../lib/i18n';
import { useLead } from '../lib/lead';
import { Icon } from './Icon';
import { SECTIONS } from './Nav';

export function Footer() {
  const { content } = useContent();
  const { t, lang } = useLang();
  const { open } = useLead();
  const { footer, contact, features } = content;

  return (
    <footer className="footer">
      <div className="footer__watermark" aria-hidden="true">
        AD5X
      </div>
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <a className="brand" href="#overview" aria-label="Flashforge AD5X">
              <span className="brand__mark">A5</span>
              <span className="brand__text">
                <span className="brand__name">FLASHFORGE</span>
                <span className="brand__model">AD5X</span>
              </span>
            </a>
            <p className="footer__about">{t(footer.about)}</p>
            <p className="footer__disclaimer">{t(footer.disclaimer)}</p>
          </div>

          <div>
            <h2 className="footer__col-title">{lang === 'fa' ? 'بخش‌ها' : 'Sections'}</h2>
            <div className="footer__links">
              {SECTIONS.map((section) => (
                <a key={section.id} href={`#${section.id}`}>
                  {lang === 'fa' ? section.fa : section.en}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="footer__col-title">{lang === 'fa' ? 'ویژگی‌ها' : 'Features'}</h2>
            <div className="footer__links">
              {features.items.slice(0, 5).map((feature) => (
                <a key={feature.id} href="#features">
                  {t(feature.title)}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="footer__col-title">{lang === 'fa' ? 'ارتباط' : 'Get in touch'}</h2>
            <div className="footer__links">
              {contact.email ? (
                <a href={`mailto:${contact.email}`} dir="ltr">
                  {contact.email}
                </a>
              ) : null}
              {contact.phone ? (
                <a href={`tel:${contact.phone}`} dir="ltr">
                  {contact.phone}
                </a>
              ) : null}
              <button type="button" className="link-arrow" onClick={() => open('buy')}>
                {lang === 'fa' ? 'ثبت درخواست خرید' : 'Request a purchase'}
              </button>
              <a className="link-arrow" href="#specs">
                {lang === 'fa' ? 'مشخصات فنی' : 'Technical specs'}
              </a>
              <a className="content-note" href="/admin">
                <Icon name="lock" size={13} />
                {lang === 'fa' ? 'مدیریت محتوا' : 'Content manager'}
              </a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>{t(footer.copyright)}</span>
          <div className="footer__bottom-links">
            <span>THINK IT. PRINT IT.</span>
            <a href="https://www.flashforge.com" target="_blank" rel="noreferrer noopener">
              www.flashforge.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
