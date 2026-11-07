import { Link } from 'react-router-dom';
import Icon from '../Icon.jsx';
import { IMAGES } from '../../data/images.js';

export default function SeasonalCampaign() {
  return (
    <section className="mt-16 lg:mt-24">
      <div className="relative isolate overflow-hidden bg-ink">
        <img
          src={IMAGES.trench}
          alt="Model in a heritage trench coat walking a London street"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/45 to-ink/10" />
        <div className="shell relative flex min-h-[440px] flex-col justify-center py-16 text-ivory lg:min-h-[540px]">
          <div className="reveal max-w-lg">
            <p className="label text-ivory/60">Autumn / Winter 2026</p>
            <h2 className="mt-4 font-display text-4xl leading-[0.95] sm:text-5xl lg:text-6xl">
              The Country
              <br />
              Weekend
            </h2>
            <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-ivory/70">
              Waxed cotton, brushed wool and leather that has been walked in. A wardrobe for the road out of
              town — and the long way home.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop?category=outerwear" className="btn-outline-white group">
                Shop the campaign
                <Icon name="arrowRight" className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
              <Link to="/our-heritage" className="link-line self-center text-[10px] text-ivory/70 hover:text-ivory">
                Read the story
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
