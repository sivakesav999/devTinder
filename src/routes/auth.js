const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const validate = require("validator");
const cookieParser = require("cookie-parser");
const { validateSignUpData } = require("../utils/validate");
const authRouter = express.Router();
authRouter.use(cookieParser());
authRouter.use(express.json());

const authCookieOptions = {
  httpOnly: true,
  sameSite: process.env.COOKIE_SAME_SITE || "lax",
  secure: process.env.COOKIE_SECURE === "true",
};

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

    const savedUser = await user.save();
    const token = await savedUser.getJwtToken();

    res.cookie("token", token, {
      ...authCookieOptions,
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.send(savedUser);
  } catch (err) {
    res.status(500).send("Error : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== "string" || !validate.isEmail(email))
      return res.status(400).send("Please Enter a valid email");
    if (typeof password !== "string" || password.length === 0)
      return res.status(400).send("Password is required");

    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid Credentials");
    const isPasswordMatch = await user.validatePassword(password);
    if (!isPasswordMatch) {
      throw new Error("Invalid Credentials");
    } else {
      const token = await user.getJwtToken();
      res.cookie("token", token, {
        ...authCookieOptions,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      res.send(user);
    }
  } catch (err) {
    if (err.message === "Invalid Credentials")
      return res.status(400).send(err.message);

    console.error("Login failed:", err);
    return res.status(500).send("Login service unavailable");
  }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", "", {
      ...authCookieOptions,
      expires: new Date(0),
    });
    res.send("Logout Successfull!");
});

module.exports = authRouter;
