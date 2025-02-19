const express = require("express");
const CommoditySkuPricing = require("../Models/CommodityPricingSchema");
const router = express.Router();

// POST API - Add new SKU pricing
router.post("/pricing", async (req, res) => {
  try {
    const {
      sku_code,
      commodity_name,
      sku_name,
      min_bag_price,
      max_bag_price,
      min_bag_quantity,
      max_bag_quantity,
    } = req.body;

    // Validate input fields
    if (
      !sku_code ||
      !commodity_name ||
      !sku_name ||
      min_bag_price === undefined ||
      max_bag_price === undefined ||
      !min_bag_quantity ||
      !max_bag_quantity
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (min_bag_price < 0 || max_bag_price < 0) {
      return res.status(400).json({ message: "Prices must be non-negative" });
    }

    if (min_bag_price > max_bag_price) {
      return res.status(400).json({
        message: "min_bag_price cannot be greater than max_bag_price",
      });
    }

    // Check if SKU already exists
    const existingSku = await CommoditySkuPricing.findOne({
      sku_code,
      commodity_name,
    });
    if (existingSku) {
      return res.status(400).json({ message: "SKU already exists" });
    }

    // Create new SKU pricing entry
    const newSku = new CommoditySkuPricing({
      sku_code,
      commodity_name,
      sku_name,
      min_bag_price,
      max_bag_price,
      min_bag_quantity,
      max_bag_quantity,
    });

    await newSku.save();

    res
      .status(201)
      .json({ message: "Pricing added successfully", data: newSku });
  } catch (error) {
    console.error("Error adding pricing:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PATCH API - Update SKU pricing
router.patch("/pricing/:sku_code", async (req, res) => {
  try {
    const { sku_code } = req.params;
    const { min_bag_price, max_bag_price } = req.body;

    // Validate input
    if (min_bag_price !== undefined && min_bag_price < 0) {
      return res
        .status(400)
        .json({ message: "min_bag_price must be non-negative" });
    }

    if (max_bag_price !== undefined && max_bag_price < 0) {
      return res
        .status(400)
        .json({ message: "max_bag_price must be non-negative" });
    }

    if (
      min_bag_price !== undefined &&
      max_bag_price !== undefined &&
      min_bag_price > max_bag_price
    ) {
      return res.status(400).json({
        message: "min_bag_price cannot be greater than max_bag_price",
      });
    }

    // Find and update the SKU pricing
    const updatedSku = await CommoditySkuPricing.findOneAndUpdate(
      { sku_code },
      { $set: { min_bag_price, max_bag_price } },
      { new: true, runValidators: true }
    );

    if (!updatedSku) {
      return res.status(404).json({ message: "SKU not found" });
    }

    res.json({ message: "Pricing updated successfully", data: updatedSku });
  } catch (error) {
    console.error("Error updating pricing:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET API - Fetch SKU pricing and apply dynamic pricing formula
router.get("/pricing", async (req, res) => {
  try {
    const { commodity_name, sku_name, bag } = req.query;

    if (!commodity_name || !sku_name || !bag) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    // Fetch pricing details based on commodity and SKU
    const pricingData = await CommoditySkuPricing.findOne({
      commodity_name,
      sku_name,
    });

    if (!pricingData) {
      return res.status(404).json({ message: "Pricing details not found" });
    }

    function calculatePrice(quantity) {
      const maximumBagPrice = pricingData.max_bag_price;
      const minimumBagPrice = pricingData.min_bag_price;
      const minimumBagQuantity = pricingData.min_bag_quantity;
      const maximumBagQuantity = pricingData.max_bag_quantity;

      if (quantity < minimumBagQuantity) return;
      // Apply dynamic pricing formula
      // Change in bags
      const changeInQuantity = Math.abs(parseInt(quantity) - maximumBagQuantity);
      //   Change in price
      const changeInPrice =
        (maximumBagPrice - minimumBagPrice) /
        (maximumBagQuantity - minimumBagQuantity);
      // Final Price
      const price = (
        minimumBagPrice +
        (changeInQuantity * changeInPrice)
      ).toFixed(2);
      return price;
    }

    const finalPrice = calculatePrice(bag);

    res.json({
      commodity_name,
      sku_name,
      bag_quantity: bag,
      calculated_price: finalPrice,
    });
  } catch (error) {
    console.error("Error fetching pricing:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
