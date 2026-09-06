const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if(!token) res.status(401).send("Please Login!")
    const decodedMessage = jwt.verify(token, "siva");
    const { userId } = decodedMessage;
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found!");
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
};

module.exports = { userAuth };
