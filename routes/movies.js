const express = require("express");
const mongoose = require("mongoose");

const { Movie, validateMovie } = require("../models/movies");
const { Genre } = require("../models/genres");

const router = express.Router();

// get all movies
router.get("/", async (req, res) => {
  const movies = await Movies.find().sort("name");
  res.status(200).json({
    data: movies,
  });
});

// get a single movie
router.get("/:id", async (req, re) => {
  const movie = await Movies.findById(req.params.id);
  if (!movie) {
    return res.status(404).json({
      sucess: false,
      data: "The movie for the given ID was not found",
    });
  }

  res.status(200).json({
    sucess: true,
    data: movie,
  });
});

// create a new movie
router.post("/", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error)
    return res.status(400).json({
      sucess: false,
      data: error.details[0].message,
    });

  const genre = await Genre.findById(req.body.genreId);
  if (!genre)
    return res.status(400).json({
      sucess: false,
      data: "ID for the given genre was not found",
    });

  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  movie = await movie.save();

  res.status(200).json({
    sucess: true,
    data: movie,
  });
});


module.exports = router