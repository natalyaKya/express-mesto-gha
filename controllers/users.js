const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const CastError = require('../errors/cast-err');
const NotFoundError = require('../errors/not-found-err');
const ServerError = require('../errors/server-err');
const UnauthorizedError = require('../errors/unauthor-err');
const DublicateError = require('../errors/dublicate-err');

module.exports.returnUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ user }))
    .catch(next);
};

module.exports.returnUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new CastError('Некорректное ID пользователя');
      }
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError(`Пользователь с таким _id ${req.params.userId} не найден`);
      }
      throw new ServerError('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.returnCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new CastError('Некорректное ID пользователя');
      }
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError(`Пользователь с таким _id ${req.params.userId} не найден`);
      }
      throw new ServerError('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => { res.status(201).send({ user }); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new CastError('Ошибка валидации');
      }
      throw new ServerError('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует');
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new CastError('Ошибка валидации');
      }
      if (err.name === 'CastError') {
        throw new CastError('Переданы некорректные данные');
      }
      throw new ServerError('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует');
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new CastError('Ошибка валидации');
      }
      if (err.name === 'CastError') {
        throw new CastError('Переданы некорректные данные');
      }
      throw new ServerError('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      return res.cookie('jwt', token, { httpOnly: true }).end();
    })
    .catch((err) => {
      if (err.name === 'Unauthorized') {
        throw new UnauthorizedError('Неверные логин или пароль');
      }
      if (err.code === 11000) {
        throw new DublicateError('Пользователь с таким e-mail уже зарегистрирован');
      }
      throw new ServerError('На сервере произошла ошибка');
    })
    .catch(next);
};
