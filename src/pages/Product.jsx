import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useStore } from '../context/StoreContext.jsx';
import { money } from '../lib/format.js';
import { usePageMeta } from '../lib/hooks.js';
import Icon from '../components/Icon.jsx';
import ProductCard from '../components/ProductCard.jsx';
import QuickView from '../components/QuickView.jsx';

const RECENT_KEY = 'evora_recently_viewed';

const SIZE_TABLE = [
  { size: 'S', chest: '96–101', waist: '76–81', shoulder: '44' },
  { size: 'M', chest: '101–106', waist: '81–86', shoulder: '45.5' },
  { size: 'L', chest: '106–111', waist: '86–91', shoulder: '47' },
  { size: 'XL', chest: '111–117', waist: '91–97', shoulder: '48.5' },
  { size: 'XXL', chest: '117–124', waist: '97–104', shoulder: '50' },
];

function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-ink/10">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-[10px] font-medium uppercase tracking-label">{title}</span>
        <Icon name={open ? 'minus' : 'plus'} className="h-4 w-4 text-ink/50" />
      </button>
      {open ? <div className="pb-5 text-[13px] leading-relaxed text-charcoal/70">{children}</div> : null}
    </div>
  );
}

export default function Product() {
  const { slug } = useParams();
  const { addToCart, pushToast, wishlist, toggleWishlist } = useStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [sizeGuide, setSizeGuide] = useState(false);
  const [quickView, setQuickView] = useState(null);
  const [recent, setRecent] = useState([]);

  const product = data?.product;

  usePageMeta(product?.name || 'Product', product?.description || '');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    api
      .get(`/products/${slug}`)
      .then((payload) => {
        if (cancelled) return;
        setData(payload);
        setActiveImage(0);
        setSize(payload.product.sizes?.[0] || '');
        setColor(payload.product.colors?.[0]?.name || '');
        setQuantity(1);
        try {
          const stored = JSON.parse(window.localStorage.getItem(RECENT_KEY) || '[]');
          setRecent(stored.filter((item) => item.slug !== payload.product.slug).slice(0, 4));
          const entry = {
            slug: payload.product.slug,
            name: payload.product.name,
            price: payload.product.price,
            categoryName: payload.product.categoryName,
            images: payload.product.images,
            sizes: payload.product.sizes,
            colors: payload.product.colors,
            stock: payload.product.stock,
            id: payload.product.id,
          };
          const next = [entry, ...stored.filter((item) => item.slug !== entry.slug)].slice(0, 6);
          window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
        } catch {
          /* storage unavailable */
        }
      })
      .catch(() => !cancelled && setNotFound(true))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const saved = product ? wishlist.ids?.includes(product.id) : false;
  const images = product?.images || [];

  const shippingCopy = useMemo(
    () =>
      'Complimentary delivery on orders over $250. Standard delivery 3–5 working days, express 1–2. Returns accepted within 14 days of delivery, unworn and with tags attached.',
    []
  );

  const submit = async () => {
    if (!product) return;
    setBusy(true);
    try {
      await addToCart({ productId: product.id, size, color, quantity });
    } catch (error) {
      pushToast(error.message, { tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const onWishlist = async () => {
    try {
      await toggleWishlist(product.id);
    } catch (error) {
      pushToast(error.message, { tone: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="shell grid gap-10 py-12 lg:grid-cols-2">
        <div className="aspect-[3/4] animate-pulse bg-beige/50" />
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse bg-beige/50" />
          <div className="h-10 w-2/3 animate-pulse bg-beige/50" />
          <div className="h-4 w-20 animate-pulse bg-beige/40" />
          <div className="h-24 w-full animate-pulse bg-beige/30" />
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="shell flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="label text-gold">404</p>
        <h1 className="mt-4 font-display text-4xl">This piece has left the collection.</h1>
        <p className="mt-3 max-w-sm text-[13px] text-charcoal/65">
          It may have sold through, or the link may be mistyped. The current collection is waiting.
        </p>
        <Link to="/shop" className="btn-dark mt-8">
          Shop the collection
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="shell pt-6">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-label text-ink/40">
          <Link to="/" className="hover:text-ink">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-ink">
            Shop
          </Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-ink">
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-ink/70">{product.name}</span>
        </nav>
      </div>

      <div className="shell mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div>
          <div
            className="relative overflow-hidden bg-beige/40"
            onMouseMove={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              setZoomPos({
                x: ((event.clientX - rect.left) / rect.width) * 100,
                y: ((event.clientY - rect.top) / rect.height) * 100,
              });
            }}
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
          >
            <img
              src={images[activeImage]?.url}
              alt={images[activeImage]?.alt || product.name}
              className="aspect-[4/5] w-full cursor-zoom-in object-cover transition-transform duration-300 lg:aspect-[3/4]"
              style={
                zoom
                  ? { transform: 'scale(1.6)', transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                  : undefined
              }
            />
            <span className="pointer-events-none absolute bottom-3 right-3 hidden items-center gap-1.5 bg-ivory/85 px-2.5 py-1.5 text-[8px] uppercase tracking-label text-ink/70 lg:flex">
              <Icon name="zoom" className="h-3 w-3" /> Hover to zoom
            </span>
            {product.badge ? (
              <span className="absolute left-3 top-3 bg-ivory/95 px-2.5 py-1.5 text-[8px] font-medium uppercase tracking-label">
                {product.badge}
              </span>
            ) : null}
          </div>

          {images.length > 1 ? (
            <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
              {images.map((image, index) => (
                <button
                  key={image.url}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`View image ${index + 1}`}
                  aria-current={activeImage === index}
                  className={`h-24 w-20 shrink-0 overflow-hidden border transition-colors ${
                    activeImage === index ? 'border-ink' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt || product.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="label text-gold">{product.categoryName}</p>
          <h1 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">{product.name}</h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-xl tabular-nums">{money(product.price)}</span>
            {product.comparePrice ? (
              <span className="text-[13px] text-warmgray line-through tabular-nums">{money(product.comparePrice)}</span>
            ) : null}
            <span className="ml-auto text-[10px] uppercase tracking-label text-ink/45">
              {product.stock > 0 ? `${product.stock > 10 ? 'In stock' : `Only ${product.stock} left`}` : 'Sold out'}
            </span>
          </div>

          <p className="mt-5 text-[13px] leading-relaxed text-charcoal/75">{product.description}</p>

          {product.sizes?.length ? (
            <div className="mt-7">
              <div className="flex items-center justify-between">
                <p className="label text-ink/55">Size</p>
                <button
                  type="button"
                  onClick={() => setSizeGuide(true)}
                  className="text-[9px] uppercase tracking-label text-ink/50 underline underline-offset-4 hover:text-ink"
                >
                  Size guide
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Select size">
                {product.sizes.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSize(option)}
                    aria-pressed={size === option}
                    className={`min-w-[52px] border px-3 py-2.5 text-[11px] uppercase tracking-wide transition-colors ${
                      size === option ? 'border-ink bg-ink text-ivory' : 'border-ink/20 hover:border-ink'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {product.colors?.length ? (
            <div className="mt-5">
              <p className="label text-ink/55">Colour — {color}</p>
              <div className="mt-3 flex gap-2.5">
                {product.colors.map((option) => (
                  <button
                    key={option.name}
                    type="button"
                    onClick={() => setColor(option.name)}
                    aria-label={option.name}
                    aria-pressed={color === option.name}
                    title={option.name}
                    className={`h-8 w-8 rounded-full border transition-all ${
                      color === option.name
                        ? 'border-ink ring-1 ring-ink ring-offset-2 ring-offset-ivory'
                        : 'border-ink/20 hover:border-ink/50'
                    }`}
                    style={{ backgroundColor: option.hex }}
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-7 flex items-stretch gap-2">
            <div className="flex items-center border border-ink/20">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="flex h-full w-10 items-center justify-center text-ink/70"
              >
                <Icon name="minus" className="h-3 w-3" />
              </button>
              <span className="w-8 text-center text-[12px] tabular-nums" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((value) => Math.min(product.stock || 10, value + 1))}
                className="flex h-full w-10 items-center justify-center text-ink/70"
              >
                <Icon name="plus" className="h-3 w-3" />
              </button>
            </div>
            <button type="button" onClick={submit} disabled={busy || product.stock < 1} className="btn-dark flex-1">
              {product.stock < 1 ? 'Sold out' : busy ? 'Adding…' : 'Add to Bag'}
            </button>
            <button
              type="button"
              onClick={onWishlist}
              aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
              aria-pressed={saved}
              className={`flex w-12 items-center justify-center border transition-colors ${
                saved ? 'border-ink bg-ink text-ivory' : 'border-ink/20 text-ink hover:border-ink'
              }`}
            >
              <Icon name="heart" className="h-4 w-4" fill={saved ? 'solid' : 'none'} />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[10px] uppercase tracking-label text-ink/50">
            <span className="flex items-center gap-2">
              <Icon name="truck" className="h-4 w-4" /> Free delivery over $250
            </span>
            <span className="flex items-center gap-2">
              <Icon name="returns" className="h-4 w-4" /> 14-day returns
            </span>
          </div>

          <div className="mt-8">
            <Accordion title="The story" defaultOpen>
              <p>{product.story || product.description}</p>
            </Accordion>
            <Accordion title="Delivery & returns">{shippingCopy}</Accordion>
            <Accordion title="Specifications">
              <dl className="space-y-2">
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 text-[10px] uppercase tracking-label text-ink/45">Material</dt>
                  <dd>{product.material || '—'}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 text-[10px] uppercase tracking-label text-ink/45">Care</dt>
                  <dd>{product.care || '—'}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 text-[10px] uppercase tracking-label text-ink/45">Sizes</dt>
                  <dd>{product.sizes?.join(', ') || 'One size'}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 text-[10px] uppercase tracking-label text-ink/45">Reference</dt>
                  <dd>EV-{String(product.id).padStart(4, '0')}</dd>
                </div>
              </dl>
            </Accordion>
          </div>
        </div>
      </div>

      {data?.related?.length ? (
        <section className="shell mt-16 lg:mt-24">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl sm:text-3xl">You may also like</h2>
            <Link to={`/shop?category=${product.category}`} className="link-line text-[10px] text-ink/60 hover:text-ink">
              More {product.categoryName}
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {data.related.map((item) => (
              <ProductCard key={item.id} product={item} onQuickView={setQuickView} />
            ))}
          </div>
        </section>
      ) : null}

      {recent.length ? (
        <section className="shell mt-16">
          <h2 className="font-display text-xl">Recently viewed</h2>
          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
            {recent.map((item) => (
              <ProductCard key={item.slug} product={item} onQuickView={setQuickView} />
            ))}
          </div>
        </section>
      ) : null}

      {sizeGuide ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Size guide">
          <button type="button" aria-label="Close size guide" className="absolute inset-0" onClick={() => setSizeGuide(false)} />
          <div className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto bg-ivory p-6 sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="label text-gold">Measurements in cm</p>
                <h3 className="mt-2 font-display text-2xl">Size Guide</h3>
              </div>
              <button
                type="button"
                onClick={() => setSizeGuide(false)}
                aria-label="Close size guide"
                className="flex h-8 w-8 items-center justify-center text-ink/50"
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>
            <table className="mt-6 w-full text-left text-[12px]">
              <thead>
                <tr className="border-b border-ink/15 text-[9px] uppercase tracking-label text-ink/45">
                  <th className="py-2 font-medium">Size</th>
                  <th className="py-2 font-medium">Chest</th>
                  <th className="py-2 font-medium">Waist</th>
                  <th className="py-2 font-medium">Shoulder</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_TABLE.map((row) => (
                  <tr key={row.size} className="border-b border-ink/10">
                    <td className="py-2.5 font-medium">{row.size}</td>
                    <td className="py-2.5 tabular-nums">{row.chest}</td>
                    <td className="py-2.5 tabular-nums">{row.waist}</td>
                    <td className="py-2.5 tabular-nums">{row.shoulder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-5 text-[12px] leading-relaxed text-charcoal/65">
              Our tailoring runs true to size with a considered, slightly relaxed line. Between sizes? Take the
              smaller for a closer fit, the larger if you intend to layer. The concierge can advise on any piece.
            </p>
          </div>
        </div>
      ) : null}

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </div>
  );
}
