const Card = require('../models/card');

const {
  CastError,
  NotFoundError,
  ServerError,
} = require('../utils/utils');

module.exports.returnCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ card }))
    .catch(res.status(ServerError).send({
      message: 'На сервере произошла ошибка',
    }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => { res.status(201).send({ card }); })
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

module.exports.deleteCardBiId = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(CastError).send({
          message: 'Некорректное ID карточки',
        });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NotFoundError).send({
          message: `Карточка с таким _id ${req.params.userId} не найдена`,
        });
      }
      return res.status(ServerError).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail()
    .then((card) => {
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(CastError).send({
          message: 'Некорректное ID карточки',
        });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NotFoundError).send({
          message: `Карточка с таким _id ${req.params.userId} не найдена`,
        });
      }
      return res.status(ServerError).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(CastError).send({
          message: 'Некорректное ID карточки',
        });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NotFoundError).send({
          message: `Карточка с таким _id ${req.params.userId} не найдена`,
        });
      }
      return res.status(ServerError).send({
        message: 'На сервере произошла ошибка',
      });
    });
};
