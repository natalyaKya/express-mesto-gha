const User = require('../models/user');

const { CastError, NotFoundError, ServerError } = require('../utils/utils');

module.exports.returnUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ user }))
    .catch(next);
};

module.exports.returnUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(CastError).send({
          message: 'Некорректное ID пользователя',
        });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NotFoundError).send({
          message: `Пользователь с таким _id ${req.params.userId} не найден`,
        });
      }
      return res.status(ServerError).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => { res.status(201).send({ user }); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(CastError).send({
          message: 'Ошибка валидации',
        });
      }
      return res.status(ServerError).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        return res.status(NotFoundError).send({
          message: 'Такого пользователя не существует',
        });
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(CastError).send({
          message: 'Ошибка валидации',
        });
      }
      if (err.name === 'CastError') {
        return res.status(CastError).send({
          message: 'Переданы некорректные данные',
        });
      }
      return res.status(ServerError).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(NotFoundError).send({
          message: 'Такого пользователя не существует',
        });
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(CastError).send({
          message: 'Ошибка валидации',
        });
      }
      if (err.name === 'CastError') {
        return res.status(CastError).send({
          message: 'Переданы некорректные данные',
        });
      }
      return res.status(ServerError).send({
        message: 'На сервере произошла ошибка',
      });
    });
};
