const pool = require('../../utils/db.connect.js');

const globalServices = require('../../services/globalServices.js');

const deleteRowAndReferences = async (id, colName, tableName) => {
    var tableNames = [
        'drag_table_appointment',
        'input_table_appointment'
    ];

    await globalServices.removeRowReferencesInOtherTablesWithID (id, colName, tableNames);
    await globalServices.deleteFromTable(
        globalServices.sanitizeTableName(tableName), id
    );
};

exports.deletePatient = async (req, res) => {
    const { id } = req.params;
    try {
        await deleteRowAndReferences(
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
        await deleteRowAndReferences(
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
        await deleteRowAndReferences(
            id, 'id_appointment_type', 'appointment_type'
        );
        res.send('Row deleted');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
};