import Icon from '../Icon.jsx';

const TESTIMONIALS = [
  {
    quote:
      'The overcoat is the best piece of clothing I own. Two winters in and it still looks better than the day it arrived.',
    name: 'Thomas E.',
    location: 'Edinburgh, UK',
    piece: 'Wool Overcoat',
  },
  {
    quote:
      'Impeccable finishing. The trousers were unhemmed as promised and my tailor said the cloth was the best he had seen in years.',
    name: 'Julian R.',
    location: 'New York, USA',
    piece: 'Prince of Wales Trousers',
  },
  {
    quote:
      'Concierge replied within the hour, arranged an exchange, and the replacement arrived in three days. This is how it should be done.',
    name: 'Marcus L.',
    location: 'Melbourne, AU',
    piece: 'Three-Piece Suit',
  },
];

export default function Testimonials() {
  return (
    <section className="mt-16 bg-paper py-14 lg:mt-24 lg:py-20">
      <div className="shell">
        <div className="reveal text-center">
          <p className="label text-gold">In their words</p>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl lg:text-4xl">Worn, and worn again</h2>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <figure key={testimonial.name} className="reveal flex flex-col border-t border-ink/15 pt-6">
              <div className="flex gap-1 text-gold" aria-label="Five out of five stars">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Icon key={index} name="star" className="h-3.5 w-3.5" fill="solid" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 font-display text-[17px] leading-relaxed text-charcoal/85">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-6">
                <p className="text-[11px] font-medium uppercase tracking-label text-ink">{testimonial.name}</p>
                <p className="mt-1 text-[10px] uppercase tracking-label text-ink/45">
                  {testimonial.location} · {testimonial.piece}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
