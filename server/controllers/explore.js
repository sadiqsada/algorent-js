const scraper = require('../scrapers/scraper.js');

const explore = (req, res) => {
  try {
    const { address } = req.body;
    scraper.scrapeRemax(address, (data) => {
      return res.json(data);
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { explore };
