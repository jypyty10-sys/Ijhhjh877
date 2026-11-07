import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { money, formatDate, statusMeta } from '../../lib/format.js';
import Icon from '../../components/Icon.jsx';

export default function AccountOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/orders')
      .then((data) => setOrders(data.orders || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-[12px] text-ink/45">Loading your orders…</p>;

  if (error) return <p className="text-[12px] text-[#b4523f]">{error}</p>;

  if (!orders.length) {
    return (
      <div className="border border-ink/10 px-6 py-14 text-center">
        <Icon name="package" className="mx-auto h-8 w-8 text-ink/25" />
        <h2 className="mt-5 font-display text-2xl">No orders yet</h2>
        <p className="mx-auto mt-2 max-w-xs text-[13px] leading-relaxed text-charcoal/65">
          Your order history will appear here once you place your first order.
        </p>
        <Link to="/shop" className="btn-dark mt-6">
          Shop the collection
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-display text-2xl">My Orders</h2>
      <ul className="mt-5 space-y-3">
        {orders.map((order) => {
          const status = statusMeta(order.status);
          return (
            <li key={order.id}>
              <Link
                to={`/account/orders/${order.orderNumber}`}
                className="flex flex-col gap-4 border border-ink/10 p-4 transition-colors hover:border-ink/30 sm:flex-row sm:items-center sm:p-5"
              >
                <div className="flex -space-x-2 sm:w-28">
                  {order.items?.slice(0, 3).map((item) => (
                    <img
                      key={item.id}
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-12 border border-ivory object-cover"
                      loading="lazy"
                    />
                  ))}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[12px] font-medium">{order.orderNumber}</p>
                    <span className={`px-2 py-0.5 text-[8px] uppercase tracking-label ${status.tone}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-charcoal/60">
                    {formatDate(order.createdAt)} · {order.items?.length || 0} piece(s) ·{' '}
                    {order.deliveryMethod} delivery
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <p className="text-[14px] tabular-nums">{money(order.total)}</p>
                  <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-label text-ink/45">
                    Details <Icon name="arrowRight" className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
