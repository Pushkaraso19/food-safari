'use client';

/**
 * SearchBar — controlled text input for filtering caterers by name
 * @param {{ value: string, onChange: (val: string) => void }} props
 */
export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full">
      {/* Search icon */}
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--accent-strong)] pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
        />
      </svg>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name…"
        className="
          w-full h-9 pl-10 pr-9 rounded-lg shadow-sm
          bg-[var(--bg-muted)] border border-[var(--border)]
          text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]
          focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]
          transition-all duration-200
        "
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Clear search"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
