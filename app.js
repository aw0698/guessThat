const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Connect Database
mongoose.connect('mongodb://localhost/guessThat', {useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;

// Check connection
db.once('open', function() {
  console.log("Connected to MongoDB");
});

// Check for DB errors
db.on('error', function(err) {
  console.log(err);
});

// Init App
const app = express();

// Body Parser Middleware
// parse application/json
app.use(bodyParser.json());

// Bring in Models
let Users = require('./models/user');

// Home Route
app.get('/', function(req,res){
  res.send("Hello World");
});

// Route Files
let users = require('./routes/users');
app.use('/users', users);

// Start Server
app.listen(3002, function(){
  console.log("Server started on port 3002...");
});