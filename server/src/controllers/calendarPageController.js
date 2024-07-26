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

exports.insertAppointment = async (req, res) => {
    const data = req.body; // Assuming JSON body with keys matching table columns
    try {
        data = calendarPageServices.checkPatientAndDoctor(data);

        const result = await globalServices.insertIntoTable(
            'drag_table_appointment', 
            data
        );

        res.json({ id: result.rows[0].id, data });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error (insertIntoTable) - ' + err.message });
    }
};

exports.updateAppointment = async (req, res) => {
    const { id } = req.params;
    const data = req.body; // Assuming JSON body with keys matching table columns
    try {
        data = calendarPageServices.checkPatientAndDoctor(data);

        const result = await globalServices.insertIntoTable(
            'drag_table_appointment', 
            id, 
            data
        );

        res.json({ id: result.rows[0].id, data });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error (insertIntoTable) - ' + err.message });
    }
};