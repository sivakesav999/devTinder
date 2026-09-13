const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);

      console.log(`${firstName} joined room ${roomId}`);

      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetUserId, newMessage }) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);

          console.log("Message:", newMessage);
          console.log("From:", userId);
          console.log("To:", targetUserId);
          console.log("Room:", roomId);

          // Find existing chat
          let chat = await Chat.findOne({
            participants: {
              $all: [userId, targetUserId],
            },
          });

          // If chat doesn't exist, create it
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          // Add message to existing chat
          chat.messages.push({
            senderId: userId,
            newMessage: newMessage,
          });

          // Save to MongoDB
          await chat.save();

          console.log("Message saved successfully:", chat._id);

          // Send message to both users in room
          io.to(roomId).emit("messageReceived", {
            firstName,
            userId,
            newMessage,
          });
        } catch (error) {
          console.error("Error sending message:", error);
        }
      },
    );

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};

module.exports = initializeSocket;
