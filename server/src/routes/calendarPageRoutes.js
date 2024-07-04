const express = require('express');
const controller = require('../controllers/calendarPageController');

const router = express.Router();

///api/calendar-page/events?floorId=1
router.get('/calendar-page/events', controller.getEvents);

///api/calendar-page/events/by-date?floorId=1&year=2024&month=6
router.get('/calendar-page/events/by-date', controller.getEventsByDate);


// router.post('/beds', controller.createBed);
// router.put('/beds/:id_beds', controller.updateBed);
// router.delete('/beds/:id_beds', controller.deleteBed);

module.exports = router;