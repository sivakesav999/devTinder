const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const connectDB = require("./config/database.js");
const app = express();
const User = require("./models/user");
app.use(express.json());
const validate = require("validator");
const { validateSignUpData } = require("./utils/validate");
const bcrypt = require("bcrypt");

app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req); // Validate the request data
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.send("User added!!!");
  } catch (err) {
    res.status(500).send("Error : " + err.message);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!validate.isEmail(email))
      throw new Error("Please Enter a valid email");
    const user = await User.findOne({ email });
    if (!user)
      throw new Error("Invalid Credentials");
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      throw new Error("Invalid Credentials");
    res.send("Login SuccessfulL!");
  } catch (err) {
    throw new Error("Error : " + err.message);
  }
});

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
    console.log(user);
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
