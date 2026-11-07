import { useStore } from '../context/StoreContext.jsx';
import Icon from './Icon.jsx';

export default function Toaster() {
  const { toasts, dismissToast } = useStore();
  if (!toasts.length) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-6 sm:items-end">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 px-4 py-3 text-[12px] shadow-lg animate-fadeUp ${
            toast.tone === 'error' ? 'bg-[#8a3232] text-ivory' : 'bg-ink text-ivory'
          }`}
        >
          <Icon name={toast.tone === 'error' ? 'close' : 'check'} className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.6} />
          <p className="flex-1 leading-relaxed">{toast.message}</p>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss notification"
            className="shrink-0 text-ivory/60 hover:text-ivory"
          >
            <Icon name="close" className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
