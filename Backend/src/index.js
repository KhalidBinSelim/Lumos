const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;


// const userHandler = require('./module/user/user.controller');

// Middleware to parse JSON
app.use(express.json());

app.use(cors());
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });


// app.use('/user', userHandler);


// Basic Route
app.get('/', (req, res) => {
  res.send('Express backend is running!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


module.exports = app;