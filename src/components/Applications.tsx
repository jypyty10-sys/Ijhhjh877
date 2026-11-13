import { useEffect, useRef, useState } from 'react';
import { useContent } from '../lib/content';
import { useLang } from '../lib/i18n';
import { useLead } from '../lib/lead';
import type { Application } from '../content/types';
import { Icon } from './Icon';
import { Reveal } from './Reveal';

export function Applications() {
  const { content } = useContent();
  const { t, lang } = useLang();
  const { open } = useLead();
  const { applications } = content;
  const [active, setActive] = useState<Application | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active && !dialog.open) {
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    }
    if (!active && dialog.open) dialog.close();
  }, [active]);

  return (
    <section id="applications" className="section apps" aria-labelledby="applications-title">
      <div className="container">
        <Reveal className="section-head section-head--split">
          <div className="stack" style={{ gap: 14 }}>
            <span className="eyebrow">APPLICATIONS</span>
            <h2 className="section-title" id="applications-title">
              {t(applications.title)}
            </h2>
          </div>
          <p className="section-head__aside">{t(applications.subtitle)}</p>
        </Reveal>

        <div className="app-grid">
          {applications.items.map((item, index) => (
            <Reveal key={item.id} delay={(index % 5) * 60}>
              <button
                type="button"
                className="app-card"
                onClick={() => setActive(item)}
                aria-haspopup="dialog"
              >
                <span className="app-card__art" aria-hidden="true">
                  <Icon name={item.icon} size={96} />
                </span>
                <span className="app-card__body">
                  <span className="app-card__title">{t(item.title)}</span>
                  <span className="app-card__text">{t(item.text)}</span>
                </span>
                <span className="app-card__cta">
                  {lang === 'fa' ? 'مشاهده جزئیات' : 'View details'}
                  <Icon name="arrow" size={12} />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="app-dialog"
        onClose={() => setActive(null)}
        onClick={(event) => {
          if (event.target === dialogRef.current) setActive(null);
        }}
      >
        {active ? (
          <div className="app-dialog__card">
            <button
              type="button"
              className="lead-dialog__close"
              onClick={() => setActive(null)}
              aria-label={lang === 'fa' ? 'بستن' : 'Close'}
            >
              <Icon name="close" size={16} />
            </button>
            <div className="app-dialog__art" aria-hidden="true">
              <Icon name={active.icon} size={92} />
            </div>
            <h3 className="hotspot-info__title">{t(active.title)}</h3>
            <p className="hotspot-info__text">{t(active.text)}</p>
            <div className="lead-form__footer">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => {
                  setActive(null);
                  open('advice');
                }}
              >
                {lang === 'fa' ? 'درخواست مشاوره برای این کاربرد' : 'Ask about this application'}
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
