const mongoose = require("mongoose");

const OrderHistorySchema = new mongoose.Schema({
  order_date: { type: String, required: true },
  shop_name: { type: String, required: true },
  buyer_name: { type: String, required: true },
  market_name: { type: String, required: true },
  contact_details: { type: Number, unique: true, required: true },
  order_details: { type: String, required: true },
  RM: { type: String, required: true },
  delivery_status: { type: String, required: true },
  delivery_date: { type: String, required: true },
});

const OrderHistory = mongoose.model("OrderHistory", OrderHistorySchema);

module.exports = OrderHistory;
