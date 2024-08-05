const pool = require('../../utils/db.connect.js');

const inputTableServices = require('../../services/calendar-page/inputTableServices.js');
const globalServices = require('../../services/globalServices.js');

exports.getAppointments = async (req, res) => {
    const { year = null, month = null, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { query, params } = inputTableServices.buildGetAppointmentsQuery(
        year, month, limit, offset
    );

    try {
        const dataResult = await pool.query(query, params);
        const data = dataResult.rows;

        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error (getAppointments) - ' + err.message });
    }
};

exports.insertAppointmentAndOtherData = async (req, res) => {
    var data = req.body; // Assuming JSON body with keys matching table columns
    try {
        if(data.id != undefined || data.id != null) {
            delete data.id;
        }
        data = await inputTableServices.alterAppointmentObjects(data);

        const result = await globalServices.insertIntoTable(
            'input_table_appointment', 
            data
        );

        res.json(result.rows[0].id);

        // res.json(data);
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
        data = await inputTableServices.alterAppointmentObjects(data);
        
        const result = await globalServices.updateInTable(
            'input_table_appointment', 
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
        await globalServices.deleteFromTable('input_table_appointment', id);
        res.send('Row deleted');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
};