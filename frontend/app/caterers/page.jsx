'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCaterers } from '../../services/api';
import CatererCard from '../../components/CatererCard';
import SkeletonCard from '../../components/SkeletonCard';
import SearchBar from '../../components/SearchBar';
import PriceFilter, { PRICE_RANGES } from '../../components/PriceFilter';
import SortSelect from '../../components/SortSelect';
import AddCatererModal from '../../components/AddCatererModal';
import Pagination from '../../components/Pagination';

export default function CaterersPage() {
  const [caterers, setCaterers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [priceIdx, setPriceIdx] = useState(0);
  const [sort, setSort] = useState('default');
  const [modalOpen, setModalOpen] = useState(false);
  const [layout, setLayout] = useState('grid');
  const [enquiryToast, setEnquiryToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [refreshTick, setRefreshTick] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const router = useRouter();

  const pageLimit = layout === 'grid' ? 12 : 10;

  function resetFilters() {
    setSearch('');
    setPriceIdx(0);
    setSort('default');
    setCurrentPage(1);
  }

  function setLayoutAndResetPage(nextLayout) {
    setLayout(nextLayout);
    setCurrentPage(1);
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('add') === '1') {
      setModalOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!enquiryToast) return;

    const timer = setTimeout(() => {
      setEnquiryToast(null);
    }, 2800);

    return () => clearTimeout(timer);
  }, [enquiryToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 250);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const { min, max } = PRICE_RANGES[priceIdx];
        const result = await fetchCaterers({
          page: currentPage,
          limit: pageLimit,
          search: debouncedSearch || undefined,
          minPrice: priceIdx === 0 ? undefined : min,
          maxPrice: priceIdx === 0 || !Number.isFinite(max) ? undefined : max,
          sort,
        });

        if (!cancelled) {
          setCaterers(result.data || []);
          setTotalResults(result.pagination?.total ?? 0);
          setTotalPages(result.pagination?.totalPages ?? 0);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [currentPage, debouncedSearch, priceIdx, sort, refreshTick, pageLimit]);

  function handleCatererAdded() {
    setCurrentPage(1);
    setRefreshTick((prev) => prev + 1);
  }

  function handleDemoEnquiry(caterer) {
    const reference = `ENQ-${Date.now().toString().slice(-6)}`;
    setEnquiryToast({
      name: caterer.name,
      reference,
    });
  }

  function handleCloseModal() {
    setModalOpen(false);

    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('add') === '1') {
      const params = new URLSearchParams(window.location.search);
      params.delete('add');
      const nextQuery = params.toString();
      router.replace(nextQuery ? `/caterers?${nextQuery}` : '/caterers', { scroll: false });
    }
  }

  function handlePageChange(nextPage) {
    if (nextPage < 1 || nextPage > totalPages || nextPage === currentPage) {
      return;
    }
    setCurrentPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const rangeStart = totalResults === 0 ? 0 : (currentPage - 1) * pageLimit + 1;
  const rangeEnd = totalResults === 0 ? 0 : rangeStart + caterers.length - 1;

  return (
    <div className="relative min-h-screen">
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(246, 77, 0, 0.35) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-8">

        <header className="mb-8 px-1 sm:px-2">
          <div className="py-1.5">
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-6 h-px bg-[var(--accent-strong)]" />
                  <span className="text-[var(--accent-strong)] text-xs font-semibold uppercase tracking-[0.15em]">
                    Caterer Directory
                  </span>
                </div>
                <h1 className="font-display text-4xl sm:text-[3.15rem] font-bold text-[var(--text-primary)] leading-[1.05]">
                  Find Your{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--accent-strong)]">
                    Perfect Caterer
                  </span>
                </h1>
                <p className="mt-2.5 text-[var(--text-secondary)] text-base max-w-2xl">
                  Discover and compare top-rated catering services for weddings, corporate events, and celebrations.
                </p>
              </div>
            </div>

          </div>
        </header>

        <section className="mb-7 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-3 sm:p-3.5">
          <div className="flex flex-col gap-2.5">
            <div className="w-full">
              <SearchBar
                value={search}
                onChange={(value) => {
                  setSearch(value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <PriceFilter
                selected={priceIdx}
                onChange={(idx) => {
                  setPriceIdx(idx);
                  setCurrentPage(1);
                }}
              />
              {(search || priceIdx !== 0 || sort !== 'default') && (
                <button
                  onClick={resetFilters}
                  className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors text-xs font-medium"
                >
                  Reset All
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="w-full sm:w-auto min-w-[220px]">
                <SortSelect
                  value={sort}
                  onChange={(value) => {
                    setSort(value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="inline-flex items-center rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] p-0.5">
                <button
                  type="button"
                  onClick={() => setLayoutAndResetPage('grid')}
                  aria-label="Grid layout"
                  title="Grid layout"
                  className={`h-8 w-8 inline-flex items-center justify-center rounded-md transition-colors ${
                    layout === 'grid'
                      ? 'bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <svg className="w-4.1 h-4.1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <rect x="4" y="4" width="6" height="6" rx="1" />
                    <rect x="14" y="4" width="6" height="6" rx="1" />
                    <rect x="4" y="14" width="6" height="6" rx="1" />
                    <rect x="14" y="14" width="6" height="6" rx="1" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setLayoutAndResetPage('list')}
                  aria-label="List layout"
                  title="List layout"
                  className={`h-8 w-8 inline-flex items-center justify-center rounded-md transition-colors ${
                    layout === 'list'
                      ? 'bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <svg className="w-4.1 h-4.1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" d="M8 6h12M8 12h12M8 18h12" />
                    <circle cx="4" cy="6" r="1" />
                    <circle cx="4" cy="12" r="1" />
                    <circle cx="4" cy="18" r="1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {!loading && !error && (
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              Showing {rangeStart}-{rangeEnd} of {totalResults} results
            </p>
          )}
        </section>

        {error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-full bg-[color:rgba(180,35,24,0.12)] flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-[var(--danger)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <p className="text-[var(--text-primary)] font-medium mb-1">Failed to load caterers</p>
            <p className="text-[var(--text-muted)] text-sm mb-5">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-[var(--brand-charcoal)] text-sm font-semibold transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {loading && (
          <div className={layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5' : 'grid grid-cols-1 gap-4'}>
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && !error && caterers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-full bg-[color:rgba(255,180,11,0.16)] flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </div>
            <p className="text-[var(--text-primary)] font-medium mb-1">No caterers found</p>
            <p className="text-[var(--text-muted)] text-sm">Try adjusting your search or filters.</p>
          </div>
        )}

        {!loading && !error && caterers.length > 0 && (
          <>
            <div className={layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5' : 'grid grid-cols-1 gap-4'}>
              {caterers.map((caterer, i) => (
                <CatererCard
                  key={caterer.id}
                  caterer={caterer}
                  onEnquire={handleDemoEnquiry}
                  style={{ animationDelay: `${i * 60}ms` }}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              disabled={loading}
            />
          </>
        )}
      </div>

      {enquiryToast && (
        <div className="fixed bottom-5 right-5 z-40 w-[320px] max-w-[calc(100vw-2rem)] rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl p-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[color:rgba(255,180,11,0.22)] text-[var(--accent-strong)]">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">Demo enquiry submitted</p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">{enquiryToast.name}</p>
                <p className="text-[11px] text-[var(--text-muted)] mt-1">Reference: {enquiryToast.reference}</p>
              </div>
            </div>
            <button
              onClick={() => setEnquiryToast(null)}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              aria-label="Close enquiry notification"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <AddCatererModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSuccess={handleCatererAdded}
      />
    </div>
  );
}
