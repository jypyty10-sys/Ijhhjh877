import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api, ApiError } from '../lib/api';
import { useContent } from '../lib/content';
import type { Lead, SiteContent } from '../content/types';
import { FieldNode, humanize, setAtPath } from '../components/admin/ContentEditor';
import { Icon } from '../components/Icon';

const LEADS_TAB = '__leads';
const HIDDEN_TABS = new Set(['version']);
const TAB_ORDER = [
  'seo',
  'hero',
  'nav',
  'features',
  'showcase',
  'specs',
  'applications',
  'filaments',
  'gallery',
  'benefits',
  'why',
  'faq',
  'finalCta',
  'contact',
  'footer',
];

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export function Admin() {
  const { applyLocal, refresh } = useContent();
  const [mode, setMode] = useState<'checking' | 'login' | 'ready'>('checking');
  const [username, setUsername] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [tab, setTab] = useState('hero');
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsState, setLeadsState] = useState<'idle' | 'loading' | 'error'>('idle');
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const loadContent = useCallback(async () => {
    const data = await api.getContent();
    setDraft(data.content);
    setUpdatedAt(data.updatedAt);
  }, []);

  useEffect(() => {
    let cancelled = false;
    api
      .session()
      .then(async (session) => {
        if (cancelled) return;
        if (!session.authenticated) {
          setMode('login');
          return;
        }
        setUsername(session.username ?? '');
        await loadContent();
        if (!cancelled) setMode('ready');
      })
      .catch(() => {
        if (!cancelled) setMode('login');
      });
    return () => {
      cancelled = true;
    };
  }, [loadContent]);

  const loadLeads = useCallback(async () => {
    setLeadsState('loading');
    try {
      const data = await api.listLeads();
      setLeads(data.leads);
      setLeadsState('idle');
    } catch {
      setLeadsState('error');
    }
  }, []);

  useEffect(() => {
    if (mode === 'ready' && tab === LEADS_TAB) void loadLeads();
  }, [mode, tab, loadLeads]);

  const removeLead = async (id: number) => {
    if (!window.confirm('این درخواست حذف شود؟')) return;
    try {
      await api.deleteLead(id);
      setLeads((list) => list.filter((lead) => lead.id !== id));
    } catch {
      setLeadsState('error');
    }
  };

  const tabs = useMemo(() => {
    if (!draft) return [];
    const known = TAB_ORDER.filter((key) => key in draft);
    const extra = Object.keys(draft).filter((key) => !HIDDEN_TABS.has(key) && !TAB_ORDER.includes(key));
    return [...known, ...extra];
  }, [draft]);

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoggingIn(true);
    setLoginError('');
    try {
      const result = await api.login(username.trim(), passwordRef.current?.value ?? '');
      setUsername(result.username);
      await loadContent();
      setMode('ready');
    } catch (error) {
      if (error instanceof ApiError && error.code === 'admin_not_configured') {
        setLoginError('ورود مدیر پیکربندی نشده است. نام کاربری و رمز را در متغیرهای محیطی تنظیم کنید.');
      } else if (error instanceof ApiError && error.code === 'rate_limited') {
        setLoginError('تلاش‌های ناموفق زیاد بوده است. چند دقیقه بعد دوباره تلاش کنید.');
      } else if (error instanceof ApiError && error.status === 0) {
        setLoginError('ارتباط با سرور برقرار نشد.');
      } else {
        setLoginError('نام کاربری یا رمز عبور نادرست است.');
      }
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } finally {
      setMode('login');
      setDraft(null);
      await refresh();
    }
  };

  const save = async () => {
    if (!draft) return;
    setSaveState('saving');
    setSaveMessage('');
    try {
      const result = await api.saveContent(draft);
      setUpdatedAt(result.updatedAt);
      applyLocal(result.content);
      setSaveState('saved');
      setSaveMessage('تغییرات ذخیره شد و در سایت اعمال شد.');
    } catch (error) {
      setSaveState('error');
      setSaveMessage(
        error instanceof ApiError && error.status === 401
          ? 'نشست منقضی شده است؛ دوباره وارد شوید.'
          : 'ذخیره انجام نشد. دوباره تلاش کنید.',
      );
    }
  };

  const reset = async () => {
    if (!window.confirm('همه محتوای سفارشی حذف و متن پیش‌فرض بازگردانده شود؟')) return;
    setSaveState('saving');
    try {
      const result = await api.resetContent();
      setDraft(result.content);
      setUpdatedAt(result.updatedAt);
      applyLocal(result.content);
      setSaveState('saved');
      setSaveMessage('محتوای پیش‌فرض بازگردانده شد.');
    } catch {
      setSaveState('error');
      setSaveMessage('بازگردانی انجام نشد.');
    }
  };

  if (mode === 'checking') {
    return (
      <div className="admin admin--center">
        <p className="admin-muted">در حال بررسی دسترسی…</p>
      </div>
    );
  }

  if (mode === 'login') {
    return (
      <div className="admin admin--center">
        <form className="admin-login" onSubmit={login}>
          <div className="admin-login__brand">
            <span className="brand__mark">A5</span>
            <div>
              <strong>FLASHFORGE AD5X</strong>
              <span>پنل مدیریت محتوا</span>
            </div>
          </div>
          <label className="field">
            <span className="field__label">نام کاربری</span>
            <input
              value={username}
              autoComplete="username"
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>
          <label className="field">
            <span className="field__label">رمز عبور</span>
            <input ref={passwordRef} type="password" autoComplete="current-password" required />
          </label>
          {loginError ? (
            <p className="admin-error" role="alert">
              {loginError}
            </p>
          ) : null}
          <button type="submit" className="btn btn--primary btn--block" disabled={loggingIn}>
            <Icon name="lock" size={16} />
            {loggingIn ? 'در حال ورود…' : 'ورود'}
          </button>
          <a className="admin-back" href="/">
            بازگشت به سایت
          </a>
        </form>
      </div>
    );
  }

  return (
    <div className="admin">
      <header className="admin-bar">
        <a className="admin-brand" href="/">
          <span className="brand__mark">A5</span>
          <span>
            <strong>FLASHFORGE AD5X</strong>
            <small>مدیریت محتوا</small>
          </span>
        </a>
        <div className="admin-bar__actions">
          <span className="admin-user">
            <Icon name="user" size={14} />
            {username}
          </span>
          <a className="btn btn--ghost" href="/">
            مشاهده سایت
          </a>
          <button type="button" className="btn btn--ghost" onClick={logout}>
            <Icon name="logout" size={15} />
            خروج
          </button>
        </div>
      </header>

      <div className="admin-shell">
        <aside className="admin-side" aria-label="بخش‌های محتوا">
          {tabs.map((key) => (
            <button
              key={key}
              type="button"
              className="admin-tab"
              aria-pressed={tab === key}
              onClick={() => setTab(key)}
            >
              {humanize(key)}
            </button>
          ))}
          <button
            type="button"
            className="admin-tab"
            aria-pressed={tab === LEADS_TAB}
            onClick={() => setTab(LEADS_TAB)}
          >
            درخواست‌های مشتریان
          </button>
        </aside>

        <main className="admin-main">
          {tab !== LEADS_TAB ? (
            <>
              <div className="admin-toolbar">
                <div>
                  <h1 className="admin-title">{humanize(tab)}</h1>
                  <p className="admin-muted">
                    {updatedAt
                      ? `آخرین ذخیره: ${new Date(updatedAt).toLocaleString('fa-IR')}`
                      : 'هنوز تغییری ذخیره نشده است.'}
                  </p>
                </div>
                <div className="admin-toolbar__actions">
                  <button type="button" className="btn btn--ghost" onClick={reset}>
                    بازگردانی پیش‌فرض
                  </button>
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={save}
                    disabled={saveState === 'saving'}
                  >
                    <Icon name="check" size={16} />
                    {saveState === 'saving' ? 'در حال ذخیره…' : 'ذخیره تغییرات'}
                  </button>
                </div>
              </div>

              {saveMessage ? (
                <p
                  className={`admin-status ${saveState === 'error' ? 'admin-status--error' : ''}`}
                  role="status"
                >
                  {saveMessage}
                </p>
              ) : null}

              {draft ? (
                <div className="admin-panel">
                  <FieldNode
                    label={humanize(tab)}
                    value={(draft as unknown as Record<string, any>)[tab]}
                    path={[tab]}
                    depth={0}
                    onChange={(path, value) => setDraft((current) => (current ? setAtPath(current, path, value) : current))}
                  />
                </div>
              ) : null}
            </>
          ) : (
            <>
              <div className="admin-toolbar">
                <div>
                  <h1 className="admin-title">درخواست‌های مشتریان</h1>
                  <p className="admin-muted">درخواست‌هایی که از فرم‌های سایت ثبت شده‌اند.</p>
                </div>
                <button type="button" className="btn btn--ghost" onClick={() => void loadLeads()}>
                  {leadsState === 'loading' ? 'در حال بارگذاری…' : 'به‌روزرسانی'}
                </button>
              </div>

              {leadsState === 'error' ? (
                <p className="admin-status admin-status--error">دریافت فهرست انجام نشد.</p>
              ) : null}

              {leads.length === 0 && leadsState !== 'loading' ? (
                <p className="admin-empty">هنوز درخواستی ثبت نشده است.</p>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>تاریخ</th>
                        <th>نام</th>
                        <th>تماس</th>
                        <th>توضیحات</th>
                        <th>منبع</th>
                        <th>عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead) => (
                        <tr key={lead.id}>
                          <td className="num">{new Date(lead.createdAt).toLocaleString('fa-IR')}</td>
                          <td>{lead.name}</td>
                          <td className="num" dir="ltr">
                            {lead.phone}
                          </td>
                          <td>{lead.message || '—'}</td>
                          <td className="num">{lead.source}</td>
                          <td>
                            <button
                              type="button"
                              className="admin-icon admin-icon--danger"
                              onClick={() => void removeLead(lead.id)}
                              aria-label={`حذف درخواست ${lead.name}`}
                              title="حذف درخواست"
                            >
                              <Icon name="trash" size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
