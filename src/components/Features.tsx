import { useContent } from '../lib/content';
import { useLang } from '../lib/i18n';
import { Icon } from './Icon';
import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';

export function Features() {
  const { content } = useContent();
  const { t } = useLang();
  const { features } = content;

  return (
    <section id="features" className="section features" aria-labelledby="features-title">
      <div className="container">
        <SectionHead
          id="features-title"
          index="01"
          label="KEY FEATURES"
          title={t(features.title)}
          aside={t(features.subtitle)}
        />

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
