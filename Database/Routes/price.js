const express = require("express");
const CommoditySkuPricing = require("../Models/priceModal");
const Order = require("../Models/order");
// const calculateInterestCredit = require("../Routes/DiscountCalculated")
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

// function calculateInterestCredit(days) {
//   const rates = [
//     { limit: 0, rate: 0 },
//     { limit: 5, rate: 0.50 },
//     { limit: 10, rate: 1 },
//     { limit: 15, rate: 1.50 },
//     { limit: 20, rate: 2 },
//     { limit: 25, rate: 2.50 },
//     { limit: 30, rate: 3 },
//   ];
//   const rate = rates.find(slab => days <= slab.limit)?.rate || rates[rates.length - 1].rate;
//   return days * rate;
// }


function calculateInterestCredit(days) {
  let rate = 0;
  if (days >= 0 && days <= 5) {
    rate = 0.25;
  } else if (days >= 6 && days <= 10) {
    rate = 0.50;
  } else if (days >= 11 && days <= 15) {
    rate = 1;
  } else if (days >= 16 && days <= 20) {
    rate = 1.5;
  } else {
    rate = 2; // default for >20 days
  }
  return days * rate;
}
// Working
router.get("/test/pricegenerate", async (req, res) => {
  console.log(req.query);

  try {
    let { commodity_name, sku_name, contact } = req.query;

    if (!contact) {
      return res.status(400).json({ message: "Missing contact parameter" });
    }

    const response = await axios.get(`http://localhost:5000/api/${contact}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer saudebazi`,
      },
    });

    const orders = response.data.orders || [];
    // console.log("Orders:", orders);

    // Try to extract first relevant order
    let firstOrder = orders.find(order =>
      (!commodity_name || order.Commodity?.toLowerCase() === commodity_name.toLowerCase()) &&
      (!sku_name || order.SKU?.toLowerCase() === sku_name.toLowerCase())
    );

    // If not found, fallback to first order
    if (!firstOrder && orders.length > 0) {
      firstOrder = orders[0];
      console.warn("No specific match found. Using fallback order:", firstOrder);
    }

    if (!firstOrder) {
      return res.status(404).json({ message: "No relevant orders found" });
    }

    // Set default values from firstOrder if not provided
    commodity_name = commodity_name || firstOrder.Commodity;
    sku_name = sku_name || firstOrder.SKU;

    // Fetch pricing data
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

    let filteredOrders = orders.filter(order =>
      order.Commodity?.toLowerCase() === commodity_name.toLowerCase() &&
      order.SKU?.toLowerCase() === sku_name.toLowerCase()
    );

    if (filteredOrders.length === 0) {
      filteredOrders = [firstOrder];
    }

    const totalInterestCredit = filteredOrders.reduce((sum, order) => {
      return sum + (parseFloat(order.Credit_intrest) || 0);
    }, 0);
    const totalInterest = calculateInterestCredit(totalInterestCredit);
console.log("Total Credit Days:", totalInterestCredit);

console.log("Total Interest Credit (in ₹):", totalInterest);

    // const totalintrest = calculateInterestCredit(totalInterestCredit,);
    // console.log("Total Interest Credit:", totalintrest);



    const totalTrasactionValue = parseFloat(firstOrder['SUM_of_Total_Transaction_value '] || 0);
    const noOfOrders = firstOrder?.No_of_Order || filteredOrders.length || 1;

    let totalAOV = totalTrasactionValue / noOfOrders;
    if (isNaN(totalAOV)) totalAOV = 0;

    const totalKg = firstOrder.Total_Kg ? orders[0].Total_Kg : 1; // Default to 1 to avoid division by 0
    console.log("Total Kg:", totalKg);

    const volumeDiscount = (max - min) / totalKg;
   const  newvolume = volumeDiscount + 1;
    console.log("Volume Discount:", newvolume);
    const fx = max + totalInterest - newvolume;
    console.log("FX:", Math.round(fx));
    const quantity_Pitched = totalAOV / (fx * 30);
    console.log("Quantity Pitched:", Math.round(quantity_Pitched + 1));

    // const date = new Date();
    // const localDateString = date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const currentDate = new Date();
const orderDate = firstOrder?.Date ? new Date(currentDate) : currentDate;

const localDateString = orderDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    const pitchedPayload = {
      date: localDateString ,
      shop_Name: firstOrder.Shop_Name ? orders[0].Shop_Name : "",
      buyer_Name: firstOrder.Buyer_Name ? orders[0].Buyer_Name : "",
      shop_Number: firstOrder.Shop_Number ? orders[0].Shop_Number : "",
      Market: firstOrder.Market ? orders[0].Market : "",
      contact_Details: [contact] ,
      commodity_name: commodity_name ,
      sku_name : sku_name ,
      fx: `${Math.round(fx)} Rs/kg`,
      quantityPitched: `${Math.round(quantity_Pitched + 1)} bag(s)`,
      transport_Expenses: firstOrder.Transport_Expenses || "",
      unloading_Charges: firstOrder.Unloading_Charges || "",
      unloading: firstOrder.Unloading || "",
      // payment_Terms: firstOrder.Payment_Terms || ""
      payment_Terms: "Cash"
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

    res.json({ pitchedPayload });

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
