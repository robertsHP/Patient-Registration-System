const express = require('express');
const controller = require('../controllers/globalController');

const router = express.Router();

router.get('/:tableName', controller.selectFromTable);
// router.get('/:tableName/:id', controller.selectWithIDFromTable);
// router.post('/:tableName', controller.insertIntoTable);
// router.put('/:tableName/:id', controller.updateInTable);
// router.delete('/:tableName/:id', controller.deleteFromTable);

