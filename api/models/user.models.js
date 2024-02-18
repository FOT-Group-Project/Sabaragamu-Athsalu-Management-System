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
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
  }

  static findByUsername(username, callback) {
    connection.query(
      "SELECT * FROM user WHERE user_name = ?",
      [username],
      (error, results) => {
        if (error) {
          return callback(error, null);
        }
        if (results.length === 0) {
          return callback(null, null); // User not found
        }
        const user = results[0];
        const foundUser = new User(user.username, user.email, user.password);
        callback(null, foundUser);
      }
    );
  }

  static createUser(username, email, password, callback) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    connection.query(
      "INSERT INTO user (user_name,email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword],
      (error, results) => {
        if (error) {
          return callback(error, null);
        }
        callback(null, results.insertId);
      }
    );
  }

  comparePassword(password) {
    return bcrypt.compareSync(password, this.password);
  }
}
export { User };
