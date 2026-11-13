import { useContent } from '../lib/content';
import { useLang } from '../lib/i18n';
import { Icon } from './Icon';
import { Reveal } from './Reveal';

export function WhyChoose() {
  const { content } = useContent();
  const { t, lang } = useLang();
  const { why } = content;

  return (
    <section id="why" className="section why" aria-labelledby="why-title">
      <div className="container why__grid">
        <Reveal className="why__aside">
          <span className="eyebrow">
            <span className="eyebrow__num num">07</span>
            WHY AD5X
          </span>
          <span className="why__badge">
            <Icon name="sparkle" size={14} />
            {lang === 'fa' ? 'انتخابی برای کارگاه و استودیو' : 'Built for studios and workshops'}
          </span>
          <h2 className="section-title" id="why-title">
            {t(why.title)}
          </h2>
          <p className="why__quote">{t(why.subtitle)}</p>
        </Reveal>

        <div className="why__list">
          {why.items.map((item, index) => (
            <Reveal key={item.id} className="why-item" delay={(index % 2) * 60}>
              <span className="why-item__icon">
                <Icon name={item.icon} size={18} />
              </span>
              <div>
                <h3 className="why-item__title">{t(item.title)}</h3>
                <p className="why-item__text">{t(item.text)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
