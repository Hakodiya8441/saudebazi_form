const mongoose = require("mongoose");

const CommoditySchema = new mongoose.Schema(
    {
        commodity_name: {
          type: String,
          required: true,
          unique: true, 
        },
      },
      {
        timestamps: true, 
      }
    );

    module.exports = mongoose.model("Commodity", CommoditySchema);

    
