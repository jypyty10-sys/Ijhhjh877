import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { money, formatDate, statusMeta } from '../../lib/format.js';
import { usePageMeta } from '../../lib/hooks.js';
import Icon from '../../components/Icon.jsx';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  usePageMeta('Admin dashboard');

  useEffect(() => {
    api
      .get('/admin/stats')
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="text-[12px] text-[#b4523f]">{error}</p>;
  if (!data) return <p className="text-[12px] text-ink/45">Loading dashboard…</p>;

  const maxRevenue = Math.max(1, ...data.monthly.map((month) => month.revenue));

  const cards = [
    { label: 'Orders', value: data.totals.orders, icon: 'package' },
    { label: 'Products', value: data.totals.products, icon: 'tag' },
    { label: 'Customers', value: data.totals.customers, icon: 'users' },
    { label: 'Revenue', value: money(data.totals.revenue), icon: 'card' },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label text-gold">Overview</p>
          <h1 className="mt-2 font-display text-3xl">Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/products/new" className="btn-dark px-5 py-2.5">
            <Icon name="plus" className="h-3.5 w-3.5" /> New product
          </Link>
          <Link to="/admin/orders" className="btn-light px-5 py-2.5">
            All orders
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="border border-ink/10 bg-paper p-5">
            <div className="flex items-center justify-between">
              <p className="text-[9px] uppercase tracking-label text-ink/45">{card.label}</p>
              <Icon name={card.icon} className="h-4 w-4 text-ink/25" />
            </div>
            <p className="mt-4 font-display text-3xl leading-none">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="border border-ink/10 bg-paper p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg">Sales overview</h2>
            <p className="text-[9px] uppercase tracking-label text-ink/40">Last 6 months</p>
          </div>
          {data.monthly.length ? (
            <div className="mt-6 flex h-44 items-end gap-3">
              {data.monthly.map((month) => (
                <div key={month.label} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[9px] tabular-nums text-ink/50">
                    {month.revenue >= 1000 ? `$${(month.revenue / 1000).toFixed(1)}k` : `$${Math.round(month.revenue)}`}
                  </span>
                  <div
                    className="w-full bg-ink/85 transition-all"
                    style={{ height: `${Math.max(6, (month.revenue / maxRevenue) * 130)}px` }}
                    title={`${month.orders} orders`}
                  />
                  <span className="text-[9px] uppercase tracking-label text-ink/40">{month.label}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-[12px] text-ink/45">No sales recorded yet.</p>
          )}
        </section>

        <section className="border border-ink/10 bg-paper p-5">
          <h2 className="font-display text-lg">Best-selling pieces</h2>
          {data.bestSellers.length ? (
            <ul className="mt-4 space-y-3">
              {data.bestSellers.map((item, index) => (
                <li key={item.slug} className="flex items-center gap-3">
                  <span className="w-4 text-[10px] tabular-nums text-ink/35">{index + 1}</span>
                  <img src={item.image} alt={item.name} className="h-12 w-10 object-cover" loading="lazy" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px]">{item.name}</p>
                    <p className="text-[9px] uppercase tracking-label text-ink/40">{item.sold} sold</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-[12px] text-ink/45">No sales yet.</p>
          )}
        </section>
      </div>

      <section className="mt-6 border border-ink/10 bg-paper">
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h2 className="font-display text-lg">Recent orders</h2>
          <Link to="/admin/orders" className="link-line text-[9px] text-ink/50">
            View all
          </Link>
        </div>
        {data.recentOrders.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-[12px]">
              <thead>
                <tr className="border-b border-ink/10 text-[9px] uppercase tracking-label text-ink/40">
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-ink/[0.06] last:border-0">
                    <td className="px-5 py-3">
                      <Link to={`/admin/orders/${order.id}`} className="font-medium hover:underline">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="max-w-[180px] truncate px-5 py-3 text-charcoal/70">{order.email}</td>
                    <td className="px-5 py-3 text-charcoal/60">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 text-[8px] uppercase tracking-label ${statusMeta(order.status).tone}`}>
                        {statusMeta(order.status).label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">{money(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-5 py-6 text-[12px] text-ink/45">No orders yet.</p>
        )}
      </section>
    </div>
  );
}
