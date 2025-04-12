const express = require("express");
const CommoditySkuPricing = require("../Models/priceModal");
const Order = require("../Models/order");
const router = express.Router();
const axios = require("axios");

// POST API - Add new SKU pricing
// router.post("/pricegenerate", async (req, res) => {
//   try {
//     const {
//       sku_code,
//       commodity_name,
//       sku_name,
//       min_bag_price,
//       max_bag_price,
//       min_bag_quantity,
//       max_bag_quantity,
//     } = req.body;

//     if (
//       !sku_code ||
//       !commodity_name ||
//       !sku_name ||
//       min_bag_price === undefined ||
//       max_bag_price === undefined ||
//       !min_bag_quantity ||
//       !max_bag_quantity
//     ) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     if (min_bag_price < 0 || max_bag_price < 0) {
//       return res.status(400).json({ message: "Prices must be non-negative" });
//     }

//     if (min_bag_price > max_bag_price) {
//       return res.status(400).json({
//         message: "min_bag_price cannot be greater than max_bag_price",
//       });
//     }

//     const existingSku = await CommoditySkuPricing.findOne({
//       sku_code,
//       commodity_name,
//     });
//     if (existingSku) {
//       return res.status(400).json({ message: "SKU already exists" });
//     }

//     const newSku = new CommoditySkuPricing({
//       sku_code,
//       commodity_name,
//       sku_name,
//       min_bag_price,
//       max_bag_price,
//       min_bag_quantity,
//       max_bag_quantity,
//     });

//     await newSku.save();

//     res
//       .status(201)
//       .json({ message: "Pricing added successfully", data: newSku });
//   } catch (error) {
//     console.error("Error adding pricing:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // PATCH API - Update SKU pricing
// router.patch("/pricegenerate/:sku_code", async (req, res) => {
//   try {
//     const { sku_code } = req.params;
//     const { min_bag_price, max_bag_price } = req.body;

//     if (min_bag_price !== undefined && min_bag_price < 0) {
//       return res
//         .status(400)
//         .json({ message: "min_bag_price must be non-negative" });
//     }

//     if (max_bag_price !== undefined && max_bag_price < 0) {
//       return res
//         .status(400)
//         .json({ message: "max_bag_price must be non-negative" });
//     }

//     if (
//       min_bag_price !== undefined &&
//       max_bag_price !== undefined &&
//       min_bag_price > max_bag_price
//     ) {
//       return res.status(400).json({
//         message: "min_bag_price cannot be greater than max_bag_price",
//       });
//     }

//     const updatedSku = await CommoditySkuPricing.findOneAndUpdate(
//       { sku_code },
//       { $set: { min_bag_price, max_bag_price } },
//       { new: true, runValidators: true }
//     );

//     if (!updatedSku) {
//       return res.status(404).json({ message: "SKU not found" });
//     }

//     res.json({ message: "Pricing updated successfully", data: updatedSku });
//   } catch (error) {
//     console.error("Error updating pricing:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // GET API - Fetch SKU pricing and apply dynamic pricing formula
// router.get("/test/pricegenerate", async (req, res) => {
//   try {
//     console.log("Received Query Params:", req.query);
//     const { commodity_name, sku_name, bag, days } = req.query;

//     if (!commodity_name || !sku_name || !bag) {
//       return res.status(400).json({ message: "Missing required parameters" });
//     }
//     const pricingData = await CommoditySkuPricing.findOne({
//       commodity_name,
//       sku_name,
//     });
//     async function getAllOrders() {
//       try {
//         const orders = await Order.find(); // Fetch all orders from the database
//         if (orders.length === 0) {
//           console.log("No orders found in the database.");
//           return null;
//         }
//         console.log("Orders fetched from database:", orders);
//         return orders;
//       } catch (error) {
//         console.error("Error fetching orders from database:", error.message);
//         return null;
//       }
//     }
//     // console.log(getAllOrders());

//     // 2. Fetch shop statistics for each contact number dynamically
//     async function getShopStatsByContact(contact) {
//       try {
//         const response = await axios.get(
//           `http://localhost:5000/api/${contact}`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               "Content-Type": "application/json",
//               Authorization: `Bearer saudebazi`,
//             },
//           }
//         );
//         const test = JSON.stringify(response.data.shopStats, null, 2);
//         return response.data;
//       } catch (error) {
//         console.error(
//           "Error fetching shop statistics for contact",
//           contact,
//           ":",
//           error.response ? error.response.data : error.message
//         );
//         return null;
//       } 
//     }
//     const shopStats = await getShopStatsByContact("7014005459");
//    console.log("shopStats",shopStats)
//   //    commodities.Cumin.Delight.averageOrderValue);
//   const cuminDelightAOV = shopStats.shopStats["Lalit Traders"].commodities.Cumin.Delight.averageOrderValue;
// console.log(cuminDelightAOV);
    

     
//     if (!pricingData) {
//       return res.status(404).json({ message: "Pricing details not found" });
//     }

//     const { max_bag_price } = pricingData;

//     const totalQuantityPurchase = parseInt(bag);
//     const total_Orders = 1;

//     const averageQuantity = AverageQuantity(totalQuantityPurchase, total_Orders);
//     const avgQuantity = parseFloat(averageQuantity);

//     const discount = calculateDiscount(averageQuantity);

//     const interestOnCredit = calculateInterestCredit(days);

//     const finalPrice = max_bag_price + interestOnCredit - discount;
  

//     const QuantityPitched = cuminDelightAOV / (finalPrice * 30);
//       console.log(QuantityPitched)


//     if (typeof finalPrice === "object" && finalPrice.error) {
//       return res.status(400).json({ message: finalPrice.error });
//     }

//     res.json({
//       commodity_name,
//       sku_name,
//       bag_quantity: bag,
//       calculated_price: finalPrice,
//       average_quantity: avgQuantity,
//       volume_discount: discount.toFixed(2),
//       finalPrice,
//     });
//   } catch (error) {
//     console.error("Error fetching pricing:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });



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
router.patch("/pricegenerate/:sku_code", async (req, res) => {
  try {
    const { sku_code } = req.params;
    const { min_bag_price, max_bag_price } = req.body;

    if (min_bag_price !== undefined && min_bag_price < 0) {
      return res.status(400).json({ message: "min_bag_price must be non-negative" });
    }

    if (max_bag_price !== undefined && max_bag_price < 0) {
      return res.status(400).json({ message: "max_bag_price must be non-negative" });
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


// GET API - Fetch SKU pricing
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

    const totalInterestCredit = filteredOrders.reduce((sum, order) => {
      return sum + (parseFloat(order.intrest_credit) || 0);
    }, 0);

    const totalAOV = filteredOrders.reduce((sum, order) => {
      return sum + (parseFloat(order.AOV) || 0);
    }, 0);

    const totalKg = filteredOrders.reduce((sum, order) => sum + (order.Total_Kg || 0), 0);

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
