const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");
const productRoutes = require("./routes/products.route"); // products route
const associationRoutes = require("./routes/association.route"); // associations route
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

//products
app.use("/api/addproduct", productRoutes);
app.use("/api/getproduct", productRoutes);
app.use("/api/getallproducts", productRoutes);
app.use("/api/updateproduct", productRoutes); 
app.use("/api/deleteproduct", productRoutes);

//associations
app.use("/api/getassociation", associationRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
