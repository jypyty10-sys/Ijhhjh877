import { useEffect, useRef, useState } from 'react';

export function useInView<T extends HTMLElement>(rootMargin = '0px 0px -10% 0px') {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        }
      },
      { rootMargin, threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}

/** Tracks which section id is currently closest to the top of the viewport. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? '');
  // Callers usually pass a fresh array each render; keying on the contents keeps
  // the observer (and its observed elements) alive instead of rebuilding it.
  const key = ids.join('|');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const elements = key
      .split('|')
      .filter(Boolean)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!elements.length) return;

    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        }
        if (visible.size) {
          const best = [...visible.entries()].sort((a, b) => b[1] - a[1])[0];
          setActive(best[0]);
        }
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.2, 0.5, 1] },
    );
    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);

  return active;
}

export function useScrollState(threshold = 24) {
  const [state, setState] = useState({ scrolled: false, progress: 0 });

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const top = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const next = {
          scrolled: top > threshold,
          progress: height > 0 ? Math.min(1, Math.max(0, top / height)) : 0,
        };
        // Skip re-renders the eye could not see; the nav re-renders on every frame otherwise.
        setState((prev) =>
          prev.scrolled === next.scrolled && Math.abs(prev.progress - next.progress) < 0.004
            ? prev
            : next,
        );
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return state;
}
