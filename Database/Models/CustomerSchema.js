const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    shop_name: {
      type: String,
      required: true,
      trim: true,
    },
    owner_name: {
      type: String,
      trim: true,
    },
    shop_number: {
      type: Number,
      min: 0,
    },
    shop_address: {
      type: String,
      required: true,
    },
    market_id: {
        type:String
    },
    contact_1: {
      type: Number,
      required: true,
      unique: true,
      minlength: 10,
      maxlength: 10,
    },
    contact_2: {
      type: String,
      minlength: 10,
      maxlength: 10,
    },
    contact_3: {
      type: String,
      minlength: 10,
      maxlength: 10,
    },
    gst_number: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", CustomerSchema);
