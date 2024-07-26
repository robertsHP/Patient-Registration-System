const pool = require('../utils/db.connect.js');

require('dotenv').config({ path: '../.env' });

const sanitizeTableName = (tableName) => {
    const allowedCalendarTables = [
        'patient', 'floor', 'room', 'bed', 'doctor', 'appointment_type',
        'input_table_appointment', 'drag_table_appointment'
    ];
    const allowedAdminTables = [
        'user', 'role', 'user_role_relation'
    ];

    tableName = tableName.toLowerCase().replace(/[^a-z0-9_]/g, '');

    if (allowedCalendarTables.includes(tableName)) {
        return process.env.CALENDAR_PAGE_TABLE_PREFIX + tableName;
    } else if (allowedAdminTables.includes(tableName)) {
        return process.env.ADMIN_TABLE_PREFIX + tableName;
    } else {
        var error = `Attempted to access table: '${tableName}'. Invalid table name`;

        console.error(error);
        throw new Error(error);
    }
};

const selectFromTable = async (tableName) => {
    const sanitizedTableName = sanitizeTableName(tableName);
    const query = `SELECT * FROM ${sanitizedTableName}`;
    return pool.query(query);
};

const selectWithIDFromTable = async (tableName, id) => {
    const sanitizedTableName = sanitizeTableName(tableName);
    const query = `SELECT * FROM ${sanitizedTableName} WHERE id = $1`;
    const values = [id];
    return pool.query(query, values);
};

const insertIntoTable = async (tableName, data) => {
    const sanitizedTableName = sanitizeTableName(tableName);
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const valuePlaceholders = values.map((_, index) => `$${index + 1}`).join(', ');
    const query = `INSERT INTO ${sanitizedTableName} (${columns}) VALUES (${valuePlaceholders}) RETURNING id`;
    return pool.query(query, values);
};

const updateInTable = async (tableName, id, data) => {
    const sanitizedTableName = sanitizeTableName(tableName);
    const updates = Object.keys(data).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = [parseInt(id), ...Object.values(data)];
    const query = `UPDATE ${sanitizedTableName} SET ${updates} WHERE id = $1 RETURNING *`;
    return pool.query(query, values);
};

const deleteFromTable = async (tableName, id) => {
    const sanitizedTableName = sanitizeTableName(tableName);
    const query = `DELETE FROM ${sanitizedTableName} WHERE id = $1 RETURNING *`;
    const values = [id];
    return pool.query(query, values);
};

module.exports = {
    sanitizeTableName,
    selectFromTable,
    selectWithIDFromTable,
    insertIntoTable,
    updateInTable,
    deleteFromTable
};