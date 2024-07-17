const express = require('express');
const controller = require('../controllers/calendarPageController');

const router = express.Router();

///api/calendar-page/rooms?floorId=1
///api/calendar-page/rooms?floorId=1&year=2024&month=6
router.get('/rooms', controller.getEvents);

module.exports = router;