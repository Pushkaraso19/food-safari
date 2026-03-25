'use client';

import { useState } from 'react';
import { createCaterer } from '../services/api';

const EMPTY_FORM = {
  name: '',
  location: '',
  pricePerPlate: '',
  cuisines: '',
  rating: '',
};

/**
 * Modal form used to create a caterer record.
 * @param {{ isOpen: boolean, onClose: () => void, onSuccess: (caterer: Object) => void }} props
 */
export default function AddCatererModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    setErrors([]);
    setLoading(true);

    const payload = {
      name: form.name.trim(),
      location: form.location.trim(),
      pricePerPlate: parseFloat(form.pricePerPlate),
      cuisines: form.cuisines.split(',').map((c) => c.trim()).filter(Boolean),
      rating: parseFloat(form.rating),
    };

    try {
      const created = await createCaterer(payload);
      setForm(EMPTY_FORM);
      onSuccess(created);
      onClose();
    } catch (err) {
      setErrors(err.details?.length ? err.details : [err.message]);
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    { name: 'name', label: 'Business Name', placeholder: 'e.g. Royal Feast Caterers', type: 'text' },
    { name: 'location', label: 'Location', placeholder: 'e.g. Mumbai, Maharashtra', type: 'text' },
    { name: 'pricePerPlate', label: 'Price Per Plate (₹)', placeholder: 'e.g. 750', type: 'number' },
    { name: 'cuisines', label: 'Cuisines (comma-separated)', placeholder: 'e.g. North Indian, Mughlai', type: 'text' },
    { name: 'rating', label: 'Rating (0–5)', placeholder: 'e.g. 4.5', type: 'number' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-2xl z-10 animate-[fadeInUp_0.3s_ease_forwards]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">Add New Caterer</h2>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {errors.length > 0 && (
          <div className="mb-4 p-3 rounded-xl bg-[color:rgba(180,35,24,0.12)] border border-[color:rgba(180,35,24,0.34)]">
            <ul className="space-y-1">
              {errors.map((e, i) => (
                <li key={i} className="text-[var(--danger)] text-xs flex items-start gap-1.5">
                  <span className="mt-0.5">•</span>{e}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-4">
          {fields.map(({ name, label, placeholder, type }) => (
            <div key={name}>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="
                  w-full px-4 py-3 rounded-xl
                  bg-[var(--bg-muted)] border border-[var(--border)]
                  text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]
                  focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--ring)]
                  transition-all duration-200
                "
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-[var(--brand-charcoal)] text-sm font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding…' : 'Add Caterer'}
          </button>
        </div>
      </div>
    </div>
  );
}
