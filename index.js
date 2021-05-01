const config = require("config");
const { urlencoded } = require("express");
const express = require("express");
const Joi = require("joi");
const helmet = require("helmet");
const morgan = require("morgan");

// database
const mongo = require('./db')

mongo

// import middleware functions
const logger = require("./middleware/logger");

const genres = require("./routes/genres");

const app = express();
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());
app.use(morgan("tiny"));

// routes
app.use("/api/genres", genres);

// configuration
console.log(`Application name : ${config.get("name")}`);
console.log(`Mail server : ${config.get("mail.host")}`);
console.log(`Mail password : ${config.get("mail.password")}`);

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
}

// impliment middleware
app.use(logger);

const port = process.env.PORT || 5000;
const environment = process.env.NODE_ENV || "development";

app.listen(port, () => {
  console.log(`Server is running on port ${port} on ${environment}`);
});
