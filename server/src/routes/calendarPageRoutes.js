const express = require('express');
const controller = require('../controllers/calendarPageController');

const router = express.Router();

///api/drag-table/get-rooms?floorId=1
///api/drag-table/get-rooms?floorId=1&year=2024&month=6
router.get('/calendar-page/drag-table/get-rooms', controller.getRooms);

//DRAG TABLE APPOINTMENT MANAGEMENT
router.post('/calendar-page/drag-table/appointment', controller.insertAppointmentAndOtherData);
router.put('/calendar-page/drag-table/appointment/:id', controller.updateAppointmentAndOtherData);
router.delete('/calendar-page/drag-table/appointment/:id', controller.deleteAppointment);

// router.post('/input-form/patient', controller.insertPatient);
// router.put('/input-form/patient/:id', controller.updatePatient);
router.delete('/calendar-page/input-form/patient/:id', controller.deletePatient);
router.delete('/calendar-page/input-form/doctor/:id', controller.deleteDoctor);
router.delete('/calendar-page/input-form/appointment_type/:id', controller.deleteAppointmentType);

router.get('/calendar-page/search/patient/:searchTerm', controller.searchForPatientMatches);
router.get('/calendar-page/search/appointments/:patientID', controller.searchForAppointmentMatchesWithPatientID);

module.exports = router;