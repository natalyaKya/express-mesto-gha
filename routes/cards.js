const routerCard = require('express').Router();
const { returnCards, createCard, deleteCardBiId, likeCard, dislikeCard } = require('../controllers/cards');

routerCard.get('/', returnCards);
routerCard.post('/', createCard);
routerCard.delete('/:cardId', deleteCardBiId);
routerCard.put('/:cardId/likes', likeCard);
routerCard.delete('/:cardId/likes', dislikeCard);

module.exports = routerCard;