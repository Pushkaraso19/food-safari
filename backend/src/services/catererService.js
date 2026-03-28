const { v4: uuidv4 } = require('uuid');
const { readCaterers, writeCaterers } = require('../utils/fileStore');
const { validateCaterer } = require('../models/catererModel');

/**
 * Retrieve all caterers from the data store
 * @param {Object} options
 * @param {number} options.page
 * @param {number} options.limit
 * @param {string} options.search
 * @param {number|undefined} options.minPrice
 * @param {number|undefined} options.maxPrice
 * @param {string|undefined} options.sort
 * @returns {Promise<{data: Array, pagination: Object}>}
 */
async function getAllCaterers(options = {}) {
  const {
    page = 1,
    limit = 10,
    search = '',
    minPrice,
    maxPrice,
    sort,
  } = options;

  let caterers = await readCaterers();

  // Search by caterer name, cuisines, and location/state (case-insensitive)
  if (search) {
    const normalized = search.toLowerCase();
    caterers = caterers.filter((c) => {
      const nameMatch = c.name.toLowerCase().includes(normalized);
      const locationMatch = c.location.toLowerCase().includes(normalized);
      const cuisineMatch = Array.isArray(c.cuisines)
        ? c.cuisines.some((cuisine) => cuisine.toLowerCase().includes(normalized))
        : false;

      return nameMatch || locationMatch || cuisineMatch;
    });
  }

  // Filter by optional price range
  if (typeof minPrice === 'number') {
    caterers = caterers.filter((c) => c.pricePerPlate >= minPrice);
  }
  if (typeof maxPrice === 'number') {
    caterers = caterers.filter((c) => c.pricePerPlate <= maxPrice);
  }
  
  // Apply requested sorting
  switch (sort) {
    case 'price_asc':
      caterers = [...caterers].sort((a, b) => a.pricePerPlate - b.pricePerPlate);
      break;
    case 'price_desc':
      caterers = [...caterers].sort((a, b) => b.pricePerPlate - a.pricePerPlate);
      break;
    case 'rating_desc':
      caterers = [...caterers].sort((a, b) => b.rating - a.rating);
      break;
    case 'rating_asc':
      caterers = [...caterers].sort((a, b) => a.rating - b.rating);
      break;
    default:
      break;
  }

  const total = caterers.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = startIndex >= total ? [] : caterers.slice(startIndex, endIndex);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
}

/**
 * Find a single caterer by its UUID
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
async function getCatererById(id) {
  const caterers = await readCaterers();
  return caterers.find((c) => c.id === id) || null;
}

/**
 * Validate and persist a new caterer
 * @param {Object} data - Raw request body
 * @returns {Promise<Object>} The newly created caterer
 * @throws {Object} Validation error with details array
 */
async function createCaterer(data) {
  const { value, error } = validateCaterer(data);
  if (error) {
    const err = new Error('Validation failed');
    err.statusCode = 422;
    err.details = error.details.map((d) => d.message);
    throw err;
  }

  const newCaterer = {
    id: uuidv4(),
    name: value.name,
    location: value.location,
    pricePerPlate: value.pricePerPlate,
    cuisines: value.cuisines,
    rating: value.rating,
  };

  const caterers = await readCaterers();
  caterers.push(newCaterer);
  await writeCaterers(caterers);

  return newCaterer;
}

module.exports = { getAllCaterers, getCatererById, createCaterer };
