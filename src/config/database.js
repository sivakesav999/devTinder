const mongoose = require('mongoose');

const connectDB = async () =>{
    await mongoose.connect("mongodb+srv://sivakesav999_db_user:siva@node.jkpdcki.mongodb.net/devTinder")
};

module.exports = connectDB;

