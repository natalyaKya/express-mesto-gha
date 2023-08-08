const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(helmet());
app.use(
  rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 40,
    message: 'Too many requests',
  }),
);
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '64cb0568c1ca60f021e4f603',
  };

  next();
});
app.use('/users', routerUser);
app.use('/cards', routerCard);
app.all('*', (req, res) => {
  res.status(404).send({
    message: 'Страница не найдена',
  });
});
app.listen(PORT);
