const express = require("express");
const { userAuth } = require("../middlewares/auth.js");
const requestRouter = express.Router();
const User = require("../models/user.js");
const ConnectionRequestModel = require("../models/connectionRequests.js");
const sendEmail = require("../utils/sendEmail");

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
        return res.status(400).json({ message: "Invalid Status : " + status });

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
          .status(409)
          .send({ message: "Connection Request Already Exists" });

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      const savedRequest = await connectionRequest.save();

      try {
        const emailRes = await sendEmail.run(
          existingUser.email,
          process.env.SES_FROM_EMAIL || "sivakesav999@gmail.com",
          [req.user.firstName, req.user.lastName].filter(Boolean).join(" "),
        );

        console.log("Email sent successfully:", emailRes.MessageId);
      } catch (emailError) {
        console.error("Email sending failed:", {
          name: emailError.name,
          message: emailError.message,
          code: emailError.Code,
        });
        return res.status(502).json({
          message: "Connection request saved, but notification email failed",
        });
      }

      res.status(200).json({
        message: "Request sent successfully!",
        savedRequest,
      });
    } catch (error) {
      if (error.name === "ValidationError" || error.name === "CastError")
        return res.status(400).json({ error: error.message });

      console.error("Failed to send connection request:", error);
      return res.status(500).json({ error: "Failed to send connection request" });
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
