const Joi = require("joi");
const mongoose = require("mongoose");

// genre schema
const { genreSehama } = require("./genres");

const Movie = mongoose.model(
  "Movies",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 255,
    },
    genre: {
      type: genreSehama,
      required: true,
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 1,
      max: 255,
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 1,
      max: 255,
    },
  })
);

const validateMovie = (movie) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().min(1).max(255),
    dailyRentalRate: Joi.number().min(1).required(),
  });

  return schema.validate(movie);
};

module.exports = { Movie, validateMovie };
