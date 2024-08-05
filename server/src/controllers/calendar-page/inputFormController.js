
const pool = require('../../utils/db.connect.js');

const calendarPageServices = require('../../services/calendarPageServices.js');
const globalServices = require('../../services/globalServices.js');

exports.deletePatient = async (req, res) => {
    const { id } = req.params;
    try {
        await calendarPageServices.deleteRowAndReferences(
            id, 'id_patient', 'patient'
        );
        res.send('Row deleted');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
};

exports.deleteDoctor = async (req, res) => {
    const { id } = req.params;
    try {
        await calendarPageServices.deleteRowAndReferences(
            id, 'id_doctor', 'doctor'
        );
        res.send('Row deleted');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
};

exports.deleteAppointmentType = async (req, res) => {
    const { id } = req.params;
    try {
        await calendarPageServices.deleteRowAndReferences(
            id, 'id_appointment_type', 'appointment_type'
        );
        res.send('Row deleted');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
};