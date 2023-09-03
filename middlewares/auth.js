const jwt = require('jsonwebtoken');
const AuthorizationError = require('./errors/AuthorizationError');

module.exports = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    const err = new AuthorizationError('Необходима авторизация');
    next(err);
  }

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (e) {
    const err = new AuthorizationError('Необходима авторизация');
    next(err);
  }

  req.user = payload;

  next();
};
