import { useLayoutEffect } from 'react';

// EVORA home scene — one scroll timeline.
//
// The pinned hero panel, the cut-out figure and the flight into the collection portrait are
// one scene, so every one of them reads ONE number: progress = scrollY / distance. Nothing
// here steps an animation forward on its own: each value is recomputed from the live scroll
// offset, so the scene holds still the moment the finger stops and runs backwards, exactly
// in step with the page, the moment the visitor scrolls back up.
//
// The scroll event is used as the frame signal and the figure is written inside it, without
// hopping through requestAnimationFrame: an extra frame of delay is what made the figure
// trail the page on Chrome Android momentum scrolling.

const MERGE_TARGET = '[data-hero-merge-target]';
const DESKTOP_QUERY = '(min-width: 1024px)';

// Scroll stops of the journey, as fractions of the single distance measured in `measure()`.
export const HERO_TIMELINE = {
  hold: 0.12, // the figure is still standing on its hero mark
  align: 0.86, // the figure has reached the collection portrait
  dissolve: 0.86, // ...and starts melting into the photograph
};

const clamp01 = (value) => (value <= 0 ? 0 : value >= 1 ? 1 : value);
const smooth = (t) => t * t * (3 - 2 * t);
const lerp = (from, to, t) => from + (to - from) * t;

// Document offset from the layout's own offset chain. Unlike
// `getBoundingClientRect().top + scrollY` this is pure layout: it cannot sit a frame behind a
// fling, and it never carries the sticky shift of a pinned element.
const docTop = (el) => {
  let top = 0;
  let node = el;
  while (node) {
    top += node.offsetTop;
    node = node.offsetParent;
  }
  return top;
};

export default function useHeroTimeline({ anchorRef, panelRef, slots, layerRef, figureRef }) {
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const layer = layerRef.current;
    const figure = figureRef.current;
    if (!panel || !layer || !figure) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let scene = null;
    let frame = 0;
    let queued = false;
    let lastTransform = '';
    let lastOpacity = '';
    let lastWidth = -1;

    // Geometry only — never the scroll position. Everything re-measured after a reflow
    // (Android toolbar, compacting header, late photographs) is therefore identical wherever
    // the page happens to be scrolled to, so a reflow can no longer re-time the flight under
    // the visitor's finger.
    const measure = () => {
      const slot = slots.map((ref) => ref.current).find((el) => el && el.getBoundingClientRect().width > 0);
      if (!slot) return false;

      const panelBox = panel.getBoundingClientRect();
      const slotBox = slot.getBoundingClientRect();

      // The anchor is a zero-height marker in front of the sticky panel, so its document
      // offset is the panel's static top — and the panel pins at that same spot.
      const start = anchorRef.current ? docTop(anchorRef.current) : panelBox.top + window.scrollY;
      const pinned = parseFloat(getComputedStyle(panel).top) || 0;
      const height = panel.offsetHeight;

      let target = null;
      const el = document.querySelector(MERGE_TARGET);
      if (el) {
        const box = el.getBoundingClientRect();
        if (box.width > 0 && box.height > 0) {
          target = { left: box.left, top: docTop(el), width: box.width, height: box.height };
        }
      }

      // The journey ends when the portrait's centre climbs to 55% of the pinned panel. That
      // single scroll offset is the denominator shared by every element in the scene.
      const centre = target ? target.top + target.height / 2 : start + height * 1.55;
      const distance = Math.max(centre - pinned - height * 0.55, height);

      scene = {
        start,
        pinned,
        distance,
        target,
        tilt: window.matchMedia(DESKTOP_QUERY).matches,
        // The mark is measured inside the panel (a relative difference of two rects read in
        // the same frame), so it is unaffected by the panel pinning or by a fling.
        mark: {
          left: slotBox.left - panelBox.left,
          top: slotBox.top - panelBox.top,
          width: slotBox.width,
          height: slotBox.height,
        },
      };
      return true;
    };

    const paint = () => {
      if (!scene) return;

      const scrollY = window.scrollY;
      const progress = clamp01(scrollY / scene.distance);
      const { mark, target, start, pinned } = scene;

      // Where the pinned panel sits right now: it holds at its sticky offset, and before it
      // reaches it (desktop, where the header sits above the scene) it rides with the page.
      const panelTop = Math.max(start - scrollY, pinned);
      const baseX = mark.left;
      const baseY = panelTop + mark.top;

      const travel = smooth(clamp01((progress - HERO_TIMELINE.hold) / (HERO_TIMELINE.align - HERO_TIMELINE.hold)));

      if (lastWidth !== mark.width) {
        lastWidth = mark.width;
        figure.style.width = `${mark.width}px`;
        figure.style.height = `${mark.height}px`;
      }

      let x = baseX;
      let y = baseY;
      let width = mark.width;

      if (target) {
        // The destination is re-read from the live scroll offset every frame, not from a
        // cached landing point, so the figure and the photograph it lands on move together.
        const frameTop = target.top - scrollY;
        const fit = Math.min(target.width / mark.width, target.height / mark.height) * 0.96;
        width = lerp(mark.width, mark.width * fit, travel);
        const height = mark.height * (width / mark.width);
        x = lerp(baseX, target.left + (target.width - width) / 2, travel);
        y = lerp(baseY, frameTop + (target.height - height) / 2, travel);
      }

      const scale = width / mark.width;
      const arc = Math.sin(Math.PI * travel);
      // Scaling happens around the centre, so the painted box is offset back to (x, y).
      const dx = (mark.width * (1 - scale)) / 2;
      const dy = (mark.height * (1 - scale)) / 2;

      const transform =
        `translate3d(${(x - dx).toFixed(2)}px, ${(y - arc * mark.height * 0.14 - dy).toFixed(2)}px, 0)` +
        // The roll is a desktop flourish: on phones it forces a 3D rasterisation of a large
        // cut-out on every frame, which is exactly what used to make the figure stutter.
        (scene.tilt ? ` rotateY(${(-6 * arc).toFixed(2)}deg)` : '') +
        ` scale(${scale.toFixed(4)})`;
      const opacity = (1 - clamp01((progress - HERO_TIMELINE.dissolve) / (1 - HERO_TIMELINE.dissolve))).toFixed(3);

      // Identical writes are skipped, so a resting page costs nothing and a stopped scroll
      // leaves the scene exactly where it stopped.
      if (transform !== lastTransform) {
        lastTransform = transform;
        figure.style.transform = transform;
      }
      if (opacity !== lastOpacity) {
        lastOpacity = opacity;
        figure.style.opacity = opacity;
      }
    };

    const relayout = () => {
      if (queued) return;
      queued = true;
      frame = requestAnimationFrame(() => {
        queued = false;
        frame = 0;
        if (measure()) layer.style.visibility = 'visible';
        paint();
      });
    };

    // Only reveal the travelling figure once its mark is known, otherwise it would paint at
    // its intrinsic size in the corner of the fixed layer.
    if (measure()) layer.style.visibility = 'visible';
    paint();

    // One listener, coalesced re-measurement. Body is observed as well as the panel: the shop
    // above the collection portrait reflows as its own data arrives (category copy, late
    // photographs), which moves the landing point. Re-measuring is safe at any moment because
    // `measure()` reads layout only, never the scroll offset.
    const observer = new ResizeObserver(relayout);
    [document.body, panel, ...slots.map((ref) => ref.current)].forEach((el) => el && observer.observe(el));

    window.addEventListener('scroll', paint, { passive: true });
    window.addEventListener('resize', relayout);
    window.addEventListener('orientationchange', relayout);
    window.addEventListener('load', relayout);
    document.fonts?.ready.then(relayout);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', paint);
      window.removeEventListener('resize', relayout);
      window.removeEventListener('orientationchange', relayout);
      window.removeEventListener('load', relayout);
      if (frame) cancelAnimationFrame(frame);
      layer.style.visibility = 'hidden';
    };
    // Refs are stable for the life of the scene; it is measured and re-measured, never rebuilt.
  }, []);
}
