import { useEffect } from 'react';
import type { GalleryItem } from '../content/types';
import { useLang } from '../lib/i18n';
import { Icon } from './Icon';
import { PrinterArt, type ArtVariant } from './PrinterArt';

interface LightboxProps {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const { t, lang } = useLang();
  const item = items[index];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onNavigate((index + 1) % items.length);
      if (event.key === 'ArrowLeft') onNavigate((index - 1 + items.length) % items.length);
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [index, items.length, onClose, onNavigate]);

  if (!item) return null;

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={t(item.label)}>
      <div className="lightbox__bar">
        <span>
          {t(item.label)} <span className="num">{`${index + 1} / ${items.length}`}</span>
        </span>
        <button
          type="button"
          className="icon-btn"
          onClick={onClose}
          aria-label={lang === 'fa' ? 'بستن گالری' : 'Close gallery'}
          autoFocus
        >
          <Icon name="close" size={17} />
        </button>
      </div>

      <div className="lightbox__stage">
        <PrinterArt variant={item.art as ArtVariant} label={t(item.label)} />
        <button
          type="button"
          className="lightbox__nav lightbox__nav--prev"
          onClick={() => onNavigate((index - 1 + items.length) % items.length)}
          aria-label={lang === 'fa' ? 'تصویر قبلی' : 'Previous image'}
        >
          <Icon name="arrow" size={18} />
        </button>
        <button
          type="button"
          className="lightbox__nav lightbox__nav--next"
          onClick={() => onNavigate((index + 1) % items.length)}
          aria-label={lang === 'fa' ? 'تصویر بعدی' : 'Next image'}
        >
          <Icon name="arrow" size={18} />
        </button>
      </div>

      <div className="lightbox__thumbs">
        {items.map((thumb, thumbIndex) => (
          <button
            key={thumb.id}
            type="button"
            className="lightbox__thumb"
            aria-current={thumbIndex === index}
            aria-label={t(thumb.label)}
            onClick={() => onNavigate(thumbIndex)}
          >
            <PrinterArt variant={thumb.art as ArtVariant} label="" />
          </button>
        ))}
      </div>
    </div>
  );
}
