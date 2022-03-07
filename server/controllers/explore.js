const scraper = require('../scrapers/scraper.js');

explore = (req, res) => {
    try {
        const { address } = req.body;
        scraper.scrape_remax(address, data => {
            return res.json(data);
        });
    }
    catch (error) {
        console.error(error);
    }
}

module.exports = { explore }