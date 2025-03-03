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
          default:"not entered"
          // required: true,
        },
        sku_name: {
          type: String,
          default:"not entered"
          // required: true,
        },
        stock_position: {
          type: String,
          default:"not entered"
          // required: true,
        },
        target_price: {
          type: String,
          default:"not entered"
          // required: true,
        },
        comments: {
          type: String,
        },
      },
    ],
    date: {
      type: String,
      default:"not entered"
      // required: true
    },
    time_slot: {
      type: String,
      default:"not entered"
      // required: true
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
