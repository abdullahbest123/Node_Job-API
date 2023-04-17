const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')


const auth = (req, res, next) =>
{
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer '))
    {
        throw new UnauthenticatedError("Token is required")
    }
    const token = authHeader.split(' ')[1]
    try
    {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { userId: payload._id, name: payload.name }
        next()
    } catch (error)
    {
        throw new UnauthenticatedError(error.message)
    }
}

module.exports = auth