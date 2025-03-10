require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.DEV_MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

  