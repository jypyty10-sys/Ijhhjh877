import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';
import Icon from './Icon.jsx';
import { MEGA_MENUS, NAV_ITEMS } from '../data/navigation.js';

function Badge({ count }) {
  if (!count) return null;
  return (
    <span className="ml-1.5 inline-flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-ink px-1 text-[9px] font-medium leading-none text-ivory">
      {count > 99 ? '99+' : count}
    </span>
  );
}

export default function Header() {
  const { cart, wishlist, user, setCartOpen, setSearchOpen, settings } = useStore();
  const headerRef = useRef(null);
  const [openMega, setOpenMega] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState('men');
  const [scrolled, setScrolled] = useState(false);
  const [mobileQuery, setMobileQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMobileOpen(false);
    setOpenMega(null);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // The home hero pins directly under this header, so its height is published as
  // `--header-h` instead of being hardcoded: the compact state, a wrapping announcement and
  // late fonts all change it. Consumers fall back to 0px when the variable is absent.
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;
    const root = document.documentElement;
    let stopped = false;
    let pending = 0;
    const write = () => {
      if (stopped) return;
      const height = Math.round(el.getBoundingClientRect().height);
      if (height > 0) root.style.setProperty('--header-h', `${height}px`);
    };
    // Written in its own frame: the variable resizes the hero panel below the header, and
    // styling from inside the observer callback would just queue another notification.
    const sync = () => {
      if (stopped || pending) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        write();
      });
    };
    write();
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    document.fonts?.ready.then(sync);
    return () => {
      stopped = true;
      if (pending) cancelAnimationFrame(pending);
      observer.disconnect();
      root.style.removeProperty('--header-h');
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (mobileOpen) {
      root.style.overflow = 'hidden';
    } else {
      root.style.overflow = '';
    }
    return () => {
      root.style.overflow = '';
    };
  }, [mobileOpen]);

  const submitMobileSearch = (event) => {
    event.preventDefault();
    const term = mobileQuery.trim();
    setMobileOpen(false);
    navigate(term ? `/search?q=${encodeURIComponent(term)}` : '/search');
  };

  const mega = openMega ? MEGA_MENUS[openMega] : null;

  return (
    <header ref={headerRef} className="sticky top-0 z-40">
      <div className="bg-ink px-4 py-2 text-center text-ivory">
        <p className="truncate text-[9px] font-medium uppercase tracking-label text-ivory/80">
          {settings.announcement || 'Complimentary worldwide delivery on orders over $250'}
        </p>
      </div>

      {/* Below lg the bar keeps one height: the home hero pins directly under it, so letting
          it compact by a few pixels dragged the whole pinned scene up mid-scroll. */}
      <div
        className={`relative border-b border-ink/10 bg-ivory/95 backdrop-blur transition-all duration-500 ease-luxury ${
          scrolled ? 'py-3 lg:py-2' : 'py-3 lg:py-4'
        }`}
        onMouseLeave={() => setOpenMega(null)}
      >
        <div className="shell flex items-center justify-between gap-3 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div className="flex items-center gap-1 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className="-ml-2 flex h-11 w-11 items-center justify-center"
            >
              <Icon name="menu" className="h-5 w-5" />
            </button>
          </div>

          <nav aria-label="Primary" className="hidden lg:flex lg:items-center lg:gap-6 xl:gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="link-line py-2 text-[10px] font-medium uppercase tracking-label text-ink/80 hover:text-ink"
                onMouseEnter={() => setOpenMega(item.mega)}
                data-active={location.pathname === '/shop' && location.search.includes(item.to.split('=')[1] || '§')}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            to="/"
            aria-label="EVORA STYLE — home"
            className="group flex flex-col items-center text-center"
            onMouseEnter={() => setOpenMega(null)}
          >
            <span
              className={`font-display uppercase leading-none tracking-[0.3em] text-ink transition-all duration-500 ${
                scrolled ? 'text-[15px] lg:text-lg' : 'text-[15px] lg:text-[26px]'
              }`}
            >
              Evora Style
            </span>
            <span className="mt-1.5 hidden text-[7px] font-medium uppercase tracking-[0.34em] text-ink/55 sm:block">
              {settings.slogan || 'Heritage • Character • Always Relevant'}
            </span>
          </Link>

          <div className="flex items-center justify-end gap-1 sm:gap-3">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden h-10 w-10 items-center justify-center text-ink/80 hover:text-ink sm:flex"
              aria-label="Search"
            >
              <Icon name="search" className="h-[18px] w-[18px]" />
            </button>
            <Link
              to={user ? '/account' : '/login'}
              className="hidden h-10 w-10 items-center justify-center text-ink/80 hover:text-ink sm:flex"
              aria-label={user ? 'My account' : 'Sign in'}
              title={user ? `${user.firstName} ${user.lastName}` : 'Sign in'}
            >
              <Icon name="user" className="h-[18px] w-[18px]" />
            </Link>
            <Link
              to="/account/wishlist"
              className="relative hidden h-10 w-10 items-center justify-center text-ink/80 hover:text-ink sm:flex"
              aria-label="Wishlist"
            >
              <Icon name="heart" className="h-[18px] w-[18px]" />
              <Badge count={wishlist.count} />
            </Link>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center text-ink/80 sm:hidden"
              aria-label="Search"
            >
              <Icon name="search" className="h-[18px] w-[18px]" />
            </button>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="flex h-10 items-center justify-center gap-1 text-ink/80 hover:text-ink"
              aria-label={`Shopping bag, ${cart.count} items`}
            >
              <Icon name="bag" className="h-[18px] w-[18px]" />
              <span className="text-[10px] font-medium tabular-nums">{cart.count}</span>
            </button>
          </div>
        </div>

        {mega ? (
          <div
            className="absolute inset-x-0 top-full hidden border-t border-ink/10 bg-paper shadow-[0_24px_40px_-32px_rgba(17,17,17,0.45)] lg:block"
            onMouseEnter={() => setOpenMega(openMega)}
          >
            <div className="shell grid grid-cols-12 gap-10 py-10">
              {mega.columns.map((column) => (
                <div key={column.title} className="col-span-3">
                  <p className="label mb-5 text-ink/40">{column.title}</p>
                  <ul className="space-y-3">
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          to={link.to}
                          className="group inline-flex items-center gap-2 text-[13px] text-charcoal/80 transition-colors hover:text-ink"
                        >
                          <span className="h-px w-0 bg-ink transition-all duration-500 ease-luxury group-hover:w-4" />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="col-span-6 grid grid-cols-[1.15fr_1fr] gap-6">
                <Link to={mega.feature.to} className="group relative block overflow-hidden bg-beige">
                  <img
                    src={mega.feature.image}
                    alt={mega.feature.title}
                    loading="lazy"
                    className="h-64 w-full object-cover transition-transform duration-[1.2s] ease-luxury group-hover:scale-[1.04]"
                  />
                </Link>
                <div className="flex flex-col justify-center">
                  <p className="label text-gold">{mega.feature.eyebrow}</p>
                  <h3 className="mt-3 font-display text-2xl leading-tight">{mega.feature.title}</h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-charcoal/70">{mega.feature.copy}</p>
                  <Link to={mega.feature.to} className="link-line mt-6 self-start text-[10px] text-ink">
                    {mega.feature.cta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-ink/45"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-ivory">
            <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
              <span className="font-display text-sm uppercase tracking-[0.3em]">Evora Style</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <form onSubmit={submitMobileSearch} className="border-b border-ink/10 px-5 py-4">
                <label className="sr-only" htmlFor="mobile-search">
                  Search
                </label>
                <div className="flex items-center gap-3 border-b border-ink/20 pb-2">
                  <Icon name="search" className="h-4 w-4 text-ink/50" />
                  <input
                    id="mobile-search"
                    value={mobileQuery}
                    onChange={(event) => setMobileQuery(event.target.value)}
                    placeholder="Search the collection"
                    className="w-full bg-transparent text-[13px] placeholder:text-warmgray focus:outline-none"
                  />
                </div>
              </form>

              <nav aria-label="Mobile" className="px-5 py-2">
                {NAV_ITEMS.map((item) => {
                  const group = MEGA_MENUS[item.mega];
                  const open = mobileGroup === item.mega;
                  return (
                    <div key={item.label} className="border-b border-ink/10">
                      <div className="flex items-center justify-between py-4">
                        <Link
                          to={item.to}
                          className="text-[11px] font-medium uppercase tracking-label"
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                        <button
                          type="button"
                          className="flex h-11 w-11 items-center justify-center"
                          aria-label={`Toggle ${item.label} links`}
                          aria-expanded={open}
                          onClick={() => setMobileGroup(open ? null : item.mega)}
                        >
                          <Icon name={open ? 'minus' : 'plus'} className="h-4 w-4 text-ink/60" />
                        </button>
                      </div>
                      {open ? (
                        <ul className="pb-4 pl-1">
                          {group.columns.flatMap((column) => column.links).map((link) => (
                            <li key={link.label}>
                              <Link
                                to={link.to}
                                onClick={() => setMobileOpen(false)}
                                className="block py-2 text-[13px] text-charcoal/75"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  );
                })}
              </nav>

              <div className="px-5 py-6">
                <p className="label mb-4 text-ink/40">My Account</p>
                <ul className="space-y-3 text-[13px] text-charcoal/80">
                  <li>
                    <Link to={user ? '/account' : '/login'} onClick={() => setMobileOpen(false)}>
                      {user ? 'My Account' : 'Sign In'}
                    </Link>
                  </li>
                  <li>
                    <Link to="/account/wishlist" onClick={() => setMobileOpen(false)}>
                      Wishlist ({wishlist.count})
                    </Link>
                  </li>
                  <li>
                    <Link to="/account/orders" onClick={() => setMobileOpen(false)}>
                      My Orders
                    </Link>
                  </li>
                  <li>
                    <Link to="/size-guide" onClick={() => setMobileOpen(false)}>
                      Size Guide
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" onClick={() => setMobileOpen(false)}>
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-ink/10 px-5 py-5">
              <p className="text-[9px] uppercase tracking-label text-ink/50">
                Heritage • Character • Always Relevant
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
