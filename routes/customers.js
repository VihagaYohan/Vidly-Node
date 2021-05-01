const express = require("express");
const { route } = require("./genres");

const { Customers, validationCustomer } = require("../models/customers");

const router = express.Router();

// get all customers
router.get("/", async (req, res) => {
  const customers = await Customers.find().sort("name");
  if (!customers) {
    return res.status(404).json({
      data: "There are no customers in the database",
    });
  }
  res.status(200).json({ data: customers });
});

// get a single customer
router.get("/:id", async (req, res) => {
  const customer = await Customers.findById(req.params.id);
  if (!customer) {
    return res.status(404).json({
      data: "The customer for the provided ID was not found",
    });
  }

  res.status(200).json({
    data: customer,
  });
});

// create a new customer
router.post("/", async (req, res) => {
  const { error } = validationCustomer(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let customer = new Customers({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });
  customer = await customer.save();

  res.status(200).json({
    data: customer,
  });
});

// update customer
router.put("/:id", async (req, res) => {
  const { error } = validationCustomer(req.body);
  if (error) {
    return res.status(400).json({ data: error.details[0].message });
  }

  // find customer and update
  const customer = await Customers.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold },
    { new: true }
  );
  if (!customer) {
    return res.status(404).json({
      sucess: false,
      data: "The customer with the given ID was not found",
    });
  }
  res.status(200).json({
    sucess: true,
    data: customer,
  });
});

// delete customer
router.delete("/:id", async (req, res) => {
  const customer = await Customers.findByIdAndRemove(req.params.id);
  if (!customer) {
    return res.status(404).json({
      data: "The customer with for the given ID was not found",
    });
  }

  res.status(200).json({
    data: customer,
  });
});

module.exports = router;
