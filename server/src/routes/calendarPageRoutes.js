const express = require('express');
const controller = require('../controllers/calendarPageController');

const router = express.Router();

///api/drag-table/get-rooms?floorId=1
///api/drag-table/get-rooms?floorId=1&year=2024&month=6
router.get('/drag-table/get-rooms', controller.getRooms);
router.post('/drag-table/appointment', controller.insertAppointmentAndOtherData);
router.put('/drag-table/appointment/:id', controller.updateAppointmentAndOtherData);
// router.delete('/drag-table/appointment/:id', controller.deleteFromTable);

module.exports = router;