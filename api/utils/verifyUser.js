const jwt = require("jsonwebtoken");
const { errorHandler } = require("./error");
const dotenv = require("dotenv");

dotenv.config();

function verifyToken(req, res, next) {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized x",
      });
    }
    req.user = user;
    next();
  });
}

module.exports = verifyToken;
