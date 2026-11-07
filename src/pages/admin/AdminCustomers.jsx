import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';
import { useStore } from '../../context/StoreContext.jsx';
import { money, formatDate } from '../../lib/format.js';
import { usePageMeta } from '../../lib/hooks.js';

export default function AdminCustomers() {
  const { pushToast, user } = useStore();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  usePageMeta('Customers — Admin');

  const load = () =>
    api
      .get('/admin/customers')
      .then((data) => setCustomers(data.customers || []))
      .catch(() => {})
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const update = async (customer, changes) => {
    try {
      await api.patch(`/admin/customers/${customer.id}`, changes);
      pushToast('Customer updated.');
      await load();
    } catch (error) {
      pushToast(error.message, { tone: 'error' });
    }
  };

  const filtered = customers.filter((customer) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(term) ||
      customer.email.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <div>
        <p className="label text-gold">Client book</p>
        <h1 className="mt-2 font-display text-3xl">Customers</h1>
        <p className="mt-1 text-[11px] text-charcoal/55">{customers.length} registered accounts</p>
      </div>

      <div className="mt-5 flex items-center gap-2 border-b border-ink/15 pb-1.5 sm:w-64">
        <span className="text-[12px] text-ink/40">⌕</span>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name or email"
          aria-label="Search customers"
          className="w-full bg-transparent text-[12px] placeholder:text-warmgray focus:outline-none"
        />
      </div>

      {loading ? (
        <p className="mt-6 text-[12px] text-ink/45">Loading customers…</p>
      ) : (
        <div className="mt-5 overflow-x-auto border border-ink/10 bg-paper">
          <table className="w-full min-w-[720px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-ink/10 text-[9px] uppercase tracking-label text-ink/40">
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Orders</th>
                <th className="px-4 py-3 font-medium">Spent</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <tr key={customer.id} className="border-b border-ink/[0.06] last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium">
                      {customer.firstName} {customer.lastName}
                    </p>
                    <p className="text-[10px] text-ink/45">{customer.email}</p>
                  </td>
                  <td className="px-4 py-3 text-charcoal/60">{formatDate(customer.createdAt)}</td>
                  <td className="px-4 py-3 tabular-nums text-charcoal/70">{customer.orderCount}</td>
                  <td className="px-4 py-3 tabular-nums text-charcoal/70">{money(customer.spent)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 text-[8px] uppercase tracking-label ${
                        customer.role === 'admin' ? 'bg-gold/15 text-gold' : 'bg-ink/[0.06] text-ink/50'
                      }`}
                    >
                      {customer.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 text-[8px] uppercase tracking-label ${
                        customer.status === 'active' ? 'bg-[#2f4a3f]/10 text-[#2f4a3f]' : 'bg-[#8a3232]/10 text-[#8a3232]'
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3 text-[9px] uppercase tracking-label">
                      <button
                        type="button"
                        onClick={() =>
                          update(customer, { status: customer.status === 'active' ? 'suspended' : 'active' })
                        }
                        disabled={customer.id === user?.id}
                        className="text-ink/50 hover:text-ink disabled:opacity-30"
                      >
                        {customer.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          update(customer, { role: customer.role === 'admin' ? 'customer' : 'admin' })
                        }
                        disabled={customer.id === user?.id}
                        className="text-ink/50 hover:text-ink disabled:opacity-30"
                      >
                        {customer.role === 'admin' ? 'Make customer' : 'Make admin'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length ? <p className="px-4 py-8 text-center text-[12px] text-ink/45">No customers match that search.</p> : null}
        </div>
      )}
    </div>
  );
}
