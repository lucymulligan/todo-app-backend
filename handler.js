const serverless = require('serverless-http');
const express = require('express');
const app = express();

app.get('/tasks', function (request, response) {

  const username = request.query.username;

  const someJson = {
    message: "Hello " + username + ", how are you?"
  };
  response.json(someJson);
})

module.exports.handler = serverless(app);