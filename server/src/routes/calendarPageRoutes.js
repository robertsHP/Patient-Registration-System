const express = require('express');

const dragTableController = require('../controllers/calendar-page/dragTableController');
const searchController = require('../controllers/calendar-page/searchController');
const inputTableController = require('../controllers/calendar-page/inputTableController');
const inputFormController = require('../controllers/calendar-page/inputFormController');

const router = express.Router();

///api/calendar-page/drag-table/get-rooms?floorId=1
///api/calendar-page/drag-table/get-rooms?floorId=1&year=2024&month=6
router.get('/calendar-page/drag-table/get-rooms', dragTableController.getRooms);
router.delete('/calendar-page/drag-table/delete-room/:id', dragTableController.deleteRoom);

router.post('/calendar-page/drag-table/appointment', dragTableController.insertAppointmentAndOtherData);
router.put('/calendar-page/drag-table/appointment/:id', dragTableController.updateAppointmentAndOtherData);
router.delete('/calendar-page/drag-table/appointment/:id', dragTableController.deleteAppointment);

router.get('/calendar-page/search/patient/:searchTerm', searchController.searchForPatientMatches);
router.get('/calendar-page/search/appointments/:patientID', 
    searchController.searchForAppointmentMatchesWithPatientID);

///api/calendar-page/input-table/get-appointments
///api/calendar-page/input-table/get-appointments?year=2024&month=6
router.get('/calendar-page/input-table/get-appointments', inputTableController.getAppointments);
router.post('/calendar-page/input-table/appointment', inputTableController.insertAppointmentAndOtherData);
router.put('/calendar-page/input-table/appointment/:id', inputTableController.updateAppointmentAndOtherData);
router.delete('/calendar-page/input-table/appointment/:id', inputTableController.deleteAppointment);

module.exports = router;

