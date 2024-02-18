import { User } from "../models/user.models.js";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  User.findByUsername(username, (error, user) => {
    if (error) {
      console.error("Error executing MySQL query:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (user) {
      return res.status(400).json({ message: "Username already exists" });
    }
    User.createUser(username, email, password, (error, userId) => {
      if (error) {
        console.error("Error executing MySQL query:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.status(201).json({ message: "User created successfully", userId });
    });
  });
};
