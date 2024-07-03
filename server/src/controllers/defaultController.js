const pool = require('../utils/db.connect.js');
const func = require('../utils/functions.js');

require('dotenv').config({ path: '../.env' });

const prefix = process.env.CALENDAR_PAGE_TABLE_PREFIX;

exports.selectFromTable = async (req, res) => { 
    const { tableName } = req.params;
    try {
        var sanitizedTableName = prefix + func.sanitizeTableName(tableName);
        const result = await pool.query(`SELECT * FROM ${sanitizedTableName}`);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
}

exports.selectWithIDFromTable = async (req, res) => { 
    const { tableName, id } = req.params;
    try {
        var sanitizedTableName = prefix + func.sanitizeTableName(tableName);
        const result = await pool.query(`SELECT * FROM ${sanitizedTableName} WHERE id = $1`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Row not found');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
} 

exports.insertIntoTable = async (req, res) => { 
    const { tableName } = req.params;
    const data = req.body; // Assuming JSON body with keys matching table columns
    const sanitizedTableName = prefix + func.sanitizeTableName(tableName);
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const valuePlaceholders = values.map((_, index) => `$${index + 1}`).join(', ');

    try {
        const result = await pool.query(`INSERT INTO ${sanitizedTableName} (${columns}) VALUES (${valuePlaceholders}) RETURNING *`, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
}

exports.updateInTable = async (req, res) => { 
    const { tableName, id } = req.params;
    const data = req.body;
    const sanitizedTableName = prefix + func.sanitizeTableName(tableName);
    const updates = Object.keys(data).map((key, index) => `${key} = $${index + 2}`);
    const values = Object.values(data);
    values.push(id);

    try {
        const result = await pool.query(`UPDATE ${sanitizedTableName} SET ${updates.join(', ')} WHERE id = $1 RETURNING *`, values);
        if (result.rows.length === 0) {
            return res.status(404).send('Row not found');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
}

exports.deleteFromTable = async (req, res) => { 
    const { tableName, id } = req.params;
    const sanitizedTableName = prefix + func.sanitizeTableName(tableName);

    try {
        const result = await pool.query(`DELETE FROM ${sanitizedTableName} WHERE id = $1 RETURNING *`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Row not found');
        }
        res.send('Row deleted');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
}