const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

// @route   POST api/users/register
// @desc    Register user
router.post('/admin/register', adminController.register);

// @route   POST api/users/login
// @desc    Login user
router.post('/admin/login', adminController.login);

// @route   POST api/users/logout
// @desc    Logout user
router.post('/admin/logout', adminController.logout);

// @route   POST api/users/login
// @desc    Login user
router.post('/admin/is-logged-in', adminController.checkLogin);

module.exports = router;
