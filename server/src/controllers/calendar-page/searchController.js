
const pool = require('../../utils/db.connect.js');

const searchServices = require('../../services/calendar-page/searchServices.js');
const globalServices = require('../../services/globalServices.js');

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