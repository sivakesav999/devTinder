const mongoose = require("mongoose");
const validate = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 10,
  },
  lastName: {
    type: String,
    minLength: 3,
    maxLength: 10,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    validate(value) {
      if (!["male", "female", "other"].includes(value))
        throw new Error("Invalid gender");
    },
  },
  photo: {
    type: String,
  },
  about: {
    type: String,
    default: "Hey there! I am using DevTinder.",
  },
  skills: {
    type: [String],
    default: ["Javascript", "Node.js", "React.js", "MongoDB"],
  },
}, {timestamps: true});

userSchema.methods.getJwtToken = function () {
  const user = this;
  const token = jwt.sign({ userId: user._id }, "siva", { expiresIn: "7d" });
  return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const isPasswordMatch = await bcrypt.compare(passwordInputByUser, user.password);
  return isPasswordMatch;
}

const User = mongoose.model("User", userSchema);
module.exports = User;
