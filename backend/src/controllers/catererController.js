const catererService = require('../services/catererService');

const ALLOWED_SORTS = new Set(['price_asc', 'price_desc', 'rating_desc', 'rating_asc']);

function parsePositiveInteger(value, fieldName, { min = 1, max } = {}) {
  const parsed = Number.parseInt(value, 10);
  const hasMax = typeof max === 'number';
  const isOutOfRange = hasMax ? parsed < min || parsed > max : parsed < min;

  if (!Number.isInteger(parsed) || isOutOfRange) {
    if (hasMax) {
      return { error: `Query param "${fieldName}" must be an integer between ${min} and ${max}` };
    }
    return { error: `Query param "${fieldName}" must be a positive integer` };
  }

  return { value: parsed };
}

function parseOptionalNumber(value, fieldName) {
  if (value === undefined) return { value: undefined };
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return { error: `Query param "${fieldName}" must be a valid number` };
  }
  return { value: parsed };
}

function parseOptionalSort(value) {
  if (typeof value !== 'string' || !value.trim()) {
    return { value: undefined };
  }

  const sort = value.trim();
  if (!ALLOWED_SORTS.has(sort)) {
    return { error: 'Query param "sort" must be one of: price_asc, price_desc, rating_desc, rating_asc' };
  }

  return { value: sort };
}

/**
 * GET /api/caterers
 * Returns paginated caterers with optional filters
 */
async function getAll(req, res, next) {
  try {
    const pageResult = parsePositiveInteger(req.query.page ?? '1', 'page');
    if (pageResult.error) {
      return res.status(400).json({ message: pageResult.error });
    }

    const limitResult = parsePositiveInteger(req.query.limit ?? '10', 'limit', { min: 1, max: 100 });
    if (limitResult.error) {
      return res.status(400).json({ message: limitResult.error });
    }

    const minPriceResult = parseOptionalNumber(req.query.minPrice, 'minPrice');
    if (minPriceResult.error) {
      return res.status(400).json({ message: minPriceResult.error });
    }

    const maxPriceResult = parseOptionalNumber(req.query.maxPrice, 'maxPrice');
    if (maxPriceResult.error) {
      return res.status(400).json({ message: maxPriceResult.error });
    }

    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const { value: page } = pageResult;
    const { value: limit } = limitResult;
    const { value: minPrice } = minPriceResult;
    const { value: maxPrice } = maxPriceResult;

    if (typeof minPrice === 'number' && typeof maxPrice === 'number' && minPrice > maxPrice) {
      return res.status(400).json({ message: '"minPrice" cannot be greater than "maxPrice"' });
    }

    const sortResult = parseOptionalSort(req.query.sort);
    if (sortResult.error) {
      return res.status(400).json({ message: sortResult.error });
    }
    const { value: sort } = sortResult;

    const result = await catererService.getAllCaterers({
      page,
      limit,
      search,
      minPrice,
      maxPrice,
      sort,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/caterers/:id
 * Returns a single caterer by ID
 */
async function getById(req, res, next) {
  try {
    const caterer = await catererService.getCatererById(req.params.id);
    if (!caterer) {
      return res.status(404).json({ success: false, message: 'Caterer not found' });
    }
    res.json({ success: true, data: caterer });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/caterers
 * Creates a new caterer
 */
async function create(req, res, next) {
  try {
    const caterer = await catererService.createCaterer(req.body);
    res.status(201).json({ success: true, data: caterer });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create };
