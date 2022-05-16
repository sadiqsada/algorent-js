const { Schema, model } = require('mongoose');

const WalletSchema = new Schema(
  {
    id: { type: String, required: true },
    mnemonic: { type: String, required: true },
  },
  { timestamps: true }
);

const Wallet = model('Wallet', WalletSchema);
module.exports = Wallet;
