const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/users');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use('/users', router);

app.listen(3000);
