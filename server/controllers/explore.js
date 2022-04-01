const scraper = require('../scrapers/scraper.js');

const explore = (req, res) => {
  try {
    const { address } = req.body;
    scraper.scrape_remax(address, '{"minBeds":2, "minBaths":2, "minPrice":"1000000","maxPrice":"10000000"}', (data) => {
      return res.json(data);
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { explore };
