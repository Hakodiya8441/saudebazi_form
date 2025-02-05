const mongoose = require("mongoose");

const skuSchema = new mongoose.Schema(
  {
    sku_code: {
      type: String,
      required: true,
      unique: true, 
    },
    sku_name: {
      type: String,
      required: true,
    },
    min_bag_price: {
      type: Number,
      required: true,
      min: 0, 
    },
    max_bag_price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true, 
  }
);


module.exports = mongoose.model("Sku", skuSchema);
