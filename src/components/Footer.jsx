import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import Newsletter from './Newsletter.jsx';
import { useStore } from '../context/StoreContext.jsx';

const SHOP_LINKS = [
  { label: 'Men', to: '/shop' },
  { label: 'Suits', to: '/shop?category=suits' },
  { label: 'Outerwear', to: '/shop?category=outerwear' },
  { label: 'Accessories', to: '/shop?category=accessories' },
  { label: 'Caps', to: '/shop?category=flat-caps' },
  { label: 'Shoes', to: '/shop?category=shoes' },
];

const SERVICE_LINKS = [
  { label: 'Contact Us', to: '/contact' },
  { label: 'Shipping Information', to: '/shipping' },
  { label: 'Returns & Exchanges', to: '/returns' },
  { label: 'Size Guide', to: '/size-guide' },
  { label: 'FAQ', to: '/faq' },
];

const ABOUT_LINKS = [
  { label: 'Our Story', to: '/our-story' },
  { label: 'Our Heritage', to: '/our-heritage' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms & Conditions', to: '/terms' },
];

const SOCIALS = [
  { name: 'Instagram', icon: 'instagram', href: 'https://instagram.com' },
  { name: 'Facebook', icon: 'facebook', href: 'https://facebook.com' },
  { name: 'Pinterest', icon: 'pinterest', href: 'https://pinterest.com' },
];

export default function Footer() {
  const { settings } = useStore();

  return (
    <footer className="mt-24 bg-ink text-ivory">
      <div className="shell grid gap-10 border-b border-ivory/10 py-14 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-8">
        <div>
          <Link to="/" className="font-display text-2xl uppercase tracking-[0.3em]">
            Evora Style
          </Link>
          <p className="mt-3 text-[9px] uppercase tracking-[0.34em] text-ivory/50">
            Heritage • Character • Always Relevant
          </p>
          <p className="mt-6 max-w-xs text-[13px] leading-relaxed text-ivory/55">
            A British heritage house for a modern generation. Tailoring, outerwear and the small details,
            made to be kept.
          </p>
          <div className="mt-6 flex gap-3">
            {SOCIALS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={social.name}
                className="flex h-9 w-9 items-center justify-center border border-ivory/20 text-ivory/70 transition-colors hover:border-ivory hover:text-ivory"
              >
                <Icon name={social.icon} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="label text-ivory/40">Shop</p>
          <ul className="mt-4 space-y-2.5">
            {SHOP_LINKS.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className="text-[13px] text-ivory/70 transition-colors hover:text-ivory">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="label text-ivory/40">Customer Service</p>
          <ul className="mt-4 space-y-2.5">
            {SERVICE_LINKS.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className="text-[13px] text-ivory/70 transition-colors hover:text-ivory">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="label text-ivory/40">About</p>
          <ul className="mt-4 space-y-2.5">
            {ABOUT_LINKS.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className="text-[13px] text-ivory/70 transition-colors hover:text-ivory">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="shell grid gap-10 border-b border-ivory/10 py-12 lg:grid-cols-2 lg:items-center">
        <Newsletter tone="dark" />
        <div className="lg:justify-self-end">
          <p className="label text-ivory/40">Concierge</p>
          <a
            href={`mailto:${settings.contact_email || 'concierge@evorastyle.com'}`}
            className="mt-3 block font-display text-xl transition-colors hover:text-beige"
          >
            {settings.contact_email || 'concierge@evorastyle.com'}
          </a>
          <p className="mt-2 text-[12px] text-ivory/50">Monday to Saturday, 9am–6pm GMT</p>
          <p className="mt-6 text-[12px] text-ivory/50">14 Cavendish Row, Marylebone, London W1G 9HP</p>
        </div>
      </div>

      <div className="shell flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
        <p className="text-[10px] uppercase tracking-label text-ivory/40">
          © {new Date().getFullYear()} Evora Style. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay'].map((method) => (
            <span
              key={method}
              className="border border-ivory/20 px-2.5 py-1 text-[8px] uppercase tracking-label text-ivory/50"
            >
              {method}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
