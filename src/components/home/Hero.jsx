import { Link } from 'react-router-dom';
import Icon from '../Icon.jsx';
import { IMAGES } from '../../data/images.js';
import { useStore } from '../../context/StoreContext.jsx';

export default function Hero() {
  const { settings } = useStore();
  const eyebrow = settings.hero_eyebrow || 'English Heritage for a Modern Generation.';
  const season = settings.hero_season || 'New Collection 2026';

  return (
    <section className="relative overflow-hidden bg-ivory">
      {/* Mobile composition */}
      <div className="shell pt-7 lg:hidden">
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-ink/20" />
          <p className="max-w-[220px] text-center text-[8px] font-medium uppercase leading-relaxed tracking-[0.2em] text-ink/75">
            {eyebrow}
          </p>
          <span className="h-px flex-1 bg-ink/20" />
        </div>

        <h1 className="display-hero mt-6 text-center text-[34vw] text-ink">Evora</h1>

        <div className="relative z-10 mx-auto -mt-[15vw] w-[92%] max-w-sm overflow-hidden bg-beige/40">
          <img
            src={IMAGES.hero}
            alt="Model wearing a charcoal wool overcoat, waistcoat and flat cap"
            className="aspect-[4/5] w-full object-cover object-top"
            fetchpriority="high"
          />
          <span className="absolute bottom-3 left-3 bg-ivory/90 px-2.5 py-1.5 text-[8px] font-medium uppercase tracking-label text-ink">
            {season}
          </span>
        </div>

        <p className="mx-auto mt-6 max-w-[300px] text-center text-[12px] leading-relaxed text-charcoal/70">
          {settings.hero_lead || 'Tailoring, outerwear and accessories drawn from the English countryside.'}
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <Link to="/shop" className="btn-dark w-full">
            Shop Now
            <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
          <Link to="/shop?collection=english-vintage" className="btn-light w-full">
            Explore Collection
          </Link>
        </div>
      </div>

      {/* Desktop composition */}
      <div className="relative hidden lg:block">
        <div className="pointer-events-none absolute inset-x-0 top-[8%] z-0 text-center">
          <span className="display-hero block whitespace-nowrap text-[23vw] text-ink">Evora</span>
        </div>

        <div className="shell relative z-10 grid grid-cols-[0.92fr_1.05fr_0.45fr] items-end gap-10 pb-14 pt-16">
          <div className="pb-20">
            <div className="max-w-[300px] border-y border-ink/25 py-4">
              <p className="text-[10px] font-medium uppercase leading-relaxed tracking-[0.2em] text-ink/80">
                {eyebrow}
              </p>
            </div>
            <p className="mt-7 max-w-[330px] text-[14px] leading-relaxed text-charcoal/70">
              {settings.hero_lead ||
                'Tailoring, outerwear and accessories drawn from the English countryside and cut for the modern city.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-dark group">
                Shop Now
                <Icon name="arrowRight" className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
              <Link to="/shop?collection=english-vintage" className="btn-light">
                Explore Collection
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[540px]">
            <div className="overflow-hidden bg-beige/40">
              <img
                src={IMAGES.hero}
                alt="Model wearing a charcoal wool overcoat, waistcoat and flat cap"
                className="aspect-[3/4] w-full object-cover object-top"
                fetchpriority="high"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 hidden w-40 border border-ink/15 bg-ivory p-3 xl:block">
              <p className="text-[8px] uppercase leading-relaxed tracking-label text-ink/60">
                The Wool Overcoat — $299
              </p>
            </div>
          </div>

          <div className="flex h-full flex-col items-end justify-start gap-4 pb-24 text-right">
            <span className="h-16 w-px bg-ink/25" />
            <p className="text-[9px] font-medium uppercase leading-relaxed tracking-[0.24em] text-ink/70">
              New
              <br />
              Collection
              <br />
              2026
            </p>
            <Link
              to="/our-heritage"
              className="link-line text-[9px] text-ink/60 hover:text-ink"
            >
              Our Heritage
            </Link>
          </div>
        </div>
      </div>

      {/* Signature strip */}
      <div className="mt-10 overflow-hidden border-y border-ink/10 py-3 lg:mt-0">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {Array.from({ length: 8 }).map((_, index) => (
            <span key={index} className="flex items-center gap-10 text-[9px] uppercase tracking-[0.32em] text-ink/45">
              Heritage <span className="text-gold">•</span> Character <span className="text-gold">•</span> Always
              Relevant
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
