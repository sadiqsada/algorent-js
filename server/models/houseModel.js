const { Schema, model } = require('mongoose');

const HouseSchema = new Schema(
  {
    address: { type: String, required: true },
    state: { type: String },
    city: { type: String },
    zipCode: { type: String, required: true, index: true },
    price: { type: String, required: true },
    imgUrl: { type: String, required: true },
    numBedrooms: { type: String, required: true },
    numBathrooms: { type: String, required: true },
  },
  { timestamps: true }
);

const House = model('House', HouseSchema);
module.exports = House;
