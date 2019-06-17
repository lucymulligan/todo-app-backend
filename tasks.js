const serverless = require('serverless-http');
const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');

app.use(cors());
app.use(express.json());

// host will be the endpoint address or what machine am i connecting to
// user is master user - generally wouldn't do this - admin
// password is database password 
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "tasksdb1"
});
// using ? to sanitise the data
app.get("/tasks", function (request, response) {
  const username = request.query.username;
  let queryToExecute = "SELECT * FROM Tasks";
  if (username) {
    queryToExecute =
      "SELECT * FROM Task JOIN User on Tasks.UserId = User.UserId WHERE User.Username = " +
      connection.escape(username);
  }
  connection.query(queryToExecute, (error, queryResults) => {
    if (error) {
      console.log("Error fetching tasks", error);
      response.status(500).json({
        error: error
      });
    } else {
      response.json({
        tasks: queryResults
      });
    }
  });
});

app.post("/tasks", function (request, response) {

  const taskToBeSaved = request.body;

  connection.query('INSERT INTO Tasks SET ?', taskToBeSaved, function (error, results, fields) {
    if (error) {
      console.log("Error saving your task!", error);
      response.status(500).json({
        error: error
      });
    }
    else {
      response.json({
        TaskID: results.insertID
      });
    }
  });
});

app.delete("/tasks/:id", function (request, response) {

  const taskId = request.params.id;

  connection.query('DELETE FROM Tasks WHERE TaskID = ?', [taskId], function (error, results, fields) {
    if (error) {
      console.log("Task could not be deleted", error);
      response.status(500).json({
        error: error
      });
    }
    else {
      response.send(200);
      console.log('deleted ' + results.affectedRows + ' rows');
    }
  })
})

app.put("/tasks/:id", function (request, response) {

  const taskId = request.params.id;
  const completed = request.body.completed

  connection.query('UPDATE Tasks set completed = ? WHERE TaskID = ?', [completed, taskId], function (error, results, fields) {
    if (error) {
      console.log("Task could not be updated", error);
      response.status(500).json({
        error: error
      });
    }
    else {
      response.send(200);
      console.log('Updated' + results.affectedRows + ' task');
    }
  })
})

module.exports.handler = serverless(app);