const express = require("express");
const CommoditySkuPricing = require("../Models/priceModal");
const Order = require("../Models/order");
const router = express.Router();
const axios = require("axios");


// POST API - Add new SKU pricing
router.post("/pricegenerate", async (req, res) => {
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

    const existingSku = await CommoditySkuPricing.findOne({
      sku_code,
      commodity_name,
    });
    if (existingSku) {
      return res.status(400).json({ message: "SKU already exists" });
    }

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

    res.status(201).json({ message: "Pricing added successfully", data: newSku });
  } catch (error) {
    console.error("Error adding pricing:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PATCH API - Update SKU pricing
router.get("/test/pricegenerate", async (req, res) => {
  console.log(req.query);
  try {
    const { commodity_name, sku_name, contact } = req.query;

    if (!commodity_name || !sku_name || !contact) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    // Fetch pricing details
    const pricingData = await CommoditySkuPricing.findOne({ commodity_name, sku_name });
    if (!pricingData) {
      return res.status(404).json({ message: "Pricing details not found" });
    }

    const max = pricingData.max_bag_price;
    const min = pricingData.min_bag_price;
    const finalPrice = max;

    if (finalPrice === null) {
      return res.status(400).json({ message: "Quantity is below minimum threshold" });
    }

    const response = await axios.get(`http://localhost:5000/api/${contact}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer saudebazi`,
      },
    });

    const orders = response.data.orders || [];

    const filteredOrders = orders.filter(order =>
      order.Commodity.toLowerCase() === commodity_name.toLowerCase() &&
      order.SKU.toLowerCase() === sku_name.toLowerCase()
    );

    console.log(filteredOrders)

    const totalInterestCredit = filteredOrders.reduce((sum, order) => {
      return sum + (parseFloat(order.intrest_credit) || 0);
    }, 0);

    // const totalAOV = filteredOrders.reduce((sum, order) => {
    //   return sum + (parseFloat(order.AOV) || 0);
    // }, 0);
     // Total AOV from first order's 'SUM_of_Total_Transaction_value ' field
     let totalTrasactionValue = 0;
     if (filteredOrders.length > 0) {
       totalTrasactionValue = parseFloat(filteredOrders[0]['SUM_of_Total_Transaction_value ']) || 0;
     }
    //  console.log("Total AOV:", totalTrasactionValue);

     const noOfOrders= filteredOrders[0]?.No_of_Order || filteredOrders.length;
    //  console.log("No of Orders:", noOfOrders);

     totalAOV = totalTrasactionValue / noOfOrders;

     console.log("Total AOV:", totalAOV);

    const totalKg = filteredOrders[0].Total_Kg;
    console.log("Total Kg:", totalKg);

    const volumeDiscount = (max - min) / totalKg;
    const fx = max + totalInterestCredit - volumeDiscount;

    const quantity_Pitched = totalAOV / (fx * 30);

    let pitchedPayload = {};

    if (filteredOrders.length > 0) {
      const firstOrder = filteredOrders[0];
      const date = new Date(firstOrder.Date);
      const localDateString = date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      });

      pitchedPayload = {
        date: localDateString,
        shop_Name: firstOrder.Shop_Name,
        buyer_Name: firstOrder.Buyer_Name || "",
        shop_Number: firstOrder.Shop_Number || "",
        Market: firstOrder.Market || "",
        contact_Details: [contact],
        commodity_name,
        sku_name,
        fx: `${Math.round(fx)} Rs/kg`,
        quantityPitched: `${Math.round(quantity_Pitched + 1)} bag(s)`,
        transport_Expenses: firstOrder.Transport_Expenses || "",
        unloading_Charges: firstOrder.Unloading_Charges || "",
        unloading: firstOrder.Unloading || "",
        payment_Terms: firstOrder.Payment_Terms || ""
      };

      console.log("Payload for pitched pricing:", pitchedPayload);

      try {
        const postResponse = await axios.post(
          `http://localhost:5000/api/add-template`,
          pitchedPayload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer saudebazi`,
            },
          }
        );
        console.log("PitchedPricing saved:", postResponse.data);
      } catch (postError) {
        console.error("Failed to POST to /add-template:", postError.message);
      }
    }

    res.json({
      pitchedPayload,
    });

  } catch (error) {
    console.error("Error fetching pricing:", error.message);

    if (error.response) {
      return res.status(error.response.status).json({
        message: error.response.data.message || "Error from internal API",
      });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;
