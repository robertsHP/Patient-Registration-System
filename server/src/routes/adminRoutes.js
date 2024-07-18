const express = require('express');
const controller = require('../controllers/adminController');

const router = express.Router();

router.get('/admin/authenticate', controller.authenticate);
router.get('/admin/register', controller.register);
router.get('/admin/forgot-password', controller.forgotPassword);

module.exports = router;
