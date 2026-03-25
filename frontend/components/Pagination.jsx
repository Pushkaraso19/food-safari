'use client';

function buildPageItems(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
  const valid = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const items = [];
  for (let i = 0; i < valid.length; i += 1) {
    const page = valid[i];
    const prev = valid[i - 1];

    if (i > 0 && page - prev > 1) {
      items.push('ellipsis');
    }
    items.push(page);
  }

  return items;
}

/**
 * Pagination controls for paged results.
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}) {
  if (totalPages <= 1) return null;

  const items = buildPageItems(currentPage, totalPages);

  return (
    <nav className="mt-8 pt-2 flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={disabled || currentPage === 1}
        className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] disabled:opacity-40 disabled:text-[var(--text-muted)] disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {items.map((item, idx) => {
        if (item === 'ellipsis') {
          return (
            <span key={`ellipsis-${idx}`} className="px-2 text-[var(--text-muted)]">
              ...
            </span>
          );
        }

        const page = item;
        const isActive = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            disabled={disabled}
            aria-current={isActive ? 'page' : undefined}
            className={`h-8 min-w-8 px-2 rounded-lg border text-sm transition-colors ${
              isActive
                ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--brand-charcoal)] font-semibold'
                : 'border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]'
            } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={disabled || currentPage === totalPages}
        className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] disabled:opacity-40 disabled:text-[var(--text-muted)] disabled:cursor-not-allowed"
      >
        Next
      </button>
    </nav>
  );
}
