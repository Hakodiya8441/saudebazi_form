const express = require("express");
const mongoose = require("mongoose");
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
    if (!customer_id || !feedback || !feedbacks || !Array.isArray(feedbacks)) {
      return res.status(400).json({ message: "Missing required fields or feedbacks must be an array" });
    }

    // Validate customer ID format
    if (!mongoose.Types.ObjectId.isValid(customer_id)) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }

    // Validate customer exists
    const customerExists = await Customer.findById(customer_id);
    if (!customerExists) {
      return res.status(404).json({ message: "Customer not found" });
    }

    let validatedFeedbacks = [];

    for (const item of feedbacks) {
      const { commodity, sku_name, stock_position, target_price, comments } = item;

      if (!commodity || !sku_name || !stock_position || target_price === undefined) {
        return res.status(400).json({ message: "Invalid feedback item structure" });
      }

      // Validate commodity and SKU IDs
      if (!mongoose.Types.ObjectId.isValid(commodity) || !mongoose.Types.ObjectId.isValid(sku_name)) {
        return res.status(400).json({ message: "Invalid commodity or SKU ID" });
      }

      // Validate commodity and SKU exist
      const [commodityExists, skuExists] = await Promise.all([
        Commodity.findById(commodity),
        CommoditySku.findById(sku_name),
      ]);

      if (!commodityExists) {
        return res.status(404).json({ message: `Commodity not found: ${commodity}` });
      }

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
  try {
    const customerId = req.query.customerId;

    // Validate customer ID if provided
    if (customerId && !mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }

    const filter = customerId ? { customer_id: customerId } : {};

    const feedbacks = await Feedback.find(filter);
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
