import { Link } from 'react-router-dom';
import { IMAGES } from '../data/images.js';

export default function AuthShell({ eyebrow, title, subtitle, children, image = IMAGES.editorial, alt }) {
  return (
    <div className="shell py-8 lg:py-14">
      <div className="grid overflow-hidden border border-ink/10 md:grid-cols-2">
        <div className="relative hidden min-h-[560px] md:block">
          <img src={image} alt={alt || 'EVORA STYLE editorial'} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 text-ivory">
            <p className="text-[9px] uppercase tracking-[0.3em] text-ivory/60">The House</p>
            <p className="mt-3 font-display text-2xl leading-snug">“A coat should outlive its owner.”</p>
            <p className="mt-3 text-[10px] uppercase tracking-label text-ivory/50">Est. 1954, London</p>
          </div>
        </div>

        <div className="bg-ivory px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
          <Link to="/" className="font-display text-sm uppercase tracking-[0.3em]">
            Evora Style
          </Link>
          {eyebrow ? <p className="label mt-8 text-gold">{eyebrow}</p> : null}
          <h1 className="mt-3 font-display text-3xl leading-tight">{title}</h1>
          {subtitle ? <p className="mt-3 text-[13px] leading-relaxed text-charcoal/65">{subtitle}</p> : null}
          <div className="mt-7">{children}</div>
        </div>
      </div>
    </div>
  );
}
