const scraper = require('../scrapers/scraper.js');
const House = require('../models/HouseModel');
const User = require('../models/userModel');

const explore = async (req, res) => {
  try {
    const { address } = req.body;
    const zipCode = address.split('|')[2];
    const results = await House.find({ zipCode }, 'imgUrl address price');

    if (results.length > 0) {
      const houses = results.map((house) => [
        house.imgUrl,
        house.address,
        house.price,
        zipCode
      ]);
      return res.json(houses);
    }

    scraper.scrape_remax(address, '', (data) => {
      data.forEach(async (house) => {
        const newHouse = new House({
          imgUrl: house[0],
          address: house[1],
          price: house[2],
          zipCode,
        });

        await newHouse.save();
      });
      return res.json(data);
    });
  } catch (error) {
    console.error(error);
  }
};

const shortlist = async (req, res) => {
  try {
    const { address, zipCode } = req.body;
    const house = await House.find({ address, zipCode });
    const user = await User.findById(req.userId);
    user.shortlistedHouses.push(house[0]);
    await user.save();
    return res.json('House shortlisted');
  } catch (error) {
    console.error(error);
  }
};

module.exports = { explore, shortlist };
