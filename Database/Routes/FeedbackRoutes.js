const express = require("express");
const Feedback = require("../Models/FeedbackSchema");
const Customer = require("../Models/CustomerSchema");
const Commodity = require("../Models/CommoditySchema");
const CommoditySku = require("../Models/SkuSchema");

const router = express.Router();

// POST API - Submit New Feedback
router.post("/add-feedback", async (req, res) => {
  try {
    console.log("Incoming Request Body:", req.body);
    const { customer_id, feedback, feedbacks, additional_comment } = req.body;

    // Validate required fields
    if (!customer_id || !feedback || !Array.isArray(feedbacks) || feedbacks.length === 0) {
      return res.status(400).json({ message: "Missing required fields or feedbacks should be an array" });
    }

    // Validate customer exists
    const customerExists = await Customer.findById(customer_id);
    if (!customerExists) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Validate feedbacks array
    let validatedFeedbacks = [];

    for (let item of feedbacks) {
      const { commodity, sku_name, stock_position, target_price, comments } = item;

      if (!commodity || !sku_name || stock_position === undefined || target_price === undefined) {
        return res.status(400).json({ message: "Invalid feedback item structure" });
      }

      // Validate commodity exists
      const commodityExists = await Commodity.findById(commodity);
      if (!commodityExists) {
        return res.status(404).json({ message: `Commodity not found: ${commodity}` });
      }

      // Validate SKU exists
      const skuExists = await CommoditySku.findById(sku_name);
      if (!skuExists) {
        return res.status(404).json({ message: `SKU not found: ${sku_name}` });
      }

      validatedFeedbacks.push({ commodity, sku_name, stock_position, target_price, comments });
    }

    // Create new feedback entry
    const newFeedback = new Feedback({
      customer_id,
      feedback,
      feedbacks: validatedFeedbacks,
      additional_comment,
    });

    const savedFeedback = await newFeedback.save();

    console.log("Saved Feedback:", savedFeedback);

    res.status(201).json({
      message: "Feedback submitted successfully",
      data: savedFeedback,
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET API - Fetch All Feedbacks
router.get("/feedbacks", async (req, res) => {
  try {
    const customerId = req.query.customerId;
    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    const feedbacks = await Feedback.find({ customer_id: customerId });
    
    if (feedbacks.length === 0) {
      return res.status(404).json({ message: "No feedback found for this customer" });
    }

    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
