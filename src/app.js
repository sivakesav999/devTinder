const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const connectDB = require("./config/database.js");
const app = express();
const User = require("./models/user");
app.use(express.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

app.get("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send({ user });
    }
  } catch (err) {
    res.status(500).send("Error fetching the user " + err.message);
  }
});

app.get("/user/all", async (req, res) => {
  try {
    const users = await User.find({});
    res.send({ users });
  } catch (err) {
    res.status(500).send("Error fetching the users " + err.message);
  }
});

app.delete("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User Deleted Successfully!");
  } catch (err) {
    res.status(404).send("User not found!");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const data = req.body;
  const userId = req.params?.userId;
  try {
    const allowedUpdates = ["firstName", "lastName", "age", "gender", "skills"];
    const isAllowedUpdates = Object.keys(data).every((key) =>
      allowedUpdates.includes(key),
    );
    if (!isAllowedUpdates) {
      throw new Error("Updates not allowed!");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
      returnDocument: "after",
    });
    res.send("Data Updated Successfully!");
  } catch (err) {
    res.status(400).send("Something went wrong : " + err.message);
  }
});

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("DB Connected & Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Database Connection Failed!", err);
  });
