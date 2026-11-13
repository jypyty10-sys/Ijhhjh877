import { useEffect } from 'react';
import type { SiteContent } from '../content/types';
import { useLang } from './i18n';

function upsertMeta(attr: 'name' | 'property', key: string, value: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', value);
}

/** Keeps the document title, description and Open Graph tags in sync with the content and language. */
export function useSeo(content: SiteContent) {
  const { t, lang } = useLang();

  useEffect(() => {
    document.title = t(content.seo.title);
    const description = t(content.seo.description);
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', t(content.seo.title));
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:locale', lang === 'fa' ? 'fa_IR' : 'en_US');
    upsertMeta('name', 'twitter:card', 'summary_large_image');
  }, [content.seo.title, content.seo.description, lang, t]);
}
