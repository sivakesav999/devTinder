const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const validate = require("validator");
const cookieParser = require("cookie-parser");
const { validateSignUpData } = require("../utils/validate");
const authRouter = express.Router();
authRouter.use(cookieParser());
authRouter.use(express.json());

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req); // Validate the request data
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.send("User added!!!");
  } catch (err) {
    res.status(500).send("Error : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!validate.isEmail(email)) throw new Error("Please Enter a valid email");
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid Credentials");
    const isPasswordMatch = await user.validatePassword(password);
    if (!isPasswordMatch) {
      throw new Error("Invalid Credentials");
    } else {
      const token = await user.getJwtToken();
      res.cookie("token", token, {expiresIn : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), httpOnly: true});
      res.send(user);
    }
  } catch (err) {
    throw new Error("Error : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", "", { expires: new Date(Date.now()) });
    res.send("Logout Successfull!");
});

module.exports = authRouter;
