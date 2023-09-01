const ERROR_CODE = 400;
const AUTH_ERROR = 401;
const OWNER_ERROR = 403;
const ERROR_NOT_FOUND = 404;
const DUPLICATE_ERROR = 409;

module.exports.castError = (message) => {
  const err = new Error(message);
  err.statusCode = ERROR_CODE;
  return err;
};

module.exports.validationError = (message) => {
  const err = new Error(message);
  err.statusCode = ERROR_CODE;
  return err;
};

module.exports.notOwnerError = (message) => {
  const err = new Error(message);
  err.statusCode = OWNER_ERROR;
  return err;
};

module.exports.authError = (message) => {
  const err = new Error(message);
  err.statusCode = AUTH_ERROR;
  return err;
};

module.exports.notFoundError = (message) => {
  const err = new Error(message);
  err.statusCode = ERROR_NOT_FOUND;
  return err;
};

module.exports.duplicateEmailError = (message) => {
  const err = new Error(message);
  err.statusCode = DUPLICATE_ERROR;
  return err;
};
