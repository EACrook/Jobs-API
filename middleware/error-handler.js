const {
  CustomAPIError
} = require('../errors')
const {
  StatusCodes
} = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, try again later'
  }
  // this is no longer needed due to the above code
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.StatusCodes).json({ msg: err.message })
  // }
  if (err.name === 'ValidationError') {
    console.log(Object.values(err.errors))
    // iterating over array, grabbing the message from the array and creating an new array with just the error messages
    customError.msg = Object.values(err.errors).map((item) => item.message).join(',')
    customError.statusCode = 400
  }

  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`
    customError.statusCode = 400
  }

  if(err.name === 'CastError') {
    customError.msg = `No job found with id: ${err.value}`
    customError.statusCode = 404
  }
  //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({
    msg: customError.msg
  })
}

module.exports = errorHandlerMiddleware