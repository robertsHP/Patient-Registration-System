const express = require('express');
const controller = require('../controllers/calendarPageController');

const router = express.Router();

router.get('/calendar-page/events', controller.getEvents);

///api/events/by-date?year=2023&month=7
router.get('/calendar-page/events/by-date', controller.getEventsByDate);


// router.post('/beds', controller.createBed);
// router.put('/beds/:id_beds', controller.updateBed);
// router.delete('/beds/:id_beds', controller.deleteBed);

module.exports = router;