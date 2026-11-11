import { Link } from 'react-router-dom';
import Icon from '../Icon.jsx';

const SERVICE_CATEGORIES = [
  { slug: 'suits', name: 'Suits', copy: 'Timeless tailoring with character.', image: 'https://images.unsplash.com/photo-1669575903350-9a349b411810?auto=format&fit=crop&w=600&q=80' },
  { slug: 'outerwear', name: 'Outerwear', copy: 'Classic coats for every season.', image: 'https://images.unsplash.com/photo-1619603364937-8d7af41ef206?auto=format&fit=crop&w=600&q=80' },
  { slug: 'accessories', name: 'Accessories', copy: 'The details make the difference.', image: 'https://images.unsplash.com/photo-1629139033414-76f3c0eacf84?auto=format&fit=crop&w=600&q=80' },
  { slug: 'flat-caps', name: 'Caps', copy: 'An iconic look for modern times.', image: 'https://images.unsplash.com/photo-1787675629407-2b3983cdba69?auto=format&fit=crop&w=600&q=80' },
  { slug: 'shoes', name: 'Shoes', copy: 'Crafted for timeless elegance.', image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80' },
];

export default function CategoryShowcase({ categories = [] }) {
  const cards = SERVICE_CATEGORIES.map((item) => {
    const match = categories.find((category) => category.slug === item.slug);
    return { ...item, image: match?.image || item.image, copy: match?.description || item.copy };
  });

  // `data-hero-next-section` is where the hero film hands the page over; scroll-mt keeps the
  // sticky header off its top edge when scrollIntoView lands on it.
  return (
    <section
      data-hero-next-section
      className="shell mt-14 scroll-mt-[calc(var(--header-h,0px)+1rem)] lg:mt-20"
    >
      <div className="rounded-md bg-charcoal px-5 py-8 text-ivory sm:px-8 sm:py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="label text-ivory/40">Shop by category</p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl">The Wardrobe</h2>
          </div>
          <Link to="/shop" className="link-line hidden text-[10px] text-ivory/70 hover:text-ivory sm:inline-block">
            View all
          </Link>
        </div>

        <div className="mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 no-scrollbar lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0">
          {cards.map((card) => (
            <Link
              key={card.slug}
              to={`/shop?category=${card.slug}`}
              className="group relative flex w-[74%] shrink-0 snap-start flex-col rounded-md border border-ivory/10 p-5 transition-colors duration-500 hover:border-ivory/30 hover:bg-ivory/[0.04] sm:w-[46%] lg:w-auto"
            >
              <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border border-ivory/15">
                <img
                  src={card.image}
                  alt={card.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1.1s] ease-luxury group-hover:scale-110"
                />
              </div>
              <h3 className="mt-5 font-display text-lg uppercase tracking-wide2">{card.name}</h3>
              <p className="mt-2 min-h-[36px] text-[11px] leading-relaxed text-ivory/50">{card.copy}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-[9px] font-medium uppercase tracking-label text-ivory/70 transition-colors group-hover:text-ivory">
                Shop now
                <Icon name="arrowRight" className="h-3 w-3 transition-transform duration-500 group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
