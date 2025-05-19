const mongoose = require('mongoose');
const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express();
const port = 8080;
const uri = 'mongodb://localhost:27017/test';

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Conexión a MongoDB exitosa');

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  const users = require('./views/users');
  const games = require('./views/games');
  const topGames = require('./views/topGames');

  app.use('/users', users);
  app.use('/games', games);
  app.use('/topGames', topGames);

  app.listen(port, () => {
    console.log(`Servidor backend escuchando en http://localhost:${port}`);
  });
})
.catch(error => {
  console.error('Fallo en la conexión a MongoDB:', error);
});
