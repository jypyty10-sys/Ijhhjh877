import { useEffect, useRef } from 'react';

/**
 * Adds the `is-visible` class to every `.reveal` element inside the returned
 * ref once it scrolls into view. Falls back to visible when unsupported.
 */
export function useReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const nodes = root.querySelectorAll('.reveal');
    if (!nodes.length) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      nodes.forEach((node) => node.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08, ...options }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [options]);

  return ref;
}

export function usePageMeta(title, description) {
  useEffect(() => {
    if (title) document.title = `${title} — EVORA STYLE`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && description) meta.setAttribute('content', description);
  }, [title, description]);
}
