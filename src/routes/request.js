const express = require("express");
const { userAuth } = require("../middlewares/auth.js");
const requestRouter = express.Router();
const User = require("../models/user.js");
const ConnectionRequestModel = require("../models/connectionRequests.js");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignore", "interested"]; //Strict Status Verification.
      if (!allowedStatus.includes(status))
        return res.json({ message: "Invalid Status : " + status });

      const existingUser = await User.findById(toUserId); //Strict User Verification.
      if (!existingUser)
        return res.status(404).json({ message: "User Not Found" });

      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          // finding whether there is a existing connection request from their ends.
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest)
        return res
          .status(400)
          .send({ message: "Connection Request Already Exists" });

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      const savedRequest = await connectionRequest.save();
      res
        .status(200)
        .json({ message: "Request sent successfully!", savedRequest });
    } catch (error) {
      res.status(400).json({ error: "ERROR: " + error.message });
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUserId = req.user._id;
      const { status, requestId } = req.params;
      const allowedStatus = ["rejected", "accepted"]; //Strict Status Verification.

      if (!allowedStatus.includes(status))
        return res.json({ message: "Status Not Allowed : " + status });

      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUserId,
        status: "interested",
      });

      if (!connectionRequest)
        return res
          .status(404)
          .json({ message: "Connection Request Not Found" });

      connectionRequest.status = status;
      const updatedRequest = await connectionRequest.save();
      res
        .status(200)
        .json({ message: "Request reviewed successfully!", updatedRequest });
    } catch (error) {
      res.status(400).json({ error: "ERROR: " + error.message });
    }
  },
);

module.exports = requestRouter;
