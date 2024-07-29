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


exports.searchForPatientMatches = async (req, res) => {
    const { searchTerm } = req.params;

    try {
        var tableName = globalServices.sanitizeTableName('patient');
        var columnName = 'pat_name';

        const query = `
            SELECT * FROM ${tableName} 
            WHERE ${columnName} ILIKE $1
        `;
        const values = [`%${searchTerm}%`];

        const { rows } = await pool.query(query, values);

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
};

exports.searchForAppointmentMatchesWithPatientID = async (req, res) => {
    const { patientID } = req.params;

    try {
        // Sanitize table names to prevent SQL injection
        const dragTableName = globalServices.sanitizeTableName('drag_table_appointment');
        const inputTableName = globalServices.sanitizeTableName('input_table_appointment');

        // Construct the SQL queries
        const dragQuery = `
            SELECT *, 'drag_table' AS source_table
            FROM ${dragTableName}
            WHERE id_patient = $1
        `;

        const inputQuery = `
            SELECT *, 'input_table' AS source_table
            FROM ${inputTableName}
            WHERE id_patient = $1
        `;

        const values = [patientID];

        // Execute both queries
        const dragResult = await pool.query(dragQuery, values);
        const inputResult = await pool.query(inputQuery, values);

        // Combine the results
        const combinedResults = [...dragResult.rows, ...inputResult.rows];

        // Send the response
        res.json(combinedResults);
    } catch (err) {
        console.error('Error fetching appointment matches:', err);
        console.error('Error details:', err.message);
        res.status(500).json({ error: 'An error occurred while fetching appointment matches' });
    }
};
