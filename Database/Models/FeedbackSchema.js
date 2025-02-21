const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // ref: "Customer",
    },
    feedback: {
      type: String,
      required: true,
    },
    feedbacks: [
      {
        commodity: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Commodity",
          required: true,
        },
        sku_name: {
          type: mongoose.Schema.Types.ObjectId,
          ref:"CommoditySku",
          required: true,
        },
        stock_position: { 
          type: String,
          required: true,
        },
        target_price: {
          type: String,
          // required: true,
        },
        comments: {
          type: String,
        },
      },
    ],
    additional_comment: {
      type: String,
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Feedback", FeedbackSchema);
