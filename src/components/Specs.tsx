import { useContent } from '../lib/content';
import { useLang } from '../lib/i18n';
import { Icon } from './Icon';
import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';

export function Specs() {
  const { content } = useContent();
  const { t, lang } = useLang();
  const { specs } = content;
  const pendingLabel = lang === 'fa' ? 'در انتظار تکمیل' : 'Pending';

  return (
    <section id="specs" className="section specs" aria-labelledby="specs-title">
      <div className="container">
        <SectionHead
          id="specs-title"
          index="03"
          label="TECHNICAL"
          title={t(specs.title)}
          aside={t(specs.subtitle)}
        />

        <div className="specs__grid">
          {specs.groups.map((group, groupIndex) => (
            <Reveal key={group.id} className="spec-card" delay={(groupIndex % 2) * 70}>
              <h3 className="spec-card__title">
                <span className="spec-card__index num">{String(groupIndex + 1).padStart(2, '0')}</span>
                {t(group.title)}
              </h3>
              {group.rows.map((row, index) => {
                const value = t(row.value);
                return (
                  <div className="spec-row" key={`${group.id}-${index}`}>
                    <span className="spec-row__label">{t(row.label)}</span>
                    <span className="spec-row__value">
                      {value ? (
                        <span className="num">{value}</span>
                      ) : (
                        <span className="spec-pending">
                          <Icon name="clock" size={12} />
                          {pendingLabel}
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </Reveal>
          ))}
        </div>

        <Reveal className="specs__footer" delay={80}>
          <p className="specs__note">
            <Icon name="warning" size={17} />
            {t(specs.note)}
          </p>
          <div className="specs__actions">
            {specs.catalogUrl ? (
              <>
                <a className="btn btn--primary" href={specs.catalogUrl} download>
                  <Icon name="download" size={17} />
                  {t(specs.catalogLabel)}
                </a>
              </>
            ) : (
              <small>
                {lang === 'fa'
                  ? 'فایل کاتالوگ هنوز بارگذاری نشده است؛ پس از افزودن آن، دکمه دانلود فعال می‌شود.'
                  : 'No catalog file has been uploaded yet — the download appears once it is added.'}
              </small>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
