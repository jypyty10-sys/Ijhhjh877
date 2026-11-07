import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import Icon from '../../components/Icon.jsx';

const LINKS = [
  { to: '/admin', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/admin/products', label: 'Products', icon: 'package' },
  { to: '/admin/orders', label: 'Orders', icon: 'truck' },
  { to: '/admin/customers', label: 'Customers', icon: 'users' },
  { to: '/admin/store', label: 'Store', icon: 'settings' },
];

export default function AdminLayout() {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    await logout();
    navigate('/');
  };

  const nav = (
    <nav className="space-y-1">
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 text-[10px] font-medium uppercase tracking-label transition-colors ${
              isActive ? 'bg-ivory/10 text-ivory' : 'text-ivory/50 hover:text-ivory'
            }`
          }
        >
          <Icon name={link.icon} className="h-4 w-4" />
          {link.label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-ivory lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="hidden bg-ink text-ivory lg:flex lg:min-h-screen lg:flex-col">
        <div className="border-b border-ivory/10 px-6 py-6">
          <Link to="/" className="block font-display text-sm uppercase tracking-[0.3em]">
            Evora Style
          </Link>
          <p className="mt-2 text-[8px] uppercase tracking-label text-ivory/40">Admin dashboard</p>
        </div>
        <div className="flex-1 py-6">{nav}</div>
        <div className="border-t border-ivory/10 px-5 py-5">
          <p className="truncate text-[11px] text-ivory/70">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="mt-0.5 truncate text-[9px] uppercase tracking-label text-ivory/35">Administrator</p>
          <div className="mt-4 flex flex-col gap-2">
            <Link to="/" className="text-[9px] uppercase tracking-label text-ivory/50 hover:text-ivory">
              View storefront
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="flex items-center gap-2 text-left text-[9px] uppercase tracking-label text-ivory/50 hover:text-ivory"
            >
              <Icon name="logout" className="h-3 w-3" /> Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-ink/10 bg-ivory/95 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button type="button" onClick={() => setOpen((value) => !value)} aria-label="Toggle admin menu" className="flex h-9 w-9 items-center justify-center">
              <Icon name={open ? 'close' : 'menu'} className="h-5 w-5" />
            </button>
            <span className="font-display text-xs uppercase tracking-[0.3em]">Admin</span>
            <Link to="/" className="text-[9px] uppercase tracking-label text-ink/50">
              Store
            </Link>
          </div>
          {open ? <div className="border-t border-ink/10 bg-ink py-3">{nav}</div> : null}
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
