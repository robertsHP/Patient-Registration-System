const pool = require('../utils/db.connect.js');

const calendarPageServices = require('../services/calendarPageServices.js');

exports.getEvents = async (req, res) => {
    const { floorId, year = null, month = null, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    if (!floorId) {
        return res.status(400).json({ error: '(getEvents) - Floor ID is a required parameter.' });
    }

    const { query, params } = calendarPageServices.buildGetEventQuery(year, month, floorId, limit, offset);

    try {
        const dataResult = await pool.query(query, params);
        const data = dataResult.rows;

        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error (getEvents) - ' + err.message });
    }
};