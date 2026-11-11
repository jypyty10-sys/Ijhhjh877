import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../Icon.jsx';
import { useStore } from '../../context/StoreContext.jsx';
import useHeroTimeline from '../../lib/useHeroTimeline.js';
import wordmarkImage from '../../assets/hero/evora-wordmark.webp';
import mannequinImage from '../../assets/hero/evora-mannequin.png';

// One shared scroll timeline carries the visitor from the hero straight into the shop.
//   layer 1 — the hero panel, pinned while the shop rises over it
//   layer 2 — the EVORA wordmark plate (never transformed)
//   layer 3 — the cut-out figure, the only element that travels
// The figure starts on its hero mark, lifts off while the shop scrolls up beneath it and
// lands on the collection portrait, where it settles into the frame and dissolves into
// the photograph. `useHeroTimeline` owns the one progress value behind all of this; this
// component only marks which element is the panel, the mark and the figure.
//
// Layout differs per input type: on phones the copy, the figure and the footer row sit in
// one flex column, so a short screen shrinks the figure instead of letting it reach the
// copy; from lg up the absolute composition is untouched.
// The uploaded autumn/winter campaign film — the model walking the same street as the hero
// artwork. It plays inside the hero panel and hands the page on to the shop when it ends.
const CAMPAIGN_FILM =
  'https://media.base44.com/videos/public/6aeebff917771fdc6f90c118/16b6d5fdc_f44b94de-910a-4e6d-84c7-b581a59cc19d.mp4';

export default function Hero() {
  const { settings } = useStore();
  const eyebrow = settings.hero_eyebrow || 'English Heritage for a Modern Generation.';
  const lead =
    settings.hero_lead || 'Tailoring, outerwear and accessories drawn from the English countryside and cut for the modern city.';
  const season = settings.hero_season || 'New Collection 2026';

  const anchorRef = useRef(null);
  const panelRef = useRef(null);
  const mobileSlotRef = useRef(null);
  const desktopSlotRef = useRef(null);
  const layerRef = useRef(null);
  const figureRef = useRef(null);
  const slots = useRef([mobileSlotRef, desktopSlotRef]).current;

  useHeroTimeline({ anchorRef, panelRef, slots, layerRef, figureRef });

  const filmRef = useRef(null);
  const [filmPlaying, setFilmPlaying] = useState(false);

  // Called straight from the tap: play() is invoked synchronously inside the interaction, with
  // nothing awaited before it, so Chrome Android counts it as user-initiated. The film stays
  // muted and inline, which is what keeps it playable without a gesture prompt.
  const playFilm = () => {
    const video = filmRef.current;
    if (!video) return;
    if (!video.paused && !video.ended) return; // one request per playback
    setFilmPlaying(true);
    if (video.ended) video.currentTime = 0;
    const started = video.play();
    if (started && typeof started.catch === 'function') {
      started.catch((error) => {
        console.error('Hero video playback failed:', error);
        setFilmPlaying(false);
      });
    }
  };

  // A real ended event, once per playback: reveal the page again and hand it to the shop.
  const finishFilm = () => {
    setFilmPlaying(false);
    const next = document.querySelector('[data-hero-next-section]');
    if (!next) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    next.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });

    // Android Chrome occasionally drops a smooth scroll started from a media event; if the
    // page has not moved at all, place it at the section instead of leaving it stuck.
    if (!reduced) {
      const from = window.scrollY;
      window.setTimeout(() => {
        if (Math.abs(window.scrollY - from) > 4) return;
        const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 0;
        window.scrollTo({ top: next.getBoundingClientRect().top + window.scrollY - header, behavior: 'auto' });
      }, 700);
    }
  };

  const figureAlt = 'Man in a charcoal tweed three-piece suit, wool overcoat and flat cap';

  return (
    <>
      {/* Zero-height marker in front of the sticky panel: its document offset is the panel's
          static top, which is where the panel pins. The timeline reads it instead of the
          panel itself, so a re-measure mid-scroll can never pick up the sticky shift. */}
      <div ref={anchorRef} aria-hidden="true" className="h-0" />

      {/* On phones the scene pins directly under the sticky header and is exactly as tall as
          the space left below it, so the pinned column is never slid under the header (which
          pushed the mark and the wordmark out of place mid-scroll). From lg up the panel
          keeps its full-viewport pin. */}
      <section
        ref={panelRef}
        className="sticky top-[var(--header-h,0px)] h-[calc(100svh-var(--header-h,0px))] overflow-hidden bg-paper lg:top-0 lg:h-[100svh]"
      >
        {/* Desktop plate: the wordmark with the figure on its mark */}
        <div className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden lg:block">
          <img
            src={wordmarkImage}
            alt=""
            aria-hidden="true"
            draggable="false"
            fetchpriority="high"
            className="absolute left-1/2 top-1/2 w-[96vw] max-w-[1800px] -translate-x-1/2 -translate-y-1/2 select-none"
          />

          <div
            ref={desktopSlotRef}
            className="absolute left-1/2 top-[52%] h-[min(52vw,68svh)] aspect-[614/933] -translate-x-1/2 -translate-y-1/2"
          >
            <img
              src={mannequinImage}
              alt={figureAlt}
              draggable="false"
              className="hidden h-full w-full select-none [filter:drop-shadow(0_24px_44px_rgba(17,17,17,0.18))] motion-reduce:block"
            />
          </div>
        </div>

        {/* Phone composition: copy, figure and footer row share one column, so a short
            screen shrinks the figure instead of letting it reach the copy. */}
        <div className="pointer-events-none absolute inset-0 z-10 lg:hidden">
          <div className="shell flex h-full flex-col pb-6 pt-5">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-ink/15" />
                <p className="max-w-[220px] text-center text-[8px] font-medium uppercase leading-relaxed tracking-[0.2em] text-ink/70">
                  {eyebrow}
                </p>
                <span className="h-px flex-1 bg-ink/15" />
              </div>

              <p className="mx-auto mt-3 max-w-[300px] text-center text-[11.5px] leading-relaxed text-charcoal/70">
                {lead}
              </p>

              <div className="pointer-events-auto mx-auto mt-4 flex max-w-[300px] flex-col gap-2">
                <button type="button" onClick={playFilm} className="btn-dark min-h-11 w-full">
                  Shop Now
                  <Icon name="arrowRight" className="h-4 w-4" />
                </button>
                <Link to="/shop?collection=english-vintage" className="btn-light min-h-11 w-full">
                  Explore Collection
                </Link>
              </div>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center py-2">
              <img
                src={wordmarkImage}
                alt=""
                aria-hidden="true"
                draggable="false"
                fetchpriority="high"
                className="pointer-events-none absolute left-1/2 top-[56%] w-[92vw] max-w-[1800px] -translate-x-1/2 -translate-y-1/2 select-none"
              />

              <div ref={mobileSlotRef} className="relative h-[40svh] max-h-full aspect-[614/933] shrink-0">
                <img
                  src={mannequinImage}
                  alt={figureAlt}
                  draggable="false"
                  className="hidden h-full w-full select-none [filter:drop-shadow(0_20px_36px_rgba(17,17,17,0.16))] motion-reduce:block"
                />
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
                  <button type="button" onClick={playFilm} className="btn-dark group">
                    Shop Now
                    <Icon
                      name="arrowRight"
                      className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
                    />
                  </button>
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
      {/* The cut-out is composited by transform alone: the drop shadow and the 3D perspective
          are desktop-only, because on Chrome Android both force the layer to be re-rasterised
          on every scroll frame, which is what made the figure trail the page. */}
      <div
        ref={layerRef}
        className="pointer-events-none invisible fixed inset-0 z-30 overflow-hidden motion-reduce:hidden lg:[perspective:1600px]"
        aria-hidden="true"
      >
        <img
          ref={figureRef}
          src={mannequinImage}
          alt=""
          draggable="false"
          className="absolute left-0 top-0 select-none will-change-transform lg:[filter:drop-shadow(0_26px_50px_rgba(17,17,17,0.22))]"
          style={{ transformOrigin: '50% 50%', transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
        />
      </div>

      {/* The campaign film, covering the pinned panel exactly (under the sticky header) only
          while it plays — above the travelling figure so the two models never share the frame.
          It never takes pointer events, so the page around it stays tappable and scrollable. */}
      <div
        aria-hidden={!filmPlaying}
        className={`pointer-events-none fixed inset-x-0 top-[var(--header-h,0px)] bottom-0 z-[35] overflow-hidden bg-ink transition-opacity duration-500 lg:top-0 ${
          filmPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <video
          ref={filmRef}
          src={CAMPAIGN_FILM}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          onEnded={finishFilm}
          onError={() => console.error('Hero video failed to load:', filmRef.current?.error)}
          className="h-full w-full object-cover"
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
