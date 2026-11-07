import { Link } from 'react-router-dom';
import Icon from '../Icon.jsx';
import { IMAGES } from '../../data/images.js';

const FALLBACK = [
  {
    slug: 'the-tailoring-room',
    title: 'The Tailoring Room',
    subtitle: 'Made to last',
    image: IMAGES.tailoring,
    ctaHref: '/shop?category=suits',
  },
  {
    slug: 'english-vintage',
    title: 'English Vintage',
    subtitle: 'New season',
    image: IMAGES.editorial,
    ctaHref: '/shop?collection=english-vintage',
  },
  {
    slug: 'country-weekend',
    title: 'Country Weekend',
    subtitle: 'Off-duty heritage',
    image: IMAGES.trench,
    ctaHref: '/shop?category=outerwear',
  },
];

export default function FeaturedCollections({ collections = [] }) {
  const items = collections.length ? collections.slice(0, 3) : FALLBACK;

  return (
    <section className="shell mt-16 lg:mt-24">
      <div className="reveal flex items-end justify-between gap-4">
        <div>
          <p className="label mb-3 text-gold">Curated by the house</p>
          <h2 className="font-display text-2xl leading-none sm:text-3xl lg:text-4xl">Featured Collections</h2>
        </div>
        <Link to="/shop" className="link-line hidden shrink-0 pb-1 text-[10px] text-ink/70 hover:text-ink sm:inline-block">
          All collections
        </Link>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-3 sm:gap-5">
        {items.map((collection, index) => (
          <Link
            key={collection.slug}
            to={collection.ctaHref || '/shop'}
            className={`group relative block overflow-hidden bg-beige/40 ${index === 1 ? 'sm:mt-8' : ''}`}
          >
            <img
              src={collection.image}
              alt={collection.title}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover transition-transform duration-[1.3s] ease-luxury group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-ivory">
              <p className="text-[8px] uppercase tracking-label text-ivory/70">{collection.subtitle}</p>
              <h3 className="mt-2 font-display text-2xl leading-tight">{collection.title}</h3>
              <span className="mt-3 inline-flex items-center gap-2 text-[9px] uppercase tracking-label text-ivory/85">
                {collection.ctaLabel || 'Discover'}
                <Icon name="arrowUpRight" className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
