const mongoose = require('mongoose');
const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const updateTopGames = require('./scripts/updateTopGames');

const app = express();
const port = 8080;
const uri = 'mongodb://localhost:27017/test';

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type"]
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Conexión a MongoDB exitosa');

  // Run updateTopGames immediately on startup
  updateTopGames().catch(error => {
    console.error('Initial actualizarMétricas failed:', error.message);
  });

  // Schedule updateTopGames every 10 seconds
  setInterval(async () => {
    try {
      await updateTopGames();
    } catch (error) {
      console.error('Scheduled actualizarMétricas failed:', error.message);
    }
  }, 10 * 1000); // 10 seconds in milliseconds

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  const users = require('./views/users');
  const games = require('./views/games');
  const topGames = require('./views/topGames');
  const votaciones = require('./views/votaciones');

  app.use('/users', users);
  app.use('/games', games);
  app.use('/topGames', topGames);
  app.use('/votaciones', votaciones);

  app.listen(port, () => {
    console.log(`Servidor backend escuchando en http://localhost:${port}`);
  });
})
.catch(error => {
  console.error('Fallo en la conexión a MongoDB:', error);
  process.exit(1);
});

module.exports = app;