const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')
const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "why not name?"],
        min: [3, "min length is 3 characters"],
        max: [15, "max length is 15 characters"]
    },
    email: {
        type: String,
        required: [true, "why not email?"],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "why not password?"],
        min: [3, "min length is 3 characters"]
    },

})

UserSchema.pre('save', async function ()
{
    const salt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password, salt);

})

UserSchema.methods.JwtVerify = function ()
{

    const token = jwt.sign({ _id: this._id, name: this.name }, process.env.JWT_SECRET, { expiresIn: '30d' })
    return token;
}

UserSchema.methods.checkPassword = async function (thepass) 
{
    const ismathc = await bcryptjs.compare(thepass, this.password)
    return ismathc

}

module.exports = mongoose.model('User', UserSchema);