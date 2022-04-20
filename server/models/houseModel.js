const { Schema, model } = require('mongoose');

const HouseSchema = new Schema(
  {
    address: { type: String, required: true },
    state: { type: String },
    city: { type: String },
    zipCode: { type: String, required: true, index: true },
<<<<<<< HEAD
    price: { type: Number, required: true },
    imgUrl: { type: String, required: true },
    numBedrooms: { type: Number, required: true },
    numBathrooms: { type: Number, required: true },
    mapUrls: { type: [String] },
=======
    price: { type: String, required: true },
    imgUrl: { type: [String], required: true },
    numBedrooms: { type: Number },
    numBathrooms: { type: Number },
    size: { type: Number },
    contact: { type: String },
    amenities: { type: [String] },
>>>>>>> jiayi
  },
  { timestamps: true }
);

const House = model('House', HouseSchema);
module.exports = House;
