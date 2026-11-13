import type { CSSProperties } from 'react';
import { useState } from 'react';
import { useContent } from '../lib/content';
import { useLang } from '../lib/i18n';
import { Icon } from './Icon';
import { Reveal } from './Reveal';

function Spool({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 240 240" className="filament-spool" role="img" aria-label="">
      <defs>
        <linearGradient id="spool-edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.30" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
        </linearGradient>
        <radialGradient id="spool-body" cx="38%" cy="30%" r="75%">
          <stop offset="0%" stopColor={color} />
          <stop offset="62%" stopColor={color} stopOpacity="0.92" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
        </radialGradient>
      </defs>
      <circle cx="120" cy="120" r="112" fill="#0b1017" opacity="0.9" />
      <circle cx="120" cy="120" r="106" fill="url(#spool-body)" />
      <circle cx="120" cy="120" r="106" fill="none" stroke="url(#spool-edge)" strokeWidth="2" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="120"
          y1="26"
          x2="120"
          y2="62"
          stroke="#000"
          strokeOpacity="0.18"
          strokeWidth="7"
          transform={`rotate(${deg} 120 120)`}
        />
      ))}
      <circle cx="120" cy="120" r="52" fill="#0a0f15" />
      <circle cx="120" cy="120" r="52" fill="none" stroke="#ffffff" strokeOpacity="0.14" />
      <circle cx="120" cy="120" r="18" fill="#1d2531" />
      <circle cx="120" cy="120" r="6" fill="#2f3a48" />
      <path
        d="M120 14a106 106 0 0 1 96 56"
        stroke="#ffffff"
        strokeOpacity="0.35"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Filaments() {
  const { content } = useContent();
  const { t } = useLang();
  const { filaments } = content;
  const [selectedId, setSelectedId] = useState(filaments.items[0]?.id ?? '');
  const selected = filaments.items.find((item) => item.id === selectedId) ?? filaments.items[0];

  return (
    <section id="filaments" className="section filaments" aria-labelledby="filaments-title">
      <div className="container filaments__grid">
        <Reveal>
          <div
            className="filament-stage"
            style={{ '--filament': selected?.hex ?? '#0789E8' } as CSSProperties}
          >
            {selected ? <Spool color={selected.hex} /> : null}
            {selected ? (
              <div className="filament-caption">
                <strong>{t(selected.name)}</strong>
                <span>{selected.hex}</span>
              </div>
            ) : null}
          </div>
        </Reveal>

        <div>
          <Reveal>
            <div className="stack" style={{ gap: 14 }}>
              <span className="eyebrow">
                <span className="eyebrow__num num">05</span>
                FILAMENT
              </span>
              <h2 className="section-title" id="filaments-title">
                {t(filaments.title)}
              </h2>
              <p className="section-head__aside">{t(filaments.subtitle)}</p>
            </div>
          </Reveal>

          <Reveal className="filament-list" delay={80}>
            {filaments.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className="filament-swatch"
                aria-pressed={selected?.id === item.id}
                onClick={() => setSelectedId(item.id)}
              >
                <span
                  className="filament-swatch__dot"
                  style={{ background: item.hex }}
                  aria-hidden="true"
                />
                <span className="filament-swatch__name">{t(item.name)}</span>
              </button>
            ))}
          </Reveal>

          <Reveal as="p" className="filament-note" delay={120}>
            <Icon name="warning" size={15} />
            {t(filaments.note)}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
