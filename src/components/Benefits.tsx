import { useContent } from '../lib/content';
import { useLang } from '../lib/i18n';
import { Reveal } from './Reveal';

export function Benefits() {
  const { content } = useContent();
  const { t } = useLang();
  const { benefits } = content;

  return (
    <section id="benefits" className="section benefits" aria-labelledby="benefits-title">
      <div className="container">
        <Reveal className="section-head section-head--split">
          <div className="stack" style={{ gap: 14 }}>
            <span className="eyebrow">PERFORMANCE</span>
            <h2 className="section-title" id="benefits-title">
              {t(benefits.title)}
            </h2>
          </div>
          <p className="section-head__aside">{t(benefits.subtitle)}</p>
        </Reveal>

        <div className="benefit-grid">
          {benefits.items.map((item, index) => (
            <Reveal key={item.id} className="benefit-item" delay={index * 70}>
              <span className="benefit-item__num">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="benefit-item__title">{t(item.title)}</h3>
              <p className="benefit-item__text">{t(item.text)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
