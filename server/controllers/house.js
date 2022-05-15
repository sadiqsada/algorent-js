const scraper = require('../scrapers/scraper.js');
const House = require('../models/houseModel');
const User = require('../models/userModel');
const formatPrice = require('../utils/formatPrice');

const explore = async (req, res) => {
  try {
    const { address, filter } = req.body;
    const scraperAddress = address;
    let scraperFilter = filter;
    scraper.guessAddress(address, async (stateCityZip) => {
      console.log(
        'Searching DB! Address: ' +
          address +
          ' stateCityZip from Guesser is: ' +
          stateCityZip
      );
      const zipCode = stateCityZip[2];
      const { minBeds, minBaths, minPrice, maxPrice } = filter;
      let filtersActive = false;
      if (
        Number(minBeds) > 1 ||
        Number(minBaths) > 1 ||
        Number(minPrice) !== 0 ||
        Number(maxPrice !== 100000000)
      ) {
        filtersActive = true;
      }

      const results = await House.find({
        zipCode,
        numBedrooms: { $gte: minBeds },
        numBathrooms: { $gte: minBaths },
        price: { $gte: minPrice, $lte: maxPrice },
      });

      console.log('DB Results Length: ' + results.length);
      if ((filtersActive && results.length > 0) || results.length > 8) {
        const houses = results.map((house) => [
          house.imgUrl,
          house.address,
          house.price,
          house.numBathrooms,
          house.numBedrooms,
          house.mapUrls[0],
          house.mapUrls[1],
        ]);
        return res.json(houses);
      }
      if (
        Number(minBeds) > 1 &&
        Number(minBaths) > 1 &&
        Number(minPrice) !== 0
      ) {
        scraperFilter = '';
      }
      const houses = [];
      const elonUser = await User.findById('628077c1411ce173370edae3');
      console.log(
        'Using Scraper! Address: ' +
          scraperAddress +
          ' Filter: ' +
          scraperFilter
      );
      scraper.scrapeRemax(scraperAddress, scraperFilter, (data) => {
        data.forEach(async (house) => {
          const scraperZipCode = house[1].split(', ')[2].split(' ')[1];
          const newHouse = new House({
            imgUrl: house[0],
            address: house[1],
            price: Number(formatPrice(house[2])),
            zipCode: scraperZipCode,
            numBedrooms: Number(house[4]) === 0 ? 1 : Number(house[4]),
            numBathrooms: Number(house[3]) === 0 ? 1 : Number(house[3]),
            mapUrls: [house[5], house[6]],
            owner: elonUser,
          });
          const newHouseArr = [
            newHouse.imgUrl,
            newHouse.address,
            newHouse.price,
            newHouse.numBathrooms,
            newHouse.numBedrooms,
            newHouse.mapUrls[0],
            newHouse.mapUrls[1],
          ];
          houses.push(newHouseArr);
          await newHouse.save();
        });
        return res.json(houses);
      });
    });
  } catch (error) {
    console.error(error);
  }
};

const shortlist = async (req, res) => {
  try {
    const { address } = req.body;
    const stateZip = address.split(', ')[2];
    const zipCode = stateZip.split(' ')[1];
    const house = await House.find({ zipCode, address });
    const user = await User.findById(req.userId);
    for (let i = 0; i < user.shortlistedHouses.length; i++) {
      const item = user.shortlistedHouses[i];
      if (item.equals(house[0]._id)) {
        return res.status(400).json('House already shortlisted');
      }
    }
    user.shortlistedHouses.push(house[0]);
    await user.save();
    return res.status(200).json('House shortlisted');
  } catch (error) {
    console.error(error);
  }
};

const getShortlist = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const houses = await House.find()
      .where('_id')
      .in(user.shortlistedHouses)
      .exec();
    return res.status(200).json(houses);
  } catch (error) {
    console.error(error);
  }
};

const recentlyViewed = async (req, res) => {
  try {
    const { address } = req.body;
    const stateZip = address.split(', ')[2];
    const zipCode = stateZip.split(' ')[1];
    const house = await House.find({ zipCode, address });
    const user = await User.findById(req.userId);
    if (user.recentlyViewed.length === 0) {
      user.recentlyViewed.push(house[0]);
      await user.save();
      return res.status(200).json('House Recently Viewed');
    }
    const previousHouse = user.recentlyViewed[user.recentlyViewed.length - 1];
    if (!previousHouse.equals(house[0]._id)) {
      user.recentlyViewed.push(house[0]);
      await user.save();
      return res.status(200).json('House Recently Viewed');
    } else {
      return res.status(200).json('House Previously Viewed');
    }
  } catch (error) {
    console.error(error);
  }
};

const getRecentlyViewed = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const houses = await House.find()
      .where('_id')
      .in(user.recentlyViewed)
      .exec();
    return res.status(200).json(houses.reverse());
  } catch (error) {
    console.error(error);
  }
};

const getHouseByID = async (req, res) => {
  try {
    const { houseID } = req.body;
    const house = await House.findById(houseID);
    return res.status(200).json(house);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  explore,
  shortlist,
  getShortlist,
  recentlyViewed,
  getRecentlyViewed,
  getHouseByID,
};
