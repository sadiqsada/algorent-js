const Offer = require('../models/offerModel');
const House = require('../models/houseModel');
const User = require('../models/userModel');

const addOffer = async (req, res) => {
  const { address, price } = req.body;
  const house = await House.find({ address });
  const user = await User.findById(req.userId);
  const elonUser = await User.findById('628077c1411ce173370edae3');
  const newOffer = new Offer({ name: user.firstName, price, house: house[0] });
  await newOffer.save();
  elonUser.receivedOffers.push(newOffer);
  await elonUser.save();
  user.sentOffers.push(newOffer);
  await user.save();
  console.log('Offer successfully saved');
  return res.json({ message: 'Offer Successfully Saved' });
};

module.exports = { addOffer };
