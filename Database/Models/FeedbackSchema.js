const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // ref: "Customer",
    },
    feedbacks: [
      {
        commodity: {
          type: String,
          required: true,
        },
        sku_name: {
          type: String,
          required: true,
        },
        stock_position: {
          type: String,
          required: true,
        },
        target_price: {
          type: String,
          required: true,
        },
        comments: {
          type: String,
        },
      },
    ],
    date: {
      type: String,
      required: true
    },
    time_slot: {
      type: String,
      required: true
    },
    additional_comment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Feedback", FeedbackSchema);
