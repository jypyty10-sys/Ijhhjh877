import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import defaultContentJson from '../content/default-content.json';
import type { SiteContent } from '../content/types';
import { api } from './api';

export const defaultContent = defaultContentJson as unknown as SiteContent;

export type ContentStatus = 'loading' | 'ready' | 'offline';

interface ContentContextValue {
  content: SiteContent;
  status: ContentStatus;
  updatedAt: string | null;
  refresh: () => Promise<void>;
  applyLocal: (next: SiteContent) => void;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [status, setStatus] = useState<ContentStatus>('loading');
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await api.getContent();
      setContent(data.content);
      setUpdatedAt(data.updatedAt);
      setStatus('ready');
      document.documentElement.dataset.contentSource = 'database';
    } catch {
      setStatus('offline');
      document.documentElement.dataset.contentSource = 'fallback';
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const applyLocal = useCallback((next: SiteContent) => {
    setContent(next);
    setStatus('ready');
  }, []);

  const value = useMemo<ContentContextValue>(
    () => ({ content, status, updatedAt, refresh, applyLocal }),
    [content, status, updatedAt, refresh, applyLocal],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used inside ContentProvider');
  return ctx;
}
