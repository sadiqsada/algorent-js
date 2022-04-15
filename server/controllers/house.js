const scraper = require('../scrapers/scraper.js');
const House = require('../models/HouseModel');
const User = require('../models/userModel');

const explore = async (req, res) => {
  try {
    const { address, filter } = req.body;
    const zipCode = address.split('|')[2];
    const results = await House.find({ zipCode });

    if (results.length > 0) {
      const houses = results.map((house) => [
        house.imgUrl,
        house.address,
        house.price,
        house.numBathrooms,
        house.numBedrooms,
        zipCode,
      ]);
      return res.json(houses);
    }

    scraper.scrapeRemax(address, filter, (data) => {
      console.log('data')
      console.log(data)
      data.forEach(async (house) => {
        const newHouse = new House({
          imgUrl: house[0],
          address: house[1],
          price: house[2],
          zipCode,
          numBedrooms: Number(house[4]) === 0 ? 1 : house[4],
          numBathrooms: Number(house[3]) === 0 ? 1 : house[3],
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
    const zipCode = stateZip.split(' ');
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
    return res.status(200).json(houses);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  explore,
  shortlist,
  getShortlist,
  recentlyViewed,
  getRecentlyViewed,
};
