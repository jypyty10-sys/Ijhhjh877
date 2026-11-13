import { useState } from 'react';
import { useContent } from '../lib/content';
import { useLang } from '../lib/i18n';
import type { GalleryItem } from '../content/types';
import { Icon } from './Icon';
import { Lightbox } from './Lightbox';
import { PrinterArt, type ArtVariant } from './PrinterArt';
import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';

const SPANS: Record<number, string> = { 0: 'gallery-item--feature' };

export function Gallery() {
  const { content } = useContent();
  const { t, lang } = useLang();
  const { gallery } = content;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="gallery" className="section gallery" aria-labelledby="gallery-title">
      <div className="container">
        <SectionHead
          id="gallery-title"
          index="08"
          label="GALLERY"
          title={t(gallery.title)}
          aside={t(gallery.subtitle)}
        />

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
                <span className="gallery-item__media">
                  <PrinterArt variant={item.art as ArtVariant} label={t(item.label)} />
                </span>
                <span className="gallery-item__label">
                  <span className="gallery-item__index num" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="gallery-item__meta">
                    <span className="gallery-item__name">{t(item.label)}</span>
                    <span className="gallery-item__hint">
                      {lang === 'fa' ? 'مشاهده' : 'View'}
                      <Icon name="zoom" size={13} />
                    </span>
                  </span>
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
