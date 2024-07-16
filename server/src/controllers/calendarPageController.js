const pool = require('../utils/db.connect.js');

const calendarPageServices = require('../services/calendarPageServices.js');
const globalServices = require('../services/globalServices.js');

require('dotenv').config({ path: '../.env' });

const prefix = process.env.CALENDAR_PAGE_TABLE_PREFIX;

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

exports.selectFromTable = async (req, res) => {
    globalServices.selectFromTable(req, res, prefix, pool);
}

exports.selectWithIDFromTable = async (req, res) => { 
    globalServices.selectWithIDFromTable(req, res, prefix, pool);
} 

exports.insertIntoTable = async (req, res) => {
    globalServices.insertIntoTable(req, res, prefix, pool);
};

exports.updateInTable = async (req, res) => { 
    globalServices.updateInTable(req, res, prefix, pool);
}

exports.deleteFromTable = async (req, res) => { 
    globalServices.deleteFromTable(req, res, prefix, pool);
}
