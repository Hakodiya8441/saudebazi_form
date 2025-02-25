const express = require("express");
const Feedback = require("../Models/FeedbackSchema");
const Customer = require("../Models/CustomerSchema");
const Commodity = require("../Models/CommoditySchema");
const CommoditySku = require("../Models/SkuSchema");
const OrderHistory = require("../Models/OrderHistorySchema");

const router = express.Router();

// POST API - Submit New Feedback
router.post("/add-feedback", async (req, res) => {
  try {
    console.log("Incoming Request Body:", req.body);
    const { customer_id, feedback, feedbacks, date, time_slot, additional_comment } = req.body;

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
      // const commodityExists = await Commodity.find({ commodity_name: commodity });
      // if (!commodityExists) {
      //   return res.status(404).json({ message: `Commodity not found: ${commodity}` });
      // }

      // Validate SKU exists
      // const skuExists = await CommoditySku.find({ sku_name });
      // if (!skuExists) {
      //   return res.status(404).json({ message: `SKU not found: ${sku_name}` });
      // }

      validatedFeedbacks.push({ commodity, sku_name, stock_position, target_price, comments });
    }

    // Check if the customer already has feedback
    const existingFeedback = await Feedback.findOne({ customer_id });

    if (existingFeedback) {
      // Update existing feedback by pushing new feedbacks into the array
      const updatedFeedback = await Feedback.findOneAndUpdate(
        { customer_id },
        {
          $push: { feedbacks: { $each: validatedFeedbacks } },
          $set: { additional_comment: additional_comment || existingFeedback.additional_comment }
        },
        { new: true }
      );

      console.log("Updated Feedback:", updatedFeedback);
      return res.status(200).json({
        message: "Feedback updated successfully",
        data: updatedFeedback,
      });
    } else {
      // Create a new feedback entry if customer has no previous feedback
      const newFeedback = new Feedback({
        customer_id,
        feedback,
        feedbacks: validatedFeedbacks,
        date,
        time_slot,
        additional_comment,
      });

      const savedFeedback = await newFeedback.save();
      console.log("New Feedback Saved:", savedFeedback);
      console.log(req.body)
      return res.status(201).json({
        message: "Feedback submitted successfully",
        data: savedFeedback,
      });
    }
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET API - Join OrderHistory, Customers, and Feedbacks
router.get("/ordersfeedback/:contact", async (req, res) => {
  try {
    const contactNumber = req.params.contact;

    // 1️⃣ Find Customer from OrderHistory (using contact details)
    const customer = await Customer.findOne({
      $or: [
        { contact_1: contactNumber },
        { contact_2: contactNumber },
        { contact_3: contactNumber }
      ]
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found in the database." });
    }

    // 2️⃣ Find Feedback using customer_id
    const feedbackData = await Feedback.findOne({ customer_id: customer._id });

    if (!feedbackData) {
      return res.status(404).json({ message: "No feedback found for this customer." });
    }

    // 3️⃣ Return only the feedbacks array
    return res.status(200).json({
      feedbacks: feedbackData.feedbacks
    });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;