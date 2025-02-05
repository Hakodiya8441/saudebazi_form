const mongoose = require("mongoose");

const MarketSchema = new mongoose.Schema(
    {
        market_name : {type: String, required: true, unique: true},
        city : {type : String, required : true, unique : true},
        state_name : {type : String, required : true, unique : true},
    },
    { timestamps: true }
)

module.exports = mongoose.model("Market", MarketSchema);
