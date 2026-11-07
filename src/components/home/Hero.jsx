import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../Icon.jsx';
import { useStore } from '../../context/StoreContext.jsx';
import sceneImage from '../../assets/hero/evora-scene.webp';
import mannequinImage from '../../assets/hero/evora-mannequin.webp';

// The mannequin was cut out of the studio film and keeps its exact position inside the
// 16:9 scene, so the two layers stay perfectly registered at every viewport size.
const MANNEQUIN_BOX = {
  left: '37.1094%',
  top: '2.6389%',
  width: '31.5625%',
  height: '92.2222%',
};

// Share of the viewport the mannequin travels over the full hero scroll.
const TRAVEL_RATIO = 0.4;

export default function Hero() {
  const { settings } = useStore();
  const eyebrow = settings.hero_eyebrow || 'English Heritage for a Modern Generation.';
  const lead =
    settings.hero_lead || 'Tailoring, outerwear and accessories drawn from the English countryside and cut for the modern city.';
  const season = settings.hero_season || 'New Collection 2026';

  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const mannequinRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const mannequin = mannequinRef.current;
    if (!section || !stage || !mannequin) return undefined;

    // Respect the visitor's motion preference: the hero simply holds its first frame.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let sectionTop = 0;
    let scrollRange = 1;
    let travel = 0;
    let frame = 0;

    const measure = () => {
      sectionTop = section.getBoundingClientRect().top + window.scrollY;
      scrollRange = Math.max(1, section.offsetHeight - stage.offsetHeight);
      travel = stage.offsetHeight * TRAVEL_RATIO;
    };

    // Scroll position → translateY, 1:1 and reversible, no animation of its own.
    const paint = () => {
      frame = 0;
      const progress = Math.min(1, Math.max(0, (window.scrollY - sectionTop) / scrollRange));
      mannequin.style.transform = `translate3d(0, ${(progress * travel).toFixed(2)}px, 0)`;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onResize = () => {
      measure();
      schedule();
    };

    measure();
    paint();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <section ref={sectionRef} className="relative h-[240vh] bg-paper">
        <div ref={stageRef} className="sticky top-0 h-[100svh] overflow-hidden bg-paper">
          {/* Studio scene (fixed) + mannequin (moves) */}
          <div className="pointer-events-none absolute left-1/2 top-[60%] aspect-[16/9] w-[max(100vw,150vw)] -translate-x-1/2 -translate-y-1/2 lg:top-1/2 lg:w-[max(100vw,177.78vh)]">
            <img
              src={sceneImage}
              alt=""
              aria-hidden="true"
              draggable="false"
              fetchpriority="high"
              className="absolute inset-0 h-full w-full select-none bg-transparent object-cover"
            />
            <img
              ref={mannequinRef}
              src={mannequinImage}
              alt="Mannequin wearing a charcoal tweed three-piece suit, wool overcoat and flat cap"
              draggable="false"
              style={MANNEQUIN_BOX}
              className="absolute select-none bg-transparent will-change-transform"
            />
          </div>

          {/* Mobile composition */}
          <div className="pointer-events-none absolute inset-0 lg:hidden">
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
          <div className="pointer-events-none absolute inset-0 hidden lg:block">
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
