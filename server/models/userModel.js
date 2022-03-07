const {Schema, model} = require('mongoose')

const UserSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        passwordHash: { type: String, required: true },
        accountType: { type:String, required: true }
    },
    { timestamps: true },
)

const User = model('User', UserSchema);
module.exports = User;