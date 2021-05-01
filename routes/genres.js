const express = require("express");
const mongoose = require("mongoose");
const Joi = require('joi')

const router = express.Router();

const genreSehama = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 5,
    maxlength: 50,
  },
});

const Genre = mongoose.model("Genre", genreSehama);

// get all genres
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.status(200).json({ data: genres });
});

// get a single genre
router.get("/:id", async (req, res) => {
  const genreId = req.params.id;
  const genre = await Genre.findById(genreId);

  if (!genre) {
    res.status(404).json({ sucess: false, data: "Genre not found" });
    return;
  }

  res.status(200).json({
    sucess: true,
    data: genre,
  });
});

// create a genre
router.post("/", async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  let genre = new Genre({
    name: req.body.name,
  });
  genre = await genre.save();

  res.status(200).send(genre);
});

// update a genre
router.put("/:id", async (req, res) => {
  // validation
  const { error } = validationGenre(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  // find genre
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!genre) {
    return res.status(404).json({
      sucess: false,
      data: "The course with the given ID was not found",
    });
  }

  res.send(genre);
});

// delete a genre
router.delete("/:id", async (req, res) => {
  // find genre
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) {
    return res.status(404).json({
      sucess: false,
      data: "The genre for the for the prodived ID was not found",
    });
  }

  res.status(200).json({
    sucess: true,
    data: genre,
  });
});

// user input validation for genre
const validationGenre = (genre) => {
  const schema = Joi.object({
    name: Joi.string().min(3),
  });

  return schema.validate(genre);
};

module.exports = router;
