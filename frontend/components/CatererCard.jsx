'use client';

/**
 * StarRating — renders filled/half/empty stars for a given rating (0–5)
 */
function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <svg
            key={star}
            className={`w-3.5 h-3.5 ${filled || half ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}
            viewBox="0 0 20 20"
            fill={filled ? 'currentColor' : half ? 'url(#half)' : 'none'}
            stroke="currentColor"
            strokeWidth={filled || half ? 0 : 1.5}
          >
            {half && (
              <defs>
                <linearGradient id="half">
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
            )}
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      })}
    </div>
  );
}

/**
 * CatererCard — displays a single caterer's details in a styled card
 * @param {{ caterer: Object, style?: Object, onEnquire?: (caterer: Object) => void }} props
 */
export default function CatererCard({ caterer, style, onEnquire = () => {} }) {
  const { name, location, pricePerPlate, cuisines, rating } = caterer;

  return (
    <article
      style={style}
      className="
        opacity-0 animate-[fadeInUp_0.5s_ease_forwards]
        rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]
        card-glow overflow-hidden
        transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-[var(--accent-strong)]
        flex flex-col
      "
    >
      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] leading-snug">
              {name}
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
              <svg className="w-3.5 h-3.5 text-[var(--accent-strong)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs text-[var(--text-secondary)]">{location}</span>
            </div>
          </div>

          {/* Rating badge */}
          <div className="shrink-0 flex flex-col items-end gap-1">
              <span className="text-lg font-bold text-[var(--accent-strong)] font-display">{rating.toFixed(1)}</span>
            <StarRating rating={rating} />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[var(--border)]" />

        {/* Cuisines */}
        <div className="flex flex-wrap gap-1.5">
          {cuisines.map((cuisine) => (
            <span
              key={cuisine}
              className="
                px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide
                bg-[color:rgba(255,180,11,0.16)] text-[var(--text-primary)] border border-[color:rgba(246,77,0,0.25)]
              "
            >
              {cuisine}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Price / plate</span>
            <div className="text-xl font-bold text-[var(--text-primary)] font-display mt-0.5">
              ₹{pricePerPlate.toLocaleString('en-IN')}
            </div>
          </div>
          <button
            onClick={() => onEnquire(caterer)}
            className="
            px-4 py-2 rounded-xl text-xs font-semibold
            bg-[var(--accent)] hover:bg-[var(--accent-strong)]
            text-[var(--brand-charcoal)] transition-colors duration-200
            shadow-lg
          "
          >
            Enquire
          </button>
        </div>
      </div>
    </article>
  );
}
