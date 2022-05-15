const { Schema, model } = require('mongoose');

const OfferSchema = new Schema(
  {
    name: { type: String },
    price: { type: Number, required: true },
    house: { type: Schema.Types.ObjectId, ref: 'House' },
  },
  { timestamps: true }
);

const Offer = model('Offer', OfferSchema);
module.exports = Offer;
