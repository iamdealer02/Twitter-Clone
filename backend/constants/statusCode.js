// create status codes for the application
const queryError = 500;
const notFound = 404;
const badGateway = 502;
const userAlreadyExists = 409;
const success = 200;
const missingParameters = 400;
const unauthorized = 401;
const badRequest = 400;

module.exports = {
  badGateway,
  queryError,
  notFound,
  userAlreadyExists,
  success,
  missingParameters,
  unauthorized,
  badRequest,
};