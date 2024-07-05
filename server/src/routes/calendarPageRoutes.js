const express = require('express');
const controller = require('../controllers/calendarPageController');

const router = express.Router();

///api/calendar-page/table/?floorId=1
router.get('/calendar-page/table', controller.getEvents);

///api/calendar-page/table/by-date?floorId=1&year=2024&month=6
// router.get('/calendar-page/table/by-date', controller.getEventsByDate);

// router.post('/beds', controller.createBed);
// router.put('/beds/:id_beds', controller.updateBed);
// router.delete('/beds/:id_beds', controller.deleteBed);

module.exports = router;