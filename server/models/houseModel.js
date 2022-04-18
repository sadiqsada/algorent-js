const { Schema, model } = require('mongoose');

const HouseSchema = new Schema(
  {
    address: { type: String, required: true },
    state: { type: String },
    city: { type: String },
    zipCode: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    imgUrl: { type: String, required: true },
    numBedrooms: { type: Number, required: true },
    numBathrooms: { type: Number, required: true },
    mapUrls: { type: [String] },
  },
  { timestamps: true }
);

const House = model('House', HouseSchema);
module.exports = House;
