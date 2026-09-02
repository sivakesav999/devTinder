const validate = require("validator");

const validateSignUpData = (req) => {
    const {firstName, lastName, email, password} = req.body;
    if(!firstName || !lastName) throw new Error("First Name and Last Name are required");
    else if(!validate.isEmail(email)) throw new Error("Please Enter a valid email");
    else if(!validate.isStrongPassword(password)) throw new Error("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol");
}

const validateEditProfileData = (req) => {
    const allowedUpdates = ["firstName", "lastName", "age", "gender", "skills", "about", "photoUrl"];
    const isEditAllowed = Object.keys(req.body).every((key) => {
        return allowedUpdates.includes(key);
    });
    return isEditAllowed;
}

module.exports = {validateSignUpData, validateEditProfileData};