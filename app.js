const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const {
  login,
  createUser,
} = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(
  rateLimit({
    windowMs: 40 * 60 * 1000,
    max: 70,
    message: 'Too many requests',
  }),
);
app.use(helmet());
app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri().regex(/^http(s)?:\/\/(w{3}\.)?[\w\-._~:/?#[\]@!$&'()*+,;=](#)?/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
  }),
}), createUser);
app.use(cookieParser());
app.use(auth);
app.use('/users', routerUser);
app.use('/cards', routerCard);
app.all('*', () => {
  throw new NotFoundError('Страница не найдена');
});
app.use(errors());
app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  next();
});
app.listen(PORT);
