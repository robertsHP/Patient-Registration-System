const express = require('express');
const controller = require('../controllers/globalController');

const router = express.Router();

router.get('/calendar-page/:tableName', controller.selectFromTable);
router.get('/calendar-page/:tableName/:id', controller.selectWithIDFromTable);
router.post('/calendar-page/:tableName', controller.insertIntoTable);
router.put('/calendar-page/:tableName/:id', controller.updateInTable);
router.delete('/calendar-page/:tableName/:id', controller.deleteFromTable);