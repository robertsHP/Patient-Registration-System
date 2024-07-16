const express = require('express');
const controller = require('../controllers/calendarPageController');

const router = express.Router();

///api/calendar-page/rooms?floorId=1
///api/calendar-page/rooms?floorId=1&year=2024&month=6
router.get('/calendar-page/rooms', controller.getEvents);

router.get('/calendar-page/:tableName', controller.selectFromTable);
router.get('/calendar-page/:tableName/:id', controller.selectWithIDFromTable);
router.post('/calendar-page/:tableName', controller.insertIntoTable);
router.put('/calendar-page/:tableName/:id', controller.updateInTable);
router.delete('/calendar-page/:tableName/:id', controller.deleteFromTable);

module.exports = router;