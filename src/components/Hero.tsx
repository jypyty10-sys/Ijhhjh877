import { useContent } from '../lib/content';
import { useLang } from '../lib/i18n';
import { useLead } from '../lib/lead';
import { Icon } from './Icon';
import { PrinterArt } from './PrinterArt';
import { Reveal } from './Reveal';

export function Hero() {
  const { content } = useContent();
  const { t, lang } = useLang();
  const { open } = useLead();
  const hero = content.hero;

  const stats = [
    { value: '500', unit: 'mm/s', fa: 'حداکثر سرعت چاپ', en: 'Max print speed' },
    { value: '±0.1', unit: 'mm', fa: 'دقت اعلام‌شده سازنده', en: 'Declared accuracy' },
    { value: 'CoreXY', unit: '', fa: 'ساختار حرکتی', en: 'Motion structure' },
    { value: 'Direct Drive', unit: '', fa: 'نوع اکسترودر', en: 'Extruder' },
  ];

  return (
    <section id="overview" className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <Reveal className="hero__eyebrow">
            <span className="hero__eyebrow-dot">
              <Icon name="sparkle" size={13} />
            </span>
            {t(hero.eyebrow)}
          </Reveal>

          <Reveal className="hero__wordmark" delay={60}>
            <span className="hero__brand">{hero.brand}</span>
            <span className="hero__model">{hero.model}</span>
          </Reveal>

          <Reveal as="h1" id="hero-title" className="hero__title" delay={120}>
            {t(hero.headline)}
          </Reveal>

          <Reveal as="p" className="hero__desc" delay={180}>
            {t(hero.description)}
          </Reveal>

          <Reveal className="hero__actions" delay={240}>
            <a className="btn btn--primary btn--lg" href="#specs">
              {t(hero.primaryCta)}
              <Icon name="arrow" size={18} />
            </a>
            <button type="button" className="btn btn--ghost btn--lg" onClick={() => open('buy')}>
              {t(hero.secondaryCta)}
            </button>
          </Reveal>

          <Reveal as="ul" className="hero__trust" delay={300}>
            {hero.trust.map((item, index) => (
              <li key={index}>
                <Icon name={index === 0 ? 'shield' : 'check'} size={15} />
                {t(item)}
              </li>
            ))}
          </Reveal>
        </div>

        <div className="hero__art">
          <div className="hero__art-glow" aria-hidden="true" />
          <Reveal className="hero__art-frame" delay={160}>
            {hero.image ? (
              <img src={hero.image} alt={lang === 'fa' ? 'پرینتر سه‌بعدی Flashforge AD5X' : 'Flashforge AD5X 3D printer'} />
            ) : (
              <PrinterArt
                variant="full"
                label={lang === 'fa' ? 'رندر شبیه‌سازی‌شده پرینتر سه‌بعدی Flashforge AD5X' : 'Simulated render of the Flashforge AD5X 3D printer'}
              />
            )}
            <span className="hero__label hero__label--a">
              <span className="num">500 mm/s</span>
            </span>
            <span className="hero__label hero__label--b">
              <span className="num">CoreXY</span>
            </span>
            <span className="hero__label hero__label--c">
              <span className="num">±0.1 mm</span>
            </span>
          </Reveal>
        </div>
      </div>

      <div className="container">
        <Reveal as="dl" className="hero__stats" delay={120}>
          {stats.map((stat) => (
            <div className="hero__stat" key={stat.en}>
              <dt className="hero__stat-label">{lang === 'fa' ? stat.fa : stat.en}</dt>
              <dd className="hero__stat-value">
                <span className="num">{stat.value}</span>
                {stat.unit ? <small className="num">{stat.unit}</small> : null}
              </dd>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
