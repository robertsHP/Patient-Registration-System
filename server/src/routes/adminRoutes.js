const express = require('express');
const controller = require('../controllers/adminController');

const router = express.Router();

router.get('/auth', controller.selectFromTable);

module.exports = router;
