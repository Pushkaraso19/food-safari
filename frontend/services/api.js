const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Fetch paginated caterers from backend API
 * @param {Object} params
 * @param {number} params.page
 * @param {number} params.limit
 * @param {string} [params.search]
 * @param {number} [params.minPrice]
 * @param {number} [params.maxPrice]
 * @param {string} [params.sort]
 * @returns {Promise<{data: Array, pagination: Object}>}
 */
export async function fetchCaterers(params = {}) {
  const query = new URLSearchParams();

  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.search) query.set('search', params.search);
  if (typeof params.minPrice === 'number') query.set('minPrice', String(params.minPrice));
  if (typeof params.maxPrice === 'number') query.set('maxPrice', String(params.maxPrice));
  if (params.sort && params.sort !== 'default') query.set('sort', params.sort);

  const qs = query.toString();
  const url = `${API_URL}/api/caterers${qs ? `?${qs}` : ''}`;

  const res = await fetch(url, {
    cache: 'no-store', // Always fetch fresh data
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to fetch caterers (${res.status})`);
  }

  const json = await res.json();
  return json;
}

/**
 * Fetch a single caterer by ID
 * @param {string} id
 * @returns {Promise<Object>} Caterer object
 */
export async function fetchCatererById(id) {
  const res = await fetch(`${API_URL}/api/caterers/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Caterer not found (${res.status})`);
  }

  const json = await res.json();
  return json.data;
}

/**
 * Create a new caterer
 * @param {Object} payload - Caterer data
 * @returns {Promise<Object>} Created caterer
 */
export async function createCaterer(payload) {
  const res = await fetch(`${API_URL}/api/caterers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!res.ok) {
    const error = new Error(json.message || 'Failed to create caterer');
    error.details = json.details || [];
    throw error;
  }

  return json.data;
}
