
const express = require('express');

const inputFormController = require('../controllers/inputSelectorController');

const router = express.Router();

// router.post('/calendar-page/input-form/patient', inputFormController.insertPatient);
// router.put('/calendar-page/input-form/patient/:id', inputFormController.updatePatient);
router.delete('/calendar-page/input-form/patient/:id', inputFormController.deletePatient);
router.delete('/calendar-page/input-form/doctor/:id', inputFormController.deleteDoctor);
router.delete('/calendar-page/input-form/appointment_type/:id', inputFormController.deleteAppointmentType);