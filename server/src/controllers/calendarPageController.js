const pool = require('../utils/db.connect.js');

const calendarPageServices = require('../services/calendarPageServices.js');

const globalServices = require('../services/globalServices.js');

exports.getRooms = async (req, res) => {
    const { floorId, year = null, month = null, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    if (!floorId) {
        return res.status(400).json({ error: '(getRooms) - Floor ID is a required parameter.' });
    }

    const { query, params } = calendarPageServices.buildGetAppointmentQuery(year, month, floorId, limit, offset);

    try {
        const dataResult = await pool.query(query, params);
        const data = dataResult.rows;

        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error (getRooms) - ' + err.message });
    }
};

exports.insertAppointmentAndOtherData = async (req, res) => {
    var data = req.body; // Assuming JSON body with keys matching table columns
    try {
        if(data.id != undefined || data.id != null) {
            delete data.id;
        }
        data = await calendarPageServices.alterAndUpdateAppointmentObjects(data);

        const result = await globalServices.insertIntoTable(
            'drag_table_appointment', 
            data
        );

        res.json(result.rows[0].id);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error (insertAppointment) - ' + err.message });
    }
};

exports.updateAppointmentAndOtherData = async (req, res) => {
    const { id } = req.params;
    var data = req.body; // Assuming JSON body with keys matching table columns
    
    try {
        if(data.id != undefined || data.id != null) {
            delete data.id;
        }
        data = await calendarPageServices.alterAndUpdateAppointmentObjects(data);
        
        const result = await globalServices.updateInTable(
            'drag_table_appointment', 
            id, 
            data
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error (updateAppointment) - ' + err.message });
    }
};

exports.deleteAppointment = async (req, res) => {
    const { id } = req.params;
    try {
        await globalServices.deleteFromTable('drag_table_appointment', id);
        res.send('Row deleted');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
};

// exports.insertPatient = async (req, res) => {

// };

// exports.updatePatient = async (req, res) => {

// };

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