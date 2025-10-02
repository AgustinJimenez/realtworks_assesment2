const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { invalidateStatsCache } = require('./stats');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Cache for data to avoid repeated file reads
let dataCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 30000; // 30 seconds

// Utility to read data asynchronously with caching
async function readData() {
  const now = Date.now();
  if (dataCache && (now - cacheTimestamp) < CACHE_TTL) {
    return dataCache;
  }
  
  const raw = await fs.readFile(DATA_PATH);
  dataCache = JSON.parse(raw);
  cacheTimestamp = now;
  return dataCache;
}

// Invalidate cache when data is written
function invalidateCache() {
  dataCache = null;
  cacheTimestamp = 0;
}

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const data = await readData();
    const { limit, q, offset } = req.query;
    let results = data;

    if (q) {
      // Search in both name and category (case-insensitive)
      const searchTerm = q.toLowerCase();
      results = results.filter(item => 
        (item.name && item.name.toLowerCase().includes(searchTerm)) || 
        (item.category && item.category.toLowerCase().includes(searchTerm))
      );
    }

    const totalCount = results.length;
    const startIndex = offset ? parseInt(offset) : 0;
    const endIndex = limit ? startIndex + parseInt(limit) : results.length;
    
    const paginatedResults = results.slice(startIndex, endIndex);

    res.json({
      items: paginatedResults,
      total: totalCount,
      showing: paginatedResults.length,
      offset: startIndex
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const data = await readData();
    const item = data.find(i => i.id === parseInt(req.params.id));
    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    // Validate payload
    const { name, category, price } = req.body;
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      const err = new Error('Name is required and must be a non-empty string');
      err.status = 400;
      throw err;
    }
    
    if (!category || typeof category !== 'string' || category.trim().length === 0) {
      const err = new Error('Category is required and must be a non-empty string');
      err.status = 400;
      throw err;
    }
    
    if (typeof price !== 'number' || price <= 0 || !isFinite(price)) {
      const err = new Error('Price is required and must be a positive number');
      err.status = 400;
      throw err;
    }
    
    const item = { name: name.trim(), category: category.trim(), price };
    const data = await readData();
    item.id = Date.now();
    data.push(item);
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
    invalidateCache(); // Clear cache after write
    invalidateStatsCache();
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
