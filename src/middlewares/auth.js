const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).send("Please Login!");

    const decodedMessage = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decodedMessage;
    const user = await User.findById(userId);
    if (!user) return res.status(401).send("User not found!");
    req.user = user;
    return next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError")
      return res.status(401).send("Authentication failed");

    console.error("Authentication lookup failed:", err);
    return res.status(500).send("Authentication service unavailable");
  }
};

module.exports = { userAuth };
