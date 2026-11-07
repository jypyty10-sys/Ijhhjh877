import { Link } from 'react-router-dom';
import Icon from '../Icon.jsx';
import { IMAGES } from '../../data/images.js';

export default function HeritageStory() {
  return (
    <section className="shell mt-16 lg:mt-24">
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
        <div className="reveal order-2 md:order-1">
          <p className="label text-gold">Our Heritage</p>
          <h2 className="mt-4 font-display text-3xl leading-[1.05] sm:text-4xl lg:text-5xl">
            Cut in England.
            <br />
            Kept for decades.
          </h2>
          <p className="mt-5 max-w-md text-[13px] leading-relaxed text-charcoal/70">
            EVORA began in 1954 with a single tailor, a roll of Yorkshire cloth and a belief that a coat should
            outlive its owner. That belief has not changed. We still work with the same mills, the same small
            workshops, and the same standard — quietly, and without compromise.
          </p>
          <p className="mt-4 max-w-md text-[13px] leading-relaxed text-charcoal/70">
            Every piece is designed to be worn hard, repaired often, and handed on. Heritage is not a mood
            here; it is a manufacturing decision.
          </p>
          <div className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-ink/10 pt-6">
            {[
              { value: '1954', label: 'Established' },
              { value: '11', label: 'Partner workshops' },
              { value: '70yrs', label: 'Of cloth' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl">{stat.value}</p>
                <p className="mt-1 text-[9px] uppercase tracking-label text-ink/45">{stat.label}</p>
              </div>
            ))}
          </div>
          <Link to="/our-story" className="btn-dark group mt-8">
            Read our story
            <Icon name="arrowRight" className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="order-1 md:order-2">
          <div className="relative">
            <img
              src={IMAGES.workshop}
              alt="Detail of tweed tailoring being adjusted in the atelier"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
            <div className="absolute -bottom-5 -left-5 hidden w-40 border border-ink/10 bg-ivory p-4 sm:block">
              <p className="text-[8px] uppercase leading-relaxed tracking-label text-ink/55">
                Hand-finished in a workshop of eleven
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
