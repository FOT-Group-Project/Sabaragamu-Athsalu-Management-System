const models = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { errorHandler } = require("../utils/error");

dotenv.config();

function signUp(req, res) {
  models.User.findOne({ where: { email: req.body.email } })
    .then((result) => {
      if (result) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      } else {
        models.User.findOne({ where: { username: req.body.username } })
          .then((result) => {
            if (result) {
              return res.status(400).json({
                success: false,
                message: "Username already exists",
              });
            } else {
              bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(req.body.password, salt, function (err, hash) {
                  const user = {
                    username: req.body.username,
                    email: req.body.email,
                    password: hash,
                  };

                  models.User.create(user)
                    .then((result) => {
                      res.status(201).json({
                        success: true,
                        message: "User created successfully",
                        user: result,
                      });
                    })
                    .catch((err) => {
                      res.status(500).json({
                        success: false,
                        message: "Internal Server Error",
                        error: err,
                      });
                    });
                });
              });
            }
          })
          .catch((error) => {
            res.status(500).json({
              success: false,
              message: "Internal Server Error",
              error: error,
            });
          });
      }
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error,
      });
    });
}

function signIn(req, res) {
  models.User.findOne({ where: { username: req.body.username } })
    .then((user) => {
      if (user === null) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      } else {
        bcrypt.compare(
          req.body.password,
          user.password,
          function (err, result) {
            if (result) {
              const token = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET_KEY
              );
              return res.status(200).json({
                success: true,
                message: "User logged in successfully",
                token: token,
                user: user,
              });
            } else {
              return res.status(400).json({
                success: false,
                message: "Invalid password",
              });
            }
          }
        );
      }
    })
    .catch((error) => {});
}

// export const signup = async (req, res, next) => {
//   const { username, email, password } = req.body;

//   if (
//     !username ||
//     !email ||
//     !password ||
//     username === "" ||
//     email === "" ||
//     password === ""
//   ) {
//     next(errorHandler(400, "All fields are required"));
//   }

//   User.findByUsername(username, (error, user) => {
//     if (error) {
//       console.error("Error executing MySQL query:", error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//     if (user) {
//       return next(errorHandler(400, "Username already exists"));
//     }
//     User.createUser(username, email, password, (error, userId) => {
//       if (error) {
//         next(error);
//       }
//       res.status(201).json({ message: "User created successfully", userId });
//     });
//   });
// };

// export const signin = async (req, res, next) => {
//   const { username, password } = req.body;

//   if (!username || !password || username === "" || password === "") {
//     next(errorHandler(400, "All fields are required"));
//   }

//   try {
//     User.findByUsername(username, (error, user) => {
//       if (error) {
//         console.error("Error executing MySQL query:", error);
//         return res.status(500).json({ message: "Internal server error" });
//       }
//       if (!user) {
//         return next(errorHandler(400, "Username not found"));
//       }
//       if (!user.comparePassword(password)) {
//         return next(errorHandler(400, "Invalid password"));
//       }

//       const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);

//       const { password: pass, ...rest } = user;

//       res
//         .status(200)
//         .cookie("access_token", token, {
//           httpOnly: true,
//         })
//         .json(rest);
//     });
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = {
  signUp: signUp,
  signIn: signIn,
};
