import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';
import { useStore } from '../../context/StoreContext.jsx';
import { money, formatDate } from '../../lib/format.js';
import { usePageMeta } from '../../lib/hooks.js';
import Icon from '../../components/Icon.jsx';

const TABS = ['Settings', 'Discounts', 'Subscribers', 'Collections'];

export default function AdminStore() {
  const { pushToast } = useStore();
  const [tab, setTab] = useState('Settings');
  const [settings, setSettings] = useState({});
  const [discounts, setDiscounts] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [collections, setCollections] = useState([]);
  const [newCode, setNewCode] = useState({ code: '', type: 'percent', value: '', minSubtotal: '' });
  const [busy, setBusy] = useState(false);

  usePageMeta('Store management — Admin');

  const loadAll = () => {
    Promise.all([
      api.get('/admin/settings'),
      api.get('/admin/discounts'),
      api.get('/admin/subscribers'),
      api.get('/admin/collections'),
    ])
      .then(([s, d, sub, c]) => {
        setSettings(s.settings || {});
        setDiscounts(d.discounts || []);
        setSubscribers(sub.subscribers || []);
        setCollections(c.collections || []);
      })
      .catch((error) => pushToast(error.message, { tone: 'error' }));
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveSettings = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      const payload = {
        announcement: settings.announcement,
        hero_eyebrow: settings.hero_eyebrow,
        hero_lead: settings.hero_lead,
        hero_season: settings.hero_season,
        contact_email: settings.contact_email,
        instagram_handle: settings.instagram_handle,
        shipping_standard: Number(settings.shipping_standard),
        shipping_express: Number(settings.shipping_express),
        free_shipping_threshold: Number(settings.free_shipping_threshold),
      };
      const data = await api.put('/admin/settings', payload);
      setSettings(data.settings);
      pushToast('Store settings saved.');
    } catch (error) {
      pushToast(error.message, { tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const createDiscount = async (event) => {
    event.preventDefault();
    try {
      await api.post('/admin/discounts', {
        code: newCode.code,
        type: newCode.type,
        value: Number(newCode.value),
        minSubtotal: Number(newCode.minSubtotal) || 0,
      });
      pushToast('Discount created.');
      setNewCode({ code: '', type: 'percent', value: '', minSubtotal: '' });
      loadAll();
    } catch (error) {
      pushToast(error.message, { tone: 'error' });
    }
  };

  const field = (key) => (event) => setSettings((current) => ({ ...current, [key]: event.target.value }));

  return (
    <div>
      <div>
        <p className="label text-gold">Store management</p>
        <h1 className="mt-2 font-display text-3xl">Store</h1>
      </div>

      <div className="mt-5 flex gap-1 overflow-x-auto border-b border-ink/10 no-scrollbar">
        {TABS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setTab(option)}
            className={`shrink-0 border-b-2 px-4 py-2.5 text-[10px] uppercase tracking-label transition-colors ${
              tab === option ? 'border-ink text-ink' : 'border-transparent text-ink/45 hover:text-ink/75'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {tab === 'Settings' ? (
        <form onSubmit={saveSettings} className="mt-6 max-w-2xl space-y-4 border border-ink/10 bg-paper p-5">
          <div>
            <label className="field-label" htmlFor="s-announcement">Announcement bar</label>
            <input id="s-announcement" className="field" value={settings.announcement || ''} onChange={field('announcement')} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="s-eyebrow">Hero eyebrow</label>
              <input id="s-eyebrow" className="field" value={settings.hero_eyebrow || ''} onChange={field('hero_eyebrow')} />
            </div>
            <div>
              <label className="field-label" htmlFor="s-season">Hero season label</label>
              <input id="s-season" className="field" value={settings.hero_season || ''} onChange={field('hero_season')} />
            </div>
          </div>
          <div>
            <label className="field-label" htmlFor="s-lead">Hero paragraph</label>
            <textarea id="s-lead" rows="2" className="field" value={settings.hero_lead || ''} onChange={field('hero_lead')} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="s-email">Concierge email</label>
              <input id="s-email" className="field" value={settings.contact_email || ''} onChange={field('contact_email')} />
            </div>
            <div>
              <label className="field-label" htmlFor="s-instagram">Instagram handle</label>
              <input id="s-instagram" className="field" value={settings.instagram_handle || ''} onChange={field('instagram_handle')} />
            </div>
            <div>
              <label className="field-label" htmlFor="s-standard">Standard delivery ($)</label>
              <input id="s-standard" type="number" className="field" value={settings.shipping_standard ?? ''} onChange={field('shipping_standard')} />
            </div>
            <div>
              <label className="field-label" htmlFor="s-express">Express delivery ($)</label>
              <input id="s-express" type="number" className="field" value={settings.shipping_express ?? ''} onChange={field('shipping_express')} />
            </div>
            <div>
              <label className="field-label" htmlFor="s-threshold">Free delivery threshold ($)</label>
              <input id="s-threshold" type="number" className="field" value={settings.free_shipping_threshold ?? ''} onChange={field('free_shipping_threshold')} />
            </div>
          </div>
          <button type="submit" disabled={busy} className="btn-dark">
            {busy ? 'Saving…' : 'Save settings'}
          </button>
        </form>
      ) : null}

      {tab === 'Discounts' ? (
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="overflow-x-auto border border-ink/10 bg-paper">
            <table className="w-full min-w-[480px] text-left text-[12px]">
              <thead>
                <tr className="border-b border-ink/10 text-[9px] uppercase tracking-label text-ink/40">
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">Value</th>
                  <th className="px-4 py-3 font-medium">Min. spend</th>
                  <th className="px-4 py-3 font-medium">Used</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {discounts.map((discount) => (
                  <tr key={discount.id} className="border-b border-ink/[0.06] last:border-0">
                    <td className="px-4 py-3 font-medium tracking-wide">{discount.code}</td>
                    <td className="px-4 py-3 tabular-nums">
                      {discount.type === 'percent' ? `${discount.value}%` : money(discount.value)}
                    </td>
                    <td className="px-4 py-3 tabular-nums">{discount.minSubtotal ? money(discount.minSubtotal) : '—'}</td>
                    <td className="px-4 py-3 tabular-nums text-charcoal/60">{discount.usageCount}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[8px] uppercase tracking-label ${discount.active ? 'bg-[#2f4a3f]/10 text-[#2f4a3f]' : 'bg-ink/10 text-ink/50'}`}>
                        {discount.active ? 'Active' : 'Paused'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3 text-[9px] uppercase tracking-label">
                        <button
                          type="button"
                          onClick={async () => {
                            await api.patch(`/admin/discounts/${discount.id}`, { active: !discount.active });
                            loadAll();
                          }}
                          className="text-ink/50 hover:text-ink"
                        >
                          {discount.active ? 'Pause' : 'Activate'}
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await api.delete(`/admin/discounts/${discount.id}`);
                            pushToast('Discount removed.');
                            loadAll();
                          }}
                          className="text-ink/35 hover:text-[#b4523f]"
                          aria-label={`Delete ${discount.code}`}
                        >
                          <Icon name="trash" className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!discounts.length ? <p className="px-4 py-8 text-center text-[12px] text-ink/45">No discount codes yet.</p> : null}
          </div>

          <form onSubmit={createDiscount} className="h-fit border border-ink/10 bg-paper p-5">
            <h2 className="font-display text-lg">New code</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="field-label" htmlFor="d-code">Code</label>
                <input
                  id="d-code"
                  className="field uppercase"
                  value={newCode.code}
                  onChange={(event) => setNewCode((c) => ({ ...c, code: event.target.value.toUpperCase() }))}
                  placeholder="SPRING20"
                  required
                />
              </div>
              <div>
                <label className="field-label" htmlFor="d-type">Type</label>
                <select
                  id="d-type"
                  className="field"
                  value={newCode.type}
                  onChange={(event) => setNewCode((c) => ({ ...c, type: event.target.value }))}
                >
                  <option value="percent">Percentage</option>
                  <option value="fixed">Fixed amount</option>
                </select>
              </div>
              <div>
                <label className="field-label" htmlFor="d-value">Value</label>
                <input
                  id="d-value"
                  type="number"
                  min="1"
                  className="field"
                  value={newCode.value}
                  onChange={(event) => setNewCode((c) => ({ ...c, value: event.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="field-label" htmlFor="d-min">Minimum spend (optional)</label>
                <input
                  id="d-min"
                  type="number"
                  min="0"
                  className="field"
                  value={newCode.minSubtotal}
                  onChange={(event) => setNewCode((c) => ({ ...c, minSubtotal: event.target.value }))}
                />
              </div>
            </div>
            <button type="submit" className="btn-dark mt-4 w-full">
              Create discount
            </button>
          </form>
        </div>
      ) : null}

      {tab === 'Subscribers' ? (
        <div className="mt-6 overflow-x-auto border border-ink/10 bg-paper">
          <table className="w-full min-w-[420px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-ink/10 text-[9px] uppercase tracking-label text-ink/40">
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 text-right font-medium">Remove</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="border-b border-ink/[0.06] last:border-0">
                  <td className="px-4 py-3">{subscriber.email}</td>
                  <td className="px-4 py-3 text-charcoal/60">{subscriber.source}</td>
                  <td className="px-4 py-3 text-charcoal/60">{formatDate(subscriber.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={async () => {
                        await api.delete(`/admin/subscribers/${subscriber.id}`);
                        loadAll();
                      }}
                      aria-label={`Remove ${subscriber.email}`}
                      className="text-ink/35 hover:text-[#b4523f]"
                    >
                      <Icon name="trash" className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!subscribers.length ? <p className="px-4 py-8 text-center text-[12px] text-ink/45">No subscribers yet.</p> : null}
        </div>
      ) : null}

      {tab === 'Collections' ? (
        <div className="mt-6 space-y-4">
          {collections.map((collection) => (
            <form
              key={collection.id}
              onSubmit={async (event) => {
                event.preventDefault();
                const form = new FormData(event.currentTarget);
                try {
                  await api.patch(`/admin/collections/${collection.id}`, {
                    title: String(form.get('title') || ''),
                    subtitle: String(form.get('subtitle') || ''),
                    description: String(form.get('description') || ''),
                    image: String(form.get('image') || ''),
                  });
                  pushToast('Collection updated.');
                  loadAll();
                } catch (error) {
                  pushToast(error.message, { tone: 'error' });
                }
              }}
              className="grid gap-4 border border-ink/10 bg-paper p-5 sm:grid-cols-[120px_1fr]"
            >
              <img src={collection.image} alt={collection.title} className="h-28 w-full object-cover sm:h-32" loading="lazy" />
              <div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="field-label">Subtitle</label>
                    <input name="subtitle" className="field py-2" defaultValue={collection.subtitle || ''} />
                  </div>
                  <div>
                    <label className="field-label">Title</label>
                    <input name="title" className="field py-2" defaultValue={collection.title} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="field-label">Description</label>
                    <input name="description" className="field py-2" defaultValue={collection.description || ''} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="field-label">Image URL</label>
                    <input name="image" className="field py-2 text-[11px]" defaultValue={collection.image || ''} />
                  </div>
                </div>
                <button type="submit" className="btn-light mt-3 px-5 py-2">
                  Save
                </button>
              </div>
            </form>
          ))}
        </div>
      ) : null}
    </div>
  );
}
