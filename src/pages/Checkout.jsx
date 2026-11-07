import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';
import { api } from '../lib/api.js';
import { money } from '../lib/format.js';
import { usePageMeta } from '../lib/hooks.js';
import { useDiscount } from '../lib/useDiscount.js';
import Icon from '../components/Icon.jsx';

const STEPS = ['Details', 'Delivery', 'Payment'];

const EMPTY = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  postcode: '',
  country: 'United Kingdom',
};

export default function Checkout() {
  const { cart, user, settings, refresh, pushToast } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [delivery, setDelivery] = useState('standard');
  const [payment, setPayment] = useState('invoice');
  const [placing, setPlacing] = useState(false);
  const discount = useDiscount(cart.subtotal);
  const autoTried = useRef(false);

  usePageMeta('Checkout', 'Complete your EVORA STYLE order.');

  const threshold = Number(settings.free_shipping_threshold ?? 250);
  const shipping =
    delivery === 'express'
      ? Number(settings.shipping_express ?? 24)
      : cart.subtotal === 0 || cart.subtotal >= threshold
        ? 0
        : Number(settings.shipping_standard ?? 12);
  const total = Math.max(0, cart.subtotal + shipping - discount.amount);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      firstName: current.firstName || user?.firstName || '',
      lastName: current.lastName || user?.lastName || '',
      email: current.email || user?.email || '',
      phone: current.phone || user?.phone || '',
    }));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    api
      .get('/account/addresses')
      .then((data) => {
        const preferred = data.addresses?.find((address) => address.isDefault) || data.addresses?.[0];
        if (!preferred) return;
        setForm((current) => ({
          ...current,
          line1: current.line1 || preferred.line1,
          line2: current.line2 || preferred.line2 || '',
          city: current.city || preferred.city,
          postcode: current.postcode || preferred.postcode,
          country: current.country || preferred.country,
        }));
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (autoTried.current) return;
    if (discount.code && !discount.applied) {
      autoTried.current = true;
      discount.validate(discount.code);
    }
  }, [discount]);

  if (!cart.items.length) {
    return <Navigate to="/cart" replace />;
  }

  const set = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const validateDetails = () => {
    const next = {};
    if (form.firstName.trim().length < 2) next.firstName = 'Enter your first name';
    if (form.lastName.trim().length < 2) next.lastName = 'Enter your last name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) next.email = 'Enter a valid email';
    if (!form.line1.trim()) next.line1 = 'Enter your street address';
    if (!form.city.trim()) next.city = 'Enter your city';
    if (!form.postcode.trim()) next.postcode = 'Enter your postcode';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const next = () => {
    if (step === 0 && !validateDetails()) return;
    setStep((value) => Math.min(value + 1, STEPS.length - 1));
  };

  const placeOrder = async () => {
    if (!validateDetails()) {
      setStep(0);
      return;
    }
    setPlacing(true);
    try {
      const data = await api.post('/orders', {
        customer: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
        },
        shippingAddress: {
          fullName: `${form.firstName} ${form.lastName}`.trim(),
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          postcode: form.postcode,
          country: form.country,
          phone: form.phone,
        },
        deliveryMethod: delivery,
        paymentMethod: payment,
        discountCode: discount.applied?.code || null,
      });
      try {
        window.localStorage.removeItem('evora_discount_code');
      } catch {
        /* storage unavailable */
      }
      await refresh();
      pushToast('Order recorded — awaiting confirmation.');
      navigate(`/order/${data.order.orderNumber}?email=${encodeURIComponent(form.email)}`, {
        state: { order: data.order, notice: data.notice },
      });
    } catch (error) {
      pushToast(error.message, { tone: 'error' });
      if (error.errors) setErrors(error.errors);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="shell pt-8 lg:pt-12">
      <div className="flex flex-col gap-3 border-b border-ink/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="label text-gold">Secure checkout</p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl">Checkout</h1>
        </div>
        <Link to="/cart" className="link-line text-[10px] text-ink/55 hover:text-ink">
          Return to bag
        </Link>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
        <div>
          <ol className="mb-8 flex items-center gap-3 text-[9px] uppercase tracking-label">
            {STEPS.map((label, index) => (
              <li key={label} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => index < step && setStep(index)}
                  className={`flex items-center gap-2 ${index === step ? 'text-ink' : 'text-ink/35'}`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border text-[9px] ${
                      index === step
                        ? 'border-ink bg-ink text-ivory'
                        : index < step
                          ? 'border-ink/50 text-ink/60'
                          : 'border-ink/20'
                    }`}
                  >
                    {index < step ? <Icon name="check" className="h-2.5 w-2.5" strokeWidth={2} /> : index + 1}
                  </span>
                  {label}
                </button>
                {index < STEPS.length - 1 ? <span className="h-px w-6 bg-ink/15" /> : null}
              </li>
            ))}
          </ol>

          {step === 0 ? (
            <section aria-labelledby="details-heading">
              <h2 id="details-heading" className="font-display text-xl">
                Contact & delivery address
              </h2>
              {!user ? (
                <p className="mt-2 text-[12px] text-charcoal/60">
                  Checking out as a guest.{' '}
                  <Link to="/login?redirect=/checkout" className="underline underline-offset-4 hover:text-ink">
                    Sign in
                  </Link>{' '}
                  to use saved details.
                </p>
              ) : null}

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="field-label" htmlFor="firstName">
                    First name
                  </label>
                  <input id="firstName" className="field" value={form.firstName} onChange={set('firstName')} autoComplete="given-name" />
                  {errors.firstName ? <p className="mt-1 text-[11px] text-[#b4523f]">{errors.firstName}</p> : null}
                </div>
                <div>
                  <label className="field-label" htmlFor="lastName">
                    Last name
                  </label>
                  <input id="lastName" className="field" value={form.lastName} onChange={set('lastName')} autoComplete="family-name" />
                  {errors.lastName ? <p className="mt-1 text-[11px] text-[#b4523f]">{errors.lastName}</p> : null}
                </div>
                <div className="sm:col-span-2">
                  <label className="field-label" htmlFor="email">
                    Email
                  </label>
                  <input id="email" type="email" className="field" value={form.email} onChange={set('email')} autoComplete="email" />
                  {errors.email ? <p className="mt-1 text-[11px] text-[#b4523f]">{errors.email}</p> : null}
                </div>
                <div className="sm:col-span-2">
                  <label className="field-label" htmlFor="phone">
                    Phone (optional)
                  </label>
                  <input id="phone" className="field" value={form.phone} onChange={set('phone')} autoComplete="tel" />
                </div>
                <div className="sm:col-span-2 mt-2">
                  <p className="label text-ink/40">Shipping address</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="field-label" htmlFor="line1">
                    Address
                  </label>
                  <input id="line1" className="field" value={form.line1} onChange={set('line1')} autoComplete="address-line1" />
                  {errors.line1 ? <p className="mt-1 text-[11px] text-[#b4523f]">{errors.line1}</p> : null}
                </div>
                <div className="sm:col-span-2">
                  <label className="field-label" htmlFor="line2">
                    Apartment, suite (optional)
                  </label>
                  <input id="line2" className="field" value={form.line2} onChange={set('line2')} autoComplete="address-line2" />
                </div>
                <div>
                  <label className="field-label" htmlFor="city">
                    City
                  </label>
                  <input id="city" className="field" value={form.city} onChange={set('city')} autoComplete="address-level2" />
                  {errors.city ? <p className="mt-1 text-[11px] text-[#b4523f]">{errors.city}</p> : null}
                </div>
                <div>
                  <label className="field-label" htmlFor="postcode">
                    Postcode
                  </label>
                  <input id="postcode" className="field" value={form.postcode} onChange={set('postcode')} autoComplete="postal-code" />
                  {errors.postcode ? <p className="mt-1 text-[11px] text-[#b4523f]">{errors.postcode}</p> : null}
                </div>
                <div className="sm:col-span-2">
                  <label className="field-label" htmlFor="country">
                    Country
                  </label>
                  <select id="country" className="field" value={form.country} onChange={set('country')} autoComplete="country-name">
                    {['United Kingdom', 'Ireland', 'France', 'Germany', 'United States', 'Canada', 'Australia', 'Japan'].map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>
          ) : null}

          {step === 1 ? (
            <section aria-labelledby="delivery-heading">
              <h2 id="delivery-heading" className="font-display text-xl">
                Delivery method
              </h2>
              <div className="mt-5 space-y-3">
                {[
                  {
                    id: 'standard',
                    title: 'Standard delivery',
                    copy: '3–5 working days, tracked',
                    price: cart.subtotal >= threshold ? 0 : Number(settings.shipping_standard ?? 12),
                  },
                  {
                    id: 'express',
                    title: 'Express delivery',
                    copy: '1–2 working days, signature required',
                    price: Number(settings.shipping_express ?? 24),
                  },
                ].map((option) => (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-center justify-between border px-4 py-4 transition-colors ${
                      delivery === option.id ? 'border-ink' : 'border-ink/15 hover:border-ink/40'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="delivery"
                        value={option.id}
                        checked={delivery === option.id}
                        onChange={() => setDelivery(option.id)}
                        className="accent-ink"
                      />
                      <span>
                        <span className="block text-[12px] font-medium uppercase tracking-label">{option.title}</span>
                        <span className="mt-1 block text-[11px] text-charcoal/60">{option.copy}</span>
                      </span>
                    </span>
                    <span className="text-[13px] tabular-nums">
                      {option.price === 0 ? 'Complimentary' : money(option.price)}
                    </span>
                  </label>
                ))}
              </div>
              <p className="mt-4 text-[11px] leading-relaxed text-charcoal/60">
                Orders are dispatched from London. A tracking link is emailed once your parcel leaves the atelier.
              </p>
            </section>
          ) : null}

          {step === 2 ? (
            <section aria-labelledby="payment-heading">
              <h2 id="payment-heading" className="font-display text-xl">
                Payment
              </h2>

              <div className="mt-5 space-y-3">
                <label className="flex cursor-pointer items-start gap-3 border border-ink px-4 py-4">
                  <input
                    type="radio"
                    name="payment"
                    value="invoice"
                    checked={payment === 'invoice'}
                    onChange={() => setPayment('invoice')}
                    className="mt-0.5 accent-ink"
                  />
                  <span>
                    <span className="block text-[12px] font-medium uppercase tracking-label">
                      Request an invoice
                    </span>
                    <span className="mt-1 block text-[11px] leading-relaxed text-charcoal/60">
                      Your order is recorded and our concierge confirms availability and payment by email. No card
                      details are collected.
                    </span>
                  </span>
                </label>

                <label className="flex cursor-not-allowed items-start gap-3 border border-ink/10 px-4 py-4 opacity-55">
                  <input type="radio" name="payment" value="card" disabled className="mt-0.5" />
                  <span>
                    <span className="block text-[12px] font-medium uppercase tracking-label">
                      Card payment — coming soon
                    </span>
                    <span className="mt-1 block text-[11px] leading-relaxed text-charcoal/60">
                      A secure card provider (Stripe) is not connected to this store yet.
                    </span>
                  </span>
                </label>
              </div>

              <div className="mt-5 border border-gold/40 bg-gold/[0.06] px-4 py-3">
                <p className="flex items-start gap-2 text-[11px] leading-relaxed text-charcoal/75">
                  <Icon name="lock" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                  No payment will be taken when you place this order. Nothing here simulates a card transaction —
                  the order is created as <em>awaiting confirmation</em> for the concierge to fulfil.
                </p>
              </div>

              <div className="mt-6 border border-ink/10 p-4">
                <p className="label mb-2 text-ink/40">Delivering to</p>
                <p className="text-[12px] leading-relaxed text-charcoal/75">
                  {form.firstName} {form.lastName}
                  <br />
                  {form.line1}
                  {form.line2 ? (
                    <>
                      <br />
                      {form.line2}
                    </>
                  ) : null}
                  <br />
                  {form.city}, {form.postcode}
                  <br />
                  {form.country}
                </p>
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="mt-3 text-[10px] uppercase tracking-label text-ink/50 underline underline-offset-4 hover:text-ink"
                >
                  Edit details
                </button>
              </div>
            </section>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            {step > 0 ? (
              <button type="button" onClick={() => setStep(step - 1)} className="btn-light px-8">
                Back
              </button>
            ) : null}
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={next} className="btn-dark flex-1 sm:flex-none sm:px-12">
                Continue to {STEPS[step + 1].toLowerCase()}
                <Icon name="arrowRight" className="h-4 w-4" />
              </button>
            ) : (
              <button type="button" onClick={placeOrder} disabled={placing} className="btn-dark flex-1 sm:flex-none sm:px-12">
                {placing ? 'Placing order…' : `Place order · ${money(total)}`}
              </button>
            )}
          </div>
        </div>

        <aside>
          <div className="border border-ink/10 p-6 lg:sticky lg:top-32">
            <h2 className="font-display text-xl">Order summary</h2>
            <ul className="mt-4 divide-y divide-ink/10">
              {cart.items.map((item) => (
                <li key={item.id} className="flex gap-3 py-4">
                  <img
                    src={item.image}
                    alt={item.imageAlt || item.name}
                    className="h-20 w-16 object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium">{item.name}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-label text-ink/45">
                      {item.color}
                      {item.size ? ` · ${item.size}` : ''} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-[12px] tabular-nums">{money(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>

            <dl className="mt-2 space-y-2.5 border-t border-ink/10 pt-4 text-[12px]">
              <div className="flex justify-between">
                <dt className="text-charcoal/60">Subtotal</dt>
                <dd className="tabular-nums">{money(cart.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-charcoal/60">Delivery</dt>
                <dd className="tabular-nums">{shipping === 0 ? 'Complimentary' : money(shipping)}</dd>
              </div>
              {discount.amount > 0 ? (
                <div className="flex justify-between text-gold">
                  <dt>Discount ({discount.applied.code})</dt>
                  <dd className="tabular-nums">−{money(discount.amount)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between border-t border-ink/10 pt-3">
                <dt className="text-[10px] uppercase tracking-label text-ink/60">Total</dt>
                <dd className="font-display text-xl tabular-nums">{money(total)}</dd>
              </div>
            </dl>
            {discount.error ? <p className="mt-2 text-[11px] text-[#b4523f]">{discount.error}</p> : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
