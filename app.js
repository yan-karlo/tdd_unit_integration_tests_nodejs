const express = require('express');
const app = express();
const todoRoutes = require('./routes/todo.routes');
const mongodb = require('./mongoDB/mongodb.connector');

mongodb.connect();

app.use(express.json());
app.use('/todos', todoRoutes);
app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
})


module.exports = app