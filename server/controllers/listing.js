const House = require('../models/houseModel');

const create = (req, res) => {
    const {image, address, zipCode, state, city, size, numBed, numBath, amenities, price, contact} = req.body

}

module.exports = { create };