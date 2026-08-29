const express = require("express");

const app = express();

//app.use("/route", rH1, rH2, [rH3, rH4], rH5);

app.use(
  "/user",
  (req, res, next) => {
    next();
    res.send("User route 1");
    
  },
  [(req, res, next) => {
    next();
  },
  (req, res, next) => {
    next();
    res.send("User route 2");
    
  }],
  (req, res, next) => {
    res.send("User route 3");
    next();
  },
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
