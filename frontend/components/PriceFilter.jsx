'use client';

const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under ₹500', min: 0, max: 499 },
  { label: '₹500 – ₹750', min: 500, max: 750 },
  { label: '₹750 – ₹1000', min: 750, max: 1000 },
  { label: 'Above ₹1000', min: 1001, max: Infinity },
];

/**
 * PriceFilter — pill-style buttons to filter caterers by price range
 * @param {{ selected: number, onChange: (idx: number) => void }} props
 */
export default function PriceFilter({ selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {PRICE_RANGES.map((range, idx) => (
        <button
          key={range.label}
          onClick={() => onChange(idx)}
          className={`
            px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200
            ${
              selected === idx
                ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--brand-charcoal)] shadow-sm'
                : 'bg-transparent border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-strong)]/60 hover:text-[var(--text-primary)]'
            }
          `}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}

export { PRICE_RANGES };
