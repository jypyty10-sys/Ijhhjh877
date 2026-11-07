import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { useStore } from '../../context/StoreContext.jsx';
import { usePageMeta } from '../../lib/hooks.js';
import Icon from '../../components/Icon.jsx';

const BLANK = {
  name: '',
  category: 'suits',
  price: '',
  comparePrice: '',
  stock: '',
  description: '',
  story: '',
  material: '',
  care: '',
  badge: '',
  sizesText: 'S, M, L, XL',
  colors: [{ name: 'Charcoal', hex: '#2B2B2B' }],
  images: [{ url: '', alt: '' }],
  isNew: false,
  isFeatured: false,
  isBestseller: false,
  active: true,
};

export default function AdminProductEditor() {
  const { id } = useParams();
  const isNew = !id;
  const { categories, pushToast } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState(BLANK);
  const [loading, setLoading] = useState(!isNew);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  usePageMeta(isNew ? 'New product' : 'Edit product', 'Manage the EVORA STYLE catalogue.');

  useEffect(() => {
    if (isNew) return;
    api
      .get('/admin/products')
      .then((data) => {
        const product = data.products.find((item) => String(item.id) === String(id));
        if (!product) {
          setError('Product not found.');
          return;
        }
        setForm({
          name: product.name,
          category: product.category,
          price: product.price,
          comparePrice: product.comparePrice || '',
          stock: product.stock,
          description: product.description || '',
          story: product.story || '',
          material: product.material || '',
          care: product.care || '',
          badge: product.badge || '',
          sizesText: (product.sizes || []).join(', '),
          colors: product.colors?.length ? product.colors : [{ name: '', hex: '#111111' }],
          images: product.images?.length ? product.images : [{ url: '', alt: '' }],
          isNew: product.isNew,
          isFeatured: product.isFeatured,
          isBestseller: product.isBestseller,
          active: product.active,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const set = (field) => (event) =>
    setForm((current) => ({
      ...current,
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
    }));

  const updateColor = (index, key, value) =>
    setForm((current) => ({
      ...current,
      colors: current.colors.map((color, position) => (position === index ? { ...color, [key]: value } : color)),
    }));

  const updateImage = (index, key, value) =>
    setForm((current) => ({
      ...current,
      images: current.images.map((image, position) => (position === index ? { ...image, [key]: value } : image)),
    }));

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const payload = {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        comparePrice: form.comparePrice ? Number(form.comparePrice) : null,
        stock: Number(form.stock) || 0,
        description: form.description,
        story: form.story,
        material: form.material,
        care: form.care,
        badge: form.badge || null,
        sizes: form.sizesText
          .split(',')
          .map((size) => size.trim())
          .filter(Boolean),
        colors: form.colors.filter((color) => color.name.trim()),
        images: form.images.filter((image) => image.url.trim()),
        isNew: form.isNew,
        isFeatured: form.isFeatured,
        isBestseller: form.isBestseller,
        active: form.active,
      };
      if (isNew) {
        const data = await api.post('/admin/products', payload);
        pushToast('Product created.');
        navigate(`/admin/products/${data.product.id}`);
      } else {
        await api.patch(`/admin/products/${id}`, payload);
        pushToast('Product updated.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p className="text-[12px] text-ink/45">Loading product…</p>;

  return (
    <div>
      <Link to="/admin/products" className="inline-flex items-center gap-2 text-[9px] uppercase tracking-label text-ink/45 hover:text-ink">
        <Icon name="chevronLeft" className="h-3 w-3" /> All products
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label text-gold">{isNew ? 'Create' : 'Edit'}</p>
          <h1 className="mt-2 font-display text-3xl">{isNew ? 'New product' : form.name}</h1>
        </div>
      </div>

      <form onSubmit={submit} className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-5">
          <section className="border border-ink/10 bg-paper p-5">
            <h2 className="font-display text-lg">Details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="p-name">Name</label>
                <input id="p-name" className="field" value={form.name} onChange={set('name')} required />
              </div>
              <div>
                <label className="field-label" htmlFor="p-category">Category</label>
                <select id="p-category" className="field" value={form.category} onChange={set('category')}>
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label" htmlFor="p-badge">Badge</label>
                <input id="p-badge" className="field" value={form.badge} onChange={set('badge')} placeholder="Icon, Limited…" />
              </div>
              <div>
                <label className="field-label" htmlFor="p-price">Price (USD)</label>
                <input id="p-price" type="number" min="0" step="1" className="field" value={form.price} onChange={set('price')} required />
              </div>
              <div>
                <label className="field-label" htmlFor="p-compare">Compare at</label>
                <input id="p-compare" type="number" min="0" step="1" className="field" value={form.comparePrice} onChange={set('comparePrice')} />
              </div>
              <div>
                <label className="field-label" htmlFor="p-stock">Stock</label>
                <input id="p-stock" type="number" min="0" step="1" className="field" value={form.stock} onChange={set('stock')} />
              </div>
              <div>
                <label className="field-label" htmlFor="p-sizes">Sizes (comma separated)</label>
                <input id="p-sizes" className="field" value={form.sizesText} onChange={set('sizesText')} />
              </div>
              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="p-description">Description</label>
                <textarea id="p-description" rows="4" className="field" value={form.description} onChange={set('description')} />
              </div>
              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="p-story">Story</label>
                <textarea id="p-story" rows="2" className="field" value={form.story} onChange={set('story')} />
              </div>
              <div>
                <label className="field-label" htmlFor="p-material">Material</label>
                <input id="p-material" className="field" value={form.material} onChange={set('material')} />
              </div>
              <div>
                <label className="field-label" htmlFor="p-care">Care</label>
                <input id="p-care" className="field" value={form.care} onChange={set('care')} />
              </div>
            </div>
          </section>

          <section className="border border-ink/10 bg-paper p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg">Colours</h2>
              <button
                type="button"
                onClick={() => setForm((current) => ({ ...current, colors: [...current.colors, { name: '', hex: '#111111' }] }))}
                className="text-[9px] uppercase tracking-label text-ink/50 hover:text-ink"
              >
                + Add colour
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {form.colors.map((color, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="color"
                    aria-label={`Colour ${index + 1}`}
                    value={color.hex}
                    onChange={(event) => updateColor(index, 'hex', event.target.value)}
                    className="h-9 w-10 border border-ink/15 bg-transparent p-0.5"
                  />
                  <input
                    value={color.name}
                    onChange={(event) => updateColor(index, 'name', event.target.value)}
                    placeholder="Colour name"
                    className="field flex-1 py-2"
                  />
                  <button
                    type="button"
                    aria-label="Remove colour"
                    onClick={() => setForm((current) => ({ ...current, colors: current.colors.filter((_, position) => position !== index) }))}
                    className="p-2 text-ink/35 hover:text-ink"
                  >
                    <Icon name="trash" className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-ink/10 bg-paper p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg">Images</h2>
                <p className="mt-1 text-[10px] text-ink/45">
                  Paste image URLs. No object storage is connected, so uploads are not available yet.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setForm((current) => ({ ...current, images: [...current.images, { url: '', alt: '' }] }))}
                className="text-[9px] uppercase tracking-label text-ink/50 hover:text-ink"
              >
                + Add image
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {form.images.map((image, index) => (
                <div key={index} className="flex flex-col gap-2 border border-ink/10 p-3 sm:flex-row sm:items-center">
                  {image.url ? (
                    <img src={image.url} alt="" className="h-14 w-12 shrink-0 object-cover" />
                  ) : (
                    <div className="flex h-14 w-12 shrink-0 items-center justify-center bg-beige/40 text-ink/25">
                      <Icon name="image" className="h-5 w-5" />
                    </div>
                  )}
                  <input
                    value={image.url}
                    onChange={(event) => updateImage(index, 'url', event.target.value)}
                    placeholder="https://images.unsplash.com/…"
                    className="field flex-1 py-2 text-[11px]"
                    aria-label={`Image ${index + 1} URL`}
                  />
                  <input
                    value={image.alt}
                    onChange={(event) => updateImage(index, 'alt', event.target.value)}
                    placeholder="Alt text"
                    className="field w-full py-2 text-[11px] sm:w-40"
                    aria-label={`Image ${index + 1} alt text`}
                  />
                  <button
                    type="button"
                    aria-label="Remove image"
                    onClick={() => setForm((current) => ({ ...current, images: current.images.filter((_, position) => position !== index) }))}
                    className="p-2 text-ink/35 hover:text-ink"
                  >
                    <Icon name="trash" className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="border border-ink/10 bg-paper p-5">
            <h2 className="font-display text-lg">Visibility</h2>
            <div className="mt-4 space-y-3 text-[12px]">
              {[
                ['active', 'Published on the storefront'],
                ['isNew', 'Mark as new arrival'],
                ['isFeatured', 'Show in Best of Evora'],
                ['isBestseller', 'Show in best sellers'],
              ].map(([field, label]) => (
                <label key={field} className="flex items-center gap-2 text-charcoal/75">
                  <input type="checkbox" checked={form[field]} onChange={set(field)} className="accent-ink" />
                  {label}
                </label>
              ))}
            </div>
          </section>

          {error ? (
            <p role="alert" className="border border-[#b4523f]/30 bg-[#b4523f]/5 px-3 py-2 text-[11px] text-[#b4523f]">
              {error}
            </p>
          ) : null}

          <button type="submit" disabled={busy} className="btn-dark w-full">
            {busy ? 'Saving…' : isNew ? 'Create product' : 'Save changes'}
          </button>
          <Link to="/admin/products" className="btn-light w-full">
            Cancel
          </Link>
        </aside>
      </form>
    </div>
  );
}
