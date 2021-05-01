const mongoose = require("mongoose");
const Joi = require("joi");

// genre model
const genreSehama = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 5,
    maxlength: 50,
  },
});

const Genre = mongoose.model("Genre", genreSehama);

// user input validation for genre
const validationGenre = (genre) => {
  const schema = Joi.object({
    name: Joi.string().min(3),
  });

  return schema.validate(genre);
};

module.exports = {
  Genre,
  validationGenre,
  genreSehama
};
