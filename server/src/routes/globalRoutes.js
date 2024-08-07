const express = require('express');
const controller = require('../controllers/globalController');

const router = express.Router();

router.get('/global/:tableName', controller.selectFromTable);
router.get('/global/:tableName/:id', controller.selectWithIDFromTable);
router.post('/global/:tableName', controller.insertIntoTable);
router.put('/global/:tableName/:id', controller.updateInTable);
router.delete('/global/:tableName/:id', controller.deleteFromTable);

module.exports = router;

