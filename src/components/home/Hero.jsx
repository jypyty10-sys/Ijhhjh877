import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../Icon.jsx';
import { useStore } from '../../context/StoreContext.jsx';
import wordmarkImage from '../../assets/hero/evora-wordmark.webp';
import mannequinImage from '../../assets/hero/evora-mannequin.png';

// One shared scroll timeline carries the visitor from the hero straight into the shop.
//   layer 1 — the hero panel, pinned while the shop rises over it
//   layer 2 — the EVORA wordmark plate (never transformed)
//   layer 3 — the cut-out figure, the only element that travels
// The figure starts on its hero mark, lifts off while the shop scrolls up beneath it and
// lands on the collection portrait, where it settles into the frame and dissolves into
// the photograph. Every value is a pure function of window.scrollY, so stopping the wheel
// stops the scene and scrolling back up replays it exactly in reverse.
const MERGE_TARGET = '[data-hero-merge-target]';

const lerp = (from, to, t) => from + (to - from) * t;
const clamp01 = (value) => Math.min(1, Math.max(0, value));

export default function Hero() {
  const { settings } = useStore();
  const eyebrow = settings.hero_eyebrow || 'English Heritage for a Modern Generation.';
  const lead =
    settings.hero_lead || 'Tailoring, outerwear and accessories drawn from the English countryside and cut for the modern city.';
  const season = settings.hero_season || 'New Collection 2026';

  const slotRef = useRef(null);
  const layerRef = useRef(null);
  const figureRef = useRef(null);

  useLayoutEffect(() => {
    const slot = slotRef.current;
    const layer = layerRef.current;
    const figure = figureRef.current;
    if (!slot || !layer || !figure) return undefined;

    // Respect the visitor's motion preference: the figure simply stays on its hero mark.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let frame = 0;

    const paint = () => {
      frame = 0;
      const mark = slot.getBoundingClientRect();
      const target = document.querySelector(MERGE_TARGET);
      const targetBox = target ? target.getBoundingClientRect() : null;

      // The scene is spent once the collection portrait sits in the middle of the screen.
      const landing = targetBox
        ? targetBox.top + targetBox.height / 2 + window.scrollY - window.innerHeight * 0.55
        : window.innerHeight;
      const progress = clamp01(window.scrollY / Math.max(1, landing));
      const eased = progress * progress * (3 - 2 * progress);

      const size = `${mark.width}px`;
      if (figure.style.width !== size) {
        figure.style.width = size;
        figure.style.height = `${mark.height}px`;
      }

      let x = mark.left;
      let y = mark.top;
      let width = mark.width;

      if (targetBox) {
        // Land at the size that fits the collection frame, so the figure settles inside
        // the photograph instead of overflowing it.
        const fit = Math.min(targetBox.width / mark.width, targetBox.height / mark.height) * 0.96;
        width = lerp(mark.width, mark.width * fit, eased);
        const height = mark.height * (width / mark.width);
        x = lerp(mark.left, targetBox.left + (targetBox.width - width) / 2, eased);
        y = lerp(mark.top, targetBox.top + (targetBox.height - height) / 2, eased);
      }

      // Scaling happens around the centre, so the painted box is offset back to (x, y).
      const scale = width / mark.width;
      const dx = (mark.width * (1 - scale)) / 2;
      const dy = (mark.height * (1 - scale)) / 2;
      // A shallow arc and a roll give the travel depth instead of a flat slide.
      const arc = Math.sin(Math.PI * eased);
      const lift = arc * mark.height * 0.14;
      const roll = -6 * arc;

      figure.style.transform =
        `translate3d(${(x - dx).toFixed(2)}px, ${(y - lift - dy).toFixed(2)}px, 0) ` +
        `rotateY(${roll.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      figure.style.opacity = (1 - clamp01((progress - 0.86) / 0.14)).toFixed(3);
    };

    const request = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    paint();
    layer.style.visibility = 'visible';

    // Anything that reflows above the figure (fonts, the promo bar, lazy images) moves its
    // hero mark, so re-measure on layout changes as well as on scroll.
    const observer = new ResizeObserver(request);
    observer.observe(document.body);
    observer.observe(slot);

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    window.addEventListener('load', request);
    document.fonts?.ready.then(request);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      window.removeEventListener('load', request);
      if (frame) cancelAnimationFrame(frame);
      layer.style.visibility = 'hidden';
    };
  }, []);

  return (
    <>
      <section className="sticky top-0 h-[100svh] overflow-hidden bg-paper">
        {/* Wordmark plate + the figure's hero mark */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <img
            src={wordmarkImage}
            alt=""
            aria-hidden="true"
            draggable="false"
            fetchpriority="high"
            className="absolute left-1/2 top-[66svh] w-[94vw] max-w-[1800px] -translate-x-1/2 -translate-y-1/2 select-none lg:top-1/2 lg:w-[96vw]"
          />

          <div
            ref={slotRef}
            className="absolute bottom-[15svh] left-1/2 h-[40svh] aspect-[614/933] -translate-x-1/2 lg:bottom-auto lg:top-[52%] lg:h-[min(52vw,68svh)] lg:-translate-y-1/2"
          >
            <img
              src={mannequinImage}
              alt="Man in a charcoal tweed three-piece suit, wool overcoat and flat cap"
              draggable="false"
              className="hidden h-full w-full select-none [filter:drop-shadow(0_24px_44px_rgba(17,17,17,0.18))] motion-reduce:block"
            />
          </div>
        </div>

        {/* Mobile composition */}
        <div className="pointer-events-none absolute inset-0 z-10 lg:hidden">
          <div className="shell flex h-full flex-col justify-between pb-7 pt-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-ink/15" />
                <p className="max-w-[220px] text-center text-[8px] font-medium uppercase leading-relaxed tracking-[0.2em] text-ink/70">
                  {eyebrow}
                </p>
                <span className="h-px flex-1 bg-ink/15" />
              </div>

              <p className="mx-auto mt-3.5 max-w-[300px] text-center text-[11.5px] leading-relaxed text-charcoal/70">
                {lead}
              </p>

              <div className="pointer-events-auto mx-auto mt-4 flex max-w-[300px] flex-col gap-2">
                <Link to="/shop" className="btn-dark w-full">
                  Shop Now
                  <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
                <Link to="/shop?collection=english-vintage" className="btn-light w-full">
                  Explore Collection
                </Link>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <span className="text-[8px] uppercase tracking-[0.28em] text-ink/40">{season}</span>
              <span className="flex items-center gap-2 text-[8px] uppercase tracking-[0.28em] text-ink/40">
                <span className="h-px w-5 bg-ink/20" />
                Scroll
              </span>
            </div>
          </div>
        </div>

        {/* Desktop composition */}
        <div className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
          <div className="shell flex h-full flex-col justify-between py-12">
            <div className="flex items-start justify-between gap-8">
              <div className="max-w-[300px] border-y border-ink/20 py-4">
                <p className="text-[10px] font-medium uppercase leading-relaxed tracking-[0.2em] text-ink/75">
                  {eyebrow}
                </p>
              </div>
              <div className="text-right">
                <span className="mb-4 block h-14 w-px bg-ink/20" />
                <p className="text-[9px] font-medium uppercase leading-relaxed tracking-[0.24em] text-ink/60">
                  New
                  <br />
                  Collection
                  <br />
                  2026
                </p>
              </div>
            </div>

            <div className="flex items-end justify-between gap-10">
              <div className="max-w-[330px]">
                <p className="text-[14px] leading-relaxed text-charcoal/70">{lead}</p>
                <div className="pointer-events-auto mt-7 flex flex-wrap gap-3">
                  <Link to="/shop" className="btn-dark group">
                    Shop Now
                    <Icon
                      name="arrowRight"
                      className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
                    />
                  </Link>
                  <Link to="/shop?collection=english-vintage" className="btn-light">
                    Explore Collection
                  </Link>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 text-right">
                <Link to="/our-heritage" className="link-line pointer-events-auto text-[9px] text-ink/55 hover:text-ink">
                  Our Heritage
                </Link>
                <span className="flex items-center gap-2 text-[8px] uppercase tracking-[0.28em] text-ink/40">
                  Scroll
                  <span className="h-px w-6 bg-ink/20" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The figure while it travels from the hero into the collection portrait */}
      <div
        ref={layerRef}
        className="pointer-events-none invisible fixed inset-0 z-30 overflow-hidden motion-reduce:hidden"
        style={{ perspective: '1600px' }}
        aria-hidden="true"
      >
        <img
          ref={figureRef}
          src={mannequinImage}
          alt=""
          draggable="false"
          className="absolute left-0 top-0 select-none [filter:drop-shadow(0_26px_50px_rgba(17,17,17,0.22))] will-change-transform"
          style={{ transformOrigin: '50% 50%', transformStyle: 'preserve-3d' }}
        />
      </div>

      {/* Signature strip */}
      <div className="relative z-10 overflow-hidden border-y border-ink/10 bg-paper py-3">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {Array.from({ length: 8 }).map((_, index) => (
            <span key={index} className="flex items-center gap-10 text-[9px] uppercase tracking-[0.32em] text-ink/45">
              Heritage <span className="text-gold">•</span> Character <span className="text-gold">•</span> Always
              Relevant
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
