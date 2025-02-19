const express = require("express");
const Feedback = require("../Models/FeedbackSchema");
const Customer = require("../Models/CustomerSchema");
const Commodity = require("../Models/CommoditySchema");
const CommoditySku = require("../Models/SkuSchema");

const router = express.Router();

// POST API - Submit New Feedback
router.post("/add-feedback", async (req, res) => {
  try {
    const { customer_id, feedback, feedbacks, additional_comment } = req.body;

    // Validate required fields
    if (!customer_id || !feedback || !feedbacks) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate customer exists
    const customerExists = await Customer.findById(customer_id);
    if (!customerExists) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Validate feedbacks field
    let validatedFeedbacks = [];

    if (typeof feedbacks === "object") {
      const { commodity, sku_name, stock_position, target_price, comments } =
        feedbacks;

      if (
        !commodity ||
        !sku_name ||
        !stock_position ||
        target_price === undefined
      ) {
        return res
          .status(400)
          .json({ message: "Invalid feedback item structure" });
      }

      // Validate commodity exists
      const commodityExists = await Commodity.findById(commodity);
      if (!commodityExists) {
        return res
          .status(404)
          .json({ message: `Commodity not found: ${commodity}` });
      }

      // Validate SKU exists
      const skuExists = await CommoditySku.findById(sku_name);
      if (!skuExists) {
        return res.status(404).json({ message: `SKU not found: ${sku_name}` });
      }

      validatedFeedbacks.push({
        commodity,
        sku_name,
        stock_position,
        target_price,
        comments,
      });
    }

    // Create new feedback entry
    const newFeedback = new Feedback({
      customer_id,
      feedback,
      feedbacks: validatedFeedbacks,
      additional_comment,
    });

    await newFeedback.save();

    res.status(201).json({
      message: "Feedback submitted successfully",
      data: newFeedback,
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET API - Fetch All Feedbacks
router.get("/feedbacks", async (req, res) => {
  const customerId = req.query.customerId;
  try {
    const feedbacks = await Feedback.find({ customer_id: customerId });
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
