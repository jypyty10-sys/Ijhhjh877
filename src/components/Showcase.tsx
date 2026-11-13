import { useState } from 'react';
import { useContent } from '../lib/content';
import { useLang } from '../lib/i18n';
import { Icon } from './Icon';
import { PrinterArt } from './PrinterArt';
import { Reveal } from './Reveal';

export function Showcase() {
  const { content } = useContent();
  const { t, lang } = useLang();
  const { showcase } = content;
  const [selectedId, setSelectedId] = useState(showcase.hotspots[0]?.id ?? '');
  const selected = showcase.hotspots.find((h) => h.id === selectedId) ?? showcase.hotspots[0];

  return (
    <section id="showcase" className="section showcase" aria-labelledby="showcase-title">
      <div className="container">
        <Reveal className="section-head section-head--split">
          <div className="stack" style={{ gap: 14 }}>
            <span className="eyebrow">COMPONENTS</span>
            <h2 className="section-title" id="showcase-title">
              {t(showcase.title)}
            </h2>
          </div>
          <p className="section-head__aside">{t(showcase.subtitle)}</p>
        </Reveal>

        <div className="showcase__grid">
          <Reveal className="showcase__stage">
            <div className="showcase__art">
              <PrinterArt
                variant="full"
                label={
                  lang === 'fa'
                    ? 'نمای تعاملی اجزای پرینتر Flashforge AD5X'
                    : 'Interactive component view of the Flashforge AD5X'
                }
              />
              {showcase.hotspots.map((hotspot, index) => (
                <button
                  key={hotspot.id}
                  type="button"
                  className="hotspot"
                  style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                  aria-pressed={selected?.id === hotspot.id}
                  aria-label={`${t(hotspot.title)} — ${t(showcase.hint)}`}
                  onClick={() => setSelectedId(hotspot.id)}
                >
                  <span className="hotspot__ring" aria-hidden="true" />
                  <span className="hotspot__dot" aria-hidden="true" />
                  <span className="visually-hidden">{`${index + 1}`}</span>
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal className="showcase__panel" delay={120}>
            <span className="showcase__hint">
              <Icon name="target" size={15} />
              {t(showcase.hint)}
            </span>

            <div className="hotspot-tabs" role="group" aria-label={t(showcase.hint)}>
              {showcase.hotspots.map((hotspot) => (
                <button
                  key={hotspot.id}
                  type="button"
                  className="hotspot-tab"
                  aria-pressed={selected?.id === hotspot.id}
                  onClick={() => setSelectedId(hotspot.id)}
                >
                  {t(hotspot.title)}
                </button>
              ))}
            </div>

            {selected ? (
              <div className="hotspot-info" aria-live="polite">
                <span className="hotspot-info__index num">
                  {String(showcase.hotspots.indexOf(selected) + 1).padStart(2, '0')} /{' '}
                  {String(showcase.hotspots.length).padStart(2, '0')}
                </span>
                <h3 className="hotspot-info__title">{t(selected.title)}</h3>
                <p className="hotspot-info__text">{t(selected.text)}</p>
              </div>
            ) : null}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
