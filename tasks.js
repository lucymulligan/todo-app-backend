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

app.get("/tasks", function(request, response) {
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

app.post("/tasks", function(request, response) {
  
  const taskToBeSaved = request.body;

  connection.query('INSERT INTO Task SET ?', taskToBeSaved, function (error, results, fields) {
    if (error) {
      console.log("Error saving your task!", err);
      response.status(500).json({
        error: err
      });
    } 
    else { 
      response.json({
        TaskID: results.insertID
      });
    }
  });
});


module.exports.handler = serverless(app);