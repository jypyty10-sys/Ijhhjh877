import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';

export default function ProtectedRoute({ children, admin = false }) {
  const { user, ready } = useStore();
  const location = useLocation();

  if (!ready) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="label animate-pulse">Loading…</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  if (admin && user.role !== 'admin') {
    return (
      <div className="shell flex min-h-[70vh] flex-col items-center justify-center text-center">
        <span className="label text-gold">403 — Restricted</span>
        <h1 className="mt-4 font-display text-4xl">This room is for the house staff.</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-charcoal/70">
          Your account does not have administrator access. If you believe this is a mistake, please contact the
          concierge at concierge@evorastyle.com.
        </p>
        <a href="/" className="btn-dark mt-8">
          Back to the store
        </a>
      </div>
    );
  }

  return children;
}
