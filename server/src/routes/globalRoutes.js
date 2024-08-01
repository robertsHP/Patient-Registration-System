const express = require('express');
const controller = require('../controllers/globalController');

const router = express.Router();

router.get('/table/:tableName', controller.selectFromTable);
router.get('/table/:tableName/:id', controller.selectWithIDFromTable);
router.post('/table/:tableName', controller.insertIntoTable);
router.put('/table/:tableName/:id', controller.updateInTable);
router.delete('/table/:tableName/:id', controller.deleteFromTable);

module.exports = router;
