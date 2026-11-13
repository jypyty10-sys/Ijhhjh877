type Path = (string | number)[];

const LABELS: Record<string, string> = {
  version: 'نسخه',
  seo: 'SEO',
  nav: 'ناوبری',
  hero: 'بخش آغازین (Hero)',
  features: 'ویژگی‌ها',
  showcase: 'نمایش تعاملی',
  specs: 'مشخصات فنی',
  applications: 'کاربردها',
  filaments: 'فیلامنت‌ها',
  gallery: 'گالری تصاویر',
  benefits: 'مزیت‌ها',
  why: 'چرا AD5X',
  faq: 'پرسش‌های متداول',
  finalCta: 'دعوت نهایی',
  contact: 'تماس',
  footer: 'پاورقی',
  title: 'عنوان',
  subtitle: 'زیرعنوان',
  headline: 'تیتر اصلی',
  description: 'توضیح',
  text: 'متن',
  label: 'برچسب',
  value: 'مقدار',
  name: 'نام',
  q: 'پرسش',
  a: 'پاسخ',
  icon: 'آیکون',
  hex: 'کد رنگ',
  art: 'نوع تصویر',
  image: 'آدرس تصویر',
  catalogUrl: 'آدرس فایل کاتالوگ',
  catalogLabel: 'متن دکمه کاتالوگ',
  email: 'ایمیل',
  phone: 'تلفن',
  address: 'نشانی',
  hours: 'ساعات پاسخ‌گویی',
  socials: 'شبکه‌های اجتماعی',
  primary: 'دکمه اصلی',
  secondary: 'دکمه دوم',
  tertiary: 'دکمه سوم',
  primaryCta: 'دکمه اصلی',
  secondaryCta: 'دکمه دوم',
  tertiaryCta: 'دکمه سوم',
  cta: 'دعوت به اقدام',
  brand: 'برند',
  model: 'مدل',
  eyebrow: 'متن بالای تیتر',
  highlights: 'نکات کلیدی',
  trust: 'نشان‌های اعتماد',
  hint: 'راهنما',
  hotspots: 'نقاط تعاملی',
  groups: 'گروه‌ها',
  rows: 'ردیف‌ها',
  items: 'آیتم‌ها',
  placeholder: 'جای‌نگهدار',
  note: 'یادداشت',
  disclaimer: 'سلب مسئولیت',
  copyright: 'کپی‌رایت',
  about: 'درباره',
  link: 'پیوند',
  href: 'نشانی پیوند',
  id: 'شناسه',
  x: 'موقعیت افقی (٪)',
  y: 'موقعیت عمودی (٪)',
  desc: 'توضیح کوتاه',
};

export const humanize = (key: string) =>
  LABELS[key] ?? key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());

export function isLocalized(value: unknown): value is { fa: string; en: string } {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.fa === 'string' &&
    typeof record.en === 'string' &&
    Object.keys(record).every((key) => key === 'fa' || key === 'en')
  );
}

export function setAtPath(root: any, path: Path, value: any): any {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  const copy = Array.isArray(root) ? [...root] : { ...root };
  copy[head as any] = setAtPath(root[head as any], rest, value);
  return copy;
}

const removeItem = (list: any[], index: number) => list.filter((_, i) => i !== index);
const insertItem = (list: any[], index: number, item: any) => [
  ...list.slice(0, index),
  item,
  ...list.slice(index),
];

function cloneItem(value: any) {
  const next = structuredClone(value);
  if (next && typeof next === 'object' && !Array.isArray(next) && 'id' in next) {
    next.id = `${String(next.id)}-${Math.random().toString(36).slice(2, 6)}`;
  }
  return next;
}

interface FieldProps {
  label: string;
  value: any;
  path: Path;
  depth: number;
  onChange: (path: Path, value: any) => void;
  onRemove?: () => void;
  onDuplicate?: () => void;
}

function ScalarField({
  label,
  value,
  path,
  onChange,
}: {
  label: string;
  value: string | number | boolean;
  path: Path;
  onChange: (path: Path, value: any) => void;
}) {
  if (typeof value === 'boolean') {
    return (
      <label className="admin-check">
        <input
          type="checkbox"
          checked={value}
          onChange={(event) => onChange(path, event.target.checked)}
        />
        <span>{label}</span>
      </label>
    );
  }

  if (typeof value === 'number') {
    return (
      <label className="field">
        <span className="field__label">{label}</span>
        <input
          type="number"
          value={Number.isFinite(value) ? value : 0}
          onChange={(event) => onChange(path, Number(event.target.value))}
        />
      </label>
    );
  }

  const long = value.length > 70 || value.includes('\n');
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      {long ? (
        <textarea value={value} rows={3} onChange={(event) => onChange(path, event.target.value)} />
      ) : (
        <input value={value} onChange={(event) => onChange(path, event.target.value)} />
      )}
    </label>
  );
}

function LocalizedField({
  label,
  value,
  path,
  onChange,
}: {
  label: string;
  value: { fa: string; en: string };
  path: Path;
  onChange: (path: Path, value: any) => void;
}) {
  const long = value.fa.length > 70 || value.en.length > 70 || value.fa.includes('\n');
  return (
    <div className="admin-localized">
      {label ? <span className="field__label">{label}</span> : null}
      <div className="admin-localized__row">
        {(['fa', 'en'] as const).map((key) => (
          <label className="field" key={key}>
            <span className="field__label">{key === 'fa' ? 'فارسی' : 'English'}</span>
            {long ? (
              <textarea
                dir={key === 'fa' ? 'rtl' : 'ltr'}
                rows={3}
                value={value[key]}
                onChange={(event) => onChange(path, { ...value, [key]: event.target.value })}
              />
            ) : (
              <input
                dir={key === 'fa' ? 'rtl' : 'ltr'}
                value={value[key]}
                onChange={(event) => onChange(path, { ...value, [key]: event.target.value })}
              />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

export function FieldNode({ label, value, path, depth, onChange, onRemove, onDuplicate }: FieldProps) {
  const header = (
    <div className="admin-node__head">
      <span className="admin-node__label">{label}</span>
      <span className="admin-node__actions">
        {onDuplicate ? (
          <button type="button" className="admin-icon" onClick={onDuplicate} title="افزودن مشابه">
            +
          </button>
        ) : null}
        {onRemove ? (
          <button
            type="button"
            className="admin-icon admin-icon--danger"
            onClick={onRemove}
            title="حذف"
          >
            ×
          </button>
        ) : null}
      </span>
    </div>
  );

  if (isLocalized(value)) {
    return (
      <div className="admin-node">
        {onRemove || onDuplicate ? header : null}
        <LocalizedField label={label} value={value} path={path} onChange={onChange} />
      </div>
    );
  }

  if (value === null || value === undefined) {
    return (
      <div className="admin-node">
        {header}
        <label className="field">
          <span className="field__label">{label} (اختیاری)</span>
          <input value="" onChange={(event) => onChange(path, event.target.value)} />
        </label>
      </div>
    );
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return (
      <div className="admin-node">
        {onRemove || onDuplicate ? header : null}
        <ScalarField label={label} value={value} path={path} onChange={onChange} />
      </div>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div className="admin-node admin-node--array">
        {header}
        <div className="admin-list">
          {value.map((item, index) => (
            <fieldset className="admin-item" key={index}>
              <legend>#{index + 1}</legend>
              <FieldNode
                label={typeof item === 'object' ? '' : `مقدار ${index + 1}`}
                value={item}
                path={[...path, index]}
                depth={depth + 1}
                onChange={onChange}
                onRemove={value.length > 1 ? () => onChange(path, removeItem(value, index)) : undefined}
                onDuplicate={
                  typeof item === 'object'
                    ? () => onChange(path, insertItem(value, index + 1, cloneItem(item)))
                    : undefined
                }
              />
            </fieldset>
          ))}
        </div>
        <button
          type="button"
          className="btn btn--ghost admin-add"
          onClick={() =>
            onChange(
              path,
              insertItem(value, value.length, value.length ? cloneItem(value[value.length - 1]) : ''),
            )
          }
        >
          + افزودن
        </button>
      </div>
    );
  }

  return (
    <div className={`admin-node ${depth > 0 ? 'admin-node--nested' : ''}`}>
      {header}
      <div className="admin-grid">
        {Object.entries(value as Record<string, any>).map(([key, child]) => (
          <FieldNode
            key={key}
            label={humanize(key)}
            value={child}
            path={[...path, key]}
            depth={depth + 1}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
}
