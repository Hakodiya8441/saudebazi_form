const express = require('express');
require('./Config/db');
const commodityRoutes = require("./Routes/CommodityRoutes");
const customerRoutes = require("./Routes/CustomerRoutes");
const commoditySkuRoutes = require("./Routes/SkuRoutes");
const feedbackRoutes = require("./Routes/FeedbackRoutes");



const app = express();

app.use(express.json());

app.use("/api", commodityRoutes);
app.use("/api",customerRoutes);
app.use("/api",commoditySkuRoutes);
app.use("/api",feedbackRoutes);

app.listen(5000,()=>console.log("Server running on port 5000"))