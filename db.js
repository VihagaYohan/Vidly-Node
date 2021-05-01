const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to MongoDB.."))
  .catch((err) => console.log(`Failed to connect to MongoDB : ${err}`));


  module.exports = mongoose