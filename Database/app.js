const express = require("express");
require('dotenv').config();
require("./Config/db");
const commodityRoutes = require("./Routes/CommodityRoutes");
const customerRoutes = require("./Routes/CustomerRoutes");
const commoditySkuRoutes = require("./Routes/SkuRoutes");
const feedbackRoutes = require("./Routes/FeedbackRoutes");
const middleware = require("./auth");
const timesloteRoute = require("./Routes/WeekDaysRoutes");
const orderRoutes = require("./Routes/OrderHistoryRoutes");
const pricingRoutes = require("./Routes/CommodityPricing");
const appointmentroutes = require("./Routes/appointmentroutes");
const ContentRoutes = require("./Routes/ContentRoutes");
const shopStatsRoutes = require("./Routes/shopStats"); // Import the shopStatsRoutes
const otpricingRoutes = require("./Routes/price"); // Import the pricing routes
const otorderRoutes = require("./Routes/shopStats"); // Import your order routes
const template = require("./Routes/templateRoutes");

const app = express();

// Set default timezone to Asia/Kolkata
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Kolkata");

const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
console.log("Current Time (Asia/Kolkata):", currentTime);

app.use(middleware);
app.use(express.json());
const PORT = process.env.PORT || 5000;

// Use routes for different API endpoints
app.use("/api", commodityRoutes);
app.use("/api", customerRoutes);
app.use("/api", commoditySkuRoutes);
app.use("/api", feedbackRoutes);
app.use("/api", timesloteRoute);
app.use("/api", orderRoutes);
app.use("/api", pricingRoutes);
app.use("/api", appointmentroutes);
app.use("/api", ContentRoutes);
app.use("/api", shopStatsRoutes); // Register the shopStats route
app.use("/api", otpricingRoutes);
app.use("/api", otorderRoutes);  // Mount the routes
app.use("/api", template); // Mount the template routes

app.listen( PORT, () => console.log(`Server running on ${PORT}`));
