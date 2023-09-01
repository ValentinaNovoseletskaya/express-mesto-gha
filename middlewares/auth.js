const jwt = require('jsonwebtoken');
const { authError } = require('../utils/errors');

module.exports = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    const err = authError('Необходима авторизация');
    next(err);
  }

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (e) {
    const err = authError('Необходима авторизация');
    next(err);
  }

  req.user = payload;

  next();
};
