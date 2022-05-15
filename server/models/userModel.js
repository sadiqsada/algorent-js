const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Active'], default: 'Pending' },
    confirmationCode: { type: String, unique: true },
    resetCode: { type: String, unique: false },
    shortlistedHouses: [{ type: Schema.Types.ObjectId, ref: 'House' }],
    recentlyViewed: [{ type: Schema.Types.ObjectId, ref: 'House' }],
    receivedOffers: [{ type: Schema.Types.ObjectId, ref: 'Offer' }],
    sentOffers: [{ type: Schema.Types.ObjectId, ref: 'Offer' }],
    avatar: { data: Buffer, contentType: String },
    wallets: [{ type: Schema.Types.ObjectId, ref: 'Wallet' }],
    selectedWallet: { type: Schema.Types.ObjectId, ref: 'Wallet' }
  },
  { timestamps: true }
);

const User = model('User', UserSchema);
module.exports = User;
