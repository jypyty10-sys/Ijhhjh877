import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { api, ApiError } from './api';
import { useLang } from './i18n';
import { Icon } from '../components/Icon';

type Intent = 'buy' | 'advice' | 'contact';

interface LeadContextValue {
  open: (intent?: Intent) => void;
  close: () => void;
}

const LeadContext = createContext<LeadContextValue | null>(null);

export function LeadProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [intent, setIntent] = useState<Intent>('buy');
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const open = useCallback((next: Intent = 'buy') => {
    setIntent(next);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    dialogRef.current?.close();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    }
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <LeadContext.Provider value={{ open, close }}>
      {children}
      {isOpen ? (
        <dialog
          ref={dialogRef}
          className="lead-dialog"
          onClose={() => setIsOpen(false)}
          onClick={(event) => {
            if (event.target === dialogRef.current) close();
          }}
        >
          <div className="lead-dialog__card">
            <button type="button" className="lead-dialog__close" onClick={close} aria-label="بستن">
              <Icon name="close" size={16} />
            </button>
            <LeadForm intent={intent} onIntentChange={setIntent} onDone={close} />
          </div>
        </dialog>
      ) : null}
    </LeadContext.Provider>
  );
}

export function useLead() {
  const ctx = useContext(LeadContext);
  if (!ctx) throw new Error('useLead must be used inside LeadProvider');
  return ctx;
}

const INTENT_LABELS: Record<Intent, { fa: string; en: string }> = {
  buy: { fa: 'خرید محصول', en: 'Buy' },
  advice: { fa: 'مشاوره فنی', en: 'Advice' },
  contact: { fa: 'تماس و پشتیبانی', en: 'Contact' },
};

export function normalizeDigits(input: string) {
  return input
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}

interface LeadFormProps {
  intent: Intent;
  onIntentChange: (intent: Intent) => void;
  onDone?: () => void;
  compact?: boolean;
}

export function LeadForm({ intent, onIntentChange, onDone, compact }: LeadFormProps) {
  const { lang, t } = useLang();
  const [values, setValues] = useState({ name: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [serverError, setServerError] = useState('');

  const copy = {
    title: lang === 'fa' ? 'ثبت درخواست' : 'Send a request',
    hint:
      lang === 'fa'
        ? 'اطلاعات شما فقط برای پیگیری همین درخواست ثبت می‌شود.'
        : 'Your details are stored only to follow up on this request.',
    name: lang === 'fa' ? 'نام و نام خانوادگی' : 'Full name',
    phone: lang === 'fa' ? 'شماره تماس' : 'Phone number',
    message: lang === 'fa' ? 'توضیحات (اختیاری)' : 'Message (optional)',
    messagePlaceholder:
      lang === 'fa' ? 'مدل مورد نظر، زمان خرید یا سؤال فنی خود را بنویسید…' : 'Tell us what you need…',
    submit: lang === 'fa' ? 'ارسال درخواست' : 'Send request',
    sending: lang === 'fa' ? 'در حال ارسال…' : 'Sending…',
    ok: lang === 'fa' ? 'درخواست شما ثبت شد. کارشناس با شما تماس می‌گیرد.' : 'Request received. We will contact you.',
    error: lang === 'fa' ? 'ارسال انجام نشد. دوباره تلاش کنید.' : 'Could not send. Please try again.',
    noBackend:
      lang === 'fa'
        ? 'سرویس درخواست‌ها در دسترس نیست. لطفاً بعداً تلاش کنید.'
        : 'The request service is unavailable. Please try again later.',
    nameErr: lang === 'fa' ? 'نام را کامل وارد کنید.' : 'Enter your full name.',
    phoneErr: lang === 'fa' ? 'شماره تماس معتبر وارد کنید.' : 'Enter a valid phone number.',
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (values.name.trim().length < 2) nextErrors.name = copy.nameErr;
    const digits = normalizeDigits(values.phone).replace(/[^\d]/g, '');
    if (digits.length < 8 || digits.length > 15) nextErrors.phone = copy.phoneErr;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setState('sending');
    setServerError('');
    try {
      await api.createLead({
        name: values.name.trim(),
        phone: digits,
        message: values.message.trim().slice(0, 800),
        source: `site:${intent}`,
      });
      setState('ok');
      setValues({ name: '', phone: '', message: '' });
      window.setTimeout(() => {
        setState('idle');
        onDone?.();
      }, 2400);
    } catch (error) {
      setState('error');
      setServerError(error instanceof ApiError && error.status === 0 ? copy.noBackend : copy.error);
    }
  };

  return (
    <form className="lead-form" onSubmit={submit} noValidate>
      <div>
        <h3 className="lead-card__title">{copy.title}</h3>
        {!compact ? <p className="lead-card__hint">{copy.hint}</p> : null}
      </div>

      <div className="intent-switch" role="group" aria-label={lang === 'fa' ? 'نوع درخواست' : 'Request type'}>
        {(Object.keys(INTENT_LABELS) as Intent[]).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={intent === key}
            onClick={() => onIntentChange(key)}
          >
            {t(INTENT_LABELS[key])}
          </button>
        ))}
      </div>

      <div className="lead-form__grid">
        <div className={`field ${errors.name ? 'field--invalid' : ''}`}>
          <label className="field__label" htmlFor={`lead-name`}>
            {copy.name}
          </label>
          <input
            id="lead-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(event) => setValues((v) => ({ ...v, name: event.target.value }))}
            placeholder={lang === 'fa' ? 'مثلاً سارا محمدی' : 'e.g. Sara Mohammadi'}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name ? <span className="field__error">{errors.name}</span> : null}
        </div>
        <div className={`field ${errors.phone ? 'field--invalid' : ''}`}>
          <label className="field__label" htmlFor={`lead-phone`}>
            {copy.phone}
          </label>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            dir="ltr"
            autoComplete="tel"
            value={values.phone}
            onChange={(event) => setValues((v) => ({ ...v, phone: event.target.value }))}
            placeholder="0912 000 0000"
            aria-invalid={Boolean(errors.phone)}
          />
          {errors.phone ? <span className="field__error">{errors.phone}</span> : null}
        </div>
        <div className="field field--full">
          <label className="field__label" htmlFor={`lead-message`}>
            {copy.message}
          </label>
          <textarea
            id="lead-message"
            name="message"
            value={values.message}
            onChange={(event) => setValues((v) => ({ ...v, message: event.target.value }))}
            placeholder={copy.messagePlaceholder}
            maxLength={800}
          />
        </div>
      </div>

      <div className="lead-form__footer">
        <button type="submit" className="btn btn--primary" disabled={state === 'sending'}>
          <Icon name="send" size={17} />
          {state === 'sending' ? copy.sending : copy.submit}
        </button>
        {state === 'ok' ? (
          <span className="lead-form__status lead-form__status--ok" role="status">
            <Icon name="check" size={15} />
            {copy.ok}
          </span>
        ) : null}
        {state === 'error' ? (
          <span className="lead-form__status lead-form__status--err" role="alert">
            <Icon name="warning" size={15} />
            {serverError}
          </span>
        ) : null}
      </div>
    </form>
  );
}
