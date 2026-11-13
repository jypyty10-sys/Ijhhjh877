import { useState } from 'react';
import { useContent } from '../lib/content';
import { useLang } from '../lib/i18n';
import { Icon } from './Icon';
import { Reveal } from './Reveal';

export function Faq() {
  const { content } = useContent();
  const { t } = useLang();
  const { faq } = content;
  const [openId, setOpenId] = useState<string | null>(faq.items[0]?.id ?? null);

  return (
    <section id="faq" className="section faq" aria-labelledby="faq-title">
      <div className="container faq__layout">
        <Reveal>
          <div className="stack" style={{ gap: 14 }}>
            <span className="eyebrow">FAQ</span>
            <h2 className="section-title" id="faq-title">
              {t(faq.title)}
            </h2>
            <p className="section-head__aside">{t(faq.subtitle)}</p>
          </div>
        </Reveal>

        <div className="faq-list">
          {faq.items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <Reveal key={item.id} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className="faq-q"
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${item.id}`}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                >
                  {t(item.q)}
                  <span className="faq-q__icon" aria-hidden="true">
                    <Icon name="chevron" size={14} />
                  </span>
                </button>
                <div className="faq-a" id={`faq-a-${item.id}`} role="region" aria-hidden={!isOpen}>
                  <div className="faq-a__inner">
                    <p>{t(item.a)}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
