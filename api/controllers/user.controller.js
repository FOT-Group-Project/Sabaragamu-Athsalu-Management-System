const models = require("../models");

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

module.exports = {
  save: save,
};
