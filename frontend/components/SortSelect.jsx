'use client';

import { useEffect, useRef, useState } from 'react';

const SORT_OPTIONS = [
  { label: 'Default', value: 'default' },
  { label: 'Rating: High → Low', value: 'rating_desc' },
  { label: 'Rating: Low → High', value: 'rating_asc' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
];

/**
 * SortSelect — dropdown to sort caterer listings
 * @param {{ value: string, onChange: (val: string) => void }} props
 */
export default function SortSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const activeLabel = SORT_OPTIONS.find((opt) => opt.value === value)?.label || 'Default';

  useEffect(() => {
    function handleOutsideClick(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  function handleSelect(nextValue) {
    onChange(nextValue);
    setOpen(false);
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="
          w-full min-w-[220px] h-10 px-3.5 rounded-lg
          bg-[var(--bg-muted)] border border-[var(--border)]
          text-sm text-[var(--text-primary)] flex items-center justify-between gap-3
          focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--ring)]
          transition-all duration-200
        "
      >
        <span className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)]">Sort</span>
          <span className="font-medium text-[var(--text-primary)]">{activeLabel}</span>
        </span>
        <svg
          className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-xl p-1">
          <ul role="listbox" className="space-y-0.5">
            {SORT_OPTIONS.map((opt) => {
              const isActive = value === opt.value;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-[var(--bg-muted)] text-[var(--text-primary)] font-medium'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {opt.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export { SORT_OPTIONS };
