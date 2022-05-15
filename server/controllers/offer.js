const Offer = require('../models/offerModel');

const addOffer = async (req, res) => {
    const { name, price, houseID } = req.body;
    const newOffer = new Offer({ name, price, house: houseID });
    await newOffer.save();
    console.log('Offer successfully saved');
}

module.exports = { addOffer };