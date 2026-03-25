'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState('light');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const nextTheme = stored || 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 6);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  }

  function handleAddCaterer() {
    router.push('/caterers?add=1');
  }

  return (
    <header className={`sticky top-0 z-50 border-b border-[var(--border)] surface-glass backdrop-blur-md transition-all duration-200 ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/caterers" className="group inline-flex items-center gap-2.5" aria-label="Go to caterers page">
          <span className="h-2 w-2 rounded-full bg-[var(--accent-strong)] group-hover:scale-110 transition-transform" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-[1.35rem] bg-gradient-to-r from-[var(--text-primary)] to-[var(--accent-strong)] text-transparent bg-clip-text">
              Food Safari
            </span>
            <span className={`hidden sm:inline text-[10px] uppercase tracking-[0.16em] mt-1 ${pathname === '/caterers' ? 'text-[var(--accent-strong)]' : 'text-[var(--text-muted)]'}`}>
              Caterer Directory
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-muted)] transition-all duration-200"
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <circle cx="12" cy="12" r="4" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21m9-9h-2.25M5.25 12H3m15.114 6.364-1.591-1.591M7.477 7.477 5.886 5.886m12.228 0-1.591 1.591M7.477 16.523l-1.591 1.591" />
              </svg>
            ) : (
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={handleAddCaterer}
            className="inline-flex items-center justify-center h-10 gap-2 px-4 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-[var(--brand-charcoal)] text-sm font-semibold transition-all duration-200 hover:shadow-lg"
            aria-label="Add caterer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
            </svg>
            <span className="hidden sm:inline">Add Caterer</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>
    </header>
  );
}
