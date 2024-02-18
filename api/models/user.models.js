import mysql from "mysql";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }
}
