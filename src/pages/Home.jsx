import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { useStore } from '../context/StoreContext.jsx';
import { useReveal, usePageMeta } from '../lib/hooks.js';
import Hero from '../components/home/Hero.jsx';
import CategoryShowcase from '../components/home/CategoryShowcase.jsx';
import EditorialBanner from '../components/home/EditorialBanner.jsx';
import ServiceBenefits from '../components/home/ServiceBenefits.jsx';
import ProductRail from '../components/home/ProductRail.jsx';
import SeasonalCampaign from '../components/home/SeasonalCampaign.jsx';
import FeaturedCollections from '../components/home/FeaturedCollections.jsx';
import HeritageStory from '../components/home/HeritageStory.jsx';
import Testimonials from '../components/home/Testimonials.jsx';
import InstagramGallery from '../components/home/InstagramGallery.jsx';
import Newsletter from '../components/Newsletter.jsx';
import QuickView from '../components/QuickView.jsx';

export default function Home() {
  const { categories, collections } = useStore();
  const [bestOf, setBestOf] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickView, setQuickView] = useState(null);
  const revealRef = useReveal();

  usePageMeta(
    'English Heritage for a Modern Generation',
    'EVORA STYLE — premium British heritage menswear. Tailoring, outerwear, caps, shoes and accessories, made to be kept.'
  );

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.get('/products?featured=1&limit=5'),
      api.get('/products?new=1&limit=8'),
      api.get('/products?bestseller=1&sort=popular&limit=4'),
    ])
      .then(([featured, fresh, popular]) => {
        if (cancelled) return;
        setBestOf(featured.items || []);
        setNewArrivals(fresh.items || []);
        setBestSellers(popular.items || []);
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div ref={revealRef}>
      <Hero />
      <CategoryShowcase categories={categories} />
      <EditorialBanner collection={collections?.[0]} />
      <ServiceBenefits />

      <ProductRail
        eyebrow="The most wanted"
        title="Best of Evora"
        href="/shop?featured=1"
        products={bestOf}
        columns={5}
        loading={loading}
        onQuickView={setQuickView}
      />

      <SeasonalCampaign />

      <ProductRail
        eyebrow="Just arrived"
        title="New Arrivals"
        href="/shop?sort=newest"
        products={newArrivals.slice(0, 4)}
        columns={4}
        loading={loading}
        onQuickView={setQuickView}
      />

      <FeaturedCollections collections={collections} />

      <ProductRail
        eyebrow="Chosen most often"
        title="Best Sellers"
        href="/shop?bestseller=1"
        products={bestSellers}
        columns={4}
        loading={loading}
        onQuickView={setQuickView}
      />

      <HeritageStory />
      <Testimonials />
      <InstagramGallery />

      <section className="shell mt-16 lg:mt-24">
        <div className="reveal grid gap-8 border border-ink/10 bg-ivory px-6 py-10 sm:px-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="label text-gold">Join the house</p>
            <h2 className="mt-3 font-display text-2xl leading-tight sm:text-3xl">
              Early access, quiet restocks,
              <br className="hidden sm:block" /> and stories from the workshop.
            </h2>
          </div>
          <Newsletter title="Letters from Evora" />
        </div>
      </section>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </div>
  );
}
