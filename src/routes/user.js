const express = require("express");
const { userAuth } = require("../middlewares/auth.js");
const userRouter = express.Router();
const ConnectionRequestModel = require("../models/connectionRequests.js");

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName photoUrl age gender skills");
    res.json({
      message: "Data fetched successfully!",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(404).send("ERROR : " + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "firstName lastName photoUrl age gender skills")
      .populate("toUserId", "firstName lastName photoUrl age gender skills");

    const connectionsData = connections.map((connection) => {
      if (connection.fromUserId._id.equals(loggedInUser._id)) {
        return connection.toUserId;
    }

      return connection.fromUserId;
    });

    res.json({
      message: "Here are your connections!",
      data: connectionsData,
    });
  } catch (error) {
    res.status(404).send("ERROR : " + error.message);
  }
});

module.exports = userRouter;
