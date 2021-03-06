const { Schema, model } = require('mongoose');

const HouseSchema = new Schema(
  {
    address: { type: String, required: true },
    state: { type: String },
    city: { type: String },
    zipCode: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    mapUrls: { type: [String] },
    imgUrl: { type: [String], required: true },
    numBedrooms: { type: Number },
    numBathrooms: { type: Number },
    size: { type: Number },
    contact: { type: String },
    amenities: { type: [String] },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const House = model('House', HouseSchema);
module.exports = House;
