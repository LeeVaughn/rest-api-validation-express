'use strict';

const express = require('express');
const { check, validationResult } = require('express-validator/check');
// Above code uses destructuring, it is the same as:
// const checkModule = require('express-validator/check');
// const check = checkModule.check;
// const validationResult = checkModule.validationResult;

// This array is used to keep track of user records
// as they are created.
const users = [];

// Construct a router instance.
const router = express.Router();


const nameValidationChain = check('name')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('Please provide a value for "name"');

// Route that returns a list of users.
router.get('/users', (req, res) => {
  res.json(users);
});

// Route that creates a new user.
router.post('/users', [
  check('name')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "name"'),
  check('email')
    .exists()
    .withMessage('Please provide a value for "email"'),
], (req, res) => {
  // Attempt to get the validation result from the Request object.
  const errors = validationResult(req);

  // If there are validation errors...
  if (!errors.isEmpty()) {
    // Use the Array `map()` method to get a list of error messages.
    const errorMessages = errors.array().map(error => error.msg);

    // Return the validation errors to the client.
    res.status(400).json({ errors: errorMessages });
  } else {
    // Get the user from the request body.
    const user = req.body;

    // Add the user to the `users` array.
    users.push(user);

    // Set the status to 201 Created and end the response.
    res.status(201).end();
  }
});

module.exports = router;
