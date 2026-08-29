const express = require("express");

const app = express();
const {adminAuth, userAuth} = require("./middlewares/auth");

//Admin
app.get("/admin/getAllData",adminAuth, (req, res)=>{
    res.send("All Admin Data Sent!");
});

//User
app.get("/user/getAllData", userAuth, (req, res)=>{
    res.send("All User Data Sent");
});

app.post("/user/login", (req, res) => {
    res.send("Loggedin Successfully!")
})
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
