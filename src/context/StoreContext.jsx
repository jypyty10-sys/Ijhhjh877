import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';

const StoreContext = createContext(null);

const emptyCart = { items: [], count: 0, subtotal: 0 };
const emptyWishlist = { items: [], ids: [], count: 0 };

export function StoreProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(emptyCart);
  const [wishlist, setWishlist] = useState(emptyWishlist);
  const [settings, setSettings] = useState({});
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [ready, setReady] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const pushToast = useCallback((message, options = {}) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((current) => [...current, { id, message, tone: options.tone || 'default' }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, options.duration || 4200);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const refresh = useCallback(async () => {
    const data = await api.get('/bootstrap');
    setUser(data.user || null);
    setCart(data.cart || emptyCart);
    setWishlist(data.wishlist || emptyWishlist);
    setSettings(data.settings || {});
    setCategories(data.categories || []);
    setCollections(data.collections || []);
    return data;
  }, []);

  useEffect(() => {
    refresh()
      .catch(() => pushToast('We could not load the store. Please refresh.', { tone: 'error' }))
      .finally(() => setReady(true));
  }, [refresh, pushToast]);

  const applyCartPayload = useCallback((data) => {
    if (data.cart) setCart(data.cart);
    if (data.wishlist) setWishlist(data.wishlist);
  }, []);

  const addToCart = useCallback(
    async ({ productId, size, color, quantity = 1 }) => {
      const data = await api.post('/cart/items', { productId, size, color, quantity });
      applyCartPayload(data);
      setCartOpen(true);
      pushToast(data.message || 'Added to your bag.');
      return data;
    },
    [applyCartPayload, pushToast]
  );

  const updateCartItem = useCallback(
    async (id, quantity) => {
      const data = await api.patch(`/cart/items/${id}`, { quantity });
      applyCartPayload(data);
    },
    [applyCartPayload]
  );

  const removeCartItem = useCallback(
    async (id) => {
      const data = await api.delete(`/cart/items/${id}`);
      applyCartPayload(data);
      pushToast('Removed from your bag.');
    },
    [applyCartPayload, pushToast]
  );

  const toggleWishlist = useCallback(
    async (productId) => {
      if (!user) {
        // Guests can still save pieces; the server keeps them against the guest cookie.
      }
      const data = await api.post('/wishlist/toggle', { productId });
      applyCartPayload(data);
      pushToast(data.message || 'Wishlist updated.');
      return data.saved;
    },
    [applyCartPayload, pushToast, user]
  );

  const login = useCallback(
    async (email, password) => {
      const data = await api.post('/auth/login', { email, password });
      await refresh();
      pushToast(`Welcome back, ${data.user.firstName}.`);
      return data.user;
    },
    [refresh, pushToast]
  );

  const register = useCallback(
    async (payload) => {
      const data = await api.post('/auth/register', payload);
      await refresh();
      pushToast(`Welcome to EVORA, ${data.user.firstName}.`);
      return data.user;
    },
    [refresh, pushToast]
  );

  const logout = useCallback(async () => {
    await api.post('/auth/logout');
    await refresh();
    pushToast('You have been signed out.');
  }, [refresh, pushToast]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      isAdmin: user?.role === 'admin',
      cart,
      wishlist,
      settings,
      categories,
      collections,
      ready,
      toasts,
      pushToast,
      dismissToast,
      addToCart,
      updateCartItem,
      removeCartItem,
      toggleWishlist,
      login,
      register,
      logout,
      refresh,
      cartOpen,
      setCartOpen,
      searchOpen,
      setSearchOpen,
    }),
    [
      user,
      cart,
      wishlist,
      settings,
      categories,
      collections,
      ready,
      toasts,
      pushToast,
      dismissToast,
      addToCart,
      updateCartItem,
      removeCartItem,
      toggleWishlist,
      login,
      register,
      logout,
      refresh,
      cartOpen,
      searchOpen,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used inside StoreProvider');
  return context;
}
