import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import { usePageMeta } from '../../lib/hooks.js';
import Icon from '../../components/Icon.jsx';

const LINKS = [
  { to: '/account', label: 'Overview', end: true, icon: 'user' },
  { to: '/account/orders', label: 'My Orders', icon: 'package' },
  { to: '/account/wishlist', label: 'Wishlist', icon: 'heart' },
  { to: '/account/addresses', label: 'Saved Addresses', icon: 'pin' },
  { to: '/account/profile', label: 'Profile Settings', icon: 'settings' },
];

export default function Account() {
  const { user, logout, isAdmin } = useStore();
  const navigate = useNavigate();

  usePageMeta('My Account', 'Your EVORA STYLE account.');

  const signOut = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="shell pt-8 lg:pt-12">
      <div className="border-b border-ink/10 pb-5">
        <p className="label text-gold">Client area</p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">My Account</h1>
        <p className="mt-2 text-[12px] text-charcoal/60">
          {user?.firstName} {user?.lastName} · {user?.email}
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[230px_1fr] lg:gap-12">
        <aside>
          <nav aria-label="Account" className="flex gap-2 overflow-x-auto no-scrollbar lg:flex-col lg:gap-0">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-3 border-b border-ink/10 px-1 py-3 text-[11px] uppercase tracking-label transition-colors lg:px-0 ${
                    isActive ? 'text-ink' : 'text-ink/45 hover:text-ink/75'
                  }`
                }
              >
                <Icon name={link.icon} className="hidden h-3.5 w-3.5 lg:block" />
                {link.label}
              </NavLink>
            ))}
            {isAdmin ? (
              <NavLink
                to="/admin"
                className="flex shrink-0 items-center gap-3 border-b border-ink/10 px-1 py-3 text-[11px] uppercase tracking-label text-gold lg:px-0"
              >
                <Icon name="dashboard" className="hidden h-3.5 w-3.5 lg:block" />
                Admin Dashboard
              </NavLink>
            ) : null}
            <button
              type="button"
              onClick={signOut}
              className="flex shrink-0 items-center gap-3 border-b border-ink/10 px-1 py-3 text-left text-[11px] uppercase tracking-label text-ink/45 transition-colors hover:text-ink lg:px-0"
            >
              <Icon name="logout" className="hidden h-3.5 w-3.5 lg:block" />
              Sign Out
            </button>
          </nav>
        </aside>

        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
