import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';
import { useStore } from '../../context/StoreContext.jsx';
import Icon from '../../components/Icon.jsx';

const EMPTY = {
  label: 'Home',
  fullName: '',
  line1: '',
  line2: '',
  city: '',
  postcode: '',
  country: 'United Kingdom',
  phone: '',
  isDefault: false,
};

export default function AccountAddresses() {
  const { user, pushToast } = useStore();
  const [addresses, setAddresses] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () =>
    api
      .get('/account/addresses')
      .then((data) => setAddresses(data.addresses || []))
      .catch(() => {})
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const startNew = () => {
    setEditing('new');
    setForm({ ...EMPTY, fullName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(), phone: user?.phone || '' });
  };

  const startEdit = (address) => {
    setEditing(address.id);
    setForm({
      label: address.label || 'Home',
      fullName: address.fullName,
      line1: address.line1,
      line2: address.line2 || '',
      city: address.city,
      postcode: address.postcode,
      country: address.country,
      phone: address.phone || '',
      isDefault: Boolean(address.isDefault),
    });
  };

  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      if (editing === 'new') {
        await api.post('/account/addresses', form);
      } else {
        await api.patch(`/account/addresses/${editing}`, form);
      }
      pushToast('Address saved.');
      setEditing(null);
      await load();
    } catch (error) {
      pushToast(error.message, { tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/account/addresses/${id}`);
      pushToast('Address removed.');
      await load();
    } catch (error) {
      pushToast(error.message, { tone: 'error' });
    }
  };

  const makeDefault = async (id) => {
    try {
      await api.patch(`/account/addresses/${id}`, { isDefault: true });
      await load();
    } catch (error) {
      pushToast(error.message, { tone: 'error' });
    }
  };

  const set = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }));

  return (
    <div>
      <div className="flex items-end justify-between">
        <h2 className="font-display text-2xl">Saved Addresses</h2>
        <button type="button" onClick={startNew} className="btn-light px-5 py-2.5">
          Add address
        </button>
      </div>

      {loading ? <p className="mt-5 text-[12px] text-ink/45">Loading…</p> : null}

      {!loading && !addresses.length && editing === null ? (
        <div className="mt-5 border border-ink/10 px-6 py-12 text-center">
          <Icon name="pin" className="mx-auto h-7 w-7 text-ink/25" />
          <p className="mt-4 text-[13px] text-charcoal/65">No saved addresses yet.</p>
        </div>
      ) : null}

      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {addresses.map((address) => (
          <li key={address.id} className="border border-ink/10 p-5">
            <div className="flex items-start justify-between">
              <p className="text-[10px] uppercase tracking-label text-ink/45">
                {address.label || 'Address'}
                {address.isDefault ? <span className="ml-2 text-gold">· Default</span> : null}
              </p>
              <div className="flex gap-3 text-ink/40">
                <button type="button" onClick={() => startEdit(address)} aria-label="Edit address" className="hover:text-ink">
                  <Icon name="edit" className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => remove(address.id)} aria-label="Delete address" className="hover:text-ink">
                  <Icon name="trash" className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-charcoal/75">
              {address.fullName}
              <br />
              {address.line1}
              {address.line2 ? (
                <>
                  <br />
                  {address.line2}
                </>
              ) : null}
              <br />
              {address.city}, {address.postcode}
              <br />
              {address.country}
            </p>
            {!address.isDefault ? (
              <button
                type="button"
                onClick={() => makeDefault(address.id)}
                className="mt-3 text-[9px] uppercase tracking-label text-ink/45 underline underline-offset-4 hover:text-ink"
              >
                Set as default
              </button>
            ) : null}
          </li>
        ))}
      </ul>

      {editing !== null ? (
        <form onSubmit={save} className="mt-6 border border-ink/15 p-5">
          <div className="flex items-center justify-between">
            <p className="font-display text-lg">{editing === 'new' ? 'New address' : 'Edit address'}</p>
            <button type="button" onClick={() => setEditing(null)} aria-label="Cancel" className="text-ink/40 hover:text-ink">
              <Icon name="close" className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Label</label>
              <input className="field" value={form.label} onChange={set('label')} placeholder="Home, Studio…" />
            </div>
            <div>
              <label className="field-label">Full name</label>
              <input className="field" value={form.fullName} onChange={set('fullName')} required />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">Address</label>
              <input className="field" value={form.line1} onChange={set('line1')} required />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">Apartment, suite (optional)</label>
              <input className="field" value={form.line2} onChange={set('line2')} />
            </div>
            <div>
              <label className="field-label">City</label>
              <input className="field" value={form.city} onChange={set('city')} required />
            </div>
            <div>
              <label className="field-label">Postcode</label>
              <input className="field" value={form.postcode} onChange={set('postcode')} required />
            </div>
            <div>
              <label className="field-label">Country</label>
              <input className="field" value={form.country} onChange={set('country')} />
            </div>
            <div>
              <label className="field-label">Phone</label>
              <input className="field" value={form.phone} onChange={set('phone')} />
            </div>
            <label className="flex items-center gap-2 text-[12px] text-charcoal/70 sm:col-span-2">
              <input type="checkbox" checked={form.isDefault} onChange={set('isDefault')} className="accent-ink" />
              Use as my default delivery address
            </label>
          </div>

          <div className="mt-5 flex gap-2">
            <button type="submit" disabled={busy} className="btn-dark">
              {busy ? 'Saving…' : 'Save address'}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="btn-light">
              Cancel
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
