import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Lang, Localized } from '../content/types';

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  t: (value: Localized | string | undefined | null) => string;
  dir: 'rtl' | 'ltr';
}

const LangContext = createContext<LangContextValue | null>(null);
const STORAGE_KEY = 'ad5x.lang';

function readInitialLang(): Lang {
  if (typeof window === 'undefined') return 'fa';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'fa' || stored === 'en') return stored;
  return 'fa';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'fa' ? 'rtl' : 'ltr';
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const toggle = useCallback(() => setLangState((l) => (l === 'fa' ? 'en' : 'fa')), []);

  const t = useCallback(
    (value: Localized | string | undefined | null) => {
      if (!value) return '';
      if (typeof value === 'string') return value;
      return value[lang] || value.fa || value.en || '';
    },
    [lang],
  );

  const value = useMemo<LangContextValue>(
    () => ({ lang, setLang, toggle, t, dir: lang === 'fa' ? 'rtl' : 'ltr' }),
    [lang, setLang, toggle, t],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider');
  return ctx;
}
