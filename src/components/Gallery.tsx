import { useState } from 'react';
import { useContent } from '../lib/content';
import { useLang } from '../lib/i18n';
import type { GalleryItem } from '../content/types';
import { Icon } from './Icon';
import { Lightbox } from './Lightbox';
import { PrinterArt, type ArtVariant } from './PrinterArt';
import { Reveal } from './Reveal';

const SPANS: Record<number, string> = { 0: 'gallery-item--wide', 3: 'gallery-item--tall' };

export function Gallery() {
  const { content } = useContent();
  const { t, lang } = useLang();
  const { gallery } = content;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="gallery" className="section gallery" aria-labelledby="gallery-title">
      <div className="container">
        <Reveal className="section-head section-head--split">
          <div className="stack" style={{ gap: 14 }}>
            <span className="eyebrow">GALLERY</span>
            <h2 className="section-title" id="gallery-title">
              {t(gallery.title)}
            </h2>
          </div>
          <p className="section-head__aside">{t(gallery.subtitle)}</p>
        </Reveal>

        <div className="gallery-grid">
          {gallery.items.map((item: GalleryItem, index) => (
            <Reveal key={item.id} delay={(index % 4) * 50} className={`gallery-item ${SPANS[index] ?? ''}`.trim()}>
              <button
                type="button"
                className="gallery-item__button"
                onClick={() => setOpenIndex(index)}
                aria-label={
                  lang === 'fa' ? `بزرگ‌نمایی ${t(item.label)}` : `Enlarge ${t(item.label)}`
                }
              >
                <PrinterArt variant={item.art as ArtVariant} label={t(item.label)} />
                <span className="gallery-item__label">
                  {t(item.label)}
                  <Icon name="zoom" size={14} />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {openIndex !== null ? (
        <Lightbox
          items={gallery.items}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />
      ) : null}
    </section>
  );
}
