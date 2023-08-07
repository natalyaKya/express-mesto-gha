const User = require('../models/user');

module.exports.returnUsers = (req, res) => {

  User.find({})
    .then(user => res.status(200).send({ user }))
    .catch(err => res.status(500).send(`Ошибка сервера: ${err.message}`));
};

module.exports.returnUserById = (req, res) => {

  User.findById(req.user._id)
    .then(user => {
      if (!user) {
        return res.status(404).send(`Такого пользователя не существует`);
      }
      res.status(200).send({ user })
    })
    .catch(err => res.status(500).send(`Ошибка сервера: ${err.message}`));
};

module.exports.createUser = (req, res) => {
  console.log(req.user._id);
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => { return res.status(201).send({ user }) })
    .catch(err => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: `Ошибка валидации: ${Object.values(err.errors).map((err) => err.message).join(", ")}`
        });
      }
      if (err.name === "CastError") {
        return res.status(400).send({
          message: `Невозможно преобразовать значение: ${Object.values(err.errors).map((err) => err.message).join(", ")}`
        });
      }
      res.status(500).send(`Ошибка сервера: ${err.message}`);
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true
  })
    .then(user => {
      if (!user) {
        return res.status(404).send(`Такого пользователя не существует`);
      }
      res.status(200).send({ user })
    })
    .catch(err => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: `Ошибка валидации: ${Object.values(err.errors).map((err) => err.message).join(", ")}`
        });
      }
      if (err.name === "CastError") {
        return res.status(400).send({
          message: `Невозможно преобразовать значение: ${Object.values(err.errors).map((err) => err.message).join(", ")}`
        });
      }
      res.status(500).send(`Ошибка сервера: ${err.message}`);
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then(user => {
      if (!user) {
        return res.status(404).send(`Такого пользователя не существует`);
      }
      res.status(200).send({ user })
    })
    .catch(err => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: `Ошибка валидации: ${Object.values(err.errors).map((err) => err.message).join(", ")}`
        });
      }
      if (err.name === "CastError") {
        return res.status(400).send({
          message: `Невозможно преобразовать значение: ${Object.values(err.errors).map((err) => err.message).join(", ")}`
        });
      }
      res.status(500).send(`Ошибка сервера: ${err.message}`);
    });
};