const express = require("express");
require("./Config/db");
const commodityRoutes = require("./Routes/CommodityRoutes");
const customerRoutes = require("./Routes/CustomerRoutes");
const commoditySkuRoutes = require("./Routes/SkuRoutes");
const feedbackRoutes = require("./Routes/FeedbackRoutes");
const middleware = require("./auth");
const timesloteRoute = require("./Routes/WeekDaysRoutes");
const orderRoutes = require('./Routes/OrderHistoryRoutes');

const app = express();

app.use(middleware);
app.use(express.json());

app.use("/api", commodityRoutes);
app.use("/api", customerRoutes);
app.use("/api", commoditySkuRoutes);
app.use("/api", feedbackRoutes);
app.use("/api", timesloteRoute);
app.use("/api", orderRoutes );

app.listen(5000, () => console.log("Server running on port 5000"));
