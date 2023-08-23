const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthor-err');
const ServerError = require('../errors/server-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');

  jwt.verify(token, 'some-secret-key', { expiresIn: '7d' })
    .then((payload) => {
      req.user = payload;
      return req.user;
    })
    .catch((err) => {
      if (err.name === 'Unauthorized') {
        throw new UnauthorizedError('Необходима авторизация');
      }
      throw new ServerError('На сервере произошла ошибка');
    })
    .catch(next);
};
