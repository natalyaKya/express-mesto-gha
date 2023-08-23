const Card = require('../models/card');

const CastError = require('../errors/cast-err');
const NotFoundError = require('../errors/not-found-err');
const ServerError = require('../errors/server-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.returnCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ card }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => { res.status(201).send({ card }); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new CastError('Ошибка валидации');
      }
      throw new ServerError('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.deleteCardBiId = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => {
      if (JSON.stringify(req.user._id) !== JSON.stringify(card.owner)) {
        return next(new ForbiddenError('Пользователь не может  удалять карточки других пользователей'));
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new CastError('Некорректное ID карточки');
      }
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError(`Карточка с таким _id ${req.params.cardId} не найдена`);
      }
      throw new ServerError('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
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
        throw new CastError('Некорректное ID карточки');
      }
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError(`Карточка с таким _id ${req.params.userId} не найдена`);
      }
      throw new ServerError('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
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
        throw new CastError('Некорректное ID карточки');
      }
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError(`Карточка с таким _id ${req.params.userId} не найдена`);
      }
      throw new ServerError('На сервере произошла ошибка');
    })
    .catch(next);
};
