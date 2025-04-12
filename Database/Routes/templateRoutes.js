const express = require("express");
const router = express.Router();
const PitchedPricing = require("../Models/template"); // adjust path as needed

router.post("/add-template", async (req, res) => {
  try {
    const {
      date ,
      shop_Name,
      shop_Number,
      Market,
      contact_Details,
      commodity_name,
      sku_name,
      fx,
      quantityPitched,
      transport_Expenses,
      unloading_Charges,
      unloading,
      payment_Terms
    } = req.body;

    // Optional: Validate required fields
    if (!shop_Name || !commodity_name || !sku_name || fx === undefined || quantityPitched === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newPricing = new PitchedPricing({
      date: date || undefined, // Optional formatting
      shop_Name,
      shop_Number,
      Market,
      contact_Details,
      commodity_name,
      sku_name,
      fx,
      quantityPitched,
      transport_Expenses,
      unloading_Charges,
      unloading,
      payment_Terms,
    });

    const savedPricing = await newPricing.save();
    res.status(201).json({ message: "Pitched pricing saved", data: savedPricing });
  } catch (error) {
    console.error("Error saving pitched pricing:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;