const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
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

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("DB Connected & Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Database Connection Failed!", err);
  });
