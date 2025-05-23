// models/PitchedPricing.js
const mongoose = require("mongoose");

const pitchedPricingSchema = new mongoose.Schema({
    date: { type: String, },
    time: { type: String, },
    shop_Name: String,
    buyer_Name: String,
    shop_Number: String,
    Market : String,
    contact_Details: [{ type: Number }],
    // Updated field to store all SKU/commodity data
    commoditySkuDetails: [
      {
        commodity_name: String,
        sku_name: String,
        fx: String,
        quantityPitched: String,
      }
    ],
    transport_Expenses: { type: String },
    unloading_Charges: { type: String },
    unloading: { type: String },
    payment_Terms: { type: String },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PitchedPricing", pitchedPricingSchema);