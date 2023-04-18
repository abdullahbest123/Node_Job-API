const UserScheme = require('../models/User');
const { StatusCodes } = require('http-status-codes')
const {
    CustomAPIError,
    UnauthenticatedError,
    NotFoundError,
    BadRequestError, } = require('../errors');

const login = async function (req, res)
{
    const { name, password, email } = req.body
    if (!email || !password)
    {
        throw new BadRequestError("Email and password are required")
    }
    const user = await UserScheme.findOne({ email });
    if (!user)
    {
        throw new UnauthenticatedError("User not found");
    }
    const isPasswordCorrect = await user.checkPassword(password)
    if (!isPasswordCorrect)
    {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const token = user.JwtVerify();
    res.status(StatusCodes.OK).json({
        user: {
            email: user.email,
            lastName: user.lastName,
            location: user.location,
            name: user.name,
            token,
        },
    });

}
const updateUser = async (req, res) =>
{
    const { email, name, lastName, location } = req.body;
    if (!email || !name || !lastName || !location)
    {
        throw new BadRequest('Please provide all values');
    }
    const user = await User.findOne({ _id: req.user.userId });

    user.email = email;
    user.name = name;
    user.lastName = lastName;
    user.location = location;

    await user.save();
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({
        user: {
            email: user.email,
            lastName: user.lastName,
            location: user.location,
            name: user.name,
            token,
        },
    });
};
const register = async function (req, res)
{
    const user = await UserScheme.create({ ...req.body })
    const token = user.JwtVerify();
    res.status(StatusCodes.OK).json({
        user: {
            email: user.email,
            lastName: user.lastName,
            location: user.location,
            name: user.name,
            token,
        },
    });
}

module.exports = {
    login,
    register,
    updateUser,
}