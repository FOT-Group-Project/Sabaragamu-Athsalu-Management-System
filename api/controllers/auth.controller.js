import { User } from "../models/user.models.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

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

export const signin = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password || username === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }

  try {
    User.findByUsername(username, (error, user) => {
      if (error) {
        console.error("Error executing MySQL query:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (!user) {
        return next(errorHandler(400, "Username not found"));
      }
      if (!user.comparePassword(password)) {
        return next(errorHandler(400, "Invalid password"));
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);

      const { password: pass, ...rest } = user;

      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    });
  } catch (error) {
    next(error);
  }
};
