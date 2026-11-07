import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard.jsx';
import Icon from '../Icon.jsx';

export default function ProductRail({
  eyebrow,
  title,
  href = '/shop',
  ctaLabel = 'View all',
  products = [],
  columns = 5,
  loading = false,
  onQuickView,
}) {
  const grid =
    columns === 4
      ? 'grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-5';

  return (
    <section className="shell mt-16 lg:mt-24">
      <div className="reveal flex items-end justify-between gap-4">
        <div>
          {eyebrow ? <p className="label mb-3 text-gold">{eyebrow}</p> : null}
          <h2 className="font-display text-2xl leading-none sm:text-3xl lg:text-4xl">{title}</h2>
        </div>
        <Link to={href} className="link-line flex shrink-0 items-center gap-2 pb-1 text-[10px] text-ink/70 hover:text-ink">
          {ctaLabel}
          <Icon name="arrowRight" className="h-3.5 w-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className={`mt-7 grid ${grid}`}>
          {Array.from({ length: columns }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-[3/4] w-full bg-beige/50" />
              <div className="mt-3 h-3 w-2/3 bg-beige/50" />
              <div className="mt-2 h-3 w-1/3 bg-beige/40" />
            </div>
          ))}
        </div>
      ) : products.length ? (
        <div className={`mt-7 grid ${grid}`}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
          ))}
        </div>
      ) : (
        <p className="mt-6 text-[13px] text-charcoal/60">Nothing in this edit just yet.</p>
      )}
    </section>
  );
}
