export function money(value, currency = 'USD') {
  const amount = Number(value) || 0;
  const whole = Number.isInteger(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(amount);
}

export function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateTime(value) {
  if (!value) return '';
  return new Date(value).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const ORDER_STATUS = {
  awaiting_confirmation: { label: 'Awaiting confirmation', tone: 'bg-gold/15 text-gold' },
  processing: { label: 'Processing', tone: 'bg-ink/10 text-ink' },
  shipped: { label: 'Shipped', tone: 'bg-[#2f4a3f]/10 text-[#2f4a3f]' },
  delivered: { label: 'Delivered', tone: 'bg-[#2f4a3f]/15 text-[#2f4a3f]' },
  cancelled: { label: 'Cancelled', tone: 'bg-[#8a3232]/10 text-[#8a3232]' },
};

export function statusMeta(status) {
  return ORDER_STATUS[status] || { label: status, tone: 'bg-ink/10 text-ink' };
}

export function pluralize(count, singular, plural) {
  return count === 1 ? singular : plural;
}
