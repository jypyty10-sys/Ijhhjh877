import { useContent } from '../lib/content';
import { useLang } from '../lib/i18n';
import { useLead } from '../lib/lead';
import { Icon } from './Icon';
import { ProductStage } from './ProductStage';
import { Reveal } from './Reveal';

export function FinalCta() {
  const { content } = useContent();
  const { t, lang } = useLang();
  const { open } = useLead();
  const { finalCta } = content;

  return (
    <section id="request" className="final-cta" aria-labelledby="final-cta-title">
      <div className="container">
        <Reveal className="final-cta__card">
          <div className="final-cta__copy">
            <span className="eyebrow">FLASHFORGE AD5X</span>
            <h2 className="final-cta__title" id="final-cta-title">
              {t(finalCta.title)}
            </h2>
            <p className="final-cta__text">{t(finalCta.text)}</p>
            <div className="final-cta__actions">
              <button type="button" className="btn btn--primary btn--lg" onClick={() => open('buy')}>
                {t(finalCta.primary)}
                <Icon name="arrow" size={18} data-flip />
              </button>
              <button type="button" className="btn btn--ghost btn--lg" onClick={() => open('advice')}>
                {t(finalCta.secondary)}
              </button>
              <a className="btn btn--metal btn--lg" href="#contact">
                {t(finalCta.tertiary)}
              </a>
            </div>
            <p className="content-note">
              <Icon name="shield" size={13} />
              {lang === 'fa'
                ? 'ثبت درخواست هیچ تعهدی برای خرید ایجاد نمی‌کند.'
                : 'Sending a request does not commit you to a purchase.'}
            </p>
          </div>
          <div className="final-cta__art">
            <ProductStage
              className="stage--compact"
              label={lang === 'fa' ? 'رندر شبیه‌سازی‌شده Flashforge AD5X' : 'Simulated render of the Flashforge AD5X'}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
