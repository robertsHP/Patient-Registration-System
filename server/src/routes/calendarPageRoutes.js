const express = require('express');
const controller = require('../controllers/calendarPageController');

const router = express.Router();

///api/drag-table/get-rooms?floorId=1
///api/drag-table/get-rooms?floorId=1&year=2024&month=6
router.get('/drag-table/get-rooms', controller.getRooms);

//DRAG TABLE APPOINTMENT MANAGEMENT
router.post('/drag-table/appointment', controller.insertAppointmentAndOtherData);
router.put('/drag-table/appointment/:id', controller.updateAppointmentAndOtherData);
router.delete('/drag-table/appointment/:id', controller.deleteAppointment);

// router.post('/input-form/patient', controller.insertPatient);
// router.put('/input-form/patient/:id', controller.updatePatient);
router.delete('/input-form/patient/:id', controller.deletePatient);
router.delete('/input-form/doctor/:id', controller.deleteDoctor);
router.delete('/input-form/appointment_type/:id', controller.deleteAppointmentType);

module.exports = router;