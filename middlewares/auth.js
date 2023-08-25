const jwttoken = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthor-err');

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;
  if (!jwt) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = jwt;
  let payload;

  try {
    payload = jwttoken.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
