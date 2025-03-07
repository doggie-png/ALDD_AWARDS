/*var http = require("http");
http.createServer(function (request, response) {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Hola Mundo!\n");
  }).listen(8080);
console.log("Servidor en la url http://127.0.0.1:8080/");
*/
const mongoose = require('mongoose');
const uri = 'mongodb://localhost:27017/test';
const express = require('express'); const app = express(); const port = 8080;
const bodyParser = require('body-parser');
// support parsing of application/json type post data
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    app.use(bodyParser.json());
    //support parsing of application/x-www-form-urlencoded post data
    app.use(bodyParser.urlencoded({ extended: true }));
    app.get('/', (req, res) => {
      res.send('Hello World!')
    })
    const users = require('./views/users')
    app.use('/users', users)
    
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
      })
  .catch(error => {
    console.error('Connection fail', error);
  });