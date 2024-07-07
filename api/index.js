const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");
const storeRoutes = require("./routes/store.route");
const productRoutes = require("./routes/products.route"); // products route
const associationRoutes = require("./routes/association.route"); // association route
const storeKeepermanagestore = require("./routes/storekeepermanagestore.route");
const shopRoutes = require("./routes/shop.route");
const salesReportRoutes = require("./routes/salesReport.route");
const cookieParser = require("cookie-parser");
const shopItemRoutes = require("./routes/shopItem.route");
const stordamageproduct= require("./routes/storedamageproduct.route");
const storeItemRoutes = require("./routes/storeitem.route");
const customerreturnitemRoutes = require("./routes/customerreturnitem.route");




const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/product", productRoutes);
app.use("/api/associations", associationRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/sales-report", salesReportRoutes);
app.use("/api/shop-item", shopItemRoutes);
app.use("/api/storekeepermanagestore", storeKeepermanagestore);
app.use("/api/stordamageproduct", stordamageproduct);
app.use("/api/store-item", storeItemRoutes);
app.use("/api/customerreturnitem", customerreturnitemRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
