const {Schema, model} = require('mongoose')

const UserSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        passwordHash: { type: String, required: true },
        status: { type: String, enum: ['Pending', 'Active'], default: 'Pending'},
        confirmationCode: { type: String, unique: true},
    },
    { timestamps: true },
)

const User = model('User', UserSchema);
module.exports = User;