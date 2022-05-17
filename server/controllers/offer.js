const Offer = require('../models/offerModel');
const House = require('../models/houseModel');
const User = require('../models/userModel');

const addOffer = async (req, res) => {
  const { address, price } = req.body;
  const house = await House.find({ address });
  const user = await User.findById(req.userId);
  const elonUserResponse = await User.find({ email: 'elonmusk@twitter.com' });
  const elonUser = elonUserResponse[0];
  const newOffer = new Offer({
    name: user.firstName,
    price,
    house: house[0],
    senderID: req.userId,
  });
  await newOffer.save();
  elonUser.receivedOffers.push(newOffer);
  await elonUser.save();
  user.sentOffers.push(newOffer);
  await user.save();
  console.log('Offer successfully saved');
  return res.json({ message: 'Offer Successfully Saved' });
};

const removeOffer = async (req, res) => {
  const { id } = req.body;
  const offer = await Offer.findById(id);
  const user = await User.findById(req.userId);
  user.receivedOffers = user.receivedOffers.filter(
    (itemID) => !itemID.equals(id)
  );
  await user.save();
  const sender = await User.findById(offer.senderID);
  sender.sentOffers = sender.sentOffers.filter((itemID) => !itemID.equals(id));
  await sender.save();
  await Offer.findByIdAndDelete(offer);
  return res.json({ message: 'Offer succcessfully deleted' });
};

const removeBid = async (req, res) => {
  const { id } = req.body;
  const offer = await Offer.findById(id);
  const house = await House.findById(offer.house);
  const user = await User.findById(house.owner);
  user.receivedOffers = user.receivedOffers.filter(
    (itemID) => !itemID.equals(id)
  );
  await user.save();
  const sender = await User.findById(offer.senderID);
  sender.sentOffers = sender.sentOffers.filter((itemID) => !itemID.equals(id));
  await sender.save();
  await Offer.findByIdAndDelete(offer);
  return res.json({ message: 'Offer succcessfully deleted' });
};

const getReceivedOffers = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const receivedOffers = await Offer.find()
      .where('_id')
      .in(user.receivedOffers)
      .exec();
    return res.status(200).json(receivedOffers.reverse());
  } catch (error) {
    console.error(error);
  }
};

const getBidHouses = async (req, res) => {
  const user = await User.findById(req.userId);
  const bids = await Offer.find().where('_id').in(user.sentOffers).exec();
  return res.status(200).json(bids.reverse());
};

module.exports = {
  addOffer,
  removeOffer,
  removeBid,
  getReceivedOffers,
  getBidHouses,
};
