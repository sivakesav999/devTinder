const express = require("express");
const {userAuth} = require("../middlewares/auth.js");
const requestRouter = express.Router();

requestRouter.get("/request", userAuth, async (req, res) => {
    try{
        const user = req.user;
        res.send(user);
    } catch (error) {
        res.status(400).send("Error : " + error.message);
    }
});

module.exports = requestRouter;