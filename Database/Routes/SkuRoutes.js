const express = require('express');
const CommoditySku = require("../Models/SkuSchema")

const router = express.Router();


//post :- add a new sku

router.post("/add-sku", async (req, res) => {
    try{
        const {
            sku_code,
            sku_name,
            min_bag_price,
            max_bag_price,
            commodity_name,
          } = req.body;

          if(!sku_code || !sku_name || !min_bag_price || !max_bag_price || !commodity_name){
            return res.status(400).json({error : "Missing fields"});
          }

           //  Check if `sku_code` is unique
    const existingSku = await CommoditySku.findOne({ sku_code });
    if (existingSku) {
      return res.status(400).json({ error: "SKU Code already exists." });
    }

          const newSku = new CommoditySku({
            sku_code,
            sku_name,
            min_bag_price,
            max_bag_price,
            commodity_name,
          });

          await newSku.save();
          res.status(201).json({message:"Sku added successfully!",sku:newSku})
    } catch(error){
        res.status(500).json({message:"error"})
    }
})


// GET: Retrieve all SKUs 
// router.get("/skus", async (req, res) => {
//     try {
//       const commodityName = req.query.commodity_name;
//       console.log(commodityName)
//       console.log(CommoditySku)
  
      //  Build dynamic filter based on query parameters
    
  
    //   const skus = await CommoditySku.find(filter);


    // if (!commodityName) {

    //     return res.status(400).json({ message: " commodityName is required for search." });
    //   }
    // const skus = await CommoditySku.find({ commodity_name: commodityName });
    // console.log(skus)
  
      //  If no SKUs found, return a message
    //   if (skus.length === 0) {
    //     return res.status(404).json({ message: "No SKUs found." });
    //   }
  
//       res.status(200).json(skus);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });

router.get("/skus", async (req, res) => {
    try {
      const commodities = await CommoditySku.find();
      res.status(200).json(commodities);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.get("/skus/:name",async(req,res)=>{
    try{
      const name = req.params.name;
      const commodities = await CommoditySku.find({sku_name:name});
      res.status(200).json(commodities);
    }
    catch (error) {
      res.status(500).json({ error: error.message });
    }
})





module.exports = router;