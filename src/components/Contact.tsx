import { useState } from 'react';
import { useContent } from '../lib/content';
import { useLang } from '../lib/i18n';
import { LeadForm } from '../lib/lead';
import { Icon } from './Icon';
import { Reveal } from './Reveal';

type Intent = 'buy' | 'advice' | 'contact';

export function Contact() {
  const { content } = useContent();
  const { t, lang } = useLang();
  const { contact } = content;
  const [intent, setIntent] = useState<Intent>('buy');
  const empty = lang === 'fa' ? 'پس از تأیید فروشنده ثبت می‌شود' : 'Added once confirmed by the seller';

  const rows = [
    { icon: 'mail', label: lang === 'fa' ? 'ایمیل' : 'Email', value: contact.email },
    { icon: 'phone', label: lang === 'fa' ? 'تلفن' : 'Phone', value: contact.phone },
    { icon: 'pin', label: lang === 'fa' ? 'نشانی' : 'Address', value: t(contact.address) },
    { icon: 'clock', label: lang === 'fa' ? 'ساعات پاسخ‌گویی' : 'Support hours', value: t(contact.hours) },
  ];

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container contact__grid">
        <Reveal className="contact__info">
          <span className="eyebrow">
            <span className="eyebrow__num num">10</span>
            CONTACT
          </span>
          <h2 className="section-title" id="contact-title">
            {t(contact.title)}
          </h2>
          <p className="section-head__aside">{t(contact.subtitle)}</p>

          <div className="contact__list">
            {rows.map((row) => (
              <div className={`contact__row ${row.value ? '' : 'contact__row--empty'}`} key={row.icon}>
                <Icon name={row.icon} size={17} />
                <div>
                  <span>{row.label}</span>
                  <div className={row.value ? 'num' : undefined} dir="auto">{row.value || empty}</div>
                </div>
              </div>
            ))}
          </div>

          {contact.socials.length ? (
            <div className="footer__links">
              {contact.socials.map((social) => (
                <a key={social.id} href={social.href} target="_blank" rel="noreferrer noopener">
                  {social.label}
                </a>
              ))}
            </div>
          ) : null}
        </Reveal>

        <Reveal className="lead-card" delay={100}>
          <LeadForm intent={intent} onIntentChange={(next) => setIntent(next as Intent)} />
        </Reveal>
      </div>
    </section>
  );
}
