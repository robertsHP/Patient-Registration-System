const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

// @route   POST api/users/register
// @desc    Register user
router.post('/register', adminController.register);

// @route   POST api/users/login
// @desc    Login user
router.post('/login', adminController.login);

// // @route   POST api/users/forgot-password
// // @desc    Forgot password
// router.post('/forgot-password', adminController.forgotPassword);

module.exports = router;
