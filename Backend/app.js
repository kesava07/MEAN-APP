const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

mongoose.connect("mongodb+srv://kesava07:14NGEVtjf1tmLkWe@cluster0-wx6ar.mongodb.net/node-angular")
  .then(() => {
    console.log("Connected..!")
  }).catch(() => {
    console.log("Problem while connecting")
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('Backend/images')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
});

app.use('/api/posts', require('./routes/posts'));
app.use('/api/user', require('./routes/user'));


module.exports = app;
