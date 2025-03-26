const express = require("express");
require("./Config/db");
const commodityRoutes = require("./Routes/CommodityRoutes");
const customerRoutes = require("./Routes/CustomerRoutes");
const commoditySkuRoutes = require("./Routes/SkuRoutes");
const feedbackRoutes = require("./Routes/FeedbackRoutes");
const middleware = require("./auth");
const timesloteRoute = require("./Routes/WeekDaysRoutes");
const orderRoutes = require("./Routes/OrderHistoryRoutes");
const pricingRoutes = require("./Routes/CommodityPricing");
const moment = require("moment-timezone");
const appointmentroutes = require("./Routes/appointmentroutes")
const ContentRoutes = require("./Routes/ContentRoutes")

const app = express();

// Set default timezone to Asia/Kolkata
moment.tz.setDefault("Asia/Kolkata");

const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
console.log("Current Time (Asia/Kolkata):", currentTime);

app.use(middleware);
app.use(express.json());

app.use("/api", commodityRoutes);
app.use("/api", customerRoutes);
app.use("/api", commoditySkuRoutes);
app.use("/api", feedbackRoutes);
app.use("/api", timesloteRoute);
app.use("/api", orderRoutes);
app.use("/api", pricingRoutes);
app.use("/api", appointmentroutes)
app.use("/api", ContentRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
