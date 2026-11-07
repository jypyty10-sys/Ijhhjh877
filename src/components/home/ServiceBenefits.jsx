import Icon from '../Icon.jsx';

const BENEFITS = [
  { icon: 'truck', title: 'Fast Delivery', copy: 'Quick & safe delivery' },
  { icon: 'returns', title: 'Easy Returns', copy: 'Within 14 days' },
  { icon: 'medal', title: 'Premium Fabrics', copy: 'Built to last' },
  { icon: 'lock', title: 'Secure Payment', copy: 'Secure checkout' },
];

export default function ServiceBenefits() {
  return (
    <section className="shell mt-16">
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-y border-ink/10 py-8 sm:grid-cols-4">
        {BENEFITS.map((benefit) => (
          <div key={benefit.title} className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-3">
            <Icon name={benefit.icon} className="h-6 w-6 shrink-0 text-ink/70 sm:h-7 sm:w-7" strokeWidth={1.1} />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-label text-ink">{benefit.title}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-ink/50">{benefit.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
