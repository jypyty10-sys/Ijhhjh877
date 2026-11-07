import { Link } from 'react-router-dom';
import Icon from '../Icon.jsx';
import { IMAGES } from '../../data/images.js';

export default function EditorialBanner({ collection }) {
  const title = collection?.title || 'English Vintage';
  const subtitle = collection?.subtitle || 'New Season';
  const description =
    collection?.description ||
    'Refined pieces. Authentic style. Inspired by a timeless era — from Donegal tweed to horn-button overcoats.';
  const image = collection?.image || IMAGES.editorial;
  const href = collection?.ctaHref || '/shop?collection=english-vintage';

  return (
    <section className="shell mt-16 lg:mt-24">
      <div className="reveal grid overflow-hidden rounded-md bg-beige/60 md:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 lg:py-16">
          <p className="label text-gold">{subtitle}</p>
          <h2 className="mt-4 font-display text-4xl leading-[0.95] sm:text-5xl lg:text-6xl">{title}</h2>
          <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-charcoal/70">{description}</p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link to={href} className="btn-dark group">
              Discover the collection
              <Icon name="arrowRight" className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
            <Link to="/shop?category=waistcoats" className="link-line text-[10px] text-ink/70 hover:text-ink">
              Waistcoats
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-4 text-[9px] uppercase tracking-label text-ink/40">
            <span>Wool</span>
            <span className="h-px w-6 bg-ink/20" />
            <span>Tweed</span>
            <span className="h-px w-6 bg-ink/20" />
            <span>Horn</span>
          </div>
        </div>
        <div className="relative min-h-[320px] overflow-hidden md:min-h-[480px]">
          <img
            src={image}
            alt="Editorial portrait of a model in a dark tweed coat and British flat cap"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-ivory/90 px-3 py-2 backdrop-blur">
            <p className="text-[8px] uppercase tracking-label text-ink/70">Photographed in Marylebone</p>
          </div>
        </div>
      </div>
    </section>
  );
}
