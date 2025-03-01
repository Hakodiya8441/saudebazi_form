const express = require('express');
const middleware = require("../auth.js")
const Customer = require("../Models/CustomerSchema");
// const CustomerSchema = require('../Models/CustomerSchema');

const router = express.Router();

//  POST: Add a new Customer
router.post("/add-customer", middleware, async (req, res) => {
  try {
    const {
      shop_name,
      owner_name,
      shop_number,
      shop_address,
      market_id,
      contact_1,
      contact_2,
      contact_3,
      gst_number,
    } = req.body;

    // Validate required fields
    if (!shop_name || !shop_address || !market_id || !contact_1) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Check if `contact_1` is unique
    const existingCustomer = await Customer.findOne({
      $or: [{ contact_1 }, { contact_2 }, { contact_3 }]
    });

    if (existingCustomer) {
      return res.status(400).json({ error: "Contact number already exists." });
    }

    const newCustomer = new Customer({
      shop_name,
      owner_name,
      shop_number,
      shop_address,
      market_id,
      contact_1,
      contact_2,
      contact_3,
      gst_number,
    });

    await newCustomer.save();
    res.status(201).json({ message: "Customer added successfully!", customer: newCustomer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Retrieve all Customers (with optional filtering)
//   router.get("/customers", async (req, res) => {
//     try {
//       const { market_id, shop_name, owner_name, contact } = req.query;

//       // Build dynamic filter based on query parameters
//       let filter = {};
//       if (market_id) filter.market_id = market_id;
//       if (shop_name) filter.shop_name = shop_name;
//       if (owner_name) filter.owner_name = owner_name;

//       // Enable partial search on contact fields
//       if (contact) {
//         const contactRegex = new RegExp(contact, "i"); // Case-insensitive regex match
//         filter.$or = [
//           { contact_1: { $regex: contactRegex } },
//           { contact_2: { $regex: contactRegex } },
//           { contact_3: { $regex: contactRegex } }
//         ];
//       }

//       if (customers.length === 0) {
//         return res.status(404).json({ message: "No shops found matching this contact number." });
//       }

//       res.status(200).json(customers);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   })
router.get("/customers", async (req, res) => {
  try {
    const contact = Number(req.query.contact);


    console.log(contact)
    // if (!contact) {
    //   return res.status(400).json({ message: "Contact number is required for search." });
    // }
    const customers = await Customer.find({
      $or: [
        { contact_1: contact },
        { contact_2: { $exists: true, $eq: contact } },
        { contact_3: { $exists: true, $eq: contact } }
      ]
    })
    // const { market_id, shop_name, owner_name } = req.query;

    // let filter = {};
    //   if (market_id) filter.market_id = market_id;
    //   if (shop_name) filter.shop_name = shop_name;
    //   if (owner_name) filter.owner_name = owner_name;
    // const customer =  Customer.find(filter).populate("market_id", "market_name","shop_name");
    //   console.log(customer);

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/add-shop", async (req, resp) => {
  try {
    const { _id, shop_name, visiting_card, shop_photo } = req.body;

    if (!_id) {
      return resp.status(400).json({ message: "shop id (_id) is required" })
    }
    const response = await Customer.findByIdAndUpdate(
      _id,
      { $set: { shop_name, visiting_card, shop_photo } }
    );
    if (!response) {
      return resp.status(404).json({ message: "shop not found" })
    }
    resp.status(200).json({ message: "shop updated successfully", data: response })
  }
  catch (error) {
    console.error("error updatinf shop: ", error)
    resp.status(500).json({ message: "internal server error" })
  }
})
module.exports = router;

