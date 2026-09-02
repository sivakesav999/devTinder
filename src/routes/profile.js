const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/user");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const {validateEditProfileData} = require("../utils/validate.js");
const cookieParser = require("cookie-parser");
profileRouter.use(cookieParser());
profileRouter.use(express.json());

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if(!validateEditProfileData(req)) throw new Error("Invalid update field");
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) =>  loggedInUser[key] = req.body[key]);
        await loggedInUser.save();
        res.json({Message: `${loggedInUser.firstName}`, Data: loggedInUser});
    } catch (error) {
        return res.status(400).send("Error : " + error.message);
    }
})

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const {oldPassword, newPassword} = req.body;
        if(!oldPassword || !newPassword) throw new Error("Old Password and New Password are required");
        const loggedInUser = req.user;
        const isPasswordMatch = await loggedInUser.validatePassword(oldPassword);
        if(!isPasswordMatch) throw new Error("Old Password is incorrect");
        loggedInUser.password = newPassword;
        await loggedInUser.save();
        res.json({Message: "Password Updated Successfully", Data: loggedInUser});
    } catch (error) {
        return res.status(400).send("Error : " + error.message);
    }
});
module.exports = profileRouter;