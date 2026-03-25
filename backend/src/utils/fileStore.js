const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/caterers.json');

/**
 * Read all caterers from the JSON file
 * @returns {Promise<Array>} Array of caterer objects
 */
async function readCaterers() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // File doesn't exist yet — return empty array
      return [];
    }
    throw new Error(`Failed to read data file: ${err.message}`);
  }
}

/**
 * Write caterers array back to the JSON file
 * @param {Array} caterers - Array of caterer objects to persist
 * @returns {Promise<void>}
 */
async function writeCaterers(caterers) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(caterers, null, 2), 'utf-8');
  } catch (err) {
    throw new Error(`Failed to write data file: ${err.message}`);
  }
}

module.exports = { readCaterers, writeCaterers };
