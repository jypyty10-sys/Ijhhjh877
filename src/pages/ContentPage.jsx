import { Link, useParams } from 'react-router-dom';
import { usePageMeta } from '../lib/hooks.js';
import { IMAGES } from '../data/images.js';
import Icon from '../components/Icon.jsx';
import { useStore } from '../context/StoreContext.jsx';

const CONTENT = {
  'our-story': {
    eyebrow: 'The House',
    title: 'Our Story',
    intro:
      'EVORA STYLE began in 1954 with a tailor, a roll of Yorkshire cloth and a conviction that a coat should outlive its owner.',
    image: IMAGES.workshop,
    alt: 'Tailor adjusting a tweed jacket in the atelier',
    sections: [
      {
        heading: 'A house built on cloth',
        body: [
          'Our founder, Arthur Vane, spent twelve years on Savile Row before opening a small workshop off Marylebone High Street. He was uninterested in fashion cycles. He was interested in cloth — how it fell, how it wore, how it aged.',
          'That first collection was six pieces: an overcoat, a suit, a waistcoat, a shirt, a cap and a pair of shoes. It is, in essence, still the collection. We have refined the cuts and widened the palette, but the premise has not moved.',
        ],
      },
      {
        heading: 'Made to be repaired',
        body: [
          'Every EVORA garment is built so that it can be mended. Seams are generous, linings are replaceable and buttons are sewn to be found again. We would rather you send a coat back to us in ten years than replace it after two.',
          'We work with eleven partner workshops in England, Scotland and Italy — most of them family-run, several of them older than the brand itself.',
        ],
      },
      {
        heading: 'Today',
        body: [
          'The house remains independent and small by design. We release two collections a year, produce in limited runs, and keep the archive open to anyone who asks. Heritage, to us, is a manufacturing standard rather than a marketing one.',
        ],
      },
    ],
  },
  'our-heritage': {
    eyebrow: 'Since 1954',
    title: 'Our Heritage',
    intro:
      'English heritage for a modern generation — the cloth, the makers and the decisions behind every EVORA piece.',
    image: IMAGES.editorial,
    alt: 'Editorial image of a model in a tweed coat and flat cap',
    sections: [
      {
        heading: 'The cloth',
        body: [
          'Yorkshire melton for the overcoats. Donegal-style tweed for the suiting. Waxed cotton gabardine for the trench. Italian flannel for the blazers. Each cloth is chosen for how it behaves in year five, not week one.',
        ],
      },
      {
        heading: 'The makers',
        body: [
          'Our brogues are Goodyear-welted in Northamptonshire by a workshop of eleven. Our caps are cut in the same small atelier we have used for sixty years. Our knitwear is Scottish-spun from extra-fine merino.',
          'We visit every workshop at least twice a year, and we pay for the work rather than the name.',
        ],
      },
      {
        heading: 'The details',
        body: [
          'Horn buttons, not plastic. Bemberg linings. Working cuffs. A hand-set collar that sits high against the wind. These are small things that make a coat feel like a coat.',
        ],
      },
    ],
  },
  contact: {
    eyebrow: 'Client services',
    title: 'Contact Us',
    intro: 'Our concierge answers every message personally, Monday to Saturday.',
    sections: [
      {
        heading: 'Concierge',
        body: [
          'Email: concierge@evorastyle.com',
          'Telephone: +44 (0)20 7946 0312 — Monday to Saturday, 9am–6pm GMT',
          'We aim to reply within one working day, and usually within two hours.',
        ],
      },
      {
        heading: 'The Atelier',
        body: ['14 Cavendish Row, Marylebone, London W1G 9HP', 'Private appointments are available Tuesday to Friday by arrangement.'],
      },
      {
        heading: 'Orders & returns',
        body: [
          'Please quote your order number (EV-XXXXXX) in any correspondence so we can find your order immediately.',
          'For returns, see our returns policy — the concierge can arrange a collection from your address.',
        ],
      },
    ],
  },
  shipping: {
    eyebrow: 'Client services',
    title: 'Shipping Information',
    intro: 'Dispatched from London, tracked to your door.',
    sections: [
      {
        heading: 'Delivery options',
        body: ['Standard delivery — 3–5 working days, $12 (complimentary on orders over $250).', 'Express delivery — 1–2 working days, signature required, $24.'],
      },
      {
        heading: 'International',
        body: [
          'We ship worldwide. Duties and taxes are calculated at the border and are the responsibility of the recipient unless stated otherwise at checkout.',
          'Delivery to remote regions may add 1–3 working days.',
        ],
      },
      {
        heading: 'Tracking',
        body: ['A tracking link is emailed as soon as your parcel leaves the atelier. Orders placed before 2pm GMT are dispatched the same working day.'],
      },
    ],
  },
  returns: {
    eyebrow: 'Client services',
    title: 'Returns & Exchanges',
    intro: 'Fourteen days, no complications.',
    sections: [
      {
        heading: 'The policy',
        body: [
          'Return any unworn piece within 14 days of delivery, with tags attached and in its original packaging. We refund the full value of the garment — delivery charges are refunded only where the item was faulty.',
        ],
      },
      {
        heading: 'Exchanges',
        body: [
          'Exchanges for a different size are free of charge, subject to availability. Contact the concierge with your order number and the size you need.',
        ],
      },
      {
        heading: 'How to return',
        body: [
          'Email concierge@evorastyle.com with your order number. We will send a prepaid label and arrange a collection where available.',
          'Refunds are processed within five working days of the parcel arriving at the atelier.',
        ],
      },
    ],
  },
  'size-guide': {
    eyebrow: 'Fit & care',
    title: 'Size Guide',
    intro: 'Our tailoring runs true to size with a considered, slightly relaxed line.',
    sections: [
      {
        heading: 'Tailoring, outerwear & knitwear',
        table: true,
        body: ['Measurements in centimetres. Between sizes? Take the smaller for a closer fit, the larger if you intend to layer.'],
      },
      {
        heading: 'Caps',
        body: ['S/M — 55–57cm · M/L — 57–59cm · L/XL — 59–61cm. Measure around the widest part of the head, above the ears.'],
      },
      {
        heading: 'Shoes',
        body: ['Our footwear is built on a standard British last. If you take a half size, we recommend sizing up. Brogues soften by roughly half a size after a week of wear.'],
      },
      {
        heading: 'Care',
        body: [
          'Brush wool after each wear and rest on a broad hanger for 24 hours. Cedar shoe trees between wears. Cashmere by hand, cold, dried flat.',
          'Anything else, ask the concierge — we would rather advise than have you guess.',
        ],
      },
    ],
  },
  faq: {
    eyebrow: 'Client services',
    title: 'Frequently Asked Questions',
    intro: 'The questions we are asked most often.',
    faq: [
      {
        q: 'When will my order be dispatched?',
        a: 'Orders placed before 2pm GMT are dispatched the same working day. Express orders arrive within 1–2 working days; standard within 3–5.',
      },
      {
        q: 'Do you offer alterations?',
        a: 'Every jacket and trouser is cut with enough seam allowance for tailoring. We do not alter garments in-house, but the concierge can recommend a tailor in most major cities.',
      },
      {
        q: 'Are the trousers hemmed?',
        a: 'Tailored trousers arrive unhemmed so they can be finished to your length. Shirts, trousers in the casual range and outerwear are finished.',
      },
      {
        q: 'How do I care for tweed?',
        a: 'Brush, do not wash. Air for a day between wears and dry clean only when necessary — twice a season at most.',
      },
      {
        q: 'Can I cancel an order?',
        a: 'Yes, until it is dispatched. Email concierge@evorastyle.com with your order number and we will cancel and refund in full.',
      },
      {
        q: 'Is my payment secure?',
        a: 'This store does not yet process card payments: a payment provider is not connected, so orders are recorded as awaiting confirmation and settled with the concierge. No card details are collected on this site.',
      },
    ],
  },
  'privacy-policy': {
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    intro: 'Last updated November 2026.',
    sections: [
      {
        heading: 'What we collect',
        body: [
          'When you create an account or place an order we store your name, email address, telephone number and delivery address. We never store card details on our servers.',
          'We also record basic technical information about your visit — pages viewed, and a session cookie that keeps your bag and wishlist attached to you.',
        ],
      },
      {
        heading: 'How we use it',
        body: [
          'To fulfil orders, answer enquiries, and — only if you subscribe — send occasional collection updates. We do not sell or rent personal data.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          'You may request a copy of your data, correct it, or have your account deleted at any time by emailing concierge@evorastyle.com.',
        ],
      },
    ],
  },
  terms: {
    eyebrow: 'Legal',
    title: 'Terms & Conditions',
    intro: 'The terms on which we sell.',
    sections: [
      {
        heading: 'Orders',
        body: [
          'An order placed through this site is an offer to purchase. It is accepted when we confirm dispatch. Prices are shown in US dollars and include duties where stated.',
        ],
      },
      {
        heading: 'Payment',
        body: [
          'No payment provider is connected to this store yet. Orders are recorded as awaiting confirmation and payment is arranged with the concierge. Nothing on this site constitutes a completed card transaction.',
        ],
      },
      {
        heading: 'Returns',
        body: ['Unworn pieces may be returned within 14 days of delivery. See the returns policy for the full procedure.'],
      },
      {
        heading: 'Liability',
        body: [
          'Nothing in these terms limits your statutory rights. Our liability for any order is limited to the value of that order.',
        ],
      },
    ],
  },
};

const SIZE_ROWS = [
  ['S', '96–101', '76–81', '44'],
  ['M', '101–106', '81–86', '45.5'],
  ['L', '106–111', '86–91', '47'],
  ['XL', '111–117', '91–97', '48.5'],
  ['XXL', '117–124', '97–104', '50'],
];

export default function ContentPage() {
  const { slug } = useParams();
  const { settings } = useStore();
  const content = CONTENT[slug];

  usePageMeta(content?.title || 'Information', content?.intro || '');

  if (!content) {
    return (
      <div className="shell flex min-h-[55vh] flex-col items-center justify-center text-center">
        <p className="label text-gold">404</p>
        <h1 className="mt-3 font-display text-3xl">That page is not part of the house.</h1>
        <Link to="/" className="btn-dark mt-7">
          Back to the store
        </Link>
      </div>
    );
  }

  return (
    <article className="pt-8 lg:pt-14">
      <div className="shell max-w-3xl">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[9px] uppercase tracking-label text-ink/40">
          <Link to="/" className="hover:text-ink">
            Home
          </Link>
          <span>/</span>
          <span className="text-ink/70">{content.title}</span>
        </nav>
        <p className="label mt-6 text-gold">{content.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">{content.title}</h1>
        <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-charcoal/70">{content.intro}</p>
      </div>

      {content.image ? (
        <div className="shell mt-8">
          <img
            src={content.image}
            alt={content.alt || content.title}
            className="h-[280px] w-full object-cover sm:h-[420px]"
            loading="lazy"
          />
        </div>
      ) : null}

      <div className="shell mt-10 grid gap-10 lg:grid-cols-[1fr_260px]">
        <div className="max-w-2xl">
          {content.sections?.map((section) => (
            <section key={section.heading} className="mb-9">
              <h2 className="font-display text-2xl">{section.heading}</h2>
              {section.table ? (
                <table className="mt-4 w-full text-left text-[12px]">
                  <thead>
                    <tr className="border-b border-ink/15 text-[9px] uppercase tracking-label text-ink/45">
                      <th className="py-2 font-medium">Size</th>
                      <th className="py-2 font-medium">Chest</th>
                      <th className="py-2 font-medium">Waist</th>
                      <th className="py-2 font-medium">Shoulder</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SIZE_ROWS.map((row) => (
                      <tr key={row[0]} className="border-b border-ink/10">
                        {row.map((cell, index) => (
                          <td key={index} className={`py-2.5 ${index === 0 ? 'font-medium' : 'tabular-nums'}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : null}
              {section.body?.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-[13px] leading-relaxed text-charcoal/75">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          {content.faq ? (
            <div className="mt-2 divide-y divide-ink/10 border-y border-ink/10">
              {content.faq.map((entry) => (
                <details key={entry.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-[13px] font-medium">
                    {entry.q}
                    <Icon name="plus" className="h-4 w-4 text-ink/40 transition-transform group-open:rotate-45" />
                  </summary>
                  <p className="mt-3 text-[13px] leading-relaxed text-charcoal/70">{entry.a}</p>
                </details>
              ))}
            </div>
          ) : null}

          {slug === 'contact' ? (
            <div className="mt-10 border border-ink/10 p-6">
              <p className="label text-ink/45">Prefer email?</p>
              <p className="mt-3 text-[13px] leading-relaxed text-charcoal/70">
                Write to{' '}
                <a href={`mailto:${settings.contact_email || 'concierge@evorastyle.com'}`} className="underline underline-offset-4">
                  {settings.contact_email || 'concierge@evorastyle.com'}
                </a>{' '}
                and we will reply within one working day.
              </p>
            </div>
          ) : null}
        </div>

        <aside className="border-t border-ink/10 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <p className="label text-ink/40">More information</p>
          <ul className="mt-4 space-y-3 text-[12px] text-charcoal/70">
            {[
              { label: 'Contact Us', to: '/contact' },
              { label: 'Shipping', to: '/shipping' },
              { label: 'Returns & Exchanges', to: '/returns' },
              { label: 'Size Guide', to: '/size-guide' },
              { label: 'FAQ', to: '/faq' },
              { label: 'Our Story', to: '/our-story' },
              { label: 'Our Heritage', to: '/our-heritage' },
            ].map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition-colors hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/shop" className="btn-dark mt-6 w-full">
            Shop the collection
          </Link>
        </aside>
      </div>
    </article>
  );
}
