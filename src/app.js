const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const connectDB = require("./config/database.js");
const app = express();
const User = require("./models/user");
app.use(express.json());
app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added!!!");
  } catch (err) {
    res.status(500).send("Error adding the user " + err.message);
  }
});

app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ email: "rohit@gmail.com" });
    if (user.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send({ user });
    }
  } catch (err) {
    res.status(500).send("Error fetching the user " + err.message);
  }
});

app.get("/user/getAllUsers", async (req, res) => {
  try {
    const users = await User.find({});
    res.send({ users });
  } catch (err) {
    res.status(500).send("Error fetching the users " + err.message);
  }
});

app.delete("/user/deleteById", async (req, res) => {
  const id = req.body._id;
  try{
    const userId = await User.findByIdAndDelete(id);
    res.send("User Deleted Successfully!");
  } catch(err){
    res.send("User not found!");
  }
});

app.patch("/user/updateById", async(req, res)=>{
  const data = req.body;
  const userId = req.body._id;
  try{
    await User.findByIdAndUpdate({_id: userId}, data, { runValidators: true });
    res.send("Data Updated Successfully!");
  }catch(err){
    res.send("Something went wrong : ", err);
  }
})

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("DB Connected & Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Database Connection Failed!", err);
  });
