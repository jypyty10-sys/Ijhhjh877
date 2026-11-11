import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import SiteLayout from './components/SiteLayout.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import Product from './pages/Product.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';
import SearchResults from './pages/SearchResults.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Account from './pages/account/Account.jsx';
import AccountOverview from './pages/account/AccountOverview.jsx';
import AccountOrders from './pages/account/AccountOrders.jsx';
import AccountOrderDetail from './pages/account/AccountOrderDetail.jsx';
import AccountWishlist from './pages/account/AccountWishlist.jsx';
import AccountAddresses from './pages/account/AccountAddresses.jsx';
import AccountProfile from './pages/account/AccountProfile.jsx';
import ContentPage from './pages/ContentPage.jsx';
import NotFound from './pages/NotFound.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminProductEditor from './pages/admin/AdminProductEditor.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminOrderDetail from './pages/admin/AdminOrderDetail.jsx';
import AdminCustomers from './pages/admin/AdminCustomers.jsx';
import AdminStore from './pages/admin/AdminStore.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    // 'instant' rather than 'auto': the stylesheet sets `scroll-behavior: smooth`, which
    // 'auto' honours, so a route change used to animate the home hero backwards on the way up.
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, search]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:number" element={<OrderConfirmation />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>}>
            <Route index element={<AccountOverview />} />
            <Route path="orders" element={<AccountOrders />} />
            <Route path="orders/:number" element={<AccountOrderDetail />} />
            <Route path="wishlist" element={<AccountWishlist />} />
            <Route path="addresses" element={<AccountAddresses />} />
            <Route path="profile" element={<AccountProfile />} />
          </Route>
          <Route path="/:slug" element={<ContentPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/admin" element={<ProtectedRoute admin><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductEditor />} />
          <Route path="products/:id" element={<AdminProductEditor />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderDetail />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="store" element={<AdminStore />} />
        </Route>
      </Routes>
    </>
  );
}
