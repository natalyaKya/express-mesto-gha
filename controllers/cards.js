const Card = require('../models/card');

module.exports.returnCards = (req, res) => {

  Card.find({})
    .then(card => res.status(200).send({ card }))
    .catch(err => res.status(500).send(`Ошибка сервера: ${err.message}`));
};

module.exports.createCard = (req, res) => {

  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then(card => { return res.status(201).send({ card }) })
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

module.exports.deleteCardBiId = (req, res) => {
  Card.findByIdAndRemove(req.params.userId)
    .orFail()
    .then(card => {
      if (!card) {
        return res.status(404).send(`Такой карточки не существует`);
      }
      res.status(200).send({ data: card })
    })
    .catch(err => {
      if (err.name === "CastError") {
        return res.status(400).send({
          message: `Некорректное ID карточки:  ${err.message}`
        });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({
          message: `Карточка с таким _id ${req.params.userId} не найдена`
        });
      }
      res.status(500).send(`Ошибка сервера: ${err.message}`);
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
      runValidators: true
    },
  )
    .orFail()
    .then(card => {
      if (!card) {
        return res.status(404).send(`Такой карточки не существует`);
      }
      res.status(200).send({ card })
    })
    .catch(err => {
      if (err.name === "CastError") {
        return res.status(400).send({
          message: `Некорректное ID карточки:  ${err.message}`
        });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({
          message: `Карточка с таким _id ${req.params.userId} не найдена`
        });
      }
      res.status(500).send(`Ошибка сервера: ${err.message}`);
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then(card => {
      if (!card) {
        return res.status(404).send(`Такой карточки не существует`);
      }
      res.status(200).send({ card })
    })
    .catch(err => {
      if (err.name === "CastError") {
        return res.status(400).send({
          message: `Некорректное ID карточки:  ${err.message}`
        });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({
          message: `Карточка с таким _id ${req.params.userId} не найдена`
        });
      }
      res.status(500).send(`Ошибка сервера: ${err.message}`);
    });
}





