const express = require("express");
const OrderHistory = require("../Models/OrderHistorySchema");
const router = express.Router();

// GET: Fetch order details by unique contact
router.get("/orderhistory/:contact", async (req, res) => {
  const contactNumber = req.params.contact;
  try {
    const order = await OrderHistory.find({
      contact_details: req.params.contact,
    });
    if (!order) {
      return res.status(404).json({ error: "No order found for this contact" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST: Add a new order (Ensures unique contact)
router.post("/orderhistory", async (req, res) => {
  const {
    order_date,
    shop_name,
    buyer_name,
    market_name,
    contact_details,
    order_details,
    RM,
    delivery_status,
    delivery_date,
  } = req.body;

  if (
    !order_date ||
    !shop_name ||
    !buyer_name ||
    !contact_details ||
    !order_details ||
    !RM ||
    !delivery_status ||
    !delivery_date
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Check if contact already exists
    const existingOrder = await OrderHistory.findOne({ contact_details });
    if (existingOrder) {
      return res.status(400).json({ error: "Contact already exists" });
    }

    const newOrder = new OrderHistory({
      order_date,
      shop_name,
      buyer_name,
      market_name,
      contact_details,
      order_details,
      RM,
      delivery_status,
      delivery_date,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
