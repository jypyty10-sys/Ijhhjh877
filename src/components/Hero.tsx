import { useContent } from '../lib/content';
import { useLang } from '../lib/i18n';
import { useLead } from '../lib/lead';
import { Icon } from './Icon';
import { ProductStage } from './ProductStage';

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

  const callouts = [
    { key: 'speed', label: 'MAX SPEED', value: '500 mm/s', pos: 'a' },
    { key: 'filament', label: 'FILAMENT', value: '4 spools', pos: 'b' },
    { key: 'accuracy', label: 'ACCURACY', value: '±0.1 mm', pos: 'c' },
  ];

  return (
    <section id="overview" className="hero" aria-labelledby="hero-title">
      <div className="hero__atmosphere" aria-hidden="true">
        <span className="hero__grid-lines" />
        <span className="hero__halo hero__halo--a" />
        <span className="hero__halo hero__halo--b" />
        <span className="hero__horizon" />
        <span className="grain" />
      </div>

      <div className="container hero__inner">
        <div className="hero__lead">
          <span className="hero__eyebrow">
            <span className="hero__eyebrow-dot">
              <Icon name="sparkle" size={12} />
            </span>
            {t(hero.eyebrow)}
          </span>

          <div className="hero__wordmark">
            <span className="hero__brand">{hero.brand}</span>
            <span className="hero__model">{hero.model}</span>
            <span className="hero__rule" aria-hidden="true" />
          </div>
        </div>

        <div className="hero__visual">
          <ProductStage
            label={
              lang === 'fa'
                ? 'رندر شبیه‌سازی‌شده پرینتر سه‌بعدی Flashforge AD5X'
                : 'Simulated render of the Flashforge AD5X 3D printer'
            }
            image={hero.image}
          >
            <div className="callouts" aria-hidden="true">
              {callouts.map((callout) => (
                <span className={`callout callout--${callout.pos}`} key={callout.key}>
                  <span className="callout__dot" />
                  <span className="callout__line" />
                  <span className="callout__card">
                    <small>{callout.label}</small>
                    <strong className="num">{callout.value}</strong>
                  </span>
                </span>
              ))}
            </div>
          </ProductStage>
        </div>

        <div className="hero__body">
          <h1 className="hero__title" id="hero-title">
            {t(hero.headline)}
          </h1>
          <p className="hero__desc">{t(hero.description)}</p>

          <div className="hero__actions">
            <a className="btn btn--primary btn--lg" href="#specs">
              {t(hero.primaryCta)}
              <Icon name="arrow" size={17} data-flip />
            </a>
            <button type="button" className="btn btn--ghost btn--lg" onClick={() => open('buy')}>
              {t(hero.secondaryCta)}
            </button>
          </div>

          <ul className="hero__trust">
            {hero.trust.map((item, index) => (
              <li key={index}>
                <Icon name={index === 0 ? 'shield' : 'check'} size={14} />
                {t(item)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container hero__stats-wrap">
        <dl className="hero__stats">
          {stats.map((stat) => (
            <div className="hero__stat" key={stat.en}>
              <dt className="hero__stat-label">{lang === 'fa' ? stat.fa : stat.en}</dt>
              <dd className="hero__stat-value">
                <span className="num">{stat.value}</span>
                {stat.unit ? <small className="num">{stat.unit}</small> : null}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
