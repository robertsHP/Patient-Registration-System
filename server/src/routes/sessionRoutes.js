const express = require('express');
const router = express.Router();

const controller = require('../controllers/sessionController');

// GET: Get all session information
router.get('/session/get-all', controller.getAll);

// GET: Get session key
router.get('/session/get', controller.get);

// POST: Set session key
router.post('/session/update', controller.post);

// DELETE: Delete session key
router.delete('/session/delete', controller.delete);

module.exports = router;