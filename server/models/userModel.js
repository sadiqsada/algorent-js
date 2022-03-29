const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
  {
    key: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Active'], default: 'Pending' },
    confirmationCode: { type: String, unique: true },
    resetCode: { type: String, unique: false },
  },
  { timestamps: true }
);

const User = model('User', UserSchema);
module.exports = User;
