const serverless = require('serverless-http');
const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');

app.use(cors());

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
  connection.query(queryToExecute, (err, queryResults) => {
    if (err) {
      console.log("Error fetching tasks", err);
      response.status(500).json({
        error: err
      });
    } else {
      response.json({
        tasks: queryResults
      });
    }
  });
});

module.exports.handler = serverless(app);