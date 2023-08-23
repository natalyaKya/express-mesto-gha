const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthor-err');
const ServerError = require('../errors/server-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    if (err.name === 'Unauthorized') {
      return next(new UnauthorizedError('Необходима авторизация'));
    }
    return next(new ServerError('На сервере произошла ошибка'));
  }
  req.user = payload;
  return next();
};
