const models = require("../models");
const bcrypt = require("bcrypt");
const errorHandler = require("../utils/error");

function save(req, res) {
  const user = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    profilepicurl: req.body.profilepicurl,
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
}

function createUser(req, res, next) {
  if (!req.body.role === "Admin") {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to create this user",
    });
  }

  if (req.body.password) {
    if (req.body.password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }
  }

  if (!(req.body.password.toString() === req.body.confirmPassword.toString())) {
    return res.status(400).json({
      success: false,
      message: "Password not same as confirm password",
    });
  }

  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Username must be between 7 and 20 characters",
      });
    }
    if (req.body.username.includes(" ")) {
      return res.status(400).json({
        success: false,
        message: "Username cannot contain spaces",
      });
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: "Username must be lowercase",
      });
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return res.status(400).json({
        success: false,
        message: "Username can only contain letters and numbers",
      });
    }
  }

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
                  const newUser = {
                    username: req.body.username,
                    email: req.body.email,
                    profilepicurl: req.body.profilepicurl,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    phone: req.body.phone,
                    role: req.body.role,
                    password: hash,
                  };

                  models.User.create(newUser)
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

function updateUser(req, res, next) {
  if (req.user.id.toString() !== req.params.userId) {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to update this user",
    });
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Username must be between 7 and 20 characters",
      });
    }
    if (req.body.username.includes(" ")) {
      return res.status(400).json({
        success: false,
        message: "Username cannot contain spaces",
      });
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: "Username must be lowercase",
      });
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return res.status(400).json({
        success: false,
        message: "Username can only contain letters and numbers",
      });
    }
  }

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      const updatedUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        profilepicurl: req.body.profilepicurl,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        role: req.body.role,
        password: hash,
      };

      models.User.update(updatedUser, {
        where: {
          id: req.params.userId,
        },
      })
        .then((result) => {
          if (result[0] === 0) {
            return res.status(404).json({
              success: false,
              message: "User not found",
            });
          }
          models.User.findByPk(req.params.userId)
            .then((user) => {
              res.status(200).json({
                success: true,
                message: "User updated successfully",
                user: user,
              });
            })
            .catch((error) => {
              res.status(500).json({
                success: false,
                message: "Internal Server Error",
                error: error,
              });
            });
        })
        .catch((error) => {
          res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error,
          });
        });
    });
  });
}

function signout(req, res) {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json({ success: true, message: "User signed out successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: error });
  }
}

module.exports = {
  save: save,
  createUser: createUser,
  updateUser: updateUser,
  signout: signout,
};
