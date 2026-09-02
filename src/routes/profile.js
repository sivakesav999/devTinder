const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/user");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const cookieParser = require("cookie-parser");
profileRouter.use(cookieParser());
profileRouter.use(express.json());

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

module.exports = profileRouter;