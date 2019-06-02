const serverless = require('serverless-http');
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

app.get('/tasks', function (request, response) {

  const username = request.query.username;

  const someJson = {
    tasks: [
      {task: "buy some milk", completed: false, id: 1},
      {task: "walk the dog", completed: true, id: 2},
      {task: "go for a walk", completed: false, id: 3}
    ]
  };
  response.json(someJson);
})

module.exports.handler = serverless(app);