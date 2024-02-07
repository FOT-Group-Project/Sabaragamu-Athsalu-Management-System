import express from "express";
import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Mysql database connected!");
});

const app = express();

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});
