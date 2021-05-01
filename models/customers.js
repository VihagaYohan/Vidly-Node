const express = require("express");
const mongoose = require("mongoose");
const Joi = require('joi')

// customer model
const customerSchema = mongoose.Schema({
    name: {
      type: String,
      require: true,
      minlength: 3,
      maxlength: 50,
    },
    phone: {
      type: String,
      require: true,
      minlength: 10,
      maxlength: 10,
    },
    isGold: {
      type: Boolean,
      require: true,
    },
  });
  
  const Customers = mongoose.model("Customer", customerSchema);

  // customer modeal validation
const validationCustomer = (customer) => {
    const schema = Joi.object({
      name: Joi.string().min(3).max(50).required(),
      phone: Joi.string().min(10).required(),
      isGold: Joi.boolean().required(),
    });
  
    return schema.validate(customer);
  };

  module.exports = {
    Customers,
      validationCustomer
  }