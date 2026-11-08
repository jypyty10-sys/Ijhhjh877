import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../Icon.jsx';
import { useStore } from '../../context/StoreContext.jsx';
import wordmarkImage from '../../assets/hero/evora-wordmark.webp';
import mannequinImage from '../../assets/hero/evora-mannequin.png';

// Scroll-driven 3D stage.
//   layer 1 — paper background (fixed)
//   layer 2 — the EVORA wordmark plate (fixed, never transformed)
//   layer 3 — the cut-out figure, the only element the scroll animates
// The figure travels down the stage — leaving it completely at the end of the hero — and
// drifts towards the viewer, so the scroll reads as depth rather than a flat slide. Every
// value below is a pure function of the scroll progress, which is what makes scrolling
// back up retrace the motion exactly.
const MIN_WIDTH_3D = '(min-width: 1024px)';

const lerp = (from, to, t) => from + (to - from) * t;

export default function Hero() {
  const { settings } = useStore();
  const eyebrow = settings.hero_eyebrow || 'English Heritage for a Modern Generation.';
  const lead =
    settings.hero_lead || 'Tailoring, outerwear and accessories drawn from the English countryside and cut for the modern city.';
  const season = settings.hero_season || 'New Collection 2026';

  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const holderRef = useRef(null);
  const mannequinRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const holder = holderRef.current;
    const mannequin = mannequinRef.current;
    if (!section || !stage || !holder || !mannequin) return undefined;

    // Respect the visitor's motion preference: the hero simply holds its first frame.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const wide = window.matchMedia(MIN_WIDTH_3D);

    let sectionTop = 0;
    let scrollRange = 1;
    // Vertical travel and forward depth, measured once per layout change.
    let travel = 0;
    let depth = 0;

    // Scroll position → target progress; the painted progress eases towards it and
    // settles exactly on it, so the figure stops the moment the page stops scrolling.
    let painted = 0;
    let target = 0;
    let frame = 0;

    const paint = (progress) => {
      const eased = progress * progress * (3 - 2 * progress);
      const y = progress * travel;
      const z = eased * depth;
      const rotateX = lerp(1.8, -1.8, eased);
      const rotateY = lerp(-3.6, 3.6, eased);
      const scale = 1 + 0.03 * eased;

      mannequin.style.transform =
        `translate3d(0, ${y.toFixed(2)}px, ${z.toFixed(2)}px) ` +
        `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) ` +
        `scale(${scale.toFixed(4)})`;
    };

    const tick = () => {
      const delta = target - painted;
      if (Math.abs(delta) < 0.0006) {
        painted = target;
        paint(painted);
        frame = 0;
        return;
      }
      painted += delta * 0.14;
      paint(painted);
      frame = requestAnimationFrame(tick);
    };

    const measure = () => {
      sectionTop = section.getBoundingClientRect().top + window.scrollY;
      scrollRange = Math.max(1, section.offsetHeight - stage.offsetHeight);

      // The figure travels far enough to leave the stage completely, so the collection
      // section below is what the visitor sees once the hero scroll is spent.
      const stageBox = stage.getBoundingClientRect();
      const figureBox = holder.getBoundingClientRect();
      const figureTop = figureBox.top - stageBox.top;
      travel = Math.max(stage.offsetHeight * 0.4, stage.offsetHeight - figureTop + figureBox.height * 0.12);
      depth = wide.matches ? 150 : 100;
    };

    const readScroll = () => {
      target = Math.min(1, Math.max(0, (window.scrollY - sectionTop) / scrollRange));
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onResize = () => {
      measure();
      readScroll();
    };

    measure();
    target = Math.min(1, Math.max(0, (window.scrollY - sectionTop) / scrollRange));
    painted = target;
    paint(painted);

    window.addEventListener('scroll', readScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', readScroll);
      window.removeEventListener('resize', onResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <section ref={sectionRef} className="relative h-[190vh] bg-paper">
        <div ref={stageRef} className="sticky top-0 h-[100svh] overflow-hidden bg-paper">
          {/* Fixed wordmark plate + independently travelling figure */}
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
              ref={holderRef}
              className="absolute bottom-[10svh] left-1/2 h-[42svh] aspect-[614/933] -translate-x-1/2 lg:bottom-auto lg:top-[52%] lg:h-[min(52vw,68svh)] lg:-translate-y-1/2"
            >
              <div
                className="h-full w-full"
                style={{ perspective: '1600px', perspectiveOrigin: '50% 45%', transformStyle: 'preserve-3d' }}
              >
                <img
                  ref={mannequinRef}
                  src={mannequinImage}
                  alt="Man in a charcoal tweed three-piece suit, wool overcoat and flat cap"
                  draggable="false"
                  className="h-full w-full select-none [filter:drop-shadow(0_24px_44px_rgba(17,17,17,0.18))] will-change-transform"
                  style={{ transformStyle: 'preserve-3d', transformOrigin: '50% 55%' }}
                />
              </div>
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
        </div>
      </section>

      {/* Signature strip */}
      <div className="overflow-hidden border-y border-ink/10 bg-paper py-3">
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
