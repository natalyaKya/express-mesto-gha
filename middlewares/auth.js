const jwttoken = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthor-err');
const ServerError = require('../errors/server-err');

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;
  if (!jwt) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = jwt;
  let payload;

  try {
    payload = jwttoken.verify(token, 'some-secret-key');
    console.log(payload);
  } catch (err) {
    if (err.name === 'Unauthorized') {
      return next(new UnauthorizedError('Необходима авторизация'));
    }
    return next(new ServerError('На сервере произошла ошибка'));
  }
  req.user = payload;
  return next();
};
