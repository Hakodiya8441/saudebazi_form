const express = require("express");
const Commodity = require("../Models/CommoditySchema");

const router = express.Router();



//post: add a new commodity

router.post("/add-commodity", async (req, res) => {
    try {
      const { commodity_name } = req.body;
  
      // Check if commodity already exists
      const commodityExists = await Commodity.findOne({ commodity_name });
      if (commodityExists) {
        return res.status(400).json({ error: "Commodity already exists." });
      }
  
      const newCommodity = new Commodity({ commodity_name });
      await newCommodity.save();
      res.status(201).json({ message: "Commodity added successfully!", commodity: newCommodity });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

//get all commodity
  router.get("/commodities", async (req, res) => {
    try {
      const commodities = await Commodity.find();
      res.status(200).json(commodities);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  router.get("/commodities/:name",async(req,res)=>{
    try{
      const name = req.params.name;
      const commodites = await Commodity.find({commodity_name:name});
      res.status(200).json(commodites);
    }
    catch(error){
      res.status(500).json({ error: error.message });
    }
  })
  
  module.exports = router;