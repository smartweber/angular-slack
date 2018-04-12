const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const User = require('../models/user');

//POST register route
router.post('/register', function (req, res, next) {

  if (req.body.email &&
    req.body.username &&
    req.body.password) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    };

    User.create(userData, function (error, user) {
      if (error) {
        return res.status(401).json({ status: false, message: error });
      } else {
        delete user.password;
        return res.status(200).json({ status: true, user: user });
      }
    });

  } else {
    return res.status(400).json({ status: false, message: 'All fields required.' });
  }

});

//POST login route
router.post('/login', function (req, res, next) {

  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function (error, user) {
      if (error || !user) {
        return res.status(401).json({ status: false, message: 'Wrong email or password.' });
      } else {
        delete user.password;
        return res.status(200).json({ status: true, user: user });
      }
    });
  } else {
    return res.status(400).json({ status: false, message: 'All fields required.' });
  }

});

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return res.status(401).json({ status: false, message: 'Fail to logout.' });
      } else {
        return res.status(200).json({ status: true, message: 'Success.' });
      }
    });
  }
});

module.exports = router;