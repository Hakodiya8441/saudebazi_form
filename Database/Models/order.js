const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    Date: { type: Date },
    Shop_Name: { type: String },
    Buyer_Name: { type: String },
    Shop_Number: { type: String },
    Market: { type: String },
    address: { type: String },
    Contact_Details: [{ type: Number }],
    Commodity: { type: String },
    SKU: { type: String },
    Order_Details: { type: String },
    Kg: { type: Number },
    Total_Kg: { type: Number },
    Total_Bags: { type: Number },
    Price: { type: Number },
    Daily_Price: { type: Number },
    Total_Price: { type: Number },
    Transport_Expenses: { type: String },
    Unloading_Charges: { type: String },
    unloading: { type: String },
    Delivery_Date: { type: String },
    Payment_Terms: { type: String },
    Payment_Mode: { type: String },
    RM: { type: String },
    RM_Contact_Details: { type: String },
    status: { type: String },
    SUM_of_Total_Transaction_value : { type: Number },
    Volume: { type: Number },
    No_of_Order: { type: Number},
    No_of_Commodity: { type: Number},
    Avg_kg_order_commodity:{ type: Number },
    Volume_basis:{ type: Number },
    Avg_transaction_value_order_commodity:{ type: Number },
    Transaction_value_basis:{ type: Number },
    AOV:{ type: Number },
    Credit_intrest:{ type: Number }

});

module.exports = mongoose.model("Order", orderSchema);
