import type { Lead, SiteContent } from '../content/types';

export interface ContentResponse {
  content: SiteContent;
  updatedAt: string | null;
}

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      credentials: 'same-origin',
      headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
      ...init,
    });
  } catch {
    throw new ApiError('network', 0, 'network');
  }

  const text = await res.text();
  const data = text ? safeParse(text) : null;

  if (!res.ok) {
    const message =
      (data && (data.detail || data.message || data.error)) || `request_failed_${res.status}`;
    throw new ApiError(String(message), res.status, data?.code);
  }

  return data as T;
}

function safeParse(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export const api = {
  getContent: () => request<ContentResponse>('/api/content'),

  session: () => request<{ authenticated: boolean; username?: string; devFallback?: boolean }>('/api/admin/session'),

  login: (username: string, password: string) =>
    request<{ ok: boolean; username: string }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  logout: () => request<{ ok: boolean }>('/api/admin/logout', { method: 'POST' }),

  saveContent: (content: SiteContent) =>
    request<ContentResponse>('/api/admin/content', {
      method: 'PUT',
      body: JSON.stringify({ content }),
    }),

  resetContent: () =>
    request<ContentResponse>('/api/admin/content/reset', { method: 'POST' }),

  createLead: (payload: { name: string; phone: string; message: string; source: string }) =>
    request<{ ok: boolean; id: number }>('/api/leads', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  listLeads: () => request<{ leads: Lead[] }>('/api/admin/leads'),

  deleteLead: (id: number) => request<{ ok: boolean }>(`/api/admin/leads/${id}`, { method: 'DELETE' }),
};
