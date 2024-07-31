const express = require('express');
const controller = require('../controllers/sessionController');

const router = express.Router();

// POST: Log in a user and create a session
router.post('/set', controller.post);

// GET: Retrieve current session information
router.get('/get', controller.get);

// DELETE: Log out the user and destroy the session
router.delete('/delete', controller.delete);

module.exports = router;