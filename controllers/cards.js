const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-err');
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
    .catch(next);
};

module.exports.deleteCardBiId = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError(`Карточка с таким _id ${req.params.cardId} не найдена`))
    .then((card) => {
      if (JSON.stringify(req.user._id) !== JSON.stringify(card.owner)) {
        return next(new ForbiddenError('Пользователь не может  удалять карточки других пользователей'));
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .then(() => {
          res.send({ data: card });
        })
        .cath(next);
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
    .orFail(new NotFoundError(`Карточка с таким _id ${req.params.userId} не найдена`))
    .then((card) => {
      res.send({ card });
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError(`Карточка с таким _id ${req.params.userId} не найдена`))
    .then((card) => {
      res.send({ card });
    })
    .catch(next);
};
