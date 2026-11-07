import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { useStore } from '../../context/StoreContext.jsx';
import { money, formatDate, statusMeta } from '../../lib/format.js';
import Icon from '../../components/Icon.jsx';

export default function AccountOverview() {
  const { user, wishlist } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/orders')
      .then((data) => setOrders(data.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const latest = orders[0];

  return (
    <div>
      <div className="border border-ink/10 p-6">
        <p className="label text-gold">Welcome back</p>
        <h2 className="mt-2 font-display text-2xl">Good to see you, {user?.firstName}.</h2>
        <p className="mt-2 text-[12px] leading-relaxed text-charcoal/65">
          Member since {formatDate(user?.createdAt)}. Your orders, addresses and saved pieces are kept here.
        </p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="border border-ink/10 p-5">
          <p className="label text-ink/45">Orders</p>
          <p className="mt-3 font-display text-3xl">{orders.length}</p>
          <Link to="/account/orders" className="link-line mt-3 inline-block text-[9px] text-ink/55">
            View orders
          </Link>
        </div>
        <div className="border border-ink/10 p-5">
          <p className="label text-ink/45">Wishlist</p>
          <p className="mt-3 font-display text-3xl">{wishlist.count}</p>
          <Link to="/account/wishlist" className="link-line mt-3 inline-block text-[9px] text-ink/55">
            View wishlist
          </Link>
        </div>
        <div className="border border-ink/10 p-5">
          <p className="label text-ink/45">Addresses</p>
          <p className="mt-3 font-display text-3xl">—</p>
          <Link to="/account/addresses" className="link-line mt-3 inline-block text-[9px] text-ink/55">
            Manage addresses
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-end justify-between">
          <h3 className="font-display text-xl">Most recent order</h3>
          <Link to="/account/orders" className="link-line text-[9px] text-ink/55">
            All orders
          </Link>
        </div>

        {loading ? (
          <p className="mt-4 text-[12px] text-ink/45">Loading…</p>
        ) : latest ? (
          <Link to={`/account/orders/${latest.orderNumber}`} className="mt-4 flex flex-col gap-4 border border-ink/10 p-5 sm:flex-row sm:items-center">
            <img
              src={latest.items?.[0]?.image}
              alt={latest.items?.[0]?.name || 'Order item'}
              className="h-24 w-20 object-cover"
              loading="lazy"
            />
            <div className="flex-1">
              <p className="text-[12px] font-medium">{latest.orderNumber}</p>
              <p className="mt-1 text-[11px] text-charcoal/60">
                {formatDate(latest.createdAt)} · {latest.items?.length || 0} piece(s)
              </p>
              <span className={`mt-2 inline-flex px-2 py-1 text-[9px] uppercase tracking-label ${statusMeta(latest.status).tone}`}>
                {statusMeta(latest.status).label}
              </span>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-[14px] tabular-nums">{money(latest.total)}</p>
              <span className="mt-1 inline-flex items-center gap-1 text-[9px] uppercase tracking-label text-ink/45">
                View <Icon name="arrowRight" className="h-3 w-3" />
              </span>
            </div>
          </Link>
        ) : (
          <div className="mt-4 border border-ink/10 px-5 py-8 text-center">
            <p className="text-[13px] text-charcoal/65">You have not placed an order yet.</p>
            <Link to="/shop" className="btn-dark mt-4">
              Start shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
