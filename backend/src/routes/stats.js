const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { mean } = require('../utils/stats');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Cache for stats to avoid repeated calculations
let statsCache = null;
let statsCacheTimestamp = 0;
const STATS_CACHE_TTL = 60000; // 60 seconds

function invalidateStatsCache() {
  statsCache = null;
  statsCacheTimestamp = 0;
}

// GET /api/stats
router.get('/', async (req, res, next) => {
  try {
    const now = Date.now();
    
    // Return cached stats if still valid
    if (statsCache && (now - statsCacheTimestamp) < STATS_CACHE_TTL) {
      return res.json(statsCache);
    }

    const raw = await fs.readFile(DATA_PATH);
    const items = JSON.parse(raw);
    
    // Heavy CPU calculation with caching
    const prices = items.map(item => item.price).filter(price => typeof price === 'number' && !isNaN(price));
    const stats = {
      total: items.length,
      averagePrice: mean(prices)
    };

    // Cache the result
    statsCache = stats;
    statsCacheTimestamp = now;

    res.json(stats);
  } catch (err) {
    next(err);
  }
});

module.exports = {
  router,
  invalidateStatsCache
};
