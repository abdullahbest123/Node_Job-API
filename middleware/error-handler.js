const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) =>
{
  let customError = {
    statuscode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "something went wrong trying again"
  }
  if (err.name === 'ValidationError')
  {
    customError.msg = Object.values(err.errors).map((item) => item.message).join(',')
    customError.statuscode = StatusCodes.BAD_REQUEST
  }


  if (err.code && err.code === 11000)
  {
    customError.msg = `duplicate value entered for ${Object.keys(err.keyValue)} field please choose another value`
    customError.statuscode = StatusCodes.BAD_REQUEST
  }

  if (err.name === 'CastError')
  {
    customError.msg = `No Item Found with id ${err.value}`
    customError.statuscode = StatusCodes.BAD_REQUEST
  }

  return res.status(customError.statuscode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
