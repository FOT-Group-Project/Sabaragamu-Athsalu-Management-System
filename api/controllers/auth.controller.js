import { User } from "../models/user.models.js";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }

  User.findByUsername(username, (error, user) => {
    if (error) {
      console.error("Error executing MySQL query:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (user) {
      return next(errorHandler(400, "Username already exists"));
    }
    User.createUser(username, email, password, (error, userId) => {
      if (error) {
        next(error);
      }
      res.status(201).json({ message: "User created successfully", userId });
    });
  });
};
