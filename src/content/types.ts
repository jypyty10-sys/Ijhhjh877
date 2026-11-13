export type Lang = 'fa' | 'en';

export interface Localized {
  fa: string;
  en: string;
}

export interface Feature {
  id: string;
  icon: string;
  title: Localized;
  text: Localized;
}

export interface Hotspot {
  id: string;
  x: number;
  y: number;
  title: Localized;
  text: Localized;
}

export interface SpecRow {
  label: Localized;
  value: Localized;
  placeholder?: boolean;
}

export interface SpecGroup {
  id: string;
  title: Localized;
  rows: SpecRow[];
}

export interface Application {
  id: string;
  icon: string;
  title: Localized;
  text: Localized;
  image?: string | null;
}

export interface Filament {
  id: string;
  name: Localized;
  hex: string;
  desc?: Localized;
}

export interface GalleryItem {
  id: string;
  label: Localized;
  art: string;
}

export interface SimpleItem {
  id: string;
  icon: string;
  title: Localized;
  text: Localized;
}

export interface Benefit {
  id: string;
  title: Localized;
  text: Localized;
}

export interface FaqItem {
  id: string;
  q: Localized;
  a: Localized;
}

export interface SocialLink {
  id: string;
  label: string;
  href: string;
}

export interface SiteContent {
  version: number;
  seo: {
    title: Localized;
    description: Localized;
  };
  nav: {
    cta: Localized;
  };
  hero: {
    eyebrow: Localized;
    brand: string;
    model: string;
    headline: Localized;
    description: Localized;
    primaryCta: Localized;
    secondaryCta: Localized;
    highlights: Localized[];
    trust: Localized[];
    image: string | null;
  };
  features: {
    title: Localized;
    subtitle: Localized;
    items: Feature[];
  };
  showcase: {
    title: Localized;
    subtitle: Localized;
    hint: Localized;
    hotspots: Hotspot[];
  };
  specs: {
    title: Localized;
    subtitle: Localized;
    note: Localized;
    catalogUrl: string | null;
    catalogLabel: Localized;
    groups: SpecGroup[];
  };
  applications: {
    title: Localized;
    subtitle: Localized;
    items: Application[];
  };
  filaments: {
    title: Localized;
    subtitle: Localized;
    note: Localized;
    items: Filament[];
  };
  gallery: {
    title: Localized;
    subtitle: Localized;
    items: GalleryItem[];
  };
  benefits: {
    title: Localized;
    subtitle: Localized;
    items: Benefit[];
  };
  why: {
    title: Localized;
    subtitle: Localized;
    items: SimpleItem[];
  };
  faq: {
    title: Localized;
    subtitle: Localized;
    items: FaqItem[];
  };
  finalCta: {
    title: Localized;
    text: Localized;
    primary: Localized;
    secondary: Localized;
    tertiary: Localized;
  };
  contact: {
    title: Localized;
    subtitle: Localized;
    email: string;
    phone: string;
    address: Localized;
    hours: Localized;
    socials: SocialLink[];
  };
  footer: {
    about: Localized;
    disclaimer: Localized;
    copyright: Localized;
  };
}

export interface Lead {
  id: number;
  name: string;
  phone: string;
  message: string;
  source: string;
  createdAt: string;
}
