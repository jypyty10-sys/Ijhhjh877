import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { useStore } from '../../context/StoreContext.jsx';
import { money } from '../../lib/format.js';
import { usePageMeta } from '../../lib/hooks.js';
import Icon from '../../components/Icon.jsx';

export default function AdminProducts() {
  const { pushToast } = useStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  usePageMeta('Products — Admin');

  const load = () =>
    api
      .get('/admin/products')
      .then((data) => setProducts(data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
    );
  }, [products, search]);

  const toggleActive = async (product) => {
    try {
      await api.patch(`/admin/products/${product.id}`, { active: !product.active });
      await load();
      pushToast(`${product.name} ${product.active ? 'hidden from' : 'published to'} the storefront.`);
    } catch (error) {
      pushToast(error.message, { tone: 'error' });
    }
  };

  const remove = async (product) => {
    setDeleting(product.id);
    try {
      await api.delete(`/admin/products/${product.id}`);
      pushToast(`${product.name} removed.`);
      await load();
    } catch (error) {
      pushToast(error.message, { tone: 'error' });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label text-gold">Catalogue</p>
          <h1 className="mt-2 font-display text-3xl">Products</h1>
          <p className="mt-1 text-[11px] text-charcoal/55">{products.length} pieces in the catalogue</p>
        </div>
        <Link to="/admin/products/new" className="btn-dark px-5 py-2.5">
          <Icon name="plus" className="h-3.5 w-3.5" /> New product
        </Link>
      </div>

      <div className="mt-5 flex items-center gap-3 border-b border-ink/15 pb-2 sm:max-w-xs">
        <Icon name="search" className="h-4 w-4 text-ink/40" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search products"
          aria-label="Search products"
          className="w-full bg-transparent py-1 text-[12px] placeholder:text-warmgray focus:outline-none"
        />
      </div>

      {loading ? (
        <p className="mt-6 text-[12px] text-ink/45">Loading products…</p>
      ) : (
        <div className="mt-5 overflow-x-auto border border-ink/10 bg-paper">
          <table className="w-full min-w-[720px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-ink/10 text-[9px] uppercase tracking-label text-ink/40">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-ink/[0.06] last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images?.[0]?.url}
                        alt={product.name}
                        className="h-12 w-10 object-cover"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{product.name}</p>
                        <p className="text-[9px] uppercase tracking-label text-ink/40">
                          {product.isNew ? 'New · ' : ''}
                          {product.isFeatured ? 'Featured · ' : ''}
                          {product.isBestseller ? 'Bestseller' : ''}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-charcoal/70">{product.category}</td>
                  <td className="px-4 py-3 tabular-nums">{money(product.price)}</td>
                  <td className={`px-4 py-3 tabular-nums ${product.stock < 5 ? 'text-[#b4523f]' : ''}`}>{product.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 text-[8px] uppercase tracking-label ${
                        product.active ? 'bg-[#2f4a3f]/10 text-[#2f4a3f]' : 'bg-ink/10 text-ink/50'
                      }`}
                    >
                      {product.active ? 'Live' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => toggleActive(product)}
                        className="text-[9px] uppercase tracking-label text-ink/45 hover:text-ink"
                      >
                        {product.active ? 'Hide' : 'Publish'}
                      </button>
                      <Link
                        to={`/admin/products/${product.id}`}
                        className="text-[9px] uppercase tracking-label text-ink/60 hover:text-ink"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(product)}
                        disabled={deleting === product.id}
                        aria-label={`Delete ${product.name}`}
                        className="text-ink/35 hover:text-[#b4523f] disabled:opacity-40"
                      >
                        <Icon name="trash" className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length ? <p className="px-4 py-8 text-center text-[12px] text-ink/45">No products match that search.</p> : null}
        </div>
      )}
    </div>
  );
}
