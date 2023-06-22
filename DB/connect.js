const mongose = require("mongoose");
require("dotenv").config;

const connectDB = (url) => {
  //added mongose.set() to supress deprication from console warning
  mongose.set("strictQuery", true);
  return mongose.connect(url);
};

module.exports = connectDB;
