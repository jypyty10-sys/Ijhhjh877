import Icon from '../Icon.jsx';
import { INSTAGRAM_IMAGES } from '../../data/images.js';
import { useStore } from '../../context/StoreContext.jsx';

export default function InstagramGallery() {
  const { settings } = useStore();
  return (
    <section className="shell mt-16 lg:mt-24">
      <div className="reveal flex flex-col items-center text-center">
        <p className="label text-gold">The Gallery</p>
        <h2 className="mt-3 font-display text-2xl sm:text-3xl lg:text-4xl">
          {settings.instagram_handle || '@evorastyle'}
        </h2>
        <p className="mt-3 max-w-md text-[12px] leading-relaxed text-charcoal/60">
          Worn by our community, photographed between seasons. Tag {settings.instagram_handle || '@evorastyle'} to be
          featured.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">
        {INSTAGRAM_IMAGES.map((image) => (
          <a
            key={image.url}
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer noopener"
            className="group relative block overflow-hidden bg-beige/40"
          >
            <img
              src={image.url}
              alt={image.alt}
              loading="lazy"
              className="aspect-square w-full object-cover transition-transform duration-[1.1s] ease-luxury group-hover:scale-[1.06]"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-ink/0 text-ivory opacity-0 transition-all duration-500 group-hover:bg-ink/30 group-hover:opacity-100">
              <Icon name="instagram" className="h-5 w-5" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
