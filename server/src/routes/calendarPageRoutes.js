const express = require('express');
const controller = require('../controllers/calendarPageController');

const router = express.Router();

///api/calendar-page/drag-table/get-rooms?floorId=1
///api/calendar-page/drag-table/get-rooms?floorId=1&year=2024&month=6
router.get('/calendar-page/drag-table/get-rooms', controller.getRooms);

//DRAG TABLE APPOINTMENT MANAGEMENT
router.post('/calendar-page/drag-table/appointment', controller.insertAppointmentAndOtherData);
router.put('/calendar-page/drag-table/appointment/:id', controller.updateAppointmentAndOtherData);
router.delete('/calendar-page/drag-table/appointment/:id', controller.deleteAppointment);

// router.post('/calendar-page/input-form/patient', controller.insertPatient);
// router.put('/calendar-page/input-form/patient/:id', controller.updatePatient);
router.delete('/calendar-page/input-form/patient/:id', controller.deletePatient);
router.delete('/calendar-page/input-form/doctor/:id', controller.deleteDoctor);
router.delete('/calendar-page/input-form/appointment_type/:id', controller.deleteAppointmentType);

router.get('/calendar-page/search/patient/:searchTerm', controller.searchForPatientMatches);
router.get('/calendar-page/search/appointments/:patientID', 
    controller.searchForAppointmentMatchesWithPatientID);


///api/calendar-page/input-table/get-appointments
///api/calendar-page/input-table/get-appointments?year=2024&month=6
router.get('/calendar-page/input-table/get-appointments', controller.getAppointments);

module.exports = router;

