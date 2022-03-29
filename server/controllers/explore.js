const scraper = require('../scrapers/scraper.js');
const House = require('../models/HouseModel');

const explore = async (req, res) => {
  try {
    const { address } = req.body;
    const results = await House.find({ key: address }, 'imgUrl address price');

    if (results.length > 0) {
      const houses = results.map((house) => [
        house.imgUrl,
        house.address,
        house.price,
      ]);
      return res.json(houses);
    }

    scraper.scrapeRemax(address, (data) => {
      data.forEach(async (house) => {
        const newHouse = new House({
          key: address,
          imgUrl: house[0],
          address: house[1],
          price: house[2],
        });

        await newHouse.save();
      });
      return res.json(data);
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { explore };
