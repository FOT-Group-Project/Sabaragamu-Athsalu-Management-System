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
                { id: user.id, role: user.role },
                process.env.JWT_SECRET_KEY
              );
              const { password: pass, ...rest } = user.dataValues;

              res
                .status(200)
                .cookie("access_token", token, { httpOnly: true })
                .json(rest);
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

module.exports = {
  signUp: signUp,
  signIn: signIn,
};
