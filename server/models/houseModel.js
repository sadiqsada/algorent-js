const { Schema, model } = require('mongoose');

const HouseSchema = new Schema(
  {
    key: { type: String, required: true},
    address: { type: String, required: true },
    state: { type: String },
    city: { type: String },
    zipCode: { type: String },
    price: { type: String, required: true },
    imgUrl: { type: String, required: true },
    numBedrooms: { type: Number },
    numBathrooms: { type: Number },
  },
  { timestamps: true }
);

const House = model('House', HouseSchema);
module.exports = House;
