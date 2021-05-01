const express = require("express");
const mongoose = require("mongoose");

const { Rental, validationRental } = require("../models/rental");
const { Customers } = require("../models/customers");
const { Movie } = require("../models/movies");

const router = express.Router();

// get all rentals
router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.status(200).json({
    sucess: true,
    data: rentals,
  });
});

// get singler rental
router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental)
    return res.status(404).json({
      sucess: failed,
      data: rental,
    });

  res.status(200).json({
    sucess: true,
    data: rental,
  });
});

// create new rental
router.post("/", async (req, res) => {
  const { error } = validationRental(req.body);
  if (error)
    return res.status(400).json({
      sucess: false,
      data: error.details[0].message,
    });

  // find customer
  const customer = await Customers.findById(req.body.customerId);
  if (!customer)
    return res
      .status(404)
      .json({ sucess: false, data: "Customer was not found" });

  // find movie
  const movie = await Movie.findById(req.body.movieId);
  if (!movie)
    return res.status(404).json({ sucess: false, data: "Movie was not found" });

  // check for stock
  if (movie.numberInStock === 0)
    return res.status(400).json({
      sucess: false,
      data: "Movie not available at the moment",
    });

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      isGold: customer.isGold,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
    rentalFee: req.body.rentalFee,
  });

  rental = await rental.save();

  res.status(200).json({
    sucess: true,
    data: rental,
  });
});

module.exports = router;
