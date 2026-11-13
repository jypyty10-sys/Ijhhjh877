import { useContent } from '../lib/content';
import { useLang } from '../lib/i18n';
import { Icon } from './Icon';
import { Reveal } from './Reveal';

export function Features() {
  const { content } = useContent();
  const { t } = useLang();
  const { features } = content;

  return (
    <section id="features" className="section features" aria-labelledby="features-title">
      <div className="container">
        <Reveal className="section-head section-head--split">
          <div className="stack" style={{ gap: 14 }}>
            <span className="eyebrow">KEY FEATURES</span>
            <h2 className="section-title" id="features-title">
              {t(features.title)}
            </h2>
          </div>
          <p className="section-head__aside">{t(features.subtitle)}</p>
        </Reveal>

        <div className="feature-grid">
          {features.items.map((feature, index) => (
            <Reveal key={feature.id} delay={(index % 4) * 70} className="feature-card">
              <div className="feature-card__top">
                <span className="feature-card__icon">
                  <Icon name={feature.icon} size={21} />
                </span>
                <span className="feature-card__index num">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="feature-card__title">{t(feature.title)}</h3>
              <p className="feature-card__text">{t(feature.text)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
