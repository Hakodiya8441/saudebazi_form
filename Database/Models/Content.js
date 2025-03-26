const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  serialNo: { type: Number, required: true },
  image: { type: String, required: true },
  heading: { type: String, required: true },
  content: { type: String, required: true },
}
, {
    timestamps: true,
  });

module.exports = mongoose.model('Content', contentSchema);