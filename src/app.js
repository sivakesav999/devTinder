require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const http = require("http");
const express = require("express");
const app = express();
app.use(express.json());

const cors = require("cors");
const allowedOrigins = (
  process.env.FRONTEND_URL || "http://localhost:5173,http://13.49.44.222"
)
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin))
        return callback(null, true);
      console.warn(`CORS request rejected from origin: ${origin}`);
      return callback(null, false);
    },
    credentials: true,
  }),
);

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const User = require("./models/user");
const connectDB = require("./config/database.js");

const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");
const userRouter = require("./routes/user.js");
const initializeSocket = require("./utils/socket.js");
const chatRouter = require("./routes/chat.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter)

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log("DB Connected & Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Database Connection Failed!", err);
  });
